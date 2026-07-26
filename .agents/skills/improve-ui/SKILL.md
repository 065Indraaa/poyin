---
name: improve-ui
description: Mengaudit tampilan antarmuka (UI) produk yang ada berdasarkan standar desainnya, mengidentifikasi masalah visual yang terverifikasi, dan menyusun rencana implementasi mandiri untuk dieksekusi.
---

# Audit & Perbaikan UI (Improve UI)

Mengaudit permukaan produk secara objektif tanpa mengubah identitas produk. Mengutamakan perbaikan berbasis bukti konkret.

## Batasan & Aturan Utama

- JANGAN PERNAH mengubah kode sumber produk saat proses audit. Buat dokumen rencana perbaikan di bawah folder `design-plans/`.
- Jangan menginstal dependensi baru atau mengubah git tree secara ceroboh.
- Buat setiap dokumen rencana perbaikan independen dan berdiri sendiri agar mudah dieksekusi oleh agen/developer lain.

## Tahapan Audit

1. **Pilih Area/Permukaan UI**: Fokus pada satu alur/halaman pengguna yang jelas.
2. **Rekonstruksi Sistem Lokal**: Cek variabel CSS, token warna, tipografi, dan komponen yang digunakan pada halaman tersebut.
3. **Buktikan Masalah (Proof Gate)**: Masalah dianggap valid jika memenuhi 3 bukti:
   - **Kontrak**: Ada aturan desain terbukti yang dilanggar.
   - **Runtime**: Masalah terbukti muncul saat dijalankan/di-render.
   - **Solusi Konkret**: Ada 1 solusi pasti tanpa menebak-nebak intent produk.
4. **Susun Laporan & Rencana Kerja**: Buat prioritas perbaikan berdasarkan dampak terbesar bagi pengguna.
