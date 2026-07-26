---
name: fixing-accessibility
description: Mengaudit dan memperbaiki masalah aksesibilitas HTML termasuk label ARIA, navigasi keyboard, manajemen fokus, kontras warna, dan pesan error form.
---

# Perbaikan Aksesibilitas (Fixing Accessibility)

Memastikan antarmuka dapat digunakan oleh semua pengguna, termasuk pengguna pembaca layar (screen reader) dan navigasi keyboard.

## Panduan Cepat Perbaikan

### 1. Nama Aksesibel (Kritis)
- Setiap kontrol interaktif (tombol, input, link) WAJIB memiliki label nama yang jelas.
- Tombol yang hanya berisi ikon WAJIB diberi atribut `aria-label` atau `aria-labelledby`.
- Ikon dekoratif yang tidak memiliki fungsi WAJIB diberi atribut `aria-hidden="true"`.

### 2. Navigasi Keyboard (Kritis)
- JANGAN PERNAH menggunakan `div` atau `span` sebagai tombol tanpa dukungan tombol keyboard lengkap (Enter/Space). Gunakan elemen `<button>` native.
- Semua elemen interaktif WAJIB dapat dijangkau menggunakan tombol `Tab`.
- Indikator fokus (focus outline) WAJIB terlihat jelas untuk pengguna keyboard.
- Tombol `Escape` WAJIB bisa digunakan untuk menutup modal/dialog yang terbuka.

### 3. Dialog & Focus Trapping (Kritis)
- Saat modal/pop-up terbuka, fokus keyboard WAJIB terkunci di dalam modal tersebut.
- Saat modal ditutup, fokus keyboard WAJIB kembali ke tombol pemicu awal.

### 4. Formulir & Pesan Error (Tinggi)
- Pesan kesalahan pada input WAJIB dihubungkan menggunakan `aria-describedby` dan `aria-invalid="true"`.
