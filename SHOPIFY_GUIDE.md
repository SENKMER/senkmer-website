# Shopify Theme Konvertering

## Oversikt
Dette prosjektet er bygget med ren HTML, CSS og JavaScript, og er forberedt for å konverteres til et Shopify Theme senere.

## Konverteringssteg til Shopify Theme

### 1. Mappestruktur
Når du skal konvertere til Shopify Theme, må du omstrukturere mappene:

```
shopify-theme/
├── assets/          # CSS, JS, bilder
├── config/          # Shopify konfigurasjon
├── layout/          # theme.liquid
├── sections/        # Gjenbrukbare seksjoner
├── snippets/        # Små komponenter
├── templates/       # Sider (index, page, product, etc.)
└── locales/         # Oversettelser
```

### 2. Konverter HTML til Liquid
- Bytt ut vanlig HTML med Liquid templates
- `index.html` → `templates/index.liquid`
- Komponenter → `snippets/header.liquid`, `snippets/footer.liquid`

### 3. Asset håndtering
```liquid
<!-- I stedet for: -->
<link rel="stylesheet" href="/assets/css/main.css">

<!-- Bruk: -->
{{ 'main.css' | asset_url | stylesheet_tag }}
```

### 4. Nyttige Liquid tags
```liquid
{% comment %} Kommentarer {% endcomment %}
{{ product.title }}
{% if condition %}...{% endif %}
{% for product in collections.all.products %}...{% endfor %}
```

### 5. Shopify Settings
Lag `config/settings_schema.json` for å gjøre temaet konfigurerbart.

### 6. Sections
Konverter eksisterende seksjoner til Shopify sections med schema:
```liquid
{% schema %}
{
  "name": "Hero Section",
  "settings": [...]
}
{% endschema %}
```

## Ressurser
- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Documentation](https://shopify.dev/api/liquid)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

## Neste steg
1. Installer Shopify CLI
2. Kjør `shopify theme init`
3. Migrer innhold fra dette prosjektet
4. Test i Shopify development store
5. Deploy til production
