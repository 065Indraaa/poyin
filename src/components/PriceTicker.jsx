import { useEffect, useState } from 'react';

function formatUSD(n) {
  if (n == null) return '—';
  return n >= 1 ? `$${n.toFixed(2)}` : `$${n.toPrecision(3)}`;
}

export default function PriceTicker() {
  const [solPrice, setSolPrice] = useState(null);
  const [pct24h, setPct24h] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCG() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana&price_change_percentage=24h');
        if (!mounted) return;
        if (res.ok) {
          const j = await res.json();
          const item = Array.isArray(j) && j[0];
          if (item) {
            const price = item.current_price ?? item.price ?? null;
            const pct = item.price_change_percentage_24h ?? item.price_change_percentage_24h_in_currency ?? null;
            if (price != null) setSolPrice(price);
            if (pct != null) setPct24h(parseFloat(pct));
          }
        }
      } catch (e) {
        console.debug('CoinGecko fetch failed', e);
      }
    }

    // initial fetch
    fetchCG();
    // update every 1s (note: CoinGecko rate limits exist)
    const id = setInterval(fetchCG, 1000);

    return () => { mounted = false; clearInterval(id); };
  }, []);

  const pctClass = pct24h == null ? '' : (pct24h >= 0 ? 'up' : 'down');

  return (
    <div className="price-ticker" role="region" aria-label="SOL price">
      <div className="pt-left">
        <div className="pt-item" aria-live="polite">
          <div className="pt-label">SOL</div>
          <div className={`pt-value ${pctClass}`}>
            {formatUSD(solPrice)}
            <span className="pt-pct" aria-hidden="true">
              {pct24h == null ? '' : ` ${pct24h >= 0 ? '▲' : '▼'} ${Math.abs(pct24h).toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
