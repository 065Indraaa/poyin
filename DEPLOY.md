# Deploy SIA (Should I Ape?)

## 1. Env Variable yang HARUS Diset di Vercel

Buka **Vercel Dashboard → Project → Settings → Environment Variables**.

| Key | Value | Wajib? | Kenapa |
|-----|-------|--------|--------|
| **`VITE_HELIUS_API_KEY`** | `sk-...` dari [helius.dev](https://helius.dev) | **WAJIB** | Frontend **cuma bisa baca** env yang prefix `VITE_`. Kalau cuma set `HELIUS_API_KEY` tanpa `VITE_`, backend bisa baca tapi frontend gagal — authority & holder jadi kosong. |
| `MADEONSOL_API_KEY` | API key MadeOnSol | Optional | Blacklist, deployer tier, global fees. Kalau kosong, fitur ini non-aktif. |
| `SMART_WALLETS` | `wallet:nama:tipe:x,...` | Optional | Registry wallet pintar manual. Kalau kosong, cuma label algoritmik (whale/burner). |
| `VITE_INDEXER_WS_URL` | `wss://...` atau kosong | Optional | Kosong = polling mode (Vercel-safe). Isi = WebSocket real-time (butuh backend terpisah). |

### Kenapa Harus `VITE_HELIUS_API_KEY` (bukan `HELIUS_API_KEY`)?

Vite (build tool frontend) punya aturan keras:
- **Browser cuma bisa akses env yang prefix `VITE_`**
- Env tanpa prefix (`HELIUS_API_KEY`) hanya bisa dibaca oleh **backend API** (Node.js), gak bisa masuk ke bundle browser

Di kode frontend `sia/src/data/liveProviders.js` baris 3:
```js
const HELIUS_KEY = (import.meta.env.VITE_HELIUS_API_KEY || '').trim();
//                           ↑↑↑↑
// Ini CUMAN lihat yang VITE_ prefix. Kalau cuma set HELIUS_API_KEY,
// variabel ini jadi string kosong → semua RPC gagal → authority/holder kosong.
```

Backend (`api/token-intel.js`, `api/health.js`) memang check BOTH (`HELIUS_API_KEY` dan `VITE_HELIUS_API_KEY`), tapi frontend cuma bisa lihat yang `VITE_`.

> **Solusi**: Set `VITE_HELIUS_API_KEY` di Vercel dashboard. Value sama persis dengan key Helius kamu.

### Step-by-step Set ENV di Vercel

1. Buka [helius.dev](https://helius.dev) → login → copy API key (format `sk-...`)
2. Buka [vercel.com/dashboard](https://vercel.com/dashboard) → pilih project kamu
3. Klik tab **Settings** → **Environment Variables**
4. Tambah key:
   - `VITE_HELIUS_API_KEY` = `sk-...`
   - `MADEONSOL_API_KEY` = key kamu (kalau punya)
5. Klik **Save**
6. **Redeploy** project (Vercel gak auto-apply env ke deployment lama)
7. Tunggu deploy selesai, refresh website

---

## 2. Pilihan Deploy

### Pilihan A: Vercel Only (Paling Gampang, Gratis)

Cocok buat yang mau jalan langsung tanpa ribet.

**Env yang diset:**
```
VITE_HELIUS_API_KEY=sk-xxx
MADEONSOL_API_KEY=xxx    (opsional)
SMART_WALLETS=...        (opsional)
VITE_INDEXER_WS_URL=     (kosong)
```

**Apa yang terjadi:**
- Frontend polling `/api/feed-enriched` tiap 8 detik
- Scan deep lewat `/api/scan-deep` tiap kali user klik
- WebSocket auto-disable (Vercel gak support WS)
- Semua Helius call lewat backend API (aman, key gak expose ke browser)

**Keterbatasan:**
- Feed update tiap 8 detik (bukan real-time)
- Background indexer gak jalan 24/7
- Scan deep langsung hit Helius tiap kali user klik (rate limit ~50 RPM)

### Pilihan B: Vercel + Backend Terpisah (Real-Time)

Kalau mau push alert instan, indexer 24/7, dan cache data.

1. Deploy repo yang sama ke **Railway** / **Render** / **Fly.io**
2. Di Railway, tambah env:
   ```
   PORT=3001
   HELIUS_API_KEY=sk-xxx
   MADEONSOL_API_KEY=xxx
   ```
3. Railway otomatis jalanin `server.js` (Express + WS + Indexer Engine)
4. Copy URL Railway, contoh: `https://sia-backend.up.railway.app`
5. Di Vercel dashboard, tambah env:
   ```
   VITE_INDEXER_WS_URL=wss://sia-backend.up.railway.app/indexer-ws
   ```
6. Redeploy Vercel

---

## 3. Troubleshooting

### Semua data kosong / "Authority belum diketahui"

Cek urutan ini:
1. Apakah `VITE_HELIUS_API_KEY` sudah diset di Vercel dashboard? (bukan cuma file `.env` lokal)
2. Apakah sudah **redeploy** setelah nambah env?
3. Cek `/api/health` — kalau `rpc.ok = false`, key salah atau expired
4. Cek DevTools → Console — kalau ada `[Indexer] Using poll fallback`, itu normal untuk mode Vercel

### WebSocket error (wss:// failed)

Ini normal kalau `VITE_INDEXER_WS_URL` kosong dan kamu pakai HTTPS (Vercel). Frontend otomatis switch ke polling. Gak perlu fix apa-apa.

### MarketCap gak sesuai

Sudah di-fix di `formatLiveMarketCap`. Kalau masih aneh, cek apakah token masih bonding curve (value akan muncul sebagai "bonding").
