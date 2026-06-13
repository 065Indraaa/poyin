import { Network } from 'lucide-react';

export default function BundleGraph({ bundle }) {
  if (!bundle || !bundle.cluster) return null;

  return (
    <div className="bundle-panel">
      <div className="bundle-head">
        <Network size={18} />
        <strong>Bundle Graph Analysis</strong>
        <span className="bundle-score">Score {bundle.score}/10</span>
      </div>
      <div className="bundle-list">
        {bundle.clusters?.map((c, i) => (
          <div className="bundle-cluster" key={i}>
            <div className="cluster-funder">
              <span>Funder</span>
              <strong>{c.funder}</strong>
            </div>
            <div className="cluster-holders">
              {c.holders.map((h, j) => (
                <span className="holder-pill" key={j}>{h}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {bundle.legitFunders > 0 && (
        <p className="bundle-note">{bundle.legitFunders} cluster dari CEX (green flag)</p>
      )}
    </div>
  );
}
