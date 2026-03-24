import { useEffect, useState, useRef } from 'react';

function formatUSD(n) {
  if (n === null) return '—';
  return n >= 1 ? `$${n.toFixed(2)}` : `$${n.toPrecision(3)}`;
}

export default function PriceTicker() {
  const [solPrice, setSolPrice] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(null);
  const [pct24h, setPct24h] = useState(null);
  const wsRef = useRef(null);
  const latestRef = useRef(null);

  useEffect(() => {
    const url = 'wss://stream.binance.com:9443/ws/solusdt@trade';
    let ws;

    // initial HTTP price fallback (CoinGecko)
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        if (!mounted) return;
        if (res.ok) {
          const j = await res.json();
          if (j?.solana?.usd) setSolPrice(j.solana.usd);
        }
      } catch (e) {
        console.debug('CoinGecko fallback failed', e);
      }
    })();

    try {
      ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => console.debug('PriceTicker WS open');
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          const p = parseFloat(d.p);
          if (!Number.isNaN(p)) {
            setSolPrice(p);
            latestRef.current = p;
          }
        } catch (e) {
          console.debug('PriceTicker WS parse error', e);
        }
      };
      ws.onerror = (err) => console.debug('PriceTicker WS error', err);
      ws.onclose = (ev) => {
        console.debug('PriceTicker WS closed', ev.code, ev.reason);
        setTimeout(() => connect(), 1500);
      };
    } catch (e) {
      console.warn('WS init failed', e);
    }

    function connect() {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
      try { wsRef.current = new WebSocket(url); } catch (e) { console.debug('WS reconnect failed', e); }
    }

    // set up a 1s interval to update displayed price
    const tick = setInterval(() => {
      if (latestRef.current != null) {
        setDisplayPrice(latestRef.current);
      }
    }, 1000);

    // fetch 24h percent from Binance REST as initial and periodic update
    let pctMounted = true;
    async function fetch24() {
      try {
        const r = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT');
        if (!pctMounted) return;
        if (r.ok) {
          const j = await r.json();
          if (j && j.priceChangePercent) setPct24h(parseFloat(j.priceChangePercent));
        }
      } catch (e) {
        console.debug('24h fetch failed', e);
      }
    }
    fetch24();
    const pctInterval = setInterval(fetch24, 30_000);

    return () => {
      mounted = false;
      pctMounted = false;
      clearInterval(tick);
      clearInterval(pctInterval);
      try { ws && ws.close(); } catch (e) {}
    };
  }, []);

  // compute CSS class for pct
  const pctClass = pct24h == null ? '' : (pct24h >= 0 ? 'up' : 'down');

  return (
    <div className="price-ticker" role="region" aria-label="SOL price">
      <div className="pt-left">
        <div className="pt-item" aria-live="polite">
          <div className="pt-label">SOL</div>
          <div className={`pt-value ${pctClass}`}>
            {formatUSD(displayPrice ?? solPrice)}
            <span className="pt-pct" aria-hidden="true">
              {pct24h == null ? '' : ` ${pct24h >= 0 ? '▲' : '▼'} ${Math.abs(pct24h).toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
