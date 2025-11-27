This repository contains a minimal Shopify theme scaffold so the repository can be connected to Shopify via GitHub.

Files added:
- `layout/theme.liquid` (required)
- `templates/index.liquid` (home template)
- `config/settings_schema.json` (minimal settings schema)
- `assets/theme.css` (placeholder stylesheet)

Notes:
- These are intentionally minimal files to satisfy Shopify detection and allow setting the theme role to `main`.
- For a production theme, replace this scaffold with a full theme (for example, Dawn) or expand these files.

Next steps (on your computer or CI):
1. Verify these files are present on `main` branch.
2. In Shopify Admin > Online Store > Themes > Connect from GitHub, set the branch to `main` and choose this repository.
3. If Shopify still complains, please share the exact error message.
