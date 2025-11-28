# SENKMER Website

> Moderne, responsiv nettside bygget med ren HTML, CSS og JavaScript

![SENKMER Logo](assets/img/logo.svg)

## 📋 Innholdsfortegnelse

- [Om prosjektet](#om-prosjektet)
- [Funksjoner](#funksjoner)
- [Mappestruktur](#mappestruktur)
- [Kom i gang](#kom-i-gang)
- [Utvikling](#utvikling)
- [Sikkerhet](#sikkerhet)
- [Shopify integrasjon](#shopify-integrasjon)
- [Vedlikehold](#vedlikehold)

## 🎯 Om prosjektet

SENKMER er en moderne nettside designet med inspirasjon fra Apple og Duolingo. Nettsiden er bygget med:

- **Ren HTML5** - Semantisk og tilgjengelig markup
- **Modern CSS3** - CSS Variables, Flexbox, Grid, animasjoner
- **Vanilla JavaScript** - Ingen avhengigheter, modulær kode
- **Responsivt design** - Fungerer perfekt på alle enheter
- **SEO-optimalisert** - Semantisk HTML og meta tags

## ✨ Funksjoner

### Nettsiden inkluderer:

- ✅ **Responsiv navigasjon** med mobil-meny
- ✅ **Hero-seksjon** med gradient og animasjoner
- ✅ **Feature cards** med hover-effekter
- ✅ **Statistikk-tellere** med animerte tall
- ✅ **Kontaktskjema** med validering og rate limiting
- ✅ **Chatbot-komponent** (grunnleggende)
- ✅ **Smooth scroll** navigasjon
- ✅ **Lazy loading** for bilder
- ✅ **Scroll-animasjoner** for innhold
- ✅ **Footer** med sosiale medier
- ✅ **Profesjonell SVG-logo**

### Sikkerhetsfunksjoner:

- 🔒 Rate limiting på skjemaer
- 🔒 Input validering (client-side)
- 🔒 Security headers konfigurert
- 🔒 CORS-innstillinger
- 🔒 CSP-retningslinjer

## 📁 Mappestruktur

```
senkmer-website/
├── index.html                 # Hovedside
├── pages/                     # Undersider
│   ├── om-oss.html
│   ├── tjenester.html
│   └── kontakt.html
├── components/                # Gjenbrukbare komponenter
│   ├── header.html
│   ├── footer.html
│   └── chatbot.html
├── assets/                    # Statiske filer
│   ├── css/
│   │   ├── main.css          # Hovedstiler
│   │   └── components.css    # Komponentstiler
│   ├── js/
│   │   ├── components.js     # Komponentlaster
│   │   ├── main.js           # Hovedfunksjonalitet
│   │   ├── animations.js     # Animasjoner
│   │   └── contact.js        # Kontaktskjema
│   └── img/
│       └── logo.svg          # SENKMER logo
├── config/                    # Konfigurasjon
│   └── security.json         # Sikkerhetsinnstillinger
├── templates/                 # Maler (for fremtidig bruk)
├── package.json              # Prosjekt metadata
├── SHOPIFY_GUIDE.md         # Guide for Shopify-konvertering
└── README.md                # Denne filen
```

## 🚀 Kom i gang

### Forutsetninger

- Python 3 (for lokal server)
- Moderne nettleser (Chrome, Firefox, Safari, Edge)
- Teksteditor (VS Code anbefales)

### Installasjon

1. **Klon/Last ned prosjektet**
   ```bash
   cd /workspaces/senkmer-website
   ```

2. **Start lokal server**
   ```bash
   npm start
   # eller
   python3 -m http.server 8000
   ```

3. **Åpne i nettleser**
   ```
   http://localhost:8000
   ```

## 💻 Utvikling

### Redigere innhold

#### Endre tekst på forsiden:
Åpne `index.html` og rediger HTML-innholdet direkte.

#### Endre farger og styling:
Alle farger og variabler er definert i `assets/css/main.css`:

```css
:root {
  --color-primary: #4F46E5;
  --color-secondary: #7C3AED;
  /* ... flere variabler */
}
```

#### Legge til nye sider:

1. Kopier en eksisterende side fra `pages/`
2. Rediger innholdet
3. Legg til lenke i `components/header.html`

#### Tilpasse komponenter:

Rediger filene i `components/`:
- `header.html` - Navigasjon og logo
- `footer.html` - Bunntekst og lenker
- `chatbot.html` - Chat-widget

### JavaScript-moduler

#### `assets/js/components.js`
- Laster inn komponenter dynamisk
- Håndterer navigasjon
- Initialiserer chatbot

#### `assets/js/main.js`
- Scroll-animasjoner
- Counter-animasjoner
- Utility-funksjoner
- Notifikasjoner

#### `assets/js/animations.js`
- Parallax-effekter
- Stagger-animasjoner
- Reveal-on-scroll
- Hover-effekter

#### `assets/js/contact.js`
- Skjema-validering
- Rate limiting
- Form submission
- Feilhåndtering

## 🔒 Sikkerhet

### Client-side sikkerhet

Prosjektet inkluderer flere sikkerhetslag:

1. **Rate Limiting**
   - Kontaktskjema: 1 innsending per minutt
   - Lagret i localStorage

2. **Input Validering**
   - E-post validering
   - Telefon validering
   - Lengdebegrensninger
   - Sanitisering av input

3. **Security Headers**
   Konfigurert i `config/security.json`:
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Strict-Transport-Security
   - Content-Security-Policy

### Backend anbefaling

For produksjon, implementer:
- Server-side validering
- CSRF-beskyttelse
- Rate limiting på server
- Database sanitisering
- API-autentisering

## 🛍️ Shopify Integrasjon

Nettsiden er forberedt for konvertering til Shopify Theme.

Se `SHOPIFY_GUIDE.md` for detaljert guide.

### Rask oversikt:

1. Installer Shopify CLI
2. Konverter HTML til Liquid templates
3. Flytt assets til Shopify struktur
4. Lag sections og snippets
5. Konfigurer theme settings
6. Test og deploy

## 🔧 Vedlikehold

### Legge til nye tjenester

1. Åpne `pages/tjenester.html`
2. Kopier en eksisterende `.service-card`
3. Rediger innhold og ikon
4. Lagre

### Oppdatere farger/tema

Alle farger er definert som CSS-variabler i `:root` i `assets/css/main.css`.

Endre disse for å endre hele fargepaletten:
```css
--color-primary: #4F46E5;  /* Hovedfarge */
--color-secondary: #7C3AED; /* Sekundærfarge */
```

### Ytelsesoptimalisering

- **Bilder**: Komprimer alle bilder før opplasting
- **CSS**: Minifiser for produksjon
- **JavaScript**: Minifiser og bundle for produksjon
- **Lazy loading**: Allerede implementert for bilder
- **Caching**: Sett opp server-side caching

## 📱 Browser Support

Nettsiden støttes i:
- Chrome (siste 2 versjoner)
- Firefox (siste 2 versjoner)
- Safari (siste 2 versjoner)
- Edge (siste 2 versjoner)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design System

### Fargepalett

- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #7C3AED (Purple)
- **Accent**: #10B981 (Green)
- **Danger**: #EF4444 (Red)

### Typography

- **Font**: System fonts (SF Pro, Segoe UI, Roboto)
- **Sizes**: Responsive med clamp()
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

Bruker 8px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px

## 📝 Lisens

Dette prosjektet er privat og tilhører SENKMER.

## 👥 Kontakt

For spørsmål eller support:
- **E-post**: post@senkmer.no
- **Telefon**: +47 123 45 678
- **Nettsted**: [senkmer.no](https://senkmer.no)

---

**Bygget med ❤️ i Norge**

© 2025 SENKMER. Alle rettigheter reservert.
