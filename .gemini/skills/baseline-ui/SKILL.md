---
name: baseline-ui
description: Membersihkan kode UI dengan cepat dengan merapikan spasi, hierarki visual, tipografi, dan masalah tata letak kecil. Gunakan saat antarmuka membutuhkan pembersihan atau pemolesan cepat.
---

# Baseline UI (Standar Dasar UI)

Menegakkan standar UI yang konsisten untuk mencegah tampilan antarmuka yang berantakan atau generik hasil buatan AI.

## Cara Penggunaan

- `/baseline-ui`
  Terapkan aturan ini untuk semua pekerjaan UI pada percakapan ini.

- `/baseline-ui <nama_file>`
  Tinjau file berdasarkan aturan di bawah ini dan tampilkan:
  - Pelanggaran (kutip baris/kode persis)
  - Alasan masalah (1 kalimat singkat)
  - Solusi konkret (saran perbaikan kode)

## Teknologi & Stack

- WAJIB menggunakan nilai standar Tailwind CSS kecuali jika ada nilai custom yang sudah ada atau diminta.
- WAJIB menggunakan `motion/react` (dulu `framer-motion`) jika membutuhkan animasi JavaScript.
- SANGAT DISARANKAN menggunakan `tw-animate-css` untuk animasi masuk dan mikro-animasi pada Tailwind CSS.
- WAJIB menggunakan fungsi pembantu `cn` (`clsx` + `tailwind-merge`) untuk logika kelas CSS.

## Komponen

- WAJIB menggunakan komponen primitif yang aksesibel untuk elemen interaktif (`Base UI`, `React Aria`, `Radix`).
- WAJIB mengutamakan komponen primitif yang sudah ada di dalam proyek.
- JANGAN PERNAH mencampur sistem primitif yang berbeda pada satu area interaksi yang sama.
- WAJIB menambahkan `aria-label` pada tombol yang hanya berisi ikon.
- JANGAN PERNAH membuat ulang perilaku fokus atau keyboard secara manual jika sudah ada komponen bawaan.

## Interaksi

- WAJIB menggunakan `AlertDialog` untuk tindakan destruktif atau tindakan yang tidak bisa dibatalkan.
- DISARANKAN menggunakan struktur skeleton untuk status pemuatan data (loading state).
- JANGAN PERNAH menggunakan `h-screen`, gunakan `h-dvh` agar pas di layar perangkat seluler.
- WAJIB memperhitungkan `safe-area-inset` untuk elemen dengan posisi fixed (seperti bar navigasi bawah).
- WAJIB menampilkan pesan kesalahan tepat di dekat tempat tindakan terjadi.
- JANGAN PERNAH memblokir fungsi paste (tempel teks) pada elemen `input` atau `textarea`.

## Animasi

- JANGAN PERNAH menambahkan animasi kecuali jika diminta secara eksplisit.
- WAJIB menganimasikan hanya properti compositor (`transform`, `opacity`).
- JANGAN PERNAH menganimasikan properti tata letak (`width`, `height`, `top`, `left`, `margin`, `padding`).
- DISARANKAN menggunakan efek `ease-out` saat elemen muncul.
- JANGAN PERNAH melebihi `200ms` untuk respon balik interaksi (hover/click).
- WAJIB menghentikan animasi berulang (looping) saat elemen berada di luar layar.
- WAJIB menghormati setelan pengguna `prefers-reduced-motion`.

## Tipografi & Tata Letak

- WAJIB menggunakan `text-balance` untuk judul dan `text-pretty` untuk paragraf/isi teks.
- WAJIB menggunakan `tabular-nums` untuk tampilan data angka agar sejajar.
- JANGAN PERNAH mengubah `letter-spacing` (`tracking-*`) kecuali diminta.
- WAJIB menggunakan skala `z-index` yang pasti dan konsisten.
