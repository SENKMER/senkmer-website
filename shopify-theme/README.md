# SENKMER Shopify Theme

Dette er Shopify theme-versjonen av SENKMER-nettstedet.

## Struktur

```
shopify-theme/
├── assets/          # CSS, JS, bilder
├── config/          # Theme konfigurasjon
├── layout/          # Hovedlayout (theme.liquid)
├── sections/        # Gjenbrukbare seksjoner
├── snippets/        # Små komponenter
├── templates/       # Side-templates
└── locales/         # Oversettelser (Norsk)
```

## Installasjon

1. Installer Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Logg inn:
   ```bash
   shopify auth login
   ```

3. Push theme til Shopify:
   ```bash
   cd shopify-theme
   shopify theme push
   ```

## Utvikling

Start lokal utvikling:
```bash
shopify theme dev
```

## Tilpasninger

Alle farger, fonter og innstillinger kan endres i Theme Editor i Shopify Admin.

## Støtte

For spørsmål, kontakt contact@senkmer.no
