# Shopify Theme - Installasjonsveiledning

## Problem: "Branchen er ikke et gyldig tema"

Dette skjer fordi Shopify CLI ikke er riktig konfigurert eller du mangler tilgang til butikken.

## Løsning

### 1. Installer Shopify CLI (hvis ikke allerede installert)

```bash
npm install -g @shopify/cli @shopify/theme
```

### 2. Logg inn på Shopify

```bash
shopify auth login
```

Dette åpner en nettleser hvor du logger inn på Shopify Partner Dashboard eller butikken din.

### 3. Initialiser theme i riktig butikk

```bash
cd shopify-theme
shopify theme init
```

Velg butikken du vil koble til (f.eks. `senkmer.myshopify.com`).

### 4. Push theme

**Alternativ A: Push til development theme (anbefalt)**
```bash
shopify theme dev
```
Dette starter en lokal development server og synkroniserer automatisk.

**Alternativ B: Push til unpublished theme**
```bash
shopify theme push --unpublished
```

**Alternativ C: Push og publiser direkte**
```bash
shopify theme push --live
```
⚠️ **ADVARSEL**: Dette overskriver live theme!

### 5. Hvis du ikke har en Shopify-butikk ennå

Du må først opprette en Shopify-konto:

1. Gå til https://www.shopify.com/no/free-trial
2. Opprett en test-butikk (gratis i 3 dager)
3. Etter opprettelse, gå til **Online Store → Themes** i Shopify Admin
4. Klikk **Add theme → Upload ZIP file** og last opp hele `shopify-theme/` mappen som ZIP

### 6. Alternativ: Bruk Shopify Partner Account

Hvis du er utvikler:

1. Opprett Shopify Partner konto: https://partners.shopify.com/signup
2. Opprett en development store
3. Koble CLI til development store:
   ```bash
   shopify whoami
   shopify theme dev --store=din-dev-store.myshopify.com
   ```

## Feilsøking

### "No partner organization found"
Du må ha en Shopify Partner-konto eller tilgang til en Shopify-butikk.

### "Authentication required"
Kjør `shopify auth logout` og deretter `shopify auth login` på nytt.

### "Theme files not found"
Sjekk at du er i `shopify-theme/` mappen når du kjører kommandoer.

## Manual Upload (Enkleste metode)

Hvis CLI ikke fungerer, last opp manuelt:

1. Komprimer `shopify-theme/` til ZIP-fil:
   ```bash
   cd /workspaces/senkmer-website
   zip -r senkmer-theme.zip shopify-theme/*
   ```

2. Gå til Shopify Admin → Online Store → Themes
3. Klikk "Add theme" → "Upload ZIP file"
4. Velg `senkmer-theme.zip`
5. Etter upload, klikk "Customize" for å redigere

## Testing Lokalt (Uten Shopify)

Du kan fortsatt teste designet lokalt:

```bash
cd /workspaces/senkmer-website
python3 -m http.server 8080
```

Åpne http://localhost:8080 i nettleseren.

**Merk**: Shopify-spesifikk funksjonalitet (produkter, handlekurv, checkout) fungerer bare når theme er lastet opp til Shopify.

## Support

Hvis du fortsatt har problemer, kontakt:
- Shopify Support: https://help.shopify.com
- E-post: contact@senkmer.no
