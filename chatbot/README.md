Senkmer chatbot (frontend)

Dette er en enkel frontend-basert kundeservice-bot som bruker nøkkelord for å gi svar. Den er ment som et demo-UI. For ekte support bør du integrere med en backend eller tredjepartstjeneste (f.eks. Intercom, Zendesk eller en egen AI-tjeneste).

Sikkerhet:
- All input blir vist som tekst (ikke HTML) for å unngå XSS.
- Ingen eval eller eksterne kall utføres fra klienten.

Filer:
- /js/chatbot.js  -> enkel implementasjon
