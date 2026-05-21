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

## 2. Vercel Only vs Vercel + Backend Terpisah

### Kenapa Backend Terpisah Lebih Baik (Tapi Opsional)?

Kamu bener — **Vercel udah ada backend** (API serverless). Tapi backend Vercel punya keterbatasan:

| Aspek | Vercel Serverless Only | Backend Terpisah (Railway/Render) |
|-------|----------------------|-----------------------------------|
| **WebSocket** | ❌ Gak support | ✅ Support real-time push |
| **Background indexer** | ❌ Gak bisa jalan 24/7 | ✅ Poll DexScreener setiap 10 detik tanpa henti |
| **PumpPortal WS** | ❌ Browser WS kadang gagal (error yang kamu lihat) | ✅ Backend connect PumpPortal WS, terus kirim ke frontend |
| **Cache data** | ❌ Tiap request mulai dari nol | ✅ Cache 75 detik, history token disimpan |
| **Time-series** | ❌ Gak ada history | ✅ Bisa lihat trend token 1 jam lalu |
| **Biaya** | ✅ Gratis | 💰 Bayar backend host (~$5-20/bulan) |

**Kesimpulan**: Kalau mau **cukup jalan** → Vercel only sudah cukup. Kalau mau **push alert instan, data lebih kaya, history token, dan bundle graph forensik** → butuh backend terpisah.

### Pilihan A: Vercel Only (Cukup Buat Jalan)

**Env yang diset:**
```
VITE_HELIUS_API_KEY=sk-xxx
MADEONSOL_API_KEY=xxx    (opsional)
SMART_WALLETS=...        (opsional)
VITE_INDEXER_WS_URL=     (kosong)
```

**Apa yang terjadi:**
- Feed discovery lewat DexScreener API tiap 10 detik
- PumpPortal WS dicoba dari browser — kalau gagal, auto-retry dengan backoff
- Semua Helius call lewat `/api/token-intel` (backend API Vercel)
- WebSocket ke backend gak aktif (Vercel gak support WS persistent)

**Keterbatasan:**
- Feed update tiap 10 detik (bukan real-time)
- PumpPortal WS dari browser kadang gagal (tergantung jaringan user)
- Gak ada history token / time-series

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

### WebSocket error (wss://pumpportal.fun failed)

Ini **normal** di mode Vercel. Browser kadang gak bisa connect ke `wss://pumpportal.fun/api/data` karena:
- Network user block WS
- HTTPS → WS upgrade gagal
- Timeout

Sekarang sudah ada auto-retry dengan backoff. Kalau tetap gagal, data token tetap ke-load dari **DexScreener API** (fallback otomatis). Jadi feed tetap jalan, cuma tanpa token baru langsung dari PumpPortal.

> **Solusi**: Refresh halaman. Kalau masih gagal, itu artinya PumpPortal WS sedang maintenance atau network user block WS. DexScreener tetap jalan.

### `feature_collector.js:23 using deprecated parameters`

Ini **bukan dari code kita**. Ini dari **browser extension** yang kamu install (kemungkinan extension crypto tools). Gak perlu di-fix.

### `favicon.ico 404`

Saya sudah tambahkan `favicon.svg` dan `apple-touch-icon`. Kalau masih 404, **redeploy** Vercel supaya file static baru ke-upload.

---

## 4. Cepat Cek Lewat Browser

Buka DevTools → Console:
- Kalau muncul `[Indexer] WS connected` → backend nyambung
- Kalau muncul `[Indexer] Using poll fallback (Vercel-safe)` → mode Vercel-only aktif, normal
- Kalau muncul `PumpPortal reconnecting` → WS gagal, tapi DexScreener fallback jalan
