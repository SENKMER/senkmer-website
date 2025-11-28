# SENKMER Nettsted - Testing Sjekkliste

## ✅ Fullført Implementering

### 1. Backend API
- ✅ Flask API for kontaktskjema (`/api/contact.py`)
- ✅ E-post validering og sanitering
- ✅ Rate limiting (1 forespørsel/minutt)
- ✅ CORS konfigurasjon
- ✅ SMTP e-post integrasjon
- ✅ Logging av henvendelser

### 2. Analytics
- ✅ Privacy-friendly analytics (`/assets/js/analytics.js`)
- ✅ Plausible Analytics integrasjon
- ✅ Respekterer Do Not Track
- ✅ Ingen cookies
- ✅ Tracking av sidevisninger, scroll depth, tid på side
- ✅ Custom event tracking
- ✅ Implementert på alle sider

### 3. Nye Sider
- ✅ `/pages/butikk.html` - E-handelsbutikk med produkter
- ✅ `/pages/faq.html` - FAQ med accordion (15+ spørsmål)
- ✅ `/pages/personvern-sikkerhet.html` - GDPR-kompatibel personvernpolicy
- ✅ `/pages/priser.html` - 10 prispakker med månedlig/årlig toggle

### 4. Bilder og Design
- ✅ 7 SVG illustrasjoner (600x600px, gradient-basert)
- ✅ Logo integrert i header/footer
- ✅ Hero-bilde på forsiden
- ✅ Team-bilde på Om Oss
- ✅ Sikkerhet/chatbot/pricing/shop illustrasjoner

### 5. Shopify Konvertering
- ✅ `/shopify-theme/` struktur opprettet
- ✅ `theme.liquid` hovedlayout
- ✅ Sections: hero, header, footer
- ✅ Snippets: chatbot
- ✅ Templates: index.liquid
- ✅ Settings schema

### 6. Sikkerhet og Konfigurasjon
- ✅ Security config (`/config/security.json`)
- ✅ Rate limiting
- ✅ CORS headers
- ✅ CSP (Content Security Policy)
- ✅ Input validering
- ✅ `.env.example` for API credentials

## 🧪 Testing Sjekkliste

### Frontend Testing

#### 1. Navigasjon (Alle Sider)
- [ ] Test header navigation på desktop
- [ ] Test mobilmeny (burger menu)
- [ ] Verifiser alle lenker fungerer:
  - [ ] Hjem (`/index.html`)
  - [ ] Om oss (`/pages/om-oss.html`)
  - [ ] Tjenester (`/pages/tjenester.html`)
  - [ ] Priser (`/pages/priser.html`)
  - [ ] Butikk (`/pages/butikk.html`)
  - [ ] Kontakt (`/pages/kontakt.html`)
  - [ ] FAQ (`/pages/faq.html`)
  - [ ] Personvern (`/pages/personvern-sikkerhet.html`)

#### 2. Responsive Design
- [ ] Test på mobil (320px - 480px)
- [ ] Test på tablet (768px - 1024px)
- [ ] Test på desktop (1280px+)
- [ ] Test på 4K skjermer (2560px+)
- [ ] Verifiser at alle bilder skalerer korrekt
- [ ] Sjekk at tekst er lesbar på alle størrelser

#### 3. Animasjoner
- [ ] Fade-in på hero section
- [ ] Scroll animations fungerer
- [ ] Hover effects på knapper
- [ ] Smooth scrolling
- [ ] Counter animasjon på statistikk

#### 4. Komponenter
- [ ] Header vises på alle sider
- [ ] Footer vises på alle sider
- [ ] Chatbot toggle fungerer
- [ ] Chatbot åpner/lukker smooth
- [ ] Logo klikker til hjemmeside

#### 5. Butikk Side (`/pages/butikk.html`)
- [ ] Produktkategorier vises korrekt
- [ ] Populære produkter har riktige priser
- [ ] Tillegg/addons vises
- [ ] "Kjøp nå" knapper er synlige
- [ ] Produktbilder lastes

#### 6. FAQ Side (`/pages/faq.html`)
- [ ] Alle 5 kategorier vises
- [ ] Accordion åpner/lukker ved klikk
- [ ] Kun én seksjon åpen om gangen (eller flere?)
- [ ] Smooth animasjon ved toggle
- [ ] Alle 15+ spørsmål er lesbare

#### 7. Priser Side (`/pages/priser.html`)
- [ ] Månedlig/årlig toggle fungerer
- [ ] Priser oppdateres ved toggle (20% rabatt årlig)
- [ ] Alle 5 abonnementspakker vises
- [ ] 4 engangspakker vises
- [ ] 6 tillegg vises
- [ ] "Velg pakke" knapper fungerer

#### 8. Kontakt Side (`/pages/kontakt.html`)
- [ ] Skjema validering fungerer
- [ ] Feilmeldinger vises på norsk
- [ ] Suksessmelding vises etter innsending
- [ ] Required fields markert
- [ ] E-post validering
- [ ] Telefon validering

### Backend Testing

#### 9. API Endepunkter
- [ ] Start API: `python api/contact.py`
- [ ] Test `/api/health` endepunkt (skal returnere "ok")
- [ ] Send testmelding via kontaktskjema
- [ ] Verifiser at melding logges til `logs/contact_submissions.jsonl`
- [ ] Test rate limiting (prøv å sende 2 meldinger innen 1 minutt)
- [ ] Test CORS (fra localhost og produksjonsdomain)

#### 10. E-post Funksjonalitet
- [ ] Konfigurer SMTP i `.env` fil
- [ ] Test at e-post sendes til contact@senkmer.no
- [ ] Verifiser e-post format og innhold
- [ ] Sjekk at norske tegn (æøå) fungerer

### Analytics Testing

#### 11. Analytics
- [ ] Åpne Developer Console (F12)
- [ ] Naviger mellom sider
- [ ] Verifiser at `[Analytics] Initialized` vises
- [ ] Sjekk at pageviews trackes
- [ ] Test Do Not Track (skal ikke tracke)
- [ ] Scroll ned på en side (verifiser scroll depth events)
- [ ] Klikk på eksterne lenker (outbound tracking)

### Performance Testing

#### 12. Ytelse
- [ ] Test sidehastighet med Lighthouse (mål: 90+)
- [ ] Verifiser lazy loading av bilder
- [ ] Sjekk CSS/JS minifisering (i produksjon)
- [ ] Test caching headers
- [ ] Verifiser at SVG-er er optimaliserte

### Security Testing

#### 13. Sikkerhet
- [ ] Test CSP headers
- [ ] Verifiser CORS konfigurasjon
- [ ] Test SQL injection i kontaktskjema (skal blokkeres)
- [ ] Test XSS i kontaktskjema (skal saniteres)
- [ ] Verifiser rate limiting fungerer

### Browser Testing

#### 14. Browser Kompatibilitet
- [ ] Chrome/Edge (nyeste)
- [ ] Firefox (nyeste)
- [ ] Safari (nyeste)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Shopify Testing

#### 15. Shopify Theme
- [ ] Installer Shopify CLI: `npm install -g @shopify/cli`
- [ ] Logg inn: `shopify auth login`
- [ ] Push theme: `cd shopify-theme && shopify theme push`
- [ ] Preview theme i Shopify Admin
- [ ] Test at Liquid templates renderer korrekt
- [ ] Verifiser settings i Theme Editor

## 🚀 Deployment Sjekkliste

### Pre-Deployment
- [ ] Alle tester passert
- [ ] Ingen console errors
- [ ] Alle lenker fungerer
- [ ] Analytics konfigurert
- [ ] SMTP credentials satt (produksjon)
- [ ] Environment variables konfigurert
- [ ] Database backup (hvis aktuelt)

### Deployment
- [ ] Push til produksjonsserver
- [ ] Konfigurer DNS (senkmer.no)
- [ ] Installer SSL sertifikat
- [ ] Sett opp CI/CD (GitHub Actions)
- [ ] Konfigurer CDN (Cloudflare/Netlify)
- [ ] Start backend API på server

### Post-Deployment
- [ ] Test produksjonsside
- [ ] Verifiser SSL fungerer
- [ ] Test kontaktskjema i produksjon
- [ ] Sjekk analytics data kommer inn
- [ ] Monitor error logs
- [ ] Test fra forskjellige land/IP-er

## 📊 Forventet Resultat

### Sider Implementert: 8
1. **index.html** - Hjemmeside med hero, features, stats
2. **om-oss.html** - Om selskapet med team-bilde
3. **tjenester.html** - Tjenesteoversikt
4. **kontakt.html** - Kontaktskjema med API-integrasjon
5. **butikk.html** - E-handelsbutikk med produkter
6. **faq.html** - 15+ spørsmål med accordion
7. **personvern-sikkerhet.html** - GDPR-policy
8. **priser.html** - 10 prispakker

### Backend
- Flask API med validering og e-post
- Rate limiting og sikkerhet
- Logging til fil

### Frontend Features
- 7 SVG illustrasjoner
- Privacy-friendly analytics
- Smooth animations
- Responsive design
- Chatbot UI

### Shopify
- Komplett theme-struktur
- Liquid templates
- Konfigurerbare settings

## 📧 Kontakt
Ved problemer eller spørsmål: **contact@senkmer.no**

---

**Status**: ✅ Implementering fullført og pushet til GitHub
**Commit**: `feat: Komplett implementering av SENKMER-nettsted`
**Branch**: `main`
