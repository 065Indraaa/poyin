import { useEffect, useRef } from 'react';
import { sidebarItemsData } from '../data/panelData';
import { useLang } from '../context/LanguageContext';

export default function MobileTabs({ activePanel, onSwitch }) {
  const activeRef = useRef(null);
  const { lang } = useLang();
  const items = sidebarItemsData[lang];

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activePanel]);

  return (
    <div className="mobile-tabs" id="mobileTabs">
      {items.map((item, i) => {
        const isAdvance = item.vol === 2;
        const isSep = i === 10; // separator before vol2
        return (
          <>
            {isSep && <div key="sep" style={{ width: 1, background: 'var(--c3)', margin: '8px 0', flexShrink: 0 }} />}
            <div
              key={item.id}
              ref={activePanel === item.id ? activeRef : null}
              className={`mob-tab${activePanel === item.id ? ' active' : ''}`}
              data-panel={item.id}
              onClick={() => onSwitch(item.id)}
              style={isAdvance ? { color: activePanel === item.id ? '#7c3aed' : undefined } : undefined}
            >
              {item.title}
            </div>
          </>
        );
      })}
    </div>
  );
}
