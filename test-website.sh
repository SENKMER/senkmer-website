#!/bin/bash
# Comprehensive Testing and Validation Script for Senkmer Website

echo "🧪 Senkmer Website - Comprehensive Testing Report"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Test function
run_test() {
  local test_name="$1"
  local test_command="$2"
  local test_type="${3:-test}" # test, warning, or info
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "  Testing: $test_name... "
  
  if eval "$test_command" > /dev/null 2>&1; then
    if [ "$test_type" == "warning" ]; then
      echo -e "${YELLOW}⚠ WARNING${NC}"
      WARNINGS=$((WARNINGS + 1))
    else
      echo -e "${GREEN}✓ PASS${NC}"
      PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
  else
    echo -e "${RED}✗ FAIL${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

# 1. File Structure Tests
echo -e "\n${BLUE}1. File Structure Validation${NC}"
echo "================================"

run_test "Homepage exists (pages/hovedside/hjem.html)" "[ -f pages/hovedside/hjem.html ]"
run_test "About page exists (pages/informasjon/om-oss.html)" "[ -f pages/informasjon/om-oss.html ]"
run_test "Services page exists (pages/informasjon/tjenester.html)" "[ -f pages/informasjon/tjenester.html ]"
run_test "Pricing page exists (pages/priser/priser.html)" "[ -f pages/priser/priser.html ]"
run_test "Contact page exists (pages/kundeservice/kontakt.html)" "[ -f pages/kundeservice/kontakt.html ]"
run_test "Chatbot page exists (pages/kundeservice/chatbot.html)" "[ -f pages/kundeservice/chatbot.html ]"
run_test "References page exists (pages/kunder/referanser.html)" "[ -f pages/kunder/referanser.html ]"
run_test "Games page exists (pages/spill/minispill.html)" "[ -f pages/spill/minispill.html ]"
run_test "FAQ page exists (pages/faq/faq.html)" "[ -f pages/faq/faq.html ]"
run_test "Privacy page exists (pages/personvern/personvern.html)" "[ -f pages/personvern/personvern.html ]"
run_test "Security page exists (pages/sikkerhet/sikkerhet.html)" "[ -f pages/sikkerhet/sikkerhet.html ]"
run_test "Profile page exists (pages/konto/profil.html)" "[ -f pages/konto/profil.html ]"

# 2. CSS and JS Assets
echo -e "\n${BLUE}2. CSS & JavaScript Assets${NC}"
echo "============================"

run_test "Main theme CSS exists" "[ -f css/theme.css ]"
run_test "Pages CSS exists" "[ -f css/pages.css ]"
run_test "Main JavaScript exists" "[ -f js/main.js ]"
run_test "Animations JS exists" "[ -f js/animations.js ]"
run_test "Chatbot JS exists" "[ -f js/chatbot.js ]"
run_test "Game JS exists" "[ -f js/game.js ]"
run_test "Shopify integration JS exists" "[ -f js/shopify-integration.js ]"

# 3. JavaScript Syntax Validation
echo -e "\n${BLUE}3. JavaScript Syntax Validation${NC}"
echo "=================================="

for jsfile in js/*.js; do
  if [ -f "$jsfile" ]; then
    filename=$(basename "$jsfile")
    run_test "Syntax check: $filename" "node -c $jsfile"
  fi
done

# 4. HTML Validation (basic checks)
echo -e "\n${BLUE}4. HTML Structure Validation${NC}"
echo "=============================="

html_files=$(find pages -name "*.html" -type f)
html_count=$(echo "$html_files" | wc -l)
echo "  Found $html_count HTML files"

for htmlfile in $html_files; do
  filename=$(basename "$htmlfile")
  
  # Check for doctype
  if grep -q "<!doctype html>" "$htmlfile" || grep -q "<!DOCTYPE html>" "$htmlfile"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "  ${RED}✗ FAIL${NC}: Missing DOCTYPE in $htmlfile"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  # Check for <html lang="no">
  if grep -q '<html lang="no">' "$htmlfile"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "  ${YELLOW}⚠ WARNING${NC}: Missing lang='no' in $htmlfile"
    WARNINGS=$((WARNINGS + 1))
  fi
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
done

# 5. Link Validation
echo -e "\n${BLUE}5. Internal Link Validation${NC}"
echo "============================"

# Check for old-style broken links (excluding valid root pages)
broken_links=$(grep -r 'href="/pages/hjem\.html"' pages/ 2>/dev/null | wc -l)
if [ "$broken_links" -eq 0 ]; then
  echo -e "  ${GREEN}✓ PASS${NC}: No old /pages/hjem.html links found"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Found $broken_links old /pages/hjem.html links"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

broken_links=$(grep -r 'href="/pages/om-oss\.html"' pages/ 2>/dev/null | wc -l)
if [ "$broken_links" -eq 0 ]; then
  echo -e "  ${GREEN}✓ PASS${NC}: No old /pages/om-oss.html links found"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Found $broken_links old /pages/om-oss.html links"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

broken_links=$(grep -r 'href="/pages/priser\.html"' pages/ 2>/dev/null | wc -l)
if [ "$broken_links" -eq 0 ]; then
  echo -e "  ${GREEN}✓ PASS${NC}: No old /pages/priser.html links found"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Found $broken_links old /pages/priser.html links"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 6. Shopify Integration Checks
echo -e "\n${BLUE}6. Shopify Integration${NC}"
echo "======================="

run_test "Shopify integration JS exists" "[ -f js/shopify-integration.js ]"
run_test "Shopify config template exists" "[ -f config/shopify-config.template.js ]"
run_test "Shopify documentation exists" "[ -f SHOPIFY_INTEGRATION.md ]"
run_test "Shopify config in .gitignore" "grep -q 'shopify-config.js' .gitignore"

# Check if pricing page has Shopify integration
if grep -q "data-shopify-tier" pages/priser/priser.html; then
  echo -e "  ${GREEN}✓ PASS${NC}: Pricing page has Shopify product attributes"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${YELLOW}⚠ WARNING${NC}: Pricing page missing Shopify attributes"
  WARNINGS=$((WARNINGS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if grep -q "shopify-integration.js" pages/priser/priser.html; then
  echo -e "  ${GREEN}✓ PASS${NC}: Pricing page includes Shopify integration script"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Pricing page missing Shopify integration script"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 7. Git Branch Status
echo -e "\n${BLUE}7. Git Repository Status${NC}"
echo "========================="

current_branch=$(git branch --show-current)
echo "  Current branch: $current_branch"

# List all branches
branches=$(git branch -a | grep -v "HEAD" | wc -l)
echo "  Total branches: $branches"

# Check if main is up to date
if git status | grep -q "Your branch is up to date"; then
  echo -e "  ${GREEN}✓ PASS${NC}: Main branch is up to date with remote"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${YELLOW}⚠ WARNING${NC}: Main branch may not be synced with remote"
  WARNINGS=$((WARNINGS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 8. Accessibility Checks
echo -e "\n${BLUE}8. Basic Accessibility Checks${NC}"
echo "==============================="

# Check for alt attributes on images
html_with_img=$(grep -r "<img" pages/ --include="*.html" | wc -l)
html_with_alt=$(grep -r '<img[^>]*alt=' pages/ --include="*.html" | wc -l)
echo "  Images found: $html_with_img"
echo "  Images with alt text: $html_with_alt"

if [ "$html_with_img" -eq "$html_with_alt" ]; then
  echo -e "  ${GREEN}✓ PASS${NC}: All images have alt attributes"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  missing=$((html_with_img - html_with_alt))
  echo -e "  ${YELLOW}⚠ WARNING${NC}: $missing images missing alt attributes"
  WARNINGS=$((WARNINGS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check for lang attribute
files_with_lang=$(grep -r '<html lang=' pages/ --include="*.html" | wc -l)
echo "  HTML files with lang attribute: $files_with_lang / $html_count"

# 9. Security Checks
echo -e "\n${BLUE}9. Security Validation${NC}"
echo "========================"

# Check that config file is in .gitignore
if grep -q "config/shopify-config.js" .gitignore; then
  echo -e "  ${GREEN}✓ PASS${NC}: Shopify config protected in .gitignore"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Shopify config NOT protected in .gitignore"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Check that actual config doesn't exist (template only)
if [ ! -f "config/shopify-config.js" ]; then
  echo -e "  ${GREEN}✓ PASS${NC}: No committed Shopify credentials found"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "  ${RED}✗ FAIL${NC}: Shopify config file exists (should not be committed)"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 10. Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "================"
echo -e "Total Tests:    $TOTAL_TESTS"
echo -e "Passed:         ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:         ${RED}$FAILED_TESTS${NC}"
echo -e "Warnings:       ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✓ All critical tests passed!${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please review and fix issues.${NC}"
  echo ""
  exit 1
fi
