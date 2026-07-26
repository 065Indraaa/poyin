---
name: fixing-motion-performance
description: Mengaudit dan memperbaiki masalah performa animasi termasuk layout thrashing, properti compositor, gerakan berbasis scroll, dan efek blur.
---

# Perbaikan Performa Animasi (Fixing Motion Performance)

Memastikan semua animasi di web berjalan mulus pada 60/120 fps tanpa menyebabkan patah-patah (jank) atau beban berlebih pada GPU/CPU.

## Aturan Utama Performa Animasi

1. **Gunakan Properti Compositor**:
   - Gunakan `transform` (scale, translate, rotate) dan `opacity` untuk animasi.
   - Properti ini diproses langsung di GPU tanpa memicu kalkulasi ulang tata letak (layout reflow).

2. **Dilarang Menganimasikan Properti Layout**:
   - JANGAN PERNAH menganimasikan `width`, `height`, `top`, `left`, `margin`, atau `padding` secara terus-menerus.

3. **Animasi Berbasis Scroll**:
   - Gunakan `IntersectionObserver` atau CSS `scroll-timeline` daripada menambahkan *event listener* pada pergerakan `scroll` JavaScript.

4. **Efek Blur & Filter**:
   - Batasi efek blur (maksimal <= 8px) dan jangan pernah menganimasikan blur pada kontainer berukuran besar.
