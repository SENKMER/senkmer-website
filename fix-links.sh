#!/bin/bash
# Fix all navigation links to point to new folder structure

# Path mapping:
# /pages/hjem.html -> /pages/hovedside/hjem.html
# /pages/om-oss.html -> /pages/informasjon/om-oss.html
# /pages/tjenester.html -> /pages/informasjon/tjenester.html
# /pages/priser.html -> /pages/priser/priser.html
# /pages/kontakt.html -> /pages/kundeservice/kontakt.html
# /pages/referanser.html -> /pages/kunder/referanser.html
# /pages/chatbot.html -> /pages/kundeservice/chatbot.html
# /pages/minispill.html -> /pages/spill/minispill.html
# /pages/faq.html -> /pages/faq/faq.html
# /pages/personvern.html -> /pages/personvern/personvern.html
# /pages/sikkerhet.html -> /pages/sikkerhet/sikkerhet.html
# /pages/profil.html -> /pages/konto/profil.html

find /workspaces/senkmer-website/pages -name "*.html" -type f -exec sed -i \
  -e 's|href="/pages/hjem\.html"|href="/pages/hovedside/hjem.html"|g' \
  -e 's|href="/pages/om-oss\.html"|href="/pages/informasjon/om-oss.html"|g' \
  -e 's|href="/pages/tjenester\.html"|href="/pages/informasjon/tjenester.html"|g' \
  -e 's|href="/pages/priser\.html"|href="/pages/priser/priser.html"|g' \
  -e 's|href="/pages/kontakt\.html"|href="/pages/kundeservice/kontakt.html"|g' \
  -e 's|href="/pages/referanser\.html"|href="/pages/kunder/referanser.html"|g' \
  -e 's|href="/pages/chatbot\.html"|href="/pages/kundeservice/chatbot.html"|g' \
  -e 's|href="/pages/minispill\.html"|href="/pages/spill/minispill.html"|g' \
  -e 's|href="/pages/faq\.html"|href="/pages/faq/faq.html"|g' \
  -e 's|href="/pages/personvern\.html"|href="/pages/personvern/personvern.html"|g' \
  -e 's|href="/pages/sikkerhet\.html"|href="/pages/sikkerhet/sikkerhet.html"|g' \
  -e 's|href="/pages/profil\.html"|href="/pages/konto/profil.html"|g' \
  {} \;

echo "✓ Links updated in all HTML files"
