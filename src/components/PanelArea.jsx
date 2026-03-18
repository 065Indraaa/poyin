import { useEffect, useRef } from 'react';
import { panels } from '../data/panelData';
import { PanelEyebrow, PanelBreadcrumb, PanelNav } from './PanelComponents';
import {
  PanelBundle, PanelGlobalFees, PanelRevoke, PanelMemeVUtil,
  PanelDexPaid, PanelKonfirmasi, PanelCabal, PanelHolder,
  PanelMarketCap, PanelClosing
} from './PanelsVol1';
import {
  PanelSnipe, PanelFirst1K, PanelWalletPing, PanelModal,
  PanelTransaksi, PanelScalping, PanelMultiWallet
} from './PanelsVol2';

const CONTENT_MAP = {
  p0: PanelBundle,
  p1: PanelGlobalFees,
  p2: PanelRevoke,
  p3: PanelMemeVUtil,
  p4: PanelDexPaid,
  p5: PanelKonfirmasi,
  p6: PanelCabal,
  p7: PanelHolder,
  p8: PanelMarketCap,
  p9: PanelClosing,
  pa0: PanelSnipe,
  pa1: PanelFirst1K,
  pa2: PanelWalletPing,
  pa3: PanelModal,
  pa4: PanelTransaksi,
  pa5: PanelScalping,
  pa6: PanelMultiWallet,
};

export default function PanelArea({ activePanel, onSwitch }) {
  const areaRef = useRef(null);

  // Trigger reveal animations when panel changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelectorAll('.panel.active .reveal:not(.in)');
      el.forEach(e => e.classList.add('in'));
    }, 100);
    return () => clearTimeout(timer);
  }, [activePanel]);

  return (
    <div className="content-area" ref={areaRef}>
      {Object.entries(panels).map(([id, data]) => {
        const ContentComponent = CONTENT_MAP[id];
        const isActive = activePanel === id;

        return (
          <div
            key={id}
            id={id}
            className={`panel${isActive ? ' active' : ''}`}
          >
            <PanelEyebrow num={data.eyebrow} label={data.eyebrowLabel} vol={data.vol} />
            <h2 className="panel-title">
              {data.title.split('\n').map((line, i) => (
                <span key={i}>{line}{i < data.title.split('\n').length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="panel-sub">{data.sub}</p>
            <div className="panel-rule" style={data.vol === 2 ? { background: '#7c3aed' } : undefined} />
            <PanelBreadcrumb items={data.breadcrumb} />
            {ContentComponent && <ContentComponent />}
            <PanelNav nav={data.nav} onSwitch={onSwitch} />
          </div>
        );
      })}
    </div>
  );
}
