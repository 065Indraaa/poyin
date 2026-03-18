// ═══════════════════════════════════════════════════
// SHARED PANEL UI COMPONENTS
// ═══════════════════════════════════════════════════

export function PanelEyebrow({ num, label, vol }) {
  return (
    <div className="panel-eyebrow">
      <div className="num" style={vol === 2 ? { background: '#7c3aed' } : undefined}>{num}</div>
      {label}
    </div>
  );
}

export function PanelBreadcrumb({ items }) {
  return (
    <div className="panel-breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="bc-sep">{i % 2 === 0 ? '·' : '›'} </span>}
          {item}
        </span>
      ))}
    </div>
  );
}

export function PanelNav({ nav, onSwitch }) {
  const { prev, next, counter, prevLabel, nextLabel } = nav;
  return (
    <div className="panel-nav">
      {prev ? (
        <button className="panel-nav-btn" onClick={() => onSwitch(prev)}>{prevLabel}</button>
      ) : (
        <span />
      )}
      <span className="panel-counter">{counter}</span>
      <button className="panel-nav-btn primary" onClick={() => onSwitch(next)}>{nextLabel}</button>
    </div>
  );
}

export function Callout({ type, icon, title, children }) {
  const cls = { info: 'c-info', warn: 'c-warn', danger: 'c-danger', ok: 'c-ok', purple: 'c-purple' }[type] || 'c-info';
  return (
    <div className={`callout ${cls} reveal`}>
      <span className="callout-icon">{icon}</span>
      <div>
        {title && <div className="callout-title">{title}</div>}
        <div className="callout-text">{children}</div>
      </div>
    </div>
  );
}

export function IllusBox({ children }) {
  return <div className="illus-box reveal">{children}</div>;
}

export function DefCard({ icon, term, desc }) {
  return (
    <div className="def-card">
      <div className="def-icon">{icon}</div>
      <div className="def-term">{term}</div>
      <div className="def-desc">{desc}</div>
    </div>
  );
}

export function CkList({ items, warn, vol }) {
  return (
    <ul className={`cklist${warn ? ' warn' : ''}`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className="ck" style={vol === 2 ? { background: '#7c3aed' } : undefined}>{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

export function StepFlow({ steps }) {
  return (
    <div className="step-flow reveal">
      {steps.map((step, i) => (
        <div className="step" key={i}>
          <div className="step-num" style={step.color ? { background: step.color, fontSize: 18 } : undefined}>
            {step.icon || i + 1}
          </div>
          <div className="step-body">
            <div className="step-title" dangerouslySetInnerHTML={{ __html: step.title }} />
            <div className="step-desc" dangerouslySetInnerHTML={{ __html: step.desc }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CmpCard({ type, head, items }) {
  return (
    <div className={`cmp-card ${type}`}>
      <div className="cmp-head">{head}</div>
      <ul className="cmp-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

export function TblWrap({ headers, rows }) {
  return (
    <div className="tbl-wrap">
      <table className="nice-tbl">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PullQuote({ children }) {
  return <blockquote className="pull">{children}</blockquote>;
}

export function Badge({ type, children }) {
  const cls = { red: 'badge-red', amber: 'badge-amber', blue: 'badge-blue' }[type] || 'badge-blue';
  return <span className={`badge ${cls}`}>{children}</span>;
}
