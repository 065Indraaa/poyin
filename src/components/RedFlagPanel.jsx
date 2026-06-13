import { AlertTriangle, ShieldAlert, Skull } from 'lucide-react';

export default function RedFlagPanel({ redFlags = [] }) {
  if (!redFlags.length) return null;

  const critical = redFlags.filter((r) => r.level === 'critical');
  const high = redFlags.filter((r) => r.level === 'high');
  const others = redFlags.filter((r) => r.level !== 'critical' && r.level !== 'high');

  return (
    <div className="redflag-panel">
      <div className="redflag-head">
        <ShieldAlert size={22} />
        <strong>Emergency Red Flags</strong>
        <span>{critical.length > 0 ? `${critical.length} critical` : `${high.length} warning`}</span>
      </div>
      <div className="redflag-list">
        {critical.map((r, i) => (
          <div className="redflag-row critical" key={`c-${i}`}>
            <Skull size={16} />
            <span>{r.text}</span>
          </div>
        ))}
        {high.map((r, i) => (
          <div className="redflag-row high" key={`h-${i}`}>
            <AlertTriangle size={16} />
            <span>{r.text}</span>
          </div>
        ))}
        {others.map((r, i) => (
          <div className="redflag-row medium" key={`m-${i}`}>
            <AlertTriangle size={14} />
            <span>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
