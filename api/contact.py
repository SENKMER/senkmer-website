#!/usr/bin/env python3
"""
SENKMER Contact Form API
Simple Flask API for handling contact form submissions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["https://senkmer.no", "http://localhost:8000"]}})

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["20 per minute"],
    storage_uri="memory://"
)

# Email validation
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Phone validation
def validate_phone(phone):
    # Norwegian phone format
    pattern = r'^[\d\s\+\-\(\)]{8,15}$'
    return re.match(pattern, phone) is not None

# Sanitize input
def sanitize_string(text, max_length=1000):
    if not text:
        return ""
    # Remove any HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Limit length
    return text[:max_length].strip()

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
@limiter.limit("1 per minute")
def contact():
    """Handle contact form submission"""
    
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        # Validate required fields
        name = sanitize_string(data.get('name', ''), 100)
        email = sanitize_string(data.get('email', ''), 100)
        phone = sanitize_string(data.get('phone', ''), 20)
        subject = sanitize_string(data.get('subject', ''), 200)
        message = sanitize_string(data.get('message', ''), 5000)
        
        # Validation
        errors = []
        
        if not name or len(name) < 2:
            errors.append('Navn må være minst 2 tegn')
        
        if not email or not validate_email(email):
            errors.append('Ugyldig e-postadresse')
        
        if phone and not validate_phone(phone):
            errors.append('Ugyldig telefonnummer')
        
        if not subject or len(subject) < 3:
            errors.append('Emne må være minst 3 tegn')
        
        if not message or len(message) < 10:
            errors.append('Melding må være minst 10 tegn')
        
        if errors:
            return jsonify({
                'success': False,
                'message': 'Valideringsfeil',
                'errors': errors
            }), 400
        
        # Log submission (in production, save to database)
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'name': name,
            'email': email,
            'phone': phone,
            'subject': subject,
            'message': message
        }
        
        # Save to log file
        os.makedirs('logs', exist_ok=True)
        with open('logs/contact_submissions.jsonl', 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
        
        # Send email (configure SMTP settings)
        try:
            send_email_notification(name, email, phone, subject, message)
        except Exception as e:
            print(f"Email sending failed: {e}")
            # Don't fail the request if email fails
        
        return jsonify({
            'success': True,
            'message': 'Takk for din melding! Vi tar kontakt med deg så snart som mulig.'
        }), 200
        
    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({
            'success': False,
            'message': 'Det oppstod en feil. Vennligst prøv igjen senere.'
        }), 500

def send_email_notification(name, email, phone, subject, message):
    """Send email notification (configure with your SMTP settings)"""
    
    # SMTP Configuration (update with real credentials)
    SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USER = os.getenv('SMTP_USER', 'contact@senkmer.no')
    SMTP_PASS = os.getenv('SMTP_PASS', '')  # Set via environment variable
    TO_EMAIL = 'contact@senkmer.no'
    
    if not SMTP_PASS:
        print("SMTP password not configured")
        return
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = TO_EMAIL
    msg['Subject'] = f'[SENKMER Kontaktskjema] {subject}'
    
    # Email body
    body = f"""
    Ny henvendelse fra kontaktskjema:
    
    Navn: {name}
    E-post: {email}
    Telefon: {phone or 'Ikke oppgitt'}
    Emne: {subject}
    
    Melding:
    {message}
    
    ---
    Sendt fra SENKMER kontaktskjema
    Tidspunkt: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}
    """
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Send email
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'SENKMER Contact API'}), 200

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit errors"""
    return jsonify({
        'success': False,
        'message': 'For mange forespørsler. Vennligst vent før du sender en ny melding.'
    }), 429

if __name__ == '__main__':
    # Run in development mode
    # In production, use gunicorn or similar WSGI server
    app.run(host='0.0.0.0', port=5000, debug=False)
