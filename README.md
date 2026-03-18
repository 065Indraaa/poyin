# Poyin Trading Intel — React App

Website edukasi trading on-chain Solana milik @elpoyin, dikonversi dari single HTML file menjadi project React yang terstruktur.

## Struktur File

```
poyin-trading/
├── index.html                    # Entry point HTML
├── vite.config.js                # Vite config
├── package.json
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # App utama + state management
    ├── styles/
    │   └── main.css              # Seluruh CSS (responsive)
    ├── assets/
    │   └── avatar.png            # Avatar Poyin
    ├── data/
    │   └── panelData.js          # Data semua 17 panel + sidebar
    ├── hooks/
    │   └── useScrollReveal.js    # Intersection Observer hook
    └── components/
        ├── Navbar.jsx            # Fixed navbar
        ├── Hero.jsx              # Hero section 2-kolom
        ├── MateriIntro.jsx       # Bridge section (stats)
        ├── MobileTabs.jsx        # Horizontal tab nav mobile
        ├── Sidebar.jsx           # Desktop sidebar + progress bar
        ├── PanelArea.jsx         # Panel wrapper & switcher
        ├── PanelComponents.jsx   # Komponen UI reusable
        ├── Illustrations.jsx     # SVG diagram inline
        ├── PanelsVol1.jsx        # 10 panel Vol.1 (p0–p9)
        ├── PanelsVol2.jsx        # 7 panel Vol.2 (pa0–pa6)
        └── Footer.jsx            # Footer
```

## Panel Content

### Vol. 1 — Basic (p0–p9)
1. Bundle Token
2. Global Fees
3. Revoke & Minting
4. Meme vs Utility
5. Dex Paid, Ads & Boost
6. 3 Konfirmasi Candle
7. Cabal Play
8. Membaca Holder
9. Market Cap Tier
★. Penutup

### Vol. 2 — Advance (pa0–pa6)
A1. Cara Snipe Early Project
A2. First 1K dari $100
A3. Wallet Ping
A4. Money Management
A5. Transaksi Murah
A6. Instant Scalping
A7. Multi Wallet

## Cara Jalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build Production

```bash
npm run build
```

Output di folder `dist/`.

## Credits
- Konten: [@elpoyin](https://x.com/elpoyin)
- Partner: [trojan.com/@Keusel](https://trojan.com/@Keusel)
