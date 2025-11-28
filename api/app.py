from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# CORS - Only allow senkmer.no in production
CORS(app, origins=['https://senkmer.no', 'http://localhost:*'])

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per minute"],
    storage_uri="redis://localhost:6379"
)

jwt = JWTManager(app)

# ============================================
# CONTACT API
# ============================================

@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per minute")
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Email validation (basic)
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email'}), 400
        
        # TODO: Send email via SendGrid
        # TODO: Store in database
        
        return jsonify({
            'success': True,
            'message': 'Takk for din henvendelse. Vi tar kontakt snart!'
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

# ============================================
# AUTH API
# ============================================

@app.route('/api/auth/register', methods=['POST'])
@limiter.limit("3 per hour")
def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        # Validate
        required = ['email', 'password', 'company_name']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check password strength
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        # TODO: Check if email exists
        # TODO: Hash password with bcrypt
        # TODO: Store in database
        # TODO: Send welcome email
        
        # Create JWT token
        access_token = create_access_token(identity=data['email'])
        
        return jsonify({
            'success': True,
            'token': access_token,
            'message': 'Bruker opprettet!'
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # TODO: Verify credentials against database
        # TODO: Check password with bcrypt
        
        # Create JWT token
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'success': True,
            'token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

# ============================================
# USER API
# ============================================

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    current_user = get_jwt_identity()
    
    # TODO: Fetch from database
    profile = {
        'email': current_user,
        'company_name': 'Example AS',
        'plan': 'Pro',
        'created_at': '2025-01-01'
    }
    
    return jsonify(profile), 200

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
@limiter.limit("10 per minute")
def update_profile():
    """Update user profile"""
    current_user = get_jwt_identity()
    data = request.get_json()
    
    # TODO: Validate and update in database
    
    return jsonify({
        'success': True,
        'message': 'Profil oppdatert'
    }), 200

# ============================================
# CHATBOT ANALYTICS API
# ============================================

@app.route('/api/chatbot/analytics', methods=['GET'])
@jwt_required()
def chatbot_analytics():
    """Get chatbot analytics"""
    current_user = get_jwt_identity()
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # TODO: Fetch from database
    analytics = {
        'total_conversations': 1250,
        'avg_response_time': 2.3,
        'satisfaction_rate': 94.5,
        'top_intents': [
            {'intent': 'priser', 'count': 450},
            {'intent': 'support', 'count': 320},
            {'intent': 'registrering', 'count': 280}
        ]
    }
    
    return jsonify(analytics), 200

# ============================================
# HEALTH CHECK
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
