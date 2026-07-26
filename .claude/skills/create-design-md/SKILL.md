---
name: create-design-md
description: Create or update a DESIGN.md from an existing product repository or public website, with evidence-based design tokens and guidance.
---

# Create DESIGN.md

Generate or update `DESIGN.md` design language tokens and system contracts.

## Process

1. Collect evidence from design system tokens, CSS variables, typography, colors, spacing, rounded corners, and reusable component primitives.
2. Formulate explicit rules for color tokens, typography scales, layout rhythm, elevation, shapes, and component variants.
3. Validate and export via `npx @google/design.md lint DESIGN.md` and `npx @google/design.md export DESIGN.md`.
4. Ensure all guidelines are binding and change concrete implementation choices.
