import { Callout, IllusBox, StepFlow } from './PanelComponents';
import { SnipeSVG, WalletPingSVG, MultiWalletSVG } from './Illustrations';
import { useLang } from '../context/LanguageContext';
import T2 from '../data/translationsVol2';
import RefundImg from '../assets/Refund.jpg';
import { useState } from 'react';

/* Helper: get translations for a section */
function useT(section) {
  const { lang } = useLang();
  return T2[section]?.[lang] || T2[section]?.id || {};
}

// ═══════ PA0: SNIPE ═══════
export function PanelSnipe() {
  const t = useT('snipe');
  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p2 }} />

      <Callout type="info" icon="🗺️" title={t.mappingTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.mapping }} />
      </Callout>

      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><SnipeSVG /></div></IllusBox>

      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.caseStudy }} />

      <p className="prose reveal" style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{t.toolsHeader}</p>
      <ul className="cklist reveal">
        {t.tools.map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: i < 2 ? '#7c3aed' : i < 4 ? '#2455d4' : '#059669' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <Callout type="warn" icon="⚡" title={t.botTitle}>{t.bot}</Callout>
    </>
  );
}

// ═══════ PA1: FIRST 1K ═══════
export function PanelFirst1K() {
  const t = useT('first1k');
  const { lang } = useLang();
  return (
    <>
      {/* Ilustrasi SVG — kept as-is, labels are visual */}
      <div className="illus-box reveal">
        <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
          <rect width="700" height="280" fill="transparent" />
          <text x="350" y="34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{lang === 'en' ? 'Two Paths: $100 → $1000' : 'Dua Jalur: $100 → $1000'}</text>
          <rect x="20" y="55" width="310" height="205" rx="18" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x="175" y="86" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#1e40af">{lang === 'en' ? '💬 Connection Path' : '💬 Jalur Koneksi'}</text>
          <text x="175" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#3b82f6">{lang === 'en' ? '"Sweet Talker"' : '"Mulut Manis"'}</text>
          <line x1="40" y1="112" x2="310" y2="112" stroke="#bfdbfe" strokeWidth="1" />
          <text x="40" y="132" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">{lang === 'en' ? '→ Build cabal group relations' : '→ Bangun relasi ke grup cabal'}</text>
          <text x="40" y="152" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">{lang === 'en' ? '→ Ask to be included' : '→ Minta diajak masuk bareng'}</text>
          <text x="40" y="172" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">{lang === 'en' ? '→ Buy per instructions (official wallet)' : '→ Beli sesuai instruksi (dompet resmi)'}</text>
          <text x="40" y="192" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">{lang === 'en' ? '→ Have a private wallet on the side' : '→ Punya dompet pribadi di belakang'}</text>
          <text x="40" y="212" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">{lang === 'en' ? '→ Respect the chart when selling' : '→ Hormati chart saat menjual'}</text>
          <rect x="40" y="224" width="270" height="26" rx="8" fill="#dbeafe" stroke="#93c5fd" />
          <text x="175" y="241" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#1e40af" fontWeight="700">{lang === 'en' ? 'Good reputation → more opportunities' : 'Reputasi bagus → lebih banyak kesempatan'}</text>
          <rect x="370" y="55" width="310" height="205" rx="18" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
          <text x="525" y="86" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#4c1d95">{lang === 'en' ? '🚀 Deployer Path' : '🚀 Jalur Deployer'}</text>
          <text x="525" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#7c3aed">{lang === 'en' ? '"The Creator"' : '"Si Pembuat"'}</text>
          <line x1="390" y1="112" x2="660" y2="112" stroke="#ddd6fe" strokeWidth="1" />
          <text x="390" y="132" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? '→ Create your own coin (deploy)' : '→ Buat koin sendiri (deploy)'}</text>
          <text x="390" y="152" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? '→ You control everything' : '→ Kamu yang kontrol semuanya'}</text>
          <text x="390" y="172" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? '→ Decide timing and strategy' : '→ Tentukan waktu dan strategi'}</text>
          <text x="390" y="192" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? '→ Requires higher skills' : '→ Butuh kemampuan lebih tinggi'}</text>
          <text x="390" y="212" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? '→ Tutorial will be shared' : '→ Tutorial akan dibagikan'}</text>
          <rect x="390" y="224" width="270" height="26" rx="8" fill="#ede9fe" stroke="#c4b5fd" />
          <text x="525" y="241" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#4c1d95" fontWeight="700">{lang === 'en' ? 'Bigger potential, higher risk' : 'Potensi lebih besar, risiko lebih tinggi'}</text>
        </svg>
      </div>

      <div className="two-col reveal" style={{ marginTop: 32 }}>
        <div>
          <p className="prose"><strong>{t.jalur1Title}</strong> — {t.jalur1}</p>
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.jalur1b }} />
          <Callout type="ok" icon="✅" title={t.sellTitle}>{t.sell}</Callout>
        </div>
        <div>
          <p className="prose"><strong>{t.jalur2Title}</strong> — {t.jalur2}</p>
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.jalur2b }} />
          <Callout type="purple" icon="💡" title={t.principleTitle}>{t.principle}</Callout>
        </div>
      </div>
    </>
  );
}

// ═══════ PA2: WALLET PING ═══════
export function PanelWalletPing() {
  const t = useT('walletping');
  return (
    <>
      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><WalletPingSVG /></div></IllusBox>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p2 }} />

      <Callout type="warn" icon="⚠️" title={t.warnTitle}>{t.warn}</Callout>

      <p className="prose reveal" style={{ marginTop: 28, fontWeight: 700, color: 'var(--ink)' }}>{t.findHeader}</p>
      <ul className="cklist reveal">
        {t.findItems.map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: ['#7c3aed', '#6d28d9', '#5b21b6', '#2455d4'][i] }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <Callout type="ok" icon="📈" title={t.benefitTitle}>{t.benefit}</Callout>
    </>
  );
}

// ═══════ PA3: MODAL / MONEY MGMT ═══════
export function PanelModal() {
  const t = useT('modal');
  const { lang } = useLang();
  
  const [initialCapital, setInitialCapital] = useState(0.5);

  const steps = [];
  let currentCap = parseFloat(initialCapital) || 0;
  for (let i = 1; i <= 5; i++) {
    let tradeAmount = currentCap * 0.8;
    let profit = tradeAmount * 0.5;
    let newCap = currentCap + profit;
    if (currentCap > 0) {
      steps.push({
        step: i,
        start: currentCap.toFixed(2),
        trade: tradeAmount.toFixed(2),
        profit: profit.toFixed(2),
        end: newCap.toFixed(2)
      });
    }
    currentCap = newCap;
  }

  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />

      {/* Ilustrasi SVG — bilingual labels */}
      <div className="illus-box reveal">
        <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
          <rect width="700" height="260" fill="transparent" />
          <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{lang === 'en' ? 'Compounding Strategy: 0.5 SOL → 5 SOL' : 'Strategi Compounding: 0.5 SOL → 5 SOL'}</text>
          <rect x="20" y="55" width="100" height="80" rx="12" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
          <text x="70" y="85" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#b45309">0.5</text>
          <text x="70" y="100" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#92400e">{lang === 'en' ? 'SOL start' : 'SOL awal'}</text>
          <text x="70" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309" fontWeight="600">{lang === 'en' ? 'Initial capital' : 'Modal awal'}</text>
          <text x="138" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="155" y="55" width="140" height="80" rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x="225" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1e40af" fontWeight="700">{lang === 'en' ? '35% TP Strategy' : 'Strategi 35% TP'}</text>
          <text x="225" y="97" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{lang === 'en' ? 'Take 35% profit →' : 'Ambil 35% untung →'}</text>
          <text x="225" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{lang === 'en' ? 'move to new wallet' : 'pindah ke dompet baru'}</text>
          <text x="225" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#3b82f6">{lang === 'en' ? 'Effect: compound interest' : 'Efek: bunga berbunga'}</text>
          <text x="313" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="326" y="55" width="140" height="80" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <text x="396" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#065f46" fontWeight="700">{lang === 'en' ? 'Good opportunity' : 'Ada peluang bagus'}</text>
          <text x="396" y="97" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{lang === 'en' ? 'Enter 70-80%' : 'Masuk 70-80%'}</text>
          <text x="396" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{lang === 'en' ? 'of total savings' : 'dari total simpanan'}</text>
          <text x="396" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#059669">{lang === 'en' ? 'Target: 50% profit' : 'Target: 50% untung'}</text>
          <text x="484" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="497" y="45" width="183" height="100" rx="12" fill="#1e3a8a" stroke="#2455d4" strokeWidth="2" />
          <text x="588" y="75" textAnchor="middle" fontFamily="Georgia,serif" fontSize="24" fontWeight="700" fill="white">5 SOL</text>
          <text x="588" y="95" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">{lang === 'en' ? 'Target reached' : 'Target tercapai'}</text>
          <text x="588" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">{lang === 'en' ? 'Getting comfortable' : 'Mulai lebih nyaman'}</text>
          <text x="588" y="131" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#93c5fd">{lang === 'en' ? 'From here: play seriously' : 'Dari sini: main lebih serius'}</text>
          <rect x="20" y="158" width="660" height="82" rx="14" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5" />
          <text x="350" y="182" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">{lang === 'en' ? '🤖 Auto Take Profit — Weapon Against Greed' : '🤖 Fitur Auto Take Profit — Senjata Melawan Keserakahan'}</text>
          <text x="350" y="202" textAnchor="middle" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">{lang === 'en' ? 'Set profit target → system auto-sells → you can\'t "hold a bit more"' : 'Set target untung → sistem otomatis jual → kamu tidak bisa "tahan dikit lagi"'}</text>
          <text x="350" y="222" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#6d28d9">{lang === 'en' ? 'After target hit: DON\'T buy the same coin again. Find new opportunities.' : 'Setelah target kena: JANGAN beli lagi koin yang sama. Cari peluang baru.'}</text>
        </svg>
      </div>

      <div className="two-col reveal" style={{ marginTop: 32 }}>
        <div>
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.tp35 }} />
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.tp35why }} />
        </div>
        <div>
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.opportunity }} />
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.autoTP }} />
        </div>
      </div>

      <div className="simulation-box reveal" style={{ background: 'var(--surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border)', marginTop: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{t.simTitle}</h3>
        <p className="prose" style={{ fontSize: 14, marginBottom: 20 }}>{t.simDesc}</p>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--slate)', marginBottom: 8 }}>{t.simInput}</label>
          <input 
            type="number" 
            value={initialCapital} 
            onChange={(e) => setInitialCapital(e.target.value)}
            step="0.1"
            min="0.1"
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', width: '100%', maxWidth: 200, fontSize: 16, color: 'var(--ink)', outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--slate)' }}>
                <th style={{ padding: '12px 8px' }}>{t.simStep}</th>
                <th style={{ padding: '12px 8px' }}>{t.simStart}</th>
                <th style={{ padding: '12px 8px' }}>{t.simTrade}</th>
                <th style={{ padding: '12px 8px', color: 'var(--brand)' }}>{t.simProfit}</th>
                <th style={{ padding: '12px 8px', color: 'var(--ink)' }}>{t.simEnd}</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{s.step}</td>
                  <td style={{ padding: '12px 8px' }}>{s.start} SOL</td>
                  <td style={{ padding: '12px 8px' }}>{s.trade} SOL</td>
                  <td style={{ padding: '12px 8px', color: 'var(--brand)', fontWeight: 600 }}>+{s.profit} SOL</td>
                  <td style={{ padding: '12px 8px', color: 'var(--ink)', fontWeight: 700 }}>{s.end} SOL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout type="danger" icon="🚨" title={t.greedTitle}>{t.greed}</Callout>
    </>
  );
}

// ═══════ PA4: TRANSAKSI MURAH ═══════
export function PanelTransaksi() {
  const t = useT('transaksi');
  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />
      <div className="two-col reveal">
        <div>
          <div className="def-card">
            <div className="def-icon">⚙️</div>
            <div className="def-term">{t.rustTerm}</div>
            <div className="def-desc" dangerouslySetInnerHTML={{ __html: t.rustDesc }} />
          </div>
        </div>
        <div>
          <div className="def-card">
            <div className="def-icon">🌐</div>
            <div className="def-term">{t.rpcTerm}</div>
            <div className="def-desc" dangerouslySetInnerHTML={{ __html: t.rpcDesc }} />
          </div>
        </div>
      </div>
      <Callout type="info" icon="💡" title={t.calcTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.calc }} />
      </Callout>
      <Callout type="warn" icon="⚠️" title={t.whenTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.when }} />
      </Callout>
    </>
  );
}

// ═══════ PA5: INSTANT SCALPING ═══════
export function PanelScalping() {
  const t = useT('scalping');
  const { lang } = useLang();
  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p2 }} />

      {/* Visual Infographic — bilingual */}
      <div className="illus-box reveal">
        <svg viewBox="0 0 700 310" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
          <rect width="700" height="310" fill="transparent" />
          <text x="350" y="30" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#18182b">{lang === 'en' ? '4 Filters Before Scalping New Pairs' : '4 Filter Sebelum Scalp New Pair'}</text>
          <rect x="20" y="50" width="145" height="110" rx="14" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x="92" y="78" textAnchor="middle" fontFamily="sans-serif" fontSize="26">⛽</text>
          <text x="92" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#1e40af">Step 1</text>
          <text x="92" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{lang === 'en' ? 'Check Global' : 'Cek Global'}</text>
          <text x="92" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Gas Fee</text>
          <text x="175" y="112" textAnchor="middle" fontSize="22" fill="#94a3b8">→</text>
          <rect x="190" y="50" width="145" height="110" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <text x="262" y="78" textAnchor="middle" fontFamily="sans-serif" fontSize="26">👛</text>
          <text x="262" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#065f46">Step 2</text>
          <text x="262" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Holder &amp; Funded</text>
          <text x="262" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Wallet Age</text>
          <text x="345" y="112" textAnchor="middle" fontSize="22" fill="#94a3b8">→</text>
          <rect x="360" y="50" width="145" height="110" rx="14" fill="#fefce8" stroke="#fde68a" strokeWidth="2" />
          <text x="432" y="78" textAnchor="middle" fontFamily="sans-serif" fontSize="26">💰</text>
          <text x="432" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#92400e">Step 3</text>
          <text x="432" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">{lang === 'en' ? 'Check Balance' : 'Cek Balance'}</text>
          <text x="432" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Top Holder</text>
          <text x="515" y="112" textAnchor="middle" fontSize="22" fill="#94a3b8">→</text>
          <rect x="530" y="50" width="150" height="110" rx="14" fill="#fdf4ff" stroke="#e879f9" strokeWidth="2" />
          <text x="605" y="78" textAnchor="middle" fontFamily="sans-serif" fontSize="26">📊</text>
          <text x="605" y="100" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#701a75">Step 4</text>
          <text x="605" y="116" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#86198f">{lang === 'en' ? 'Check Entry' : 'Cek Entri'}</text>
          <text x="605" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#86198f">Market Cap</text>
          <rect x="20" y="188" width="305" height="100" rx="14" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
          <text x="172" y="214" textAnchor="middle" fontSize="20">🚫</text>
          <text x="172" y="234" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="#991b1b">{lang === 'en' ? '2+ flags → SKIP' : '2 atau lebih flag → SKIP'}</text>
          <text x="172" y="252" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#b91c1c">{lang === 'en' ? 'Too risky.' : 'Koin itu terlalu berisiko.'}</text>
          <text x="172" y="268" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#b91c1c">{lang === 'en' ? 'New coins come every minute.' : 'Selalu ada koin baru tiap menit.'}</text>
          <rect x="375" y="188" width="305" height="100" rx="14" fill="#f0fdf4" stroke="#4ade80" strokeWidth="2.5" />
          <text x="527" y="214" textAnchor="middle" fontSize="20">✅</text>
          <text x="527" y="234" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="#14532d">{lang === 'en' ? 'Only 1 flag → GAS IT' : 'Cuma 1 flag → GAS IT'}</text>
          <text x="527" y="252" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#15803d">{lang === 'en' ? 'Potential 60–70% scalp' : 'Potensi scalp 60–70%'}</text>
          <text x="527" y="268" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#15803d">{lang === 'en' ? 'on new pair fresh launch. 🚀' : 'di new pair fresh launch. 🚀'}</text>
        </svg>
      </div>

      <StepFlow steps={[
        { num: '1', title: t.step1, desc: t.step1Desc },
        { num: '2', title: t.step2, desc: t.step2Desc },
        { num: '3', title: t.step3, desc: t.step3Desc },
        { num: '4', title: t.step4, desc: t.step4Desc },
      ]} />

      <Callout type="ok" icon="🎯" title={t.resultTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.result }} />
      </Callout>
      <Callout type="warn" icon="⚠️" title={t.warnTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.warn }} />
      </Callout>
    </>
  );
}

// ═══════ PA6: MULTI WALLET ═══════
export function PanelMultiWallet() {
  const t = useT('multiwallet');
  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />
      <ul className="cklist reveal">
        {t.benefits.map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: '#7c3aed' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><MultiWalletSVG /></div></IllusBox>

      <div className="two-col reveal" style={{ marginTop: 36 }}>
        <div>
          <p className="prose"><strong>{t.howTitle}</strong> {t.how}</p>
          <p className="prose"><strong>{t.effectTitle}</strong> {t.effect}</p>
        </div>
        <div>
          <p className="prose"><strong>{t.prosTitle}</strong> {t.pros}</p>
          <p className="prose"><strong>{t.consTitle}</strong> {t.cons}</p>
        </div>
      </div>

      <Callout type="info" icon="📐" title={t.dcaTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.dca }} />
      </Callout>
      <Callout type="warn" icon="⚠️" title={t.minTitle}>{t.min}</Callout>
    </>
  );
}

// ═══════ PA7: RENT REFUND ═══════
export function PanelRefundSol() {
  const t = useT('refund');
  return (
    <>
      <p className="prose reveal" dangerouslySetInnerHTML={{ __html: t.p1 }} />

      <div className="two-col reveal" style={{ marginTop: 24 }}>
        <div>
          <p className="prose"><strong>{t.analogyTitle}</strong> <span dangerouslySetInnerHTML={{ __html: t.analogy }} /></p>
          <p className="prose" dangerouslySetInnerHTML={{ __html: t.analogy2 }} />
          <Callout type="ok" icon="💰" title={t.refundTitle}>
            <span dangerouslySetInnerHTML={{ __html: t.refundDesc }} />
          </Callout>
        </div>
        <div>
          <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={RefundImg} alt="Rent Refund" style={{ maxWidth: 220, width: '100%', borderRadius: 12, border: '1px solid var(--border)', display: 'block', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }} />
            <p className="prose" style={{ fontSize: 13, textAlign: 'center', marginTop: 16, marginBottom: 0, color: 'var(--slate)' }}>{t.illustCaption}</p>
          </div>
        </div>
      </div>

      <p className="prose reveal" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: t.platformHeader }} />

      <ul className="cklist reveal">
        {t.features.map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: '#7c3aed' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <Callout type="warn" icon="⚠️" title={t.noteTitle}>
        <span dangerouslySetInnerHTML={{ __html: t.note }} />
      </Callout>

      <div className="reveal" style={{ marginTop: 40, marginBottom: 20, textAlign: 'center' }}>
        <a href="https://refundyoursol.com/B2E6CA901EFE9F86" target="_blank" rel="noreferrer" style={{
          display: 'inline-block', background: '#ffffff', color: 'var(--brand)',
          border: '2px solid var(--brand)', padding: '16px 32px', borderRadius: 12,
          fontWeight: 800, textDecoration: 'none', fontSize: '16px',
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)', transition: 'all 0.2s ease'
        }}>{t.ctaBtn}</a>
      </div>
    </>
  );
}
