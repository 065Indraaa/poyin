# Deploy SIA (Should I Ape?)

## Masalah yang Baru Saja Diperbaiki

Vercel = serverless. Artinya dia **gak bisa** jalanin WebSocket server persistent.
Error `WebSocket connection to 'wss://www.ponyin.id/indexer-ws' failed` muncul karena `server.js` (Express + WS) **gak pernah jalan di Vercel**.

Sekarang sudah ada 2 mode otomatis:

### Mode 1: Polling Fallback (Default di Vercel)
Kalau `VITE_INDEXER_WS_URL` kosong dan website pakai HTTPS, frontend langsung pindah ke **short-polling** tiap 8 detik. Gak perlu backend terpisah.

### Mode 2: WebSocket Real-Time (Butuh backend terpisah)
Kalau mau real-time push alerts, deploy `server.js` ke Railway/Render/Fly.io/VPS, lalu masukin URL-nya ke env Vercel.

---

## Env Variables yang Harus Diatur

### A. Di Dashboard Vercel (Project Settings → Environment Variables)

| Key | Value | Required? |
|-----|-------|-----------|
| `VITE_HELIUS_API_KEY` | `sk-...` API key Helius | **Wajib** buat authority & holder scan |
| `VITE_MADEONSOL_API_KEY` | `Bearer ...` API key MadeOnSol | Optional (buat blacklist & deployer tier) |
| `VITE_INDEXER_WS_URL` | Kosongkan = polling mode. Isi `wss://...` = WS mode | Optional |

> **Catatan**: Vite hanya baca env yang prefix `VITE_`. Jangan lupa prefix-nya.

### B. Kalau Deploy Backend Terpisah (Railway / Render / VPS)

Copy file `.env` dari root project ke backend host:

```bash
PORT=3001
HELIUS_API_KEY=sk-xxx
MADEONSOL_API_KEY=xxx
```

Lalu jalankan:
```bash
node server.js
```

Backend ini akan:
- Serve API `/api/scan-deep` dan `/api/feed-enriched`
- Jalankan background indexer engine (poll DexScreener, listen PumpPortal WS)
- Buka WebSocket server di `/indexer-ws`

---

## Perbedaan Mode

| Fitur | Polling Fallback (Vercel only) | WebSocket Mode (Backend + Vercel) |
|-------|-------------------------------|-----------------------------------|
| Feed discovery | Polling tiap 8 detik | Real-time push |
| Rug alerts | Delayed (tergantung poll) | Instant push |
| Background indexer | Gak jalan (API fetch langsung) | Jalan 24/7 |
| Bundle graph forensik | Langsung dari Helius RPC | Dari cache DB + Helius |
| Deployer reputation | Langsung dari MadeOnSol | Dari cache DB |
| Biaya | Gratis (Vercel hobby) | Bayar backend host |

---

## Quick Start (Vercel Only, Tanpa Backend)

1. Push code ke GitHub.
2. Import project ke Vercel.
3. Masukin env `VITE_HELIUS_API_KEY` di dashboard Vercel.
4. Deploy.
5. Frontend akan otomatis polling. Gak ada error WS lagi.

## Quick Start (Dengan Backend Real-Time)

1. Deploy repo ini ke **Railway** atau **Render** (pilih service Node.js).
2. Railway akan otomatis detect `server.js` dan jalankan.
3. Copy public URL Railway, contoh: `https://sia-backend.railway.app`
4. Di dashboard Vercel, tambah env: `VITE_INDEXER_WS_URL=wss://sia-backend.railway.app/indexer-ws`
5. Redeploy frontend Vercel.
6. Sekarang frontend connect ke backend via WebSocket.

---

## FAQ

**Q: Kenapa gak bisa pakai WebSocket di Vercel?**
A: Vercel = serverless function. Tiap request datang, function di-spin-up, respons, lalu mati. WebSocket butuh koneksi persistent yang hidup terus. Itu gak compatible dengan serverless.

**Q: Polling fallback bikin lambat gak?**
A: Gak kerasa lambat. Feed di-poll tiap 8 detik. Scan deep di-trigger pas user klik, bukan polling. Hanya alert real-time yang delayed sedikit.

**Q: Apakah data polling sama akurat dengan WebSocket?**
A: Sama persis. Bedanya cuma cara delivery-nya (pull vs push). Data source-nya tetap DexScreener + Helius RPC.
