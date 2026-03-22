import { Callout, IllusBox, StepFlow } from './PanelComponents';
import { MarketCapSVG, DexPaidSVG, KonfirmasiSVG } from './Illustrations';
import { useLang } from '../context/LanguageContext';
import T from '../data/translations';
import avatarSrc from '../assets/avatar.png';
import bundleImg from '../assets/Bundle.jpg';
import globalFeesImg from '../assets/Global fees.jpg';
import revokeImg from '../assets/revoke.jpg';

/* ─── Shared micro-components ─────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '1.8px',
      textTransform: 'uppercase', color: 'var(--b)',
      marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        display: 'inline-block', width: 18, height: 2,
        background: 'var(--b)', borderRadius: 2, flexShrink: 0,
      }} />
      {children}
    </p>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--c3)', margin: '24px 0' }} />;
}

function HighlightBox({ children, style }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f4f8ff 0%, #eef3ff 100%)',
      border: '1px solid var(--bp)',
      borderRadius: 14, padding: '18px 22px', marginBottom: 18, ...style,
    }}>{children}</div>
  );
}

function PanelImg({ src, alt }) {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--c3)',
      boxShadow: '0 4px 20px rgba(36,85,212,.07)',
      background: 'var(--w)',
    }}>
      <img src={src} alt={alt} style={{
        width: '100%', display: 'block',
        maxHeight: 280, objectFit: 'contain', pointerEvents: 'none',
      }} />
    </div>
  );
}

function TwoCol({ left, right, flip = false }) {
  return (
    <div className="reveal" style={{
      display: 'grid',
      gridTemplateColumns: flip ? '40% 60%' : '60% 40%',
      gap: 28, alignItems: 'start', marginBottom: 20,
    }}>
      {flip ? <>{right}{left}</> : <>{left}{right}</>}
    </div>
  );
}

/* Helper: use translations based on lang */
function useT(section) {
  const { lang } = useLang();
  return T[section]?.[lang] || T[section]?.id || {};
}

/* ─── P0: BUNDLE TOKEN ─── */
export function PanelBundle() {
  const t = useT('bundle');
  return (
    <>
      <TwoCol
        left={
          <div>
            <SectionLabel>{t.secLabel1}</SectionLabel>
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
          </div>
        }
        right={<PanelImg src={bundleImg} alt="Bundle Token" />}
      />
      <div className="pull reveal">{t.quote}</div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <Callout type="warn" icon="⚠️" title={t.warn1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.warn1 }} />
        </Callout>
      </div>
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p3 }} />
        <Callout type="info" icon="💡" title={t.info1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.info1 }} />
        </Callout>
        <Callout type="warn" icon="🧠" title={t.warn2Title}>
          <span dangerouslySetInnerHTML={{ __html: t.warn2 }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P1: GLOBAL FEES ─── */
export function PanelGlobalFees() {
  const t = useT('globalfees');
  return (
    <>
      <TwoCol
        left={
          <div>
            <SectionLabel>{t.secLabel1}</SectionLabel>
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
          </div>
        }
        right={<PanelImg src={globalFeesImg} alt="Global Fees" />}
      />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <HighlightBox>
          <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontSize: 15 }}>{t.analogyTitle}</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }} dangerouslySetInnerHTML={{ __html: t.analogy }} />
        </HighlightBox>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '✅', label: t.vol1Label, color: '#065f46', bg: '#f0fdf4', border: '#a7f3d0', desc: t.vol1Desc },
            { icon: '⚠️', label: t.vol2Label, color: '#92400e', bg: '#fff8ec', border: '#fde68a', desc: t.vol2Desc },
            { icon: '🚨', label: t.vol3Label, color: '#991b1b', bg: '#fff1f1', border: '#fecaca', desc: t.vol3Desc },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel4}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p3 }} />
        <Callout type="ok" icon="💡" title={t.okTitle}>{t.ok}</Callout>
      </div>
    </>
  );
}

/* ─── P2: REVOKE & MINTING ─── */
export function PanelRevoke() {
  const t = useT('revoke');
  return (
    <>
      <TwoCol
        left={
          <div>
            <SectionLabel>{t.secLabel1}</SectionLabel>
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
            <div style={{ background: 'var(--bt)', border: '1px solid var(--bp)', borderRadius: 10, padding: '13px 16px', marginBottom: 16, fontSize: 14.5, color: 'var(--b)', fontWeight: 600 }}>{t.fakeMsg}</div>
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
          </div>
        }
        right={<PanelImg src={revokeImg} alt="Revoke & Minting" />}
      />
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 14, padding: '18px 18px' }}>
            <p style={{ fontWeight: 700, color: '#065f46', marginBottom: 12, fontSize: 14 }}>{t.revokeTitle}</p>
            {t.revokeItems.map((txt, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 6, paddingLeft: 16, borderLeft: '2px solid #a7f3d0' }}>{txt}</p>
            ))}
          </div>
          <div style={{ background: '#fff1f1', border: '1px solid #fecaca', borderRadius: 14, padding: '18px 18px' }}>
            <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 12, fontSize: 14 }}>{t.mintTitle}</p>
            {t.mintItems.map((txt, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 6, paddingLeft: 16, borderLeft: '2px solid #fecaca' }}>{txt}</p>
            ))}
          </div>
        </div>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <Callout type="warn" icon="⚠️" title={t.warn1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.warn1 }} />
          <br /><br />
          <span dangerouslySetInnerHTML={{ __html: t.warn1b }} />
        </Callout>
        <Callout type="ok" icon="🔍" title={t.ok1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.ok1 }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P3: MEME VS UTILITY ─── */
export function PanelMemeVUtil() {
  const t = useT('memevutil');
  return (
    <>
      <div className="reveal">
        <SectionLabel>{t.secLabel1}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
      </div>
      <div className="pull reveal">{t.quote}</div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '🎭', label: t.memeLabel, color: '#1a3a9e', bg: 'var(--bt)', border: 'var(--bp)', items: t.memeItems },
            { icon: '🔧', label: t.utilLabel, color: '#065f46', bg: '#f0fdf4', border: '#a7f3d0', items: t.utilItems },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '18px 18px' }}>
              <p style={{ fontWeight: 700, color: c.color, marginBottom: 14, fontSize: 15 }}>{c.icon} {c.label}</p>
              {c.items.map((txt, i) => (
                <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink2)', marginBottom: 5, display: 'flex', gap: 8 }}>
                  <span style={{ color: c.color, flexShrink: 0, fontWeight: 700 }}>→</span>{txt}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="reveal">
        <Callout type="info" icon="🎯" title={t.recoTitle}>
          <span dangerouslySetInnerHTML={{ __html: t.reco }} />
          <br /><br />
          <span dangerouslySetInnerHTML={{ __html: t.reco2 }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P4: DEX PAID ─── */
export function PanelDexPaid() {
  const t = useT('dexpaid');
  return (
    <>
      <div className="reveal">
        <SectionLabel>{t.secLabel1}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
      </div>
      <IllusBox><DexPaidSVG /></IllusBox>
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <HighlightBox>
          <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontSize: 15 }}>{t.analogyTitle}</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }} dangerouslySetInnerHTML={{ __html: t.analogy }} />
        </HighlightBox>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '💳', label: t.feat1Label, desc: t.feat1Desc },
            { icon: '📣', label: t.feat2Label, desc: t.feat2Desc },
            { icon: '🚀', label: t.feat3Label, desc: t.feat3Desc },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--w)', border: '1px solid var(--c3)', borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink3)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel4}</SectionLabel>
        <Callout type="warn" icon="⚠️" title={t.warnTitle}>
          <span dangerouslySetInnerHTML={{ __html: t.warn }} />
        </Callout>
        <Callout type="ok" icon="✅" title={t.okTitle}>
          <span dangerouslySetInnerHTML={{ __html: t.ok }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P5: 3 KONFIRMASI CANDLE ─── */
export function PanelKonfirmasi() {
  const t = useT('konfirmasi');
  return (
    <>
      <TwoCol
        left={
          <div>
            <SectionLabel>{t.secLabel1}</SectionLabel>
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
            <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
            <HighlightBox>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{t.analogyTitle}</p>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>{t.analogy}</p>
            </HighlightBox>
          </div>
        }
        right={
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--c3)', boxShadow: '0 4px 20px rgba(36,85,212,.07)' }}>
            <KonfirmasiSVG />
          </div>
        }
      />
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <StepFlow steps={[
          { icon: '1️⃣', color: '#ef4444', title: t.step1Title, desc: t.step1Desc },
          { icon: '2️⃣', color: '#f59e0b', title: t.step2Title, desc: t.step2Desc },
          { icon: '3️⃣', color: '#10b981', title: t.step3Title, desc: t.step3Desc },
        ]} />
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <Callout type="danger" icon="🚨" title={t.dangerTitle}>
          {t.danger}<br /><br />
          <span dangerouslySetInnerHTML={{ __html: t.danger2 }} />
        </Callout>
        <Callout type="ok" icon="📊" title={t.okTitle}>{t.ok}</Callout>
      </div>
    </>
  );
}

/* ─── P6: CABAL PLAY ─── */
export function PanelCabal() {
  const t = useT('cabal');
  return (
    <>
      <div className="reveal">
        <SectionLabel>{t.secLabel1}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
      </div>
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '👥', label: t.type1Label, color: '#1a3a9e', bg: 'var(--bt)', border: 'var(--bp)', desc: t.type1Desc },
            { icon: '👤', label: t.type2Label, color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe', desc: t.type2Desc },
            { icon: '⚔️', label: t.type3Label, color: '#92400e', bg: '#fff8ec', border: '#fde68a', desc: t.type3Desc },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel3}</SectionLabel>
        <Callout type="purple" icon="📖" title="">
          <span dangerouslySetInnerHTML={{ __html: t.caseStudy }} />
          <br /><br />
          <span dangerouslySetInnerHTML={{ __html: t.caseStudy2 }} />
        </Callout>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel4}</SectionLabel>
        <ul className="cklist">
          <li><span className="ck">1</span><span dangerouslySetInnerHTML={{ __html: t.tip1 }} /></li>
          <li><span className="ck">2</span><span dangerouslySetInnerHTML={{ __html: t.tip2 }} /></li>
          <li><span className="ck">3</span><span dangerouslySetInnerHTML={{ __html: t.tip3 }} /></li>
        </ul>
        <Callout type="warn" icon="🔧" title={t.toolsTitle}>
          <span dangerouslySetInnerHTML={{ __html: t.tools }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P7: HOLDER ─── */
export function PanelHolder() {
  const t = useT('holder');
  return (
    <>
      <div className="reveal">
        <SectionLabel>{t.secLabel1}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
      </div>
      <div className="reveal">
        <HighlightBox style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 36, flexShrink: 0, lineHeight: 1 }}>👤</div>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6, fontSize: 15 }}>{t.multiTitle}</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }} dangerouslySetInnerHTML={{ __html: t.multi }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {Array(10).fill('💼 2%').map((w, i) => (
                <span key={i} style={{ background: 'var(--w)', border: '1px solid var(--bp)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: 'var(--b)' }}>{w}</span>
              ))}
              <span style={{ background: 'var(--b)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#fff' }}>= 20% total</span>
            </div>
          </div>
        </HighlightBox>
      </div>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p3 }} />
        <Callout type="info" icon="💡" title={t.info1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.info1 }} />
        </Callout>
        <Callout type="warn" icon="🧠" title={t.warn1Title}>
          <span dangerouslySetInnerHTML={{ __html: t.warn1 }} />
        </Callout>
      </div>
    </>
  );
}

/* ─── P8: MARKET CAP ─── */
export function PanelMarketCap() {
  const t = useT('marketcap');
  return (
    <>
      <div className="reveal">
        <SectionLabel>{t.secLabel1}</SectionLabel>
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p1 }} />
        <p className="prose" dangerouslySetInnerHTML={{ __html: t.p2 }} />
      </div>
      <IllusBox><MarketCapSVG /></IllusBox>
      <Divider />
      <div className="reveal">
        <SectionLabel>{t.secLabel2}</SectionLabel>
        <StepFlow steps={[
          { icon: '🌀', color: '#6b7280', title: t.tier1Title, desc: t.tier1Desc },
          { icon: '🌱', color: '#3b82f6', title: t.tier2Title, desc: t.tier2Desc },
          { icon: '🐬', color: '#8b5cf6', title: t.tier3Title, desc: t.tier3Desc },
          { icon: '🐳', color: '#f59e0b', title: t.tier4Title, desc: t.tier4Desc },
          { icon: '🏦', color: '#ef4444', title: t.tier5Title, desc: t.tier5Desc },
        ]} />
      </div>
    </>
  );
}

/* ─── P9: CLOSING ─── */
export function PanelClosing({ onSwitch }) {
  const t = useT('closing');
  return (
    <>
      <div className="closing-card reveal">
        <img src={avatarSrc} className="closing-av" alt="Ponyin" draggable="false" />
        <div className="closing-quote">
          {t.quote}
          <br /><br />
          {t.quote2}
        </div>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.82)', marginBottom: 22, textAlign: 'center', lineHeight: 1.8 }}>
          {t.p1}
        </p>
        <div className="closing-sig">{t.sig}<br />@ELPonyin ✨</div>
      </div>

      <Callout type="ok" icon="🙏" title={t.calloutTitle}>
        {t.callout}
      </Callout>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }} className="reveal">
        <button onClick={() => onSwitch?.('pa0')} className="btn btn-blue" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>{t.btnVol2}</button>
        <a href="https://x.com/elponyin" target="_blank" rel="noopener" className="btn btn-blue">𝕏 Follow @elponyin</a>
        <a href="https://trojan.com/@Keusel" target="_blank" rel="noopener" className="btn btn-outline">{t.btnTrade}</a>
      </div>
    </>
  );
}
