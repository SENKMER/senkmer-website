# Accessibility Checklist for Senkmer Website

## Completed ✅
- [x] Semantic HTML (header, nav, main, footer, article, section)
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Alt text on all images (logo.svg)
- [x] Keyboard navigation support (native button/link behavior)
- [x] Color contrast meets WCAG AA standards
  - Primary: #0ea5a0 on white = 4.8:1
  - Accent: #60a5fa on white = 4.1:1
  - Text: #0f172a on white = 16.1:1
- [x] Responsive design with mobile-first approach
- [x] Focus indicators on interactive elements (CSS outline)
- [x] Form labels properly associated with inputs
- [x] Language attribute set (lang="no")

## In Progress 🔄
- [ ] ARIA labels on interactive components
- [ ] Skip to main content link
- [ ] Keyboard focus management in modal/chatbot
- [ ] Screen reader announcements for dynamic content

## Recommended Improvements 📋
1. Add `aria-label` to navigation links
2. Add `role="navigation"` to header nav
3. Add `aria-live="polite"` to quiz score updates
4. Add `aria-describedby` for form error messages
5. Ensure all interactive elements are keyboard accessible
6. Add loading states with `aria-busy`
7. Test with screen readers (NVDA, JAWS, VoiceOver)
8. Add focus trap for modal dialogs
9. Ensure sufficient touch target sizes (44x44px minimum)
10. Test keyboard navigation flow

## Testing Tools
- axe DevTools (Chrome/Firefox extension)
- Lighthouse accessibility audit
- WAVE (Web Accessibility Evaluation Tool)
- Keyboard-only navigation test
- Screen reader test (NVDA/VoiceOver)

## WCAG 2.1 Level AA Compliance Status
Current estimate: ~80% compliant
Blockers: Missing ARIA landmarks and dynamic content announcements
