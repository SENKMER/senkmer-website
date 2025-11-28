# SENKMER Backend API Eksempler

Dette er eksempel-API for SENKMER plattformen bygget med Flask.

## Installasjon

```bash
pip install -r requirements.txt
python app.py
```

## Sikkerhet

- Rate limiting: 100 requests/min per IP
- CSRF protection med Flask-WTF
- CORS konfigurert for kun senkmer.no
- Input validering med marshmallow
- JWT authentication
- HTTPS påkrevd i produksjon

## Endpoints

### POST /api/contact
Kontaktskjema submission
- Rate limit: 5/min
- Required: name, email, message
- Returns: 200 OK eller 429 Too Many Requests

### POST /api/auth/register
Registrer ny bruker
- Required: email, password, company_name
- Returns: JWT token

### POST /api/auth/login
Login bruker
- Required: email, password
- Returns: JWT token

### GET /api/user/profile
Hent brukerprofil (krever JWT)

### PUT /api/user/profile
Oppdater brukerprofil (krever JWT)

### GET /api/chatbot/analytics
Hent chatbot analytics (krever JWT)
- Query params: start_date, end_date

## Environment Variables

```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://localhost/senkmer
JWT_SECRET_KEY=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-key
```

## Testing

```bash
pytest tests/
```
