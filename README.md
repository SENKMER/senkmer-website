# SENKMER Website

Komplett norsk nettside for SENKMER AI kundeservice plattform.

## 🚀 Prosjektoversikt

- **10 unike sider** med profesjonelt norsk innhold
- **3 design layouts** (Apple, Duolingo, Shopify-inspirert)
- **10 prisnivåer** (0 kr - 49,990 kr/mnd) for 100k+ kr/mnd inntektspotensial
- **Funksjonell chatbot** med kunnskapsbase
- **Backend API** eksempler med Flask
- **Shopify theme** konvertering
- **Full SEO** optimalisering

## 📁 Struktur

```
senkmer-website/
├── pages/                    # 10 HTML sider
│   ├── hjem/                 # Landing page (Layout 1)
│   ├── om-oss/               # Om oss (Layout 2)
│   ├── tjenester/            # Tjenester (Layout 3)
│   ├── priser/               # Priser (Layout 2)
│   ├── kontakt/              # Kontakt (Layout 1)
│   ├── faq/                  # FAQ (Layout 2)
│   ├── butikken/             # Marketplace (Layout 3)
│   ├── personvern/           # Privacy policy (Layout 1)
│   ├── sikkerhet/            # Sikkerhet (Layout 2)
│   └── support-chatbot/      # Live chatbot (Layout 3)
├── components/               # Gjenbrukbare komponenter
│   ├── header.html
│   ├── footer.html
│   ├── layout-1.html         # Apple-stil template
│   ├── layout-2.html         # Duolingo-stil template
│   └── layout-3.html         # Shopify-stil template
├── assets/
│   ├── css/
│   │   ├── layout-1.css      # Minimalistisk Apple design
│   │   ├── layout-2.css      # Playful Duolingo design
│   │   └── layout-3.css      # Profesjonell Shopify design
│   ├── js/
│   │   ├── layout-1.js       # Smooth scroll, fade-in animations
│   │   ├── layout-2.js       # Bounce animations
│   │   └── layout-3.js       # Reveal animations
│   └── img/
│       └── senkmer-logo.svg  # Gradient logo
├── api/                      # Backend API eksempler
│   ├── app.py                # Flask server med alle endpoints
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # API dokumentasjon
├── shopify-theme/            # Shopify theme konvertering
│   ├── layout/
│   │   └── theme.liquid
│   ├── sections/
│   │   ├── header.liquid
│   │   ├── footer.liquid
│   │   ├── hero.liquid
│   │   └── pricing.liquid
│   ├── locales/
│   │   └── no.json           # Norske oversettelser
│   └── config/
│       └── settings_schema.json
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Crawler instruksjoner
└── README.md                 # Denne filen
```

## 🎨 Design Systems

### Layout 1 - Apple Style
- **Farger**: Primary #0071e3 (blå)
- **Font**: SF Pro Display/Text
- **Stil**: Minimalistisk, blur header, fade-in animations
- **Brukt på**: hjem, kontakt, personvern

### Layout 2 - Duolingo Style
- **Farger**: Primary #58cc02 (grønn), Secondary #1cb0f6 (blå)
- **Font**: Nunito 800 weight
- **Stil**: Playful, 3D shadows, bounce animations
- **Brukt på**: om-oss, priser, faq, sikkerhet

### Layout 3 - Shopify Style
- **Farger**: Primary #008060 (turkis)
- **Font**: Inter
- **Stil**: Profesjonell, clean cards, subtle shadows
- **Brukt på**: tjenester, butikken, support-chatbot

## 💰 Prismodell

10 prisnivåer fra 0 kr (Gratis) til 49,990 kr/mnd (Ubegrenset Ultra):

1. **Gratis** - 0 kr (50 samtaler)
2. **Basic** - 990 kr (500 samtaler)
3. **Standard** - 1,990 kr (2k samtaler)
4. **Pro** - 3,990 kr ⭐ **FEATURED** (10k samtaler)
5. **Premium** - 6,990 kr (25k samtaler)
6. **Team** - 9,990 kr (50k samtaler)
7. **Bedrift** - 14,990 kr (100k samtaler)
8. **Agentur** - 19,990 kr (250k samtaler)
9. **Enterprise** - 29,990 kr (500k samtaler)
10. **Ubegrenset Ultra** - 49,990 kr 🌟 **VIP** (unlimited)

**Inntektspotensial**: Med bare 5 Pro-kunder (19,950 kr), 3 Premium (20,970 kr), 2 Team (19,980 kr) og noen få Basic/Standard kunder når vi enkelt 100k+ kr/mnd.

## 🤖 Chatbot Funksjoner

Kunnskapsbase med 6 kategorier:
- **Priser** - Info om alle prisnivåer
- **Registrering** - Hvordan opprette konto
- **Integrasjoner** - Shopify, HubSpot, WhatsApp osv.
- **Passord** - Reset og sikkerhet
- **Support** - Kontaktinformasjon
- **Sikkerhet** - GDPR og data protection

## 🔧 Backend API

Flask server med:
- **POST /api/contact** - Kontaktskjema (rate limit: 5/min)
- **POST /api/auth/register** - Brukerregistrering (rate limit: 3/hour)
- **POST /api/auth/login** - Login med JWT
- **GET /api/user/profile** - Hent profil (krever JWT)
- **PUT /api/user/profile** - Oppdater profil (krever JWT)
- **GET /api/chatbot/analytics** - Chatbot statistikk (krever JWT)

**Sikkerhet**:
- Rate limiting (Flask-Limiter)
- JWT authentication
- CORS (kun senkmer.no)
- Input validering
- CSRF protection

## 🛍️ Shopify Theme

Konvertert til Shopify Liquid:
- `theme.liquid` - Main layout
- Sections: header, footer, hero, pricing
- Norwegian locales (`no.json`)
- Konfigurerbare farger og fonts
- 3 layout styles (velgbar i admin)

## 📊 SEO

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook/LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Sitemap.xml med alle 10 sider
- ✅ Robots.txt
- ✅ Semantic HTML5
- ✅ Mobile responsive (768px, 1024px breakpoints)

## 🚦 Kjør Lokalt

### Frontend
```bash
# Serve med Python
python -m http.server 8000

# Eller med Node.js
npx serve .
```

Åpne `http://localhost:8000/pages/hjem/`

### Backend API
```bash
cd api
pip install -r requirements.txt
python app.py
```

API kjører på `http://localhost:5000`

## 📞 Kontaktinformasjon

- **E-post**: contact@senkmer.no
- **Telefon**: (+47) 400 00 000
- **Adresse**: Senkmer AS, Oslo, Norge
- **Org.nr**: 123 456 789 MVA

## 📝 Lisens

© 2025 Senkmer AS. Alle rettigheter reservert.

---

**Laget med ❤️ i Norge**
