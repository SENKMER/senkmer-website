Senkmer — utviklingsnotater

Struktur:
- assets/   - bilder, logo, ikoner
- css/      - styles (theme.css)
- js/       - client-side skript
- pages/    - statiske sider (norsk)
- components/ - UI-komponenter (ikke fylt separat i denne demoen)
- chatbot/  - dokumentasjon for chatbot
- shopify_theme/ - minimal Shopify-tema (Liquid)

Hvordan forhåndsvise:
1. Start en enkel statisk server i repo-roten:
   python3 -m http.server 8000
2. Åpne http://localhost:8000/pages/hjem.html

Shopify:
- Jeg kan ikke automatisk deploye til din Shopify-konto uten tilgang.
- For å koble temaet, bruk Shopify CLI eller GitHub-integrasjon og push fra shopify_theme-mappen.

Sikkerhet (frontend):
- All brukerinput blir escaped før visning i chat og skjemaer.
- Ikke erstatt frontend-sjekker for server-side validering.

Neste steg:
- Jeg kan fylle ut flere komponenter, lage React/TS-versjon eller lage full Dawn-baserte theme-filer ved forespørsel.
