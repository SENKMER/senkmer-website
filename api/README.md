# API Server Setup Guide

## Installasjon

### 1. Installer Python avhengigheter

```bash
cd /workspaces/senkmer-website
pip install -r api/requirements.txt
```

### 2. Konfigurer miljøvariabler

Kopier `.env.example` til `.env`:

```bash
cp api/.env.example api/.env
```

Rediger `api/.env` og legg inn dine SMTP-detaljer:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@senkmer.no
SMTP_PASS=din_app_passord_her
```

**For Gmail:**
1. Gå til Google Account Security
2. Aktiver 2-faktor autentisering
3. Generer et "App Password"
4. Bruk dette passordet i `.env`

### 3. Start API-serveren

```bash
python api/contact.py
```

Serveren starter på `http://localhost:5000`

### 4. Test API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Send testmelding:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bruker",
    "email": "test@example.com",
    "phone": "+47 123 45 678",
    "subject": "Test melding",
    "message": "Dette er en test av kontaktskjema"
  }'
```

## Produksjon

### Bruk Gunicorn for produksjon

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api.contact:app
```

### Alternativ: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/ ./api/
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api.contact:app"]
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.senkmer.no;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Logging

Alle henvendelser logges til `logs/contact_submissions.jsonl`

```bash
tail -f logs/contact_submissions.jsonl
```

## Sikkerhet

- ✅ Rate limiting: 1 request per minutt
- ✅ CORS: Kun senkmer.no og localhost
- ✅ Input validering og sanitering
- ✅ E-post validering
- ✅ Telefon validering (norsk format)
- ✅ XSS beskyttelse (HTML tags fjernes)
