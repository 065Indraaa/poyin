import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Copy,
  DatabaseZap,
  Flame,
  Gauge,
  Layers3,
  Lock,
  Radar,
  RefreshCw,
  Search,
  ServerCrash,
  ShieldAlert,
  Signal,
  Sparkles,
  Wallet,
  XCircle
} from 'lucide-react';
import { analyzeToken, emptyToken } from './data/apeEngine';
import { ponyinPrinciples } from './data/knowledgeBase';
import { fetchDiscoveryFeed, fetchProviderHealth, fetchTokenMarketSnapshots, fetchTokenSnapshot, formatUsd, subscribeToPumpPortalStream } from './data/liveProviders';

const scanSteps = [
  'Lagi ambil data pair sama likuiditas live...',
  'Cek dulu mint authority sama freeze authority Solana-nya...',
  'Muat registry wallet pintar sama cek kualitas holder...',
  'Baca stream transaksi yang paling baru...',
  'Nilai token pake ilmu Ponyin sama data live...',
  'Rangkum verdict entry sama catetan risiko...'
];

const phases = [
  {
    key: 'fresh',
    title: 'Launch Baru',
    subtitle: 'Baru launch / pair baru',
    focus: 'Bundle dev, fake volume, transaksi awal dev',
    icon: Flame
  },
  {
    key: 'trench',
    title: 'Zona Trench',
    subtitle: 'Live feed low-mid cap',
    focus: 'Jual kecil top holder, sniper yang mau migrasi',
    icon: Radar
  },
  {
    key: 'raydium',
    title: 'Udah Masuk DEX',
    subtitle: 'Raydium / Orca / Meteora',
    focus: 'Kesehatan LP, fee ratio, wash trading',
    icon: Lock
  }
];

const LIVE_FEED_MAX_AGE_MINUTES = 3 * 24 * 60;

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState(emptyToken);
  const [report, setReport] = useState(() => analyzeToken(emptyToken));
  const [feedTokens, setFeedTokens] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [feedStatus, setFeedStatus] = useState({
    loading: true,
    provider: 'DexScreener live API',
    fetchedAt: null,
    error: null,
    streamConnected: false,
    streamLastTokenAt: null
  });
  const [providerHealth, setProviderHealth] = useState({
    loading: true,
    ok: false,
    error: null,
    env: {},
    rpc: null,
    smartWallets: null
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const refreshRequestRef = useRef(0);
  const selectedTokenRef = useRef(emptyToken);
  const feedTokensRef = useRef([]);

  useEffect(() => {
    selectedTokenRef.current = selectedToken;
  }, [selectedToken]);

  useEffect(() => {
    feedTokensRef.current = feedTokens;
  }, [feedTokens]);

  useEffect(() => {
    refreshFeed();
    refreshProviderHealth();

    const unsubscribePumpPortal = subscribeToPumpPortalStream(
      (token) => {
        setFeedTokens((current) => pruneTokens(upsertTokens(current, [token])));
      },
      (stream) => {
        setFeedStatus((current) => ({
          ...current,
          provider: stream.connected ? 'PumpPortal realtime + pair aktif DexScreener' : current.provider,
          streamConnected: Boolean(stream.connected),
          streamLastTokenAt: stream.lastTokenAt || current.streamLastTokenAt,
          error: stream.connected ? null : stream.error === 'PumpPortal reconnecting' ? current.error : translateProviderError(stream.error) || current.error
        }));
      }
    );

    const clockInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const refreshInterval = setInterval(() => {
      refreshFeed();
    }, 10000);

    const healthInterval = setInterval(() => {
      refreshProviderHealth();
    }, 45000);

    const marketRefreshInterval = setInterval(() => {
      refreshFeedMarketSnapshots();
    }, 5000);

    const pruneInterval = setInterval(() => {
      setFeedTokens((current) => pruneTokens(current));
    }, 3000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(healthInterval);
      clearInterval(marketRefreshInterval);
      clearInterval(clockInterval);
      clearInterval(pruneInterval);
      unsubscribePumpPortal();
    };
  }, []);

  async function refreshProviderHealth() {
    setProviderHealth((current) => ({ ...current, loading: true, error: null }));
    try {
      const health = await fetchProviderHealth();
      setProviderHealth({
        loading: false,
        ok: Boolean(health.ok),
        error: null,
        ...health
      });
    } catch (error) {
      setProviderHealth((current) => ({
        ...current,
        loading: false,
        ok: false,
        error: translateProviderError(error.message) || 'Status data belum nyambung'
      }));
    }
  }

  const groupedTokens = useMemo(() => {
    return feedTokens.reduce((acc, token) => {
      const key = phases.some((phase) => phase.key === token.phase) ? token.phase : 'raydium';
      acc[key] = [...(acc[key] || []), token];
      return acc;
    }, {});
  }, [feedTokens]);

  async function refreshFeed() {
    const requestId = refreshRequestRef.current + 1;
    refreshRequestRef.current = requestId;
    setFeedStatus((current) => ({ ...current, loading: true, error: null }));
    try {
      const feed = await fetchDiscoveryFeed();
      if (requestId !== refreshRequestRef.current) return;
      setFeedTokens((current) => pruneTokens(upsertTokens(current, feed.tokens)));
      setFeedStatus((current) => ({
        ...current,
        loading: false,
        provider: current.streamConnected ? 'PumpPortal realtime + pair aktif DexScreener' : feed.provider,
        fetchedAt: feed.fetchedAt,
        error: null
      }));

    } catch (error) {
      if (requestId !== refreshRequestRef.current) return;
      setFeedStatus((current) => ({
        ...current,
        loading: false,
        provider: 'DexScreener live API',
        fetchedAt: null,
        error: translateProviderError(error.message) || 'Feed lagi gak tersedia'
      }));
    }
  }

  async function refreshFeedMarketSnapshots() {
    const addresses = feedTokensRef.current
      .map((token) => token.ca)
      .filter(Boolean)
      .slice(0, 30);

    if (!addresses.length) return;

    try {
      const marketTokens = await fetchTokenMarketSnapshots(addresses);
      if (!marketTokens.length) return;

      const stampedTokens = marketTokens.map((token) => ({
        ...token,
        _marketRefreshedAt: Date.now()
      }));

      setFeedTokens((current) => pruneTokens(upsertTokens(current, stampedTokens)));
    } catch {
      // Market refresh ringan boleh gagal, gak usah ganggu hasil scan forensic terakhir.
    }
  }

  const runAnalysis = async (tokenLike) => {
    const address = typeof tokenLike === 'string' ? extractSolanaAddress(tokenLike) : tokenLike.ca;
    if (!address) return;

    const optimisticToken = typeof tokenLike === 'string' ? { ...emptyToken, ca: address, ticker: shortAddress(address) } : tokenLike;

    setSelectedToken(optimisticToken);
    setReport(analyzeToken(optimisticToken));
    setQuery(address);
    setCopied(false);
    setIsScanning(true);
    setScanIndex(0);

    scanSteps.forEach((_, index) => {
      window.setTimeout(() => setScanIndex(index), index * 360);
    });

    try {
      const liveToken = await fetchTokenSnapshot(address);
      applyLiveToken(liveToken);
    } catch (error) {
      const failedToken = {
        ...optimisticToken,
        source: 'Sumber data live lagi gak tersedia',
        providerConfidence: 'low',
        feedInsight: translateProviderError(error.message) || 'Gak ada sumber data live yang ngasih data balik.'
      };
      setSelectedToken(failedToken);
      setReport(analyzeToken(failedToken));
    } finally {
      setIsScanning(false);
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function applyLiveToken(liveToken) {
    const enrichedToken = {
      ...liveToken,
      _fetchedAt: selectedTokenRef.current?.ca === liveToken.ca ? selectedTokenRef.current._fetchedAt || Date.now() : Date.now(),
      _lastSeenAt: Date.now()
    };

    setSelectedToken(enrichedToken);
    setReport(analyzeToken(enrichedToken));
    setFeedTokens((current) => pruneTokens(upsertTokens(current, [enrichedToken])));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    runAnalysis(query);
  };

  const copyCa = async () => {
    if (!selectedToken.ca) return;
    try {
      await navigator.clipboard.writeText(selectedToken.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const meterAngle = -118 + (report.score / 100) * 236;
  const stats = buildStats(feedTokens, report, feedStatus);

  return (
    <main className="app-shell">
      <Navigation />

      <section className="hero-section" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <Bot size={16} />
            Mesin Keputusan AI Ponyin
          </div>
          <h1>Should I Ape?</h1>
          <p className="hero-lead">
            Scanner live buat trader Solana memecoin. Data diambil dari on-chain, pair market,
            sama stream transaksi, terus dinilai pake ilmu Ponyin, Space X, dan sinyal pasar tambahan.
          </p>

          <form className="search-card" onSubmit={onSubmit}>
            <Search size={22} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Paste contract address..."
              aria-label="Contract address"
            />
            <button type="submit" disabled={isScanning}>
              {isScanning ? 'Lagi Scan' : 'Analisis'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="quick-actions">
            <button type="button" onClick={refreshFeed} disabled={feedStatus.loading}>
              <RefreshCw size={15} />
              {feedStatus.loading ? 'Lagi muat ulang' : 'Muat ulang daftar live'}
            </button>
            {feedTokens.slice(0, 2).map((token) => (
              <button type="button" key={token.id} onClick={() => runAnalysis(token)}>
                Scan ${token.ticker}
              </button>
            ))}
          </div>
        </div>

        <div className="intel-panel">
          <div className="panel-toolbar">
            <span />
            <span />
            <span />
            <strong>inferensi data live</strong>
          </div>
          <div className="intel-score">
            <Gauge size={44} />
            <div>
              <span>Verdict Saat Ini</span>
              <strong>{report.verdict.instruction}</strong>
            </div>
          </div>
          <div className="intel-grid">
            <Stat label="Token live" value={stats.tokens} />
            <Stat label="Sumber data" value={stats.provider} />
            <Stat label="Keyakinan data" value={`${report.confidence}%`} />
            <Stat label="Update" value={stats.updated} />
          </div>
          <div className="intel-log">
            {report.knowledgeHits.slice(0, 3).map((hit) => (
              <LogLine key={hit.id} tone={hit.id === 'globalFees' ? 'warn' : 'good'} text={`${cleanPublicCopy(hit.title)}: ${cleanPublicCopy(hit.source)}`} />
            ))}
            {feedStatus.error && <LogLine tone="danger" text={`Gangguan data: ${feedStatus.error}`} />}
          </div>
        </div>
      </section>

      <section className="feed-section" id="feed">
        <SectionHeader
          kicker="Daftar Entry"
          title="Daftar live buat kandidat entry yang valid."
          text="Daftar ini prioritasin token yang peluang entry-nya lebih sehat: likuiditas cukup, transaksi aktif, buy pressure wajar, volume gak aneh, dan drawdown belum rusak."
        />

        <ProviderStrip
          status={feedStatus}
          health={providerHealth}
          count={feedTokens.length}
          onRefresh={() => {
            refreshFeed();
            refreshProviderHealth();
          }}
        />

        <div className="table-container">
          <table className="feed-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Fase</th>
                <th>Umur</th>
                <th>MCap</th>
                <th>Likuiditas</th>
                <th>Vol 5m</th>
                <th>Txns 5m</th>
                <th>B/S</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {feedStatus.loading && feedTokens.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">Memuat daftar live...</td>
                </tr>
              )}
              {!feedStatus.loading && feedTokens.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">Belum ada token live yang cocok kriteria entry valid. Token baru tanpa bukti pasar gak diprioritasin.</td>
                </tr>
              )}
              {feedTokens.map((token) => (
                <tr key={token.id} onClick={() => runAnalysis(token)}>
                  <td>
                    <div className="token-cell">
                      <strong>${token.ticker}</strong>
                      <span className="token-name">{token.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`phase-badge ${token.phase}`}>
                      {token.phase === 'raydium' ? 'Raydium' : token.phase === 'trench' ? 'Trench' : 'Pump.fun'}
                    </span>
                  </td>
                  <td>{formatLiveAge(token, now)}</td>
                  <td>{formatLiveMarketCap(token)}</td>
                  <td>{formatUsd(token.liquidityUsd)}</td>
                  <td>{token.volume5m}</td>
                  <td>{token.flags?.txns5m ?? '-'}</td>
                  <td>{token.buySell}</td>
                  <td><FeedHealth token={token} /></td>
                  <td>
                    <button type="button" className="scan-btn">
                      Scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scan-section" aria-live="polite">
        <div className={`scan-status ${isScanning ? 'active' : ''}`}>
          <div className="scan-orbit">
            <Radar size={28} />
          </div>
          <div>
            <strong>{isScanning ? `Lagi analisis ${selectedToken.ticker}` : 'Engine siap'}</strong>
            <p>{isScanning ? scanSteps[scanIndex] : 'Paste CA atau klik token dari feed buat jalanin 5 lapis analisis.'}</p>
          </div>
        </div>
      </section>

      <section className="result-section" id="result">
        <div className="result-layout">
          <div className="meter-card">
            <div className={`verdict-chip ${report.verdict.tone}`}>
              {report.verdict.label}
            </div>
            <div className="meter" style={{ '--needle-angle': `${meterAngle}deg` }}>
              <div className="meter-track" />
              <div className="meter-mask" />
              <div className="needle" />
              <div className="meter-center">
                <strong>{report.score}</strong>
              <span>Meter Ape</span>
              </div>
            </div>
            <div className="meter-scale">
              <span>Bahaya</span>
              <span>PvP</span>
              <span>Mulai Matang</span>
              <span>Chad</span>
            </div>
          </div>

          <div className="tldr-card">
            <div className="token-title-row">
              <div>
                <span className="eyebrow compact">{cleanPublicCopy(selectedToken.source)}</span>
                <h2>{selectedToken.name} <small>{selectedToken.ticker ? `$${selectedToken.ticker}` : ''}</small></h2>
                <p>{selectedToken.ca || 'Belum ada contract yang dipilih nih'}</p>
              </div>
              <button type="button" className="copy-btn" onClick={copyCa} disabled={!selectedToken.ca}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? 'Tersalin' : 'Salin CA'}
              </button>
            </div>

            <div className="ai-box">
              <span>Ringkasan AI</span>
              <p>{cleanPublicCopy(report.summary)}</p>
            </div>

            <div className="source-grid">
              <SourcePill icon={DatabaseZap} label="Sumber data" value={cleanPublicCopy(selectedToken.source)} />
              <SourcePill icon={Signal} label="Keyakinan data" value={`${report.confidence}%`} />
              <SourcePill icon={ShieldAlert} label="Risiko utama" value={report.primaryRisk} />
            </div>

            <div className="action-row">
              <a href={selectedToken.ca ? `https://trojan.com/@Ponyinnn?start=${selectedToken.ca}` : '#home'} target="_blank" rel="noreferrer">
                Trojan
              </a>
              <a href={selectedToken.url || (selectedToken.ca ? `https://dexscreener.com/solana/${selectedToken.ca}` : '#home')} target="_blank" rel="noreferrer">
                Chart
              </a>
            </div>
          </div>
        </div>

        <div className="check-grid">
          {report.checks.map((check) => (
            <CheckCard key={check.label} check={check} />
          ))}
        </div>

        <ForensicPanel token={selectedToken} report={report} status={feedStatus} now={now} />
      </section>

      <section className="engine-section" id="engine">
        <SectionHeader
          kicker="Ponyin Engine"
          title="Dasar analisis dari materi utama."
          text="Tiap verdict ditambatin ke materi Bundle Token, Global Fees, Revoke, Dex Paid, konfirmasi candle, baca holder, instant scalping, Space X, sama sinyal pasar live."
        />

        <div className="engine-grid">
          {report.layers.map((layer) => (
            <article className="engine-card" key={layer.title}>
              <span>{layer.index}</span>
              <h3>{layer.title}</h3>
              <p>{layer.description}</p>
            </article>
          ))}
        </div>

        <div className="knowledge-grid">
          {ponyinPrinciples.map((principle) => (
            <article className="knowledge-card" key={principle.id}>
              <strong>{principle.title}</strong>
              <span>{principle.source}</span>
              <p>{principle.rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <SectionHeader
          kicker="Cakupan Data"
          title="Live sekarang, indexer forensik selanjutnya."
          text="Data publik cukup buat discovery, pair, liquidity, mint/freeze, sama timing marketing. Bukti penuh common funder, top holder, dev sell, sama fee exact tetap butuh indexer on-chain yang lebih dalem."
        />
        <div className="roadmap-grid">
          <RoadmapCard title="Sudah live" text="Profile, boost, data pair, mint authority on-chain, serta stream transaksi saat scan." />
          <RoadmapCard title="Butuh indexer" text="Normalisasi top holder, graph common funder, retensi holder menit pertama, dan realized PnL wallet dev." />
          <RoadmapCard title="Siap dikembangkan" text="Alert Telegram /ape, watchlist wallet ping, dan scoring personal sesuai style scalping atau swing." />
        </div>
      </section>

      <footer className="site-footer">
        <strong>Should I Ape?</strong>
        <span>Aplikasi monitoring live di dalam workspace Ponyin. Feed utama gak pake daftar token statis.</span>
      </footer>
    </main>
  );
}

function Navigation() {
  return (
    <nav className="site-nav">
      <a href="#home" className="brand">
        <span>SI</span>
        <div>
          <strong>Should I Ape?</strong>
          <small>Engine Ponyin</small>
        </div>
      </a>
      <div className="nav-links">
        <a href="#feed">Daftar Live</a>
        <a href="#result">Meter Ape</a>
        <a href="#engine">Engine</a>
        <a href="#roadmap">Cakupan</a>
      </div>
    </nav>
  );
}

function SectionHeader({ kicker, title, text }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{kicker}</span>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </div>
  );
}

function ProviderStrip({ status, health, count, onRefresh }) {
  return (
    <div className={`provider-strip ${status.error ? 'error' : ''}`}>
      <div>
        {status.error ? <ServerCrash size={20} /> : <DatabaseZap size={20} />}
        <div>
          <strong>{status.error ? 'Sumber data lagi terganggu' : 'Sumber data live aktif'}</strong>
          <span>
            {status.error
              ? status.error
            : `${count} token Solana aktif${status.fetchedAt ? `, refresh ${formatTime(status.fetchedAt)}` : ''}, ${formatStreamStatus(status)}`}
          </span>
          <ProviderHealthChips health={health} />
        </div>
      </div>
      <button type="button" onClick={onRefresh} disabled={status.loading}>
        <RefreshCw size={16} />
        {status.loading ? 'Memuat' : 'Muat ulang'}
      </button>
    </div>
  );
}

function ProviderHealthChips({ health }) {
  const smartSize = Number(health?.smartWallets?.size || 0);
  const chips = [
    {
      label: health?.env?.madeOnSolKey ? 'indeks wallet aktif' : 'indeks wallet kosong',
      ok: Boolean(health?.env?.madeOnSolKey)
    },
    {
      label: health?.env?.heliusKey || health?.env?.solanaRpcUrl ? 'jalur on-chain stabil' : 'jalur on-chain publik',
      ok: Boolean(health?.env?.heliusKey || health?.env?.solanaRpcUrl)
    },
    {
      label: smartSize > 0 ? `${smartSize} wallet pintar` : 'registry wallet kosong',
      ok: smartSize > 0
    }
  ];

  return (
    <div className="provider-health-chips">
      {health?.error ? (
        <span className="warn">{health.error}</span>
      ) : chips.map((chip) => (
        <span className={chip.ok ? 'ok' : 'warn'} key={chip.label}>{chip.label}</span>
      ))}
    </div>
  );
}

function FeedHealth({ token }) {
  const status = getFeedHealth(token);

  return (
    <span className={`feed-health ${status.tone}`}>
      <span />
      {status.label}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LogLine({ tone, text }) {
  return (
    <div className={`log-line ${tone}`}>
      <span />
      {text}
    </div>
  );
}



function SourcePill({ icon: Icon, label, value }) {
  return (
    <div className="source-pill">
      <Icon size={18} />
      <div>
        <span>{label}</span>
        <strong>{value || 'belum diketahui'}</strong>
      </div>
    </div>
  );
}

function ForensicPanel({ token, report, status, now }) {
  const flags = token.flags || {};
  const metrics = token.metrics || {};
  const holders = token.rawProviders?.holders || [];
  const excludedHolders = token.rawProviders?.excludedHolders || [];
  const walletIntel = token.rawProviders?.walletIntel || [];
  const insightSummary = token.rawProviders?.insightSummary || [];
  const providerErrors = token.rawProviders?.providerErrors || {};
  const madeOnSol = token.rawProviders?.madeOnSol;
  const liquidityPool = token.rawProviders?.liquidityPool;
  const links = [
    ...(token.websites || []),
    ...(token.socials || []).map((item) => ({ label: item.type, url: item.url }))
  ].slice(0, 5);

  return (
    <div className="forensic-panel">
      <div className="forensic-head">
        <div>
          <span className="eyebrow compact">Forensic Realtime</span>
          <h2>Monitoring live berbasis Ponyin</h2>
        </div>
        <span className={`live-chip ${status.streamConnected ? 'on' : 'off'}`}>
          <span />
          {status.streamConnected ? 'Stream live' : 'Stream menyambung ulang'}
        </span>
      </div>

      <div className="forensic-grid">
        <MetricBox label="Harga" value={token.priceUsd ? `$${Number(token.priceUsd).toPrecision(4)}` : 'belum diketahui'} />
        <MetricBox label="Umur live" value={formatLiveAge(token, now)} />
        <MetricBox label="MCap / FDV" value={formatLiveMarketCap(token)} />
        <MetricBox label="Likuiditas" value={formatUsd(token.liquidityUsd)} />
        <MetricBox label="Status LP" value={liquidityPool?.status || token.lpStatus || 'belum diketahui'} tone={token.liquidityUsd < 5000 && token.phase === 'raydium' ? 'danger' : token.liquidityUsd < 25000 ? 'warn' : 'good'} />
        <MetricBox label="Vol 5m / 1h" value={`${formatUsd(metrics.volume?.m5)} / ${formatUsd(metrics.volume?.h1)}`} />
        <MetricBox label="Txns 5m / 1h" value={`${metrics.txns?.m5 ?? flags.txns5m ?? '-'} / ${metrics.txns?.h1 ?? '-'}`} />
        <MetricBox label="Buy/Sell 5m" value={`${metrics.buys?.m5 ?? flags.buys5m ?? 0}/${metrics.sells?.m5 ?? flags.sells5m ?? 0}`} />
        <MetricBox label="Harga m5 / h1" value={`${formatPct(token.priceChange?.m5)} / ${formatPct(token.priceChange?.h1)}`} tone={priceTone(token.priceChange?.m5)} />
        <MetricBox label="Vol/LP Ratio" value={`${Number(flags.volumeLiquidityRatio || 0).toFixed(2)}x`} tone={flags.volumeLiquidityRatio > 5 ? 'danger' : flags.volumeLiquidityRatio > 2 ? 'warn' : 'good'} />
        <MetricBox label="Supply Top 10" value={flags.top10Pct == null ? 'belum diketahui' : `${flags.top10Pct.toFixed(1)}%`} tone={flags.top10Pct > 55 ? 'danger' : flags.top10Pct > 40 ? 'warn' : 'good'} />
        <MetricBox label="Owner Unik" value={flags.uniqueOwnerCount ?? 'belum diketahui'} tone={flags.uniqueOwnerCount == null ? '' : flags.uniqueOwnerCount <= 3 ? 'danger' : flags.uniqueOwnerCount <= 6 ? 'warn' : 'good'} />
        <MetricBox label="Whale / Burner" value={`${flags.whales || 0} / ${flags.burners || 0}`} />
        <MetricBox label="Jumlah Pair" value={flags.dexPairCount ?? 'belum diketahui'} />
      </div>

      <div className="forensic-columns">
        <div className="forensic-card">
          <h3>Snapshot Top Holder</h3>
          <p className="card-note">Akun LP/pool dipisahkan, jadi persentase top holder tidak ikut menghitung liquidity pool.</p>
          {insightSummary.length > 0 && (
            <div className="intel-summary">
              {insightSummary.slice(0, 4).map((item) => (
                <span key={item}>{cleanPublicCopy(item)}</span>
              ))}
            </div>
          )}
          <div className="holder-list">
            {holders.length ? holders.slice(0, 10).map((holder) => (
              <div className="holder-row" key={`${holder.rank}-${holder.tokenAccount}`}>
                <span>#{holder.rank}</span>
                <strong>{shortAddress(holder.owner || holder.tokenAccount)}</strong>
                <em>{holder.pct == null ? 'belum diketahui' : `${holder.pct.toFixed(2)}%`}</em>
                <small>{holder.label || holder.type || formatSol(holder.solBalance)}</small>
              </div>
            )) : (
              <p className="muted-copy">Top holder belum tersedia. Gunakan jalur RPC privat agar pembacaan holder lebih stabil.</p>
            )}
          </div>
          {excludedHolders.length > 0 && (
            <div className="excluded-note">
              {excludedHolders.length} akun pool/vault dikeluarkan dari top holder.
            </div>
          )}
        </div>

        <div className="forensic-card">
          <h3>Liquidity Pool</h3>
          {liquidityPool ? (
            <>
              <div className="market-index-grid">
                <MetricMini label="DEX" value={liquidityPool.dex || token.pairDex || 'belum diketahui'} />
                <MetricMini label="Nilai LP" value={formatUsd(liquidityPool.usd ?? token.liquidityUsd)} />
                <MetricMini label="Base / Quote" value={`${formatTokenAmount(liquidityPool.base)} / ${formatTokenAmount(liquidityPool.quote)}`} />
                <MetricMini label="Pair aktif" value={liquidityPool.pairCount ?? flags.dexPairCount ?? 'belum diketahui'} />
              </div>
              <div className="pool-address">
                <span>Pair</span>
                <strong>{liquidityPool.pairAddress ? shortAddress(liquidityPool.pairAddress) : 'belum terindeks'}</strong>
              </div>
              {liquidityPool.excludedTopAccounts?.length > 0 && (
                <div className="holder-list compact">
                  {liquidityPool.excludedTopAccounts.slice(0, 4).map((holder) => (
                    <div className="holder-row" key={`lp-${holder.rank}-${holder.tokenAccount}`}>
                      <span>LP</span>
                      <strong>{shortAddress(holder.owner || holder.tokenAccount)}</strong>
                      <em>{holder.pct == null ? 'belum diketahui' : `${holder.pct.toFixed(2)}%`}</em>
                      <small>{holder.label || holder.type || 'pool vault'}</small>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="muted-copy">LP belum terbaca dari pair aktif. Kalau token masih bonding curve, tunggu pair DEX muncul.</p>
          )}
        </div>

        <div className="forensic-card">
          <h3>Skor Wallet Holder</h3>
          <div className="wallet-score-list">
            {walletIntel.length ? walletIntel.slice(0, 8).map((wallet) => (
              <div className="wallet-score-row" key={`${wallet.rank}-${wallet.owner || wallet.label}`}>
                <div>
                  <strong>#{wallet.rank} {wallet.label || shortAddress(wallet.owner)}</strong>
                  <span>{wallet.type || 'holder'} - {wallet.pct == null ? 'supply belum diketahui' : `${wallet.pct.toFixed(2)}% supply`}</span>
                </div>
                <em>{wallet.score}</em>
                <small>{wallet.tags?.length ? wallet.tags.join(', ') : formatSol(wallet.solBalance)}</small>
              </div>
            )) : (
              <p className="muted-copy">Skor wallet belum tersedia. Data ini akan terisi saat analisis holder on-chain aktif.</p>
            )}
          </div>
        </div>

        <div className="forensic-card">
          <h3>Kecocokan Materi & Space</h3>
          <div className="rule-match-list">
            {report.knowledgeHits.map((hit) => (
              <div className="rule-match" key={hit.id}>
                <strong>{cleanPublicCopy(hit.title)}</strong>
                <span>{cleanPublicCopy(hit.source)}</span>
                <p>{cleanPublicCopy(hit.rule)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="forensic-card">
          <h3>Intelijen Pasar Tambahan</h3>
          <div className="rule-match-list">
            {(report.marketSignals || []).map((signal) => (
              <div className={`rule-match ${signal.tone}`} key={signal.title}>
                <strong>{signal.title}</strong>
                <span>{signal.tone.toUpperCase()}</span>
                <p>{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="forensic-card">
          <h3>Intelijen Indeks Pasar</h3>
          {madeOnSol ? (
            <div className="market-index-grid">
              <MetricMini label="Umur indexer" value={madeOnSol.ageSeconds == null ? 'belum diketahui' : formatAgeSeconds(madeOnSol.ageSeconds)} />
              <MetricMini label="MCap indeks" value={formatUsd(madeOnSol.marketCapUsd)} />
              <MetricMini label="Volume 24h" value={formatUsd(madeOnSol.volume24hUsd)} />
              <MetricMini label="MEV 5m" value={formatOptionalPct(readWindow(madeOnSol.mevVolumePct, '5m'))} />
              <MetricMini label="KOL flow" value={madeOnSol.kolActivity?.signal || 'belum ada'} />
              <MetricMini label="Deployer" value={madeOnSol.deployer?.tier || 'belum diketahui'} />
            </div>
          ) : (
            <p className="muted-copy">Intelijen indeks pasar belum tersedia. Data ini muncul jika token sudah terbaca oleh sumber indeks tambahan.</p>
          )}
        </div>

        <div className="forensic-card">
          <h3>Kesehatan Data</h3>
          <div className="provider-list">
            <ProviderLine label="Data pair" ok={Boolean(token.rawProviders?.dexPair)} detail={token.pairDex ? `${token.pairDex} aktif` : cleanPublicCopy(token.source)} />
            <ProviderLine label="Authority on-chain" ok={Boolean(token.rawProviders?.mint)} detail={flags.mintRevoked == null ? 'authority belum diketahui' : `mint ${flags.mintRevoked ? 'sudah revoke' : 'masih terbuka'}`} />
            <ProviderLine label="Intel holder" ok={Boolean(token.rawProviders?.holderMeta)} detail={token.rawProviders?.holderMeta?.tokenIntelProvider ? cleanPublicCopy(token.rawProviders.holderMeta.tokenIntelProvider) : 'mode pembacaan dasar'} />
            <ProviderLine label="Indeks pasar" ok={Boolean(madeOnSol)} detail={madeOnSol ? 'data indeks tambahan aktif' : 'belum tersedia'} />
            <ProviderLine label="Registry wallet" ok={Number(token.rawProviders?.holderMeta?.smartWalletRegistrySize || flags.smartWalletRegistrySize || 0) > 0} detail={`${token.rawProviders?.holderMeta?.smartWalletRegistrySize || flags.smartWalletRegistrySize || 0} wallet pintar terbaca`} />
            <ProviderLine label="Trade stream" ok={Boolean(token.rawProviders?.pump || flags.pumpPortalTradeSeen)} detail={flags.pumpPortalTradeSeen ? 'trade terbaru terbaca' : 'belum ada trade terbaru'} />
            <ProviderLine label="Order/boost" ok={(flags.activeBoosts || 0) > 0} detail={`${flags.activeBoosts || 0} order/boost aktif`} />
            <ProviderLine label="Keyakinan data live" ok={report.confidence >= 45} detail={`${report.confidence}% confidence, ${report.primaryRisk}`} />
          </div>

          {Object.values(providerErrors).some(Boolean) && (
            <div className="provider-errors">
              {Object.entries(providerErrors).filter(([, value]) => value).map(([key, value]) => (
                <span key={key}>{formatProviderErrorKey(key)}: {cleanPublicCopy(value)}</span>
              ))}
            </div>
          )}

          {links.length > 0 && (
            <div className="link-row">
              {links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, tone = '' }) {
  return (
    <div className={`metric-box ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? 'belum diketahui'}</strong>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="metric-mini">
      <span>{label}</span>
      <strong>{value ?? 'belum diketahui'}</strong>
    </div>
  );
}

function ProviderLine({ label, ok, detail }) {
  return (
    <div className={`provider-line ${ok ? 'ok' : 'warn'}`}>
      <span />
      <strong>{label}</strong>
      <em>{detail || 'belum diketahui'}</em>
    </div>
  );
}

function CheckCard({ check }) {
  const Icon = check.status === 'pass' ? CheckCircle2 : check.status === 'fail' ? XCircle : AlertTriangle;

  return (
    <article className={`check-card ${check.status}`}>
      <Icon size={20} />
      <div>
        <span>{check.status === 'pass' ? 'LOLOS' : check.status === 'fail' ? 'GAGAL' : 'PANTAU'}</span>
        <h3>{check.label}</h3>
        <p>{cleanPublicCopy(check.detail)}</p>
      </div>
    </article>
  );
}

function RoadmapCard({ title, text }) {
  return (
    <article className="roadmap-card">
      <Layers3 size={22} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function buildStats(feedTokens, report, feedStatus) {
  return {
    tokens: String(feedTokens.length),
    provider: feedStatus.error ? 'terganggu' : 'live',
    updated: feedStatus.fetchedAt ? formatTime(feedStatus.fetchedAt) : '-',
    confidence: `${report.confidence}%`
  };
}

function translateProviderError(message) {
  if (!message) return message;
  if (String(message).includes('Health endpoint')) return 'Status data belum tersedia di pratinjau lokal';
  if (message === 'PumpPortal websocket error') return 'Stream transaksi lagi bermasalah';
  if (message === 'PumpPortal reconnecting') return 'Stream transaksi lagi nyambung ulang';
  if (message === 'No live tokens returned from DexScreener') return 'Belum ada token live dari sumber pair';
  return cleanPublicCopy(message);
}

function formatStreamStatus(status) {
  if (!status.streamConnected) return 'stream transaksi lagi nyambung ulang, data pair tetap aktif';
  if (!status.streamLastTokenAt) return 'stream transaksi udah nyambung, nunggu token baru';

  const seconds = Math.max(0, Math.floor((Date.now() - status.streamLastTokenAt) / 1000));
  if (seconds < 45) return `stream live, data ${seconds}dtk lalu`;
  if (seconds < 180) return `stream sepi ${Math.floor(seconds / 60)}m, data pair tetap aktif`;
  return 'stream belum ngasih data baru, data pair tetap aktif';
}

function cleanPublicCopy(value) {
  return String(value || 'belum diketahui')
    .replaceAll('MadeOnSol', 'indeks pasar')
    .replaceAll('DexScreener', 'sumber pair')
    .replaceAll('Health endpoint', 'status data')
    .replaceAll('PumpPortal', 'stream transaksi')
    .replaceAll('Helius', 'RPC privat')
    .replaceAll('backend token-intel', 'analisis holder')
    .replaceAll('fallback browser RPC', 'mode pembacaan dasar')
    .replaceAll('provider', 'sumber data')
    .replaceAll('Provider', 'Sumber data')
    .replaceAll('API live', 'data live');
}

function formatProviderErrorKey(key) {
  return {
    dex: 'data pair',
    solanaRpc: 'on-chain',
    pumpPortal: 'stream transaksi',
    dexOrders: 'order/boost',
    holders: 'holder'
  }[key] || key;
}

function upsertTokens(currentTokens, newTokens) {
  const map = new Map(currentTokens.map((t) => [t.ca, t]));
  newTokens.forEach((t) => {
    const previous = map.get(t.ca);
    const fetchedAt = previous?._fetchedAt || t._fetchedAt || Date.now();
    map.set(t.ca, { ...previous, ...t, _fetchedAt: fetchedAt, _lastSeenAt: Date.now() });
  });
  return Array.from(map.values()).sort((a, b) => {
    const rankA = feedRank(a);
    const rankB = feedRank(b);
    if (rankA !== rankB) return rankB - rankA;

    const ageA = a.pairCreatedAt || a._lastSeenAt || a._fetchedAt || Date.now();
    const ageB = b.pairCreatedAt || b._lastSeenAt || b._fetchedAt || Date.now();
    return ageB - ageA;
  });
}

function pruneTokens(tokens) {
  const now = Date.now();
  return tokens.filter((t) => {
    if (!t?.ca) return false;

    const report = analyzeToken(t);
    const isPumpBondingCurve = t.provider === 'PumpPortal live websocket' || t.lpStatus === 'Bonding curve';
    const lastSeenAgeMins = ((now - (t._lastSeenAt || t._fetchedAt || now)) / 60000);
    const entryScore = computeEntryScore(t, report);
    const isStrong = entryScore >= 74 || report.score >= 68 || t.liquidityUsd >= 30000 || t.flags?.reportedVolume >= 50000;
    
    // Feed ini bukan firehose token baru. Token harus ada bukti entry: market aktif, gak dump keras, dan gak wash ekstrem.
    if (entryScore < 52) return false;
    if (report.score <= 34 && entryScore < 70) return false;
    if (isPumpBondingCurve && entryScore < 70) return false;
    if (!isPumpBondingCurve && t.liquidityUsd < 6500) return false;
    if (!isPumpBondingCurve && t.flags?.volumeLiquidityRatio > 9) return false;
    if (!isPumpBondingCurve && t.flags?.sells5m > (t.flags?.buys5m * 2.6) + 8) return false;
    
    // Filter token mati, dump signifikan, atau belum cukup aktif buat disebut kandidat entry.
    if (!isPumpBondingCurve && t.priceChange?.m5 < -12) return false;
    if (!isPumpBondingCurve && t.priceChange?.h1 < -24) return false;
    if (!isPumpBondingCurve && t.flags?.txns5m < 8 && t.liquidityUsd < 18000) return false;
    if (!isPumpBondingCurve && lastSeenAgeMins > 30 && !isStrong) return false; // Gak muncul lagi dari refresh aktif.

    // Evaluasi umur token
    if (isPumpBondingCurve) {
      const feedAgeMins = t._fetchedAt ? (now - t._fetchedAt) / 60000 : 0;
      if (feedAgeMins > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (lastSeenAgeMins > 60 && !isStrong) return false;
    } else if (t.pairCreatedAt) {
      const ageMins = (now - t.pairCreatedAt) / 60000;
      if (ageMins > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (ageMins > 180 && !isStrong) return false;
    } else if (t.ageMinutes !== null) {
      if (t.ageMinutes > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (t.ageMinutes > 180 && !isStrong) return false;
    }
    
    return true;
  });
}

function feedRank(token) {
  const now = Date.now();
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket' || token.lpStatus === 'Bonding curve';
  const ageMinutes = token.pairCreatedAt ? Math.max(0, (now - token.pairCreatedAt) / 60000) : 0;
  const lastSeenAge = token._lastSeenAt ? Math.max(0, (now - token._lastSeenAt) / 1000) : 0;
  const txns = Number(token.flags?.txns5m || 0);
  const volume = Number(token.flags?.reportedVolume || 0);
  const liquidity = Number(token.liquidityUsd || 0);
  const entryScore = computeEntryScore(token);

  return entryScore * 8
    + (isPumpBondingCurve ? -120 : 0)
    + Math.max(0, 180 - Math.abs(ageMinutes - 90))
    + Math.max(0, 120 - lastSeenAge)
    + Math.min(txns * 3, 180)
    + Math.min(volume / 100, 120)
    + Math.min(liquidity / 1000, 80);
}

function getFeedHealth(token) {
  const now = Date.now();
  const lastSeenAge = token._lastSeenAt ? (now - token._lastSeenAt) / 1000 : 0;
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket' || token.lpStatus === 'Bonding curve';
  const entryScore = computeEntryScore(token);

  if (entryScore >= 78 && lastSeenAge < 90) return { tone: 'live', label: 'ENTRY' };
  if (entryScore >= 66) return { tone: 'live', label: 'KUAT' };
  if (isPumpBondingCurve) return { tone: lastSeenAge < 30 ? 'watch' : 'watch', label: 'AWAL' };
  if (lastSeenAge > 90) return { tone: 'watch', label: 'USANG' };
  if (token.priceChange?.m5 > 0 && token.flags?.txns5m >= 8) return { tone: 'live', label: 'AKTIF' };
  return { tone: 'watch', label: 'PANTAU' };
}

function computeEntryScore(token, reportOverride = null) {
  if (!token?.ca) return 0;

  const report = reportOverride || analyzeToken(token);
  const flags = token.flags || {};
  const liquidity = Number(token.liquidityUsd || 0);
  const volume5m = Number(flags.reportedVolume || 0);
  const txns5m = Number(flags.txns5m || 0);
  const buys5m = Number(flags.buys5m || 0);
  const sells5m = Number(flags.sells5m || 0);
  const priceM5 = Number(token.priceChange?.m5 || 0);
  const priceH1 = Number(token.priceChange?.h1 || 0);
  const volumeLiquidityRatio = Number(flags.volumeLiquidityRatio || 0);
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket' || token.lpStatus === 'Bonding curve';
  const buyRatio = buys5m + sells5m > 0 ? buys5m / (buys5m + sells5m) : 0.5;

  let score = Math.min(report.score, 82) * 0.55;
  score += Math.min(liquidity / 900, 24);
  score += Math.min(volume5m / 900, 18);
  score += Math.min(txns5m * 1.2, 18);
  score += Math.round((buyRatio - 0.5) * 24);

  if (priceM5 > 0 && priceM5 <= 35) score += 10;
  else if (priceM5 > 35 && priceM5 <= 120) score += 4;
  else if (priceM5 < -5) score -= 12;

  if (priceH1 > -8 && priceH1 < 220) score += 8;
  if (priceH1 < -20) score -= 14;
  if (volumeLiquidityRatio > 6) score -= 18;
  else if (volumeLiquidityRatio > 3.5) score -= 8;
  if (sells5m > buys5m * 2 + 8) score -= 18;
  if (isPumpBondingCurve && liquidity < 6000 && txns5m < 18) score -= 28;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function shortAddress(address) {
  if (!address) return 'SCAN';
  return `${address.slice(0, 4)}...${address.slice(-4)}`.toUpperCase();
}

function formatLiveAge(token, currentTime = Date.now()) {
  if (!token?.ca) return '-';

  const startTime = token.pairCreatedAt || token._fetchedAt || token._lastSeenAt;
  if (!startTime) return token.age || 'belum diketahui';

  const seconds = Math.max(0, Math.floor((currentTime - startTime) / 1000));
  if (seconds < 60) return `${seconds}dtk`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}d`;

  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}j ${minutes % 60}m`;

  return `${Math.floor(hours / 24)}h ${hours % 24}j`;
}

function formatLiveMarketCap(token) {
  if (!token?.ca) return '-';
  if (token.provider === 'PumpPortal live websocket' && token.lpStatus === 'Bonding curve') {
    return token.marketCap && token.marketCap !== 'bonding' ? `${token.marketCap} (bonding)` : 'bonding';
  }
  return token.marketCap || 'belum diketahui';
}

function formatPct(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'belum diketahui';
  return `${num > 0 ? '+' : ''}${num.toFixed(Math.abs(num) >= 100 ? 0 : 1)}%`;
}

function formatOptionalPct(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'belum diketahui';
  return `${num.toFixed(Math.abs(num) >= 100 ? 0 : 1)}%`;
}

function readWindow(value, key) {
  if (!value || typeof value !== 'object') return null;
  return value[key] ?? value[key.replace('m', 'min')] ?? value[key.toUpperCase()] ?? null;
}

function formatAgeSeconds(value) {
  const seconds = Number(value || 0);
  if (!Number.isFinite(seconds)) return 'belum diketahui';
  if (seconds < 60) return `${Math.round(seconds)} dtk`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam`;
  return `${Math.floor(seconds / 86400)} hari`;
}

function priceTone(value) {
  const num = Number(value || 0);
  if (num <= -15) return 'danger';
  if (num < 0) return 'warn';
  if (num > 0) return 'good';
  return '';
}

function formatSol(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 'owner belum diketahui';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K SOL`;
  return `${num.toFixed(num >= 10 ? 1 : 3)} SOL`;
}

function formatTokenAmount(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num <= 0) return 'unknown';
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(num >= 10 ? 1 : 3);
}

function extractSolanaAddress(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  return match ? match[0] : raw;
}

function formatTime(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(iso));
  } catch {
    return '-';
  }
}
