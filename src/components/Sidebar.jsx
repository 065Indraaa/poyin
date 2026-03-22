import { sidebarItemsData, PANEL_ORDER } from '../data/panelData';
import { useLang } from '../context/LanguageContext';

export default function Sidebar({ activePanel, onSwitch }) {
  const { lang, t } = useLang();
  const items = sidebarItemsData[lang];
  const idx = PANEL_ORDER.indexOf(activePanel);
  const pct = Math.round(((idx + 1) / PANEL_ORDER.length) * 100);

  const vol1 = items.filter(i => i.vol === 1);
  const vol2 = items.filter(i => i.vol === 2);

  return (
    <aside className="sidebar">
      <div className="sb-header">
        <div className="sb-label">{t('Materi · Vol. 1', 'Materials · Vol. 1')}</div>
        <div className="sb-progress-bar">
          <div className="sb-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {vol1.map((item, i) => (
        <SbItem key={item.id} item={item} active={activePanel === item.id} onSwitch={onSwitch} />
      ))}

      <div className="sb-sep" />
      <div className="sb-sep" />
      <div className="sb-label" style={{ color: 'var(--b)', marginTop: 4 }}>Vol. 2 — Advance</div>

      {vol2.map((item) => (
        <SbItem key={item.id} item={item} active={activePanel === item.id} onSwitch={onSwitch} isAdvance />
      ))}

      <div className="sb-sep" />
      <div className="sb-coming">
        <div className="sb-coming-label">{t('Segera Hadir', 'Coming Soon')}</div>
        <div className="sb-coming-item">
          <span>🔒</span>
          <div>
            <div className="sb-coming-title">Vol. 3 — On-chain Pro</div>
            <div className="sb-coming-sub">MEV, bundle, arbitrage</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SbItem({ item, active, onSwitch, isAdvance }) {
  return (
    <div
      className={`sb-item${active ? ' active' : ''}`}
      data-panel={item.id}
      onClick={() => onSwitch(item.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSwitch(item.id)}
    >
      <div
        className="sb-num"
        style={isAdvance ? { background: '#7c3aed', color: '#fff' } : undefined}
      >
        {item.num}
      </div>
      <div>
        <div className="sb-title">{item.title}</div>
        <div className="sb-sub">{item.sub}</div>
      </div>
    </div>
  );
}
