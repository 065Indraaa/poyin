---
name: improve-ui
description: Audit an existing product surface against its own design evidence, identify verified UI problems, and write self-contained implementation plans for another agent. Strictly read-only on product source.
---

# Improve UI

Audit one coherent product surface against the system that actually governs it. Preserve the product's identity, reuse existing owners, and prefer no finding to an unsupported one. Write plans only for changes the user selects.

## Boundaries

- Never modify product source during audit. Create or edit files under `design-plans/`.
- Do not install dependencies or mutate working tree unnecessarily.
- Make every plan self-contained for execution.
