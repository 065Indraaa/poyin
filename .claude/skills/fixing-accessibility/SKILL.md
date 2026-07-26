---
name: fixing-accessibility
description: Audit and fix HTML accessibility issues including ARIA labels, keyboard navigation, focus management, color contrast, and form errors.
---

# Fixing Accessibility

Fix accessibility issues.

## Quick Reference

### 1. Accessible Names (critical)
- Every interactive control must have an accessible name.
- Icon-only buttons must have `aria-label` or `aria-labelledby`.
- Every input, select, and textarea must be labeled.
- Decorative icons must be `aria-hidden="true"`.

### 2. Keyboard Access (critical)
- Do not use `div` or `span` as buttons without full keyboard support.
- All interactive elements must be reachable by Tab.
- Focus must be visible for keyboard users.
- Escape must close dialogs or overlays when applicable.

### 3. Focus and Dialogs (critical)
- Modals must trap focus while open.
- Restore focus to trigger on close.

### 4. Semantics & Forms
- Prefer native HTML elements (`button`, `a`, `input`).
- Form errors linked via `aria-describedby` and `aria-invalid="true"`.
