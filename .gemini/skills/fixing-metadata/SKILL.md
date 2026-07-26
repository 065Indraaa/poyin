---
name: fixing-metadata
description: Mengaudit dan memperbaiki metadata HTML termasuk judul halaman, deskripsi meta, URL kanonikal, tag Open Graph, kartu Twitter, favicon, data terstruktur JSON-LD, dan direktif robots.
---

# Perbaikan Metadata & SEO (Fixing Metadata)

Memastikan halaman web memiliki metadata lengkap untuk optimasi mesin pencari (SEO) dan tampilan pratinjau saat dibagikan ke media sosial.

## Panduan Utama

1. **Judul & Deskripsi**: Setiap halaman WAJIB memiliki elemen `<title>` yang deskriptif dan `<meta name="description">` berbentuk teks polos tanpa markdown.
2. **URL Kanonikal**: Elemen `<link rel="canonical">` WAJIB mengarah ke URL resmi halaman.
3. **Open Graph & Twitter Cards**:
   - `og:title`, `og:description`, `og:image` (WAJIB berupa URL absolut lengkap), `og:url`.
   - `twitter:card` disetel ke `"summary_large_image"` secara bawaan.
4. **Favicon & Icon App**: Path favicon harus stabil, dapat di-cache, serta menyertakan ikon Apple jika diperlukan.
