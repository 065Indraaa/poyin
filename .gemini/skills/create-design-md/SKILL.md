---
name: create-design-md
description: Membuat atau memperbarui dokumen DESIGN.md dari repositori produk atau website publik, dengan token desain berdasar bukti dan panduan terstruktur.
---

# Membuat Dokumentasi DESIGN.md

Digunakan untuk menghasilkan atau memperbarui file `DESIGN.md` yang menyimpan aturan token desain dan sistem antarmuka proyek.

## Alur Kerja

1. **Kumpulkan Bukti Visual**: Ekstrak token desain, variabel CSS, skala tipografi, warna, jarak (spacing), sudut tumpul (border-radius), dan komponen terpakai.
2. **Formulasikan Aturan Tertulis**: Buat aturan pasti untuk skema warna, tipografi, tata letak, elevasi/bayangan, bentuk elemen, dan varian komponen.
3. **Validasi & Ekspor**: Gunakan perintah `npx @google/design.md lint DESIGN.md` dan `npx @google/design.md export DESIGN.md`.
4. **Pastikan Kepastian Aturan**: Semua aturan harus jelas, mengikat, dan dapat langsung diterapkan pada pembuatan kode.
