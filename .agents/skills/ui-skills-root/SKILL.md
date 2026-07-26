---
name: ui-skills-root
description: Gunakan sebelum melakukan pekerjaan terkait UI untuk memilih konteks skill UI terkecil dan paling relevan melalui CLI ui-skills.
license: MIT
metadata:
  author: ibelick
  version: "1.0.0"
---

# Root Routing UI Skills

Ini adalah lapisan pengarah (router) untuk modul UI Skills.

Skill ini diaktifkan melalui `npx ui-skills start` atau saat agen AI mendeteksi tugas UI.

## Protokol Kerja

1. Tentukan apakah tugas terkait dengan UI.
2. Jika tidak terkait UI, kembalikan `tidak butuh skill UI`.
3. Identifikasi kategori UI yang paling relevan.
4. Periksa kategori tersebut menggunakan CLI `ui-skills`.
5. Pilih set skill terkecil dan paling fokus.
6. Muat hanya skill yang dipilih.
7. Eksekusi pekerjaan berdasarkan konteks skill tersebut.

## Aturan Pemilihan Skill

- Utamakan menggunakan **1 skill** per tugas.
- Gunakan **2 skill** hanya jika tugas membutuhkan dua sudut pandang berbeda (misal: aksesibilitas + animasi).
- Gunakan **3 skill** hanya untuk peninjauan besar, perancangan ulang, atau pekerjaan multi-halaman.
- **Jangan pernah menggunakan lebih dari 3 skill sekaligus.**
