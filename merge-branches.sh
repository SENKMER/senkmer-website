#!/bin/bash
# Merge main branch changes into all feature branches

branches=(
  "feature/hjem-page"
  "feature/om-oss-page"
  "feature/tjenester-page"
  "feature/priser-page"
  "feature/kontakt-page"
  "feature/referanser-page"
  "feature/chatbot-page"
  "feature/minispill-page"
  "feature/faq-page"
  "feature/personvern-page"
  "feature/sikkerhet-page"
  "feature/profil-page"
)

echo "🔄 Merging main branch changes into all feature branches"
echo "========================================================"
echo ""

# Ensure we're on main and up to date
git checkout main
git pull origin main

echo ""
echo "Starting branch merges..."
echo ""

for branch in "${branches[@]}"; do
  echo "📦 Processing: $branch"
  
  # Checkout branch
  git checkout "$branch"
  
  # Merge main into feature branch
  if git merge main -m "chore: merge main with Shopify integration and link fixes"; then
    echo "  ✓ Merged main into $branch"
    
    # Push to remote
    if git push origin "$branch"; then
      echo "  ✓ Pushed $branch to remote"
    else
      echo "  ✗ Failed to push $branch"
    fi
  else
    echo "  ✗ Merge conflict in $branch - requires manual resolution"
    git merge --abort
  fi
  
  echo ""
done

# Return to main branch
git checkout main

echo "✅ Branch merge process complete!"
echo ""
echo "Summary:"
echo "- Updated all feature branches with:"
echo "  • Fixed navigation links"
echo "  • Shopify e-commerce integration"
echo "  • Updated .gitignore for security"
echo "  • Test script for validation"
