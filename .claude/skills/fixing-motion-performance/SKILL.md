---
name: fixing-motion-performance
description: Audit and fix animation performance issues including layout thrashing, compositor properties, scroll-linked motion, and blur effects.
---

# Fixing Motion Performance

Fix animation performance issues and jank.

## Quick Rules

1. **Compositor Properties**: Default to animating `transform` and `opacity` only.
2. **Never Animate Layout**: Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` continuously.
3. **Scroll Animations**: Use `IntersectionObserver` or CSS `scroll-timeline` rather than `scroll` event listeners.
4. **Blur Effects**: Keep blur effects small (<=8px) and never animate blur continuously on large containers.
