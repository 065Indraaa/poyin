---
name: ui-skills
description: Set skill dan aturan standar UI & Design Engineering untuk proyek ini. Mencakup baseline-ui, improve-ui, create-design-md, fixing-accessibility, fixing-metadata, dan fixing-motion-performance. Gunakan saat membuat, meninjau, atau memoles komponen dan halaman web.
---

# UI Skills (Panduan & Pengatur Arah Design Engineering)

Proyek ini dilengkapi dengan modul **UI Skills** oleh `@ibelick`.

Saat membangun, mengaudit, atau merefaktor antarmuka pengguna (UI) dalam proyek ini, ikuti modul skill berikut sesuai kebutuhan:

1. **`baseline-ui`**: Membersihkan kode UI dari kebiasaan buruk (anti-slop), menegakkan aturan spasi, tipografi, tata letak, animasi, dan batas komponen UI.
2. **`create-design-md`**: Membuat atau memperbarui dokumen `DESIGN.md` yang berisi token desain dan aturan sistem UI proyek.
3. **`improve-ui`**: Mengaudit tampilan UI produk berdasarkan standar desain, menemukan masalah visual/UX, dan membuat rencana perbaikan terstruktur.
4. **`fixing-accessibility`**: Mengaudit dan memperbaiki aksesibilitas (WCAG), navigasi keyboard, fokus elemen, peran ARIA, dan form.
5. **`fixing-metadata`**: Memastikan metadata HTML, kartu Open Graph (sosial media), URL kanonikal, judul, dan struktur SEO sudah benar.
6. **`fixing-motion-performance`**: Mencegah animasi patah-patah (jank), mengoptimalkan animasi compositor (60fps), dan efisiensi performa gerakan.

## Perintah Penggunaan CLI

- `npx ui-skills start` - Menampilkan skill router utama
- `npx ui-skills categories` - Menampilkan semua kategori UI skill
- `npx ui-skills list` - Menampilkan daftar skill yang tersedia
- `npx ui-skills get <slug>` - Menampilkan detail lengkap dari suatu skill
