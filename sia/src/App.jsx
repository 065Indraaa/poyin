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
  Rocket,
  Search,
  ServerCrash,
  ShieldAlert,
  Signal,
  Skull,
  Sparkles,
  Wallet,
  XCircle
} from 'lucide-react';
import { analyzeToken, emptyToken } from './data/apeEngine';
import { ponyinPrinciples } from './data/knowledgeBase';
import { fetchDiscoveryFeed, fetchProviderHealth, fetchTokenMarketSnapshots, fetchTokenSnapshot, formatUsd, subscribeToPumpPortalStream } from './data/liveProviders';
import { connectIndexerSocket, fetchScanDeep, fetchEnrichedFeed } from './services/indexerSocket';
import { pushSnapshot } from './data/snapshotStore';
import { analyzeRug } from './data/rugDetector';
import { analyzeRunner } from './data/runnerDetector';
import { addToBlacklist, getBlacklistEntry, isBlacklisted, prune as pruneBlacklist } from './data/blacklist';
import RedFlagPanel from './components/RedFlagPanel';
import BundleGraph from './components/BundleGraph';

const scanSteps = [
  'Mengambil data pair dan likuiditas secara live...',
  'Memeriksa mint authority dan freeze authority on-chain...',
  'Memuat registry smart wallet dan memvalidasi kualitas holder...',
  'Membaca stream transaksi terbaru...',
  'Menilai token dengan kerangka Ponyin dan sinyal pasar live...',
  'Menyusun ringkasan verdict dan catatan risiko...'
];

const phases = [
  {
    key: 'new',
    title: 'New Launch',
    subtitle: '0–30 menit · masih di bonding curve',
    focus: 'Bundle dev awal, fake volume, dan validasi authority',
    icon: Flame
  },
  {
    key: 'early',
    title: 'Early Trench',
    subtitle: '30 menit – 6 jam',
    focus: 'Retensi holder, sinyal dev sell, dan sinkronisasi cabal',
    icon: Radar
  },
  {
    key: 'soon',
    title: 'Soon Migrate',
    subtitle: '6–24 jam · bonding mendekati DEX',
    focus: 'Kesiapan migrasi, kedalaman LP, dan keberlanjutan volume',
    icon: AlertTriangle
  },
  {
    key: 'migrated',
    title: 'Migrated',
    subtitle: 'Sudah di Raydium / Orca / Meteora',
    focus: 'Kesehatan LP, rasio fee, dan deteksi wash trading',
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
    streamLastTokenAt: null,
    pumpPortalRetry: 0,
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

  // Deep scan / indexer state
  const [deepScan, setDeepScan] = useState(null);
  const [activePipeline, setActivePipeline] = useState('all');
  const [pipelineCounts, setPipelineCounts] = useState({ new: 0, early: 0, soon: 0, migrated: 0, dead: 0 });

  useEffect(() => {
    selectedTokenRef.current = selectedToken;
  }, [selectedToken]);

  useEffect(() => {
    feedTokensRef.current = feedTokens;
  }, [feedTokens]);

  useEffect(() => {
    pruneBlacklist();
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
          pumpPortalRetry: stream.connecting ? (current.pumpPortalRetry || 0) + 1 : 0,
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

    // Connect to backend indexer for real-time alerts (WS or polling fallback)
    const unsubscribeIndexer = connectIndexerSocket((payload) => {
      if (payload.type === 'alert') {
        setFeedTokens((current) =>
          current.map((t) =>
            t.ca === payload.ca
              ? { ...t, _indexerAlert: { severity: payload.severity, text: payload.alerts?.[0] } }
              : t
          )
        );
      }
      if (payload.type === 'scan_complete' && payload.ca === selectedTokenRef.current?.ca) {
        setDeepScan((prev) => ({
          ...prev,
          verdict: payload.result.verdict,
          redFlags: payload.result.redFlags,
          stages: payload.result.stages,
        }));
      }
      if (payload.type === 'poll_discovery') {
        const incoming = (payload.tokens || []).map((t) => ({
          id: t.ca,
          ca: t.ca,
          name: t.name,
          ticker: t.ticker,
          phase: t.phase,
          ageMinutes: t.ageMinutes,
          liquidityUsd: t.liquidityUsd,
          marketCap: t.marketCap,
          volume5m: t.volume5m,
          priceChange: t.priceChange,
          buySell: `${t.buys5m}/${t.sells5m}`,
          txns5m: t.txns5m,
          buys5m: t.buys5m,
          sells5m: t.sells5m,
          flags: {
            txns5m: t.txns5m,
            buys5m: t.buys5m,
            sells5m: t.sells5m,
            reportedVolume: t.volume5m,
          },
          _indexerAlert: t.latestAlert
            ? { severity: t.latestAlert.severity, text: t.latestAlert.text }
            : undefined,
        }));
        setFeedTokens((current) => pruneTokens(upsertTokens(current, incoming)));
      }
    });

    return () => {
      clearInterval(refreshInterval);
      clearInterval(healthInterval);
      clearInterval(marketRefreshInterval);
      clearInterval(clockInterval);
      clearInterval(pruneInterval);
      unsubscribePumpPortal();
      unsubscribeIndexer();
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
      const key = phases.some((phase) => phase.key === token.phase) ? token.phase : 'migrated';
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
      .slice(0, 60);

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
    const priorBlacklist = getBlacklistEntry(address);

    setSelectedToken(optimisticToken);
    setReport(analyzeToken(optimisticToken));
    setQuery(address);
    setCopied(false);
    setIsScanning(true);
    setScanIndex(0);

    scanSteps.forEach((_, index) => {
      window.setTimeout(() => setScanIndex(index), index * 360);
    });

    // Start deep scan in background (progressive enrichment)
    setDeepScan(null);
    const deepPromise = fetchScanDeep(address)
      .then((deep) => {
        setDeepScan(deep);
        // Merge deep scan verdict as overlay if critical
        if (deep?.verdict?.isRug) {
          addToBlacklist(address, {
            reason: deep.redFlags?.map((r) => r.text).slice(0, 2).join('; ') || 'deep scan critical',
            level: 'critical'
          });
          setReport((prev) => ({
            ...prev,
            verdict: { label: 'Zona Bahaya', instruction: 'Hindari aja', tone: 'danger' },
            summary: `⚠️ Indexer backend detect red flags: ${deep.redFlags.map((r) => r.text).join('; ')}. ${prev.summary}`,
          }));
        }
      })
      .catch(() => { /* fallback ke data live biasa */ });

    try {
      const liveToken = await fetchTokenSnapshot(address);
      applyLiveToken(liveToken);

      // Re-analyze setelah data live masuk — kalau confirmed rug, tambah ke blacklist
      const rug = analyzeRug(liveToken);
      if (rug.isRugged || rug.level === 'critical') {
        addToBlacklist(address, {
          reason: rug.reasons.slice(0, 2).join('; ') || 'rug pattern',
          level: rug.level
        });
        setReport((prev) => ({
          ...prev,
          verdict: { label: 'Zona Bahaya', instruction: 'Hindari aja', tone: 'danger' },
          summary: `⚠️ Pola rug terdeteksi: ${rug.reasons.join('; ')}. ${prev.summary}`,
        }));
      } else if (priorBlacklist) {
        setReport((prev) => ({
          ...prev,
          summary: `⚠️ Token ini sebelumnya pernah ditandai (${priorBlacklist.reason}). ${prev.summary}`,
        }));
      }
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
            AI Decision Engine · Ponyin
          </div>
          <h1>Should I Ape?</h1>
          <p className="hero-lead">
            Scanner real-time untuk trader memecoin Solana. Data dihimpun dari on-chain,
            pair market, dan stream transaksi, lalu dinilai dengan kerangka analisis Ponyin,
            arsip Space X, dan sinyal pasar tambahan.
          </p>

          <form className="search-card" onSubmit={onSubmit}>
            <Search size={22} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tempel contract address Solana..."
              aria-label="Contract address"
            />
            <button type="submit" disabled={isScanning}>
              {isScanning ? 'Menganalisis...' : 'Analisis'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="quick-actions">
            <button type="button" onClick={refreshFeed} disabled={feedStatus.loading}>
              <RefreshCw size={15} />
              {feedStatus.loading ? 'Memuat ulang...' : 'Muat ulang feed live'}
            </button>
            {feedTokens.slice(0, 2).map((token) => (
              <button type="button" key={token.id} onClick={() => runAnalysis(token)}>
                Scan ${token.ticker}
              </button>
            ))}
          </div>

          <ol className="howto-strip" aria-label="Cara pakai">
            <li>
              <span>1</span>
              <div>
                <strong>Tempel CA</strong>
                <small>atau klik token dari feed di bawah.</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Engine scan 5 lapis</strong>
                <small>contract, bundle, volume, marketing, candle.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Baca verdict</strong>
                <small>skor 0–100 + ringkasan AI + materi terkait.</small>
              </div>
            </li>
          </ol>
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
              <span>Verdict saat ini</span>
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
          kicker="Feed Token Live"
          title="Daftar real-time kandidat entry yang valid."
          text="Feed ini memprioritaskan token dengan peluang entry yang lebih sehat: likuiditas memadai, transaksi aktif, tekanan beli wajar, volume tidak janggal, dan struktur harga belum rusak oleh drawdown."
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

        <div className="pipeline-tabs">
          {[
            { key: 'all', label: 'Semua', hint: 'Semua token aktif kecuali yang sudah Dead' },
            { key: 'runner', label: 'Runner', hint: 'Token dengan momentum kuat & sinyal entry terbaik' },
            { key: 'new', label: 'New', hint: 'Umur 0–30 menit, masih di bonding curve' },
            { key: 'early', label: 'Early', hint: 'Umur 30 menit – 6 jam, fase trench' },
            { key: 'soon', label: 'Soon', hint: 'Bonding mendekati migrasi DEX (6–24 jam)' },
            { key: 'migrated', label: 'Migrated', hint: 'Sudah di Raydium / Orca / Meteora' },
            { key: 'dead', label: 'Dead', hint: 'Terdeteksi rug, dump, atau likuiditas habis' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              title={tab.hint}
              aria-label={`${tab.label} — ${tab.hint}`}
              className={`${activePipeline === tab.key ? 'active' : ''} ${tab.key === 'dead' ? 'dead' : ''} ${tab.key === 'runner' ? 'runner' : ''}`}
              onClick={() => setActivePipeline(tab.key)}
            >
              {tab.label}
              <span className="count">{pipelineCount(feedTokens, tab.key)}</span>
            </button>
          ))}
        </div>
        <p className="pipeline-helper">
          {(() => {
            const tip = {
              all: 'Tampilkan semua token aktif yang lolos kriteria entry.',
              runner: 'Filter token momentum: skor entry ≥ 70 dan tren harga positif.',
              new: 'Baru lahir, masih bonding curve — wajib cek bundle dan authority sebelum apa-apa.',
              early: 'Sudah lewat menit pertama — fokus pada retensi holder dan dev sell.',
              soon: 'Bonding curve mendekati migrasi — pantau kedalaman LP dan keberlanjutan volume.',
              migrated: 'Sudah listing DEX — fokus pada kesehatan LP, rasio fee, dan deteksi wash trading.',
              dead: 'Sudah ter-flag rug / dump / LP kering. Disimpan ≤ 1 hari untuk catatan, jangan entry.',
            }[activePipeline];
            return tip;
          })()}
        </p>

        <div className="table-container">
          <table className="feed-table">
            <thead>
              <tr>
                <th title="Ticker dan nama token">Token</th>
                <th title="Fase token: New, Early, Soon Migrate, atau Migrated">Fase</th>
                <th title="Umur token sejak pair dibuat (DexScreener) atau pertama terdeteksi (PumpPortal)">Umur</th>
                <th title="Market Cap (MCap) — kapitalisasi pasar saat ini">MCap</th>
                <th title="Total nilai LP di pair aktif (USD)">Likuiditas</th>
                <th title="Volume perdagangan 5 menit terakhir">Vol 5m</th>
                <th title="Jumlah transaksi dalam 5 menit terakhir">Txns 5m</th>
                <th title="Rasio Buy / Sell dalam 5 menit terakhir">B/S</th>
                <th title="Status kesehatan untuk entry: ENTRY, RUNNER, KUAT, PANTAU, USANG, AWAL, DEAD, RUGGED">Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {feedStatus.loading && feedTokens.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">Memuat feed live...</td>
                </tr>
              )}
              {!feedStatus.loading && feedTokens.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">Belum ada token yang memenuhi kriteria entry valid. Token baru tanpa bukti pasar tidak diprioritaskan.</td>
                </tr>
              )}
              {feedTokens
                .filter((token) => filterByPipeline(token, activePipeline))
                .map((token) => (
                  <tr key={token.id} className={`${token._isRunner ? 'runner-row' : ''} ${token._isDead ? 'dead-row' : ''}`.trim()} onClick={() => runAnalysis(token)}>
                    <td>
                      <div className="token-cell">
                        <div className="token-cell-line">
                          {token._isRunner && <span className="token-runner-badge"><Rocket size={11} /> RUNNER</span>}
                          {token._isRugged && <span className="token-rugged-badge"><Skull size={11} /> RUGGED</span>}
                          {!token._isRugged && token._isDead && <span className="token-dead-badge">DEAD</span>}
                          <strong>${token.ticker}</strong>
                        </div>
                        <span className="token-name">{token.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`phase-badge ${token.phase}`}>
                        {token.phase === 'migrated' ? 'Migrated' : token.phase === 'soon' ? 'Soon' : token.phase === 'early' ? 'Early' : token.phase === 'new' ? 'New' : token.phase}
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
            <strong>{isScanning ? `Menganalisis ${selectedToken.ticker}` : 'Engine siap digunakan'}</strong>
            <p>{isScanning ? scanSteps[scanIndex] : 'Tempel CA atau pilih token dari feed untuk menjalankan 5 lapis analisis.'}</p>
          </div>
        </div>
      </section>

      <section className="result-section" id="result">
        {!selectedToken.ca && (
          <div className="result-empty-hint">
            <Sparkles size={18} />
            <div>
              <strong>Belum ada token yang dianalisis.</strong>
              <span>Tempel contract address di atas atau klik salah satu token pada feed untuk memulai. Hasil di bawah masih kosong sampai scan pertama dijalankan.</span>
            </div>
          </div>
        )}
        <div className="result-layout">
          <div className="meter-card">
            <div className={`verdict-chip ${report.verdict.tone}`} title={`Verdict ${report.verdict.tone} — ${report.verdict.instruction}`}>
              {report.verdict.tone === 'danger' && <ShieldAlert size={14} />}
              {report.verdict.tone === 'warn' && <AlertTriangle size={14} />}
              {report.verdict.tone === 'good' && <CheckCircle2 size={14} />}
              {report.verdict.label}
            </div>
            <div className="meter" style={{ '--needle-angle': `${meterAngle}deg` }}>
              <div className="meter-track" />
              <div className="meter-mask" />
              <div className="needle" />
              <div className="meter-center">
                <strong>{report.score}</strong>
              <span>Ape Meter</span>
              </div>
            </div>
            <div className="meter-scale">
              <span>Bahaya</span>
              <span>PvP</span>
              <span>Mulai matang</span>
              <span>Aman</span>
            </div>
          </div>

          <div className="tldr-card">
            <div className="token-title-row">
              <div>
                <span className="eyebrow compact">{cleanPublicCopy(selectedToken.source)}</span>
                <h2>{selectedToken.name} <small>{selectedToken.ticker ? `$${selectedToken.ticker}` : ''}</small></h2>
                <p>{selectedToken.ca || 'Belum ada contract yang dipilih.'}</p>
              </div>
              <button type="button" className="copy-btn" onClick={copyCa} disabled={!selectedToken.ca}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? 'Tersalin' : 'Salin CA'}
              </button>
            </div>

            <div className="ai-box">
              <span>Ringkasan AI</span>
              <p>{cleanPublicCopy(report.summary)}</p>
              {Number(selectedToken.flags?.priceDiscrepancyPct || 0) > 10 && (
                <div className="price-discrepancy-warning">
                  ⚠ Harga berbeda {Number(selectedToken.flags.priceDiscrepancyPct).toFixed(1)}% antar sumber (DexScreener / Birdeye / Jupiter). Validasi manual sebelum entry besar.
                </div>
              )}
              {isBlacklisted(selectedToken.ca) && (
                <div className="price-discrepancy-warning">
                  ⚠ Token ini terdaftar di blacklist lokal: {getBlacklistEntry(selectedToken.ca)?.reason || 'pernah ditandai'}
                </div>
              )}
            </div>

            <div className="source-grid">
              <SourcePill icon={DatabaseZap} label="Sumber data" value={cleanPublicCopy(selectedToken.source)} hint="Asal data: pair market, on-chain RPC, atau indeks pasar" />
              <SourcePill icon={Signal} label="Keyakinan data" value={`${report.confidence}%`} hint="Seberapa lengkap data yang menjadi dasar verdict (semakin tinggi = lebih banyak sumber tervalidasi)" />
              <SourcePill icon={ShieldAlert} label="Risiko utama" value={report.primaryRisk} hint="Risiko paling kritis yang ditemukan engine pada token ini" />
            </div>

            <div className="action-row">
              <a href={selectedToken.ca ? `https://trojan.com/@Ponyinnn?start=${selectedToken.ca}` : '#home'} target="_blank" rel="noreferrer">
                Buka di Trojan
              </a>
              <a href={selectedToken.url || (selectedToken.ca ? `https://dexscreener.com/solana/${selectedToken.ca}` : '#home')} target="_blank" rel="noreferrer">
                Lihat chart
              </a>
            </div>
          </div>
        </div>

        {/* Progressive deep-scan enrichment panels */}
        <RedFlagPanel redFlags={deepScan?.redFlags || []} />
        <BundleGraph bundle={deepScan?.stages?.holder?.bundle || deepScan?.stages?.bundle || null} />

        <DexScreenerChart token={selectedToken} />

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
          title="Setiap verdict berakar pada materi utama."
          text="Setiap keputusan diturunkan dari Bundle Token, Global Fees, Revoke & Minting, Dex Paid, Konfirmasi Candle, Membaca Holder, Instant Scalping, arsip Space X, dan sinyal pasar live."
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
              {principle.materiId && (
                <a
                  className="materi-link"
                  href={`/#${principle.materiId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`Buka materi ${principle.materiLabel} di Poyin Trading`}
                >
                  📚 Buka materi: {principle.materiLabel}
                  <ArrowRight size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <SectionHeader
          kicker="Cakupan Data"
          title="Live sekarang, forensik indexer menyusul."
          text="Data publik sudah cukup untuk discovery, pair, likuiditas, mint/freeze, dan timing marketing. Bukti penuh atas common funder, top holder, dev sell, dan fee exact tetap membutuhkan indexer on-chain yang lebih dalam."
        />
        <div className="roadmap-grid">
          <RoadmapCard title="Sudah live" text="Profil token, boost, data pair, mint authority on-chain, serta stream transaksi saat scan." />
          <RoadmapCard title="Membutuhkan indexer" text="Normalisasi top holder, graph common funder, retensi holder menit pertama, dan realized PnL wallet dev." />
          <RoadmapCard title="Roadmap berikutnya" text="Alert Telegram /ape, watchlist wallet ping, dan scoring personal sesuai gaya scalping atau swing." />
        </div>
      </section>

      <footer className="site-footer">
        <strong>Should I Ape?</strong>
        <span>Aplikasi monitoring real-time dalam ekosistem Ponyin. Feed utama tidak menggunakan daftar token statis.</span>
        <a className="footer-materi-link" href="/" target="_blank" rel="noreferrer">
          Pelajari materi Poyin Trading
          <ArrowRight size={14} />
        </a>
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
          <small>Ponyin Decision Engine</small>
        </div>
      </a>
      <div className="nav-links">
        <a href="#feed">Feed Live</a>
        <a href="#result">Ape Meter</a>
        <a href="#engine">Engine</a>
        <a href="#roadmap">Cakupan Data</a>
        <a href="/" target="_blank" rel="noreferrer" className="nav-link-external">
          Materi Ponyin <ArrowRight size={13} />
        </a>
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
          <strong>{status.error ? 'Sumber data sedang terganggu' : 'Sumber data live aktif'}</strong>
          <span>
            {status.error
              ? status.error
            : `${count} token Solana aktif${status.fetchedAt ? ` · refresh ${formatTime(status.fetchedAt)}` : ''} · ${formatStreamStatus(status)}`}
          </span>
          <ProviderHealthChips health={health} />
        </div>
      </div>
      <button type="button" onClick={onRefresh} disabled={status.loading}>
        <RefreshCw size={16} />
        {status.loading ? 'Memuat...' : 'Muat ulang'}
      </button>
    </div>
  );
}

function ProviderHealthChips({ health }) {
  const smartSize = Number(health?.smartWallets?.size || 0);
  const chips = [
    {
      label: health?.env?.madeOnSolKey ? 'indeks wallet aktif' : 'indeks wallet belum aktif',
      ok: Boolean(health?.env?.madeOnSolKey)
    },
    {
      label: health?.env?.heliusKey || health?.env?.solanaRpcUrl ? 'jalur on-chain stabil' : 'jalur on-chain publik',
      ok: Boolean(health?.env?.heliusKey || health?.env?.solanaRpcUrl)
    },
    {
      label: smartSize > 0 ? `${smartSize} smart wallet termuat` : 'registry smart wallet kosong',
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



function SourcePill({ icon: Icon, label, value, hint = '' }) {
  return (
    <div className="source-pill" title={hint || undefined}>
      <Icon size={18} />
      <div>
        <span>{label}{hint && <em className="metric-hint" aria-hidden="true">?</em>}</span>
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
          <span className="eyebrow compact">Forensik Real-Time</span>
          <h2>Monitoring real-time berbasis kerangka Ponyin</h2>
        </div>
        <span className={`live-chip ${status.streamConnected ? 'on' : 'off'}`}>
          <span />
          {status.streamConnected ? 'Stream live' : 'Menyambung ulang...'}
        </span>
      </div>

      <div className="forensic-grid">
        <MetricBox label="Harga" value={token.priceUsd ? `$${Number(token.priceUsd).toPrecision(4)}` : 'belum diketahui'} hint="Harga token saat ini dalam USD" />
        <MetricBox label="Umur live" value={formatLiveAge(token, now)} hint="Waktu sejak pair dibuat atau token pertama terdeteksi" />
        <MetricBox label="MCap / FDV" value={formatLiveMarketCap(token)} hint="Market Cap saat ini (FDV = Fully Diluted Valuation)" />
        <MetricBox label="Likuiditas" value={formatUsd(token.liquidityUsd)} hint="Total nilai LP di pair aktif" />
        <MetricBox label="Status LP" value={liquidityPool?.status || token.lpStatus || 'belum diketahui'} tone={token.liquidityUsd < 5000 && token.phase === 'migrated' ? 'danger' : token.liquidityUsd < 25000 ? 'warn' : 'good'} hint="Kondisi liquidity pool: bonding curve, terkunci, atau open" />
        <MetricBox label="Volume 5m / 1h" value={`${formatUsd(metrics.volume?.m5)} / ${formatUsd(metrics.volume?.h1)}`} hint="Total volume perdagangan dalam 5 menit dan 1 jam terakhir" />
        <MetricBox label="Transaksi 5m / 1h" value={`${metrics.txns?.m5 ?? flags.txns5m ?? '-'} / ${metrics.txns?.h1 ?? '-'}`} hint="Jumlah transaksi (buy + sell) dalam 5 menit dan 1 jam terakhir" />
        <MetricBox label="Buy / Sell 5m" value={`${metrics.buys?.m5 ?? flags.buys5m ?? 0} / ${metrics.sells?.m5 ?? flags.sells5m ?? 0}`} hint="Komposisi transaksi buy vs sell 5 menit terakhir" />
        <MetricBox label="Harga 5m / 1h" value={`${formatPct(token.priceChange?.m5)} / ${formatPct(token.priceChange?.h1)}`} tone={priceTone(token.priceChange?.m5)} hint="Perubahan harga (%) dalam 5 menit dan 1 jam terakhir" />
        <MetricBox label="Rasio Vol/LP" value={`${Number(flags.volumeLiquidityRatio || 0).toFixed(2)}×`} tone={flags.volumeLiquidityRatio > 5 ? 'danger' : flags.volumeLiquidityRatio > 2 ? 'warn' : 'good'} hint="Volume dibagi LP — rasio >5× berpotensi wash trading" />
        <MetricBox label="Supply Top 10" value={flags.top10Pct == null ? 'belum diketahui' : `${flags.top10Pct.toFixed(1)}%`} tone={flags.top10Pct > 55 ? 'danger' : flags.top10Pct > 40 ? 'warn' : 'good'} hint="Persentase supply yang dipegang 10 wallet teratas (di luar LP). >55% = red flag" />
        <MetricBox label="Owner unik" value={flags.uniqueOwnerCount ?? 'belum diketahui'} tone={flags.uniqueOwnerCount == null ? '' : flags.uniqueOwnerCount <= 3 ? 'danger' : flags.uniqueOwnerCount <= 6 ? 'warn' : 'good'} hint="Jumlah wallet unik di antara top holder. Sedikit = berisiko bundle" />
        <MetricBox label="Whale / Burner" value={`${flags.whales || 0} / ${flags.burners || 0}`} hint="Wallet whale (top holder besar) vs burner (alamat burn / dead)" />
        <MetricBox label="Jumlah pair" value={flags.dexPairCount ?? 'belum diketahui'} hint="Jumlah pair perdagangan aktif di seluruh DEX" />
      </div>

      <div className="forensic-columns">
        <div className="forensic-card">
          <h3>Snapshot Top Holder</h3>
          <p className="card-note">Akun LP/pool dipisahkan sehingga persentase top holder tidak ikut menghitung liquidity pool.</p>
          {insightSummary.length > 0 && (
            <div className="intel-summary">
              {insightSummary.slice(0, 4).map((item) => (
                <span key={item}>{cleanPublicCopy(item)}</span>
              ))}
            </div>
          )}
          <div className="holder-list">
            {holders.length ? holders.slice(0, 10).map((holder) => {
              const addr = holder.owner || holder.tokenAccount;
              return (
                <div className="holder-row" key={`${holder.rank}-${holder.tokenAccount}`}>
                  <span>#{holder.rank}</span>
                  <a
                    href={solscanAccountUrl(addr)}
                    target="_blank"
                    rel="noreferrer"
                    title={`Buka ${addr} di Solscan`}
                    className="address-link"
                  >
                    <strong>{shortAddress(addr)}</strong>
                  </a>
                  <em>{holder.pct == null ? 'belum diketahui' : `${holder.pct.toFixed(2)}%`}</em>
                  <small>{holder.label || holder.type || formatSol(holder.solBalance)}</small>
                </div>
              );
            }) : (
              <p className="muted-copy">Top holder belum tersedia. Gunakan jalur RPC privat untuk pembacaan holder yang lebih stabil.</p>
            )}
          </div>
          {excludedHolders.length > 0 && (
            <div className="excluded-note">
              {excludedHolders.length} akun pool/vault dikecualikan dari top holder.
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
                {liquidityPool.pairAddress ? (
                  <a
                    href={solscanAccountUrl(liquidityPool.pairAddress)}
                    target="_blank"
                    rel="noreferrer"
                    title={`Buka pair ${liquidityPool.pairAddress} di Solscan`}
                    className="address-link"
                  >
                    <strong>{shortAddress(liquidityPool.pairAddress)}</strong>
                  </a>
                ) : (
                  <strong>belum terindeks</strong>
                )}
              </div>
              {liquidityPool.excludedTopAccounts?.length > 0 && (
                <div className="holder-list compact">
                  {liquidityPool.excludedTopAccounts.slice(0, 4).map((holder) => {
                    const addr = holder.owner || holder.tokenAccount;
                    return (
                      <div className="holder-row" key={`lp-${holder.rank}-${holder.tokenAccount}`}>
                        <span>LP</span>
                        <a
                          href={solscanAccountUrl(addr)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Buka ${addr} di Solscan`}
                          className="address-link"
                        >
                          <strong>{shortAddress(addr)}</strong>
                        </a>
                        <em>{holder.pct == null ? 'belum diketahui' : `${holder.pct.toFixed(2)}%`}</em>
                        <small>{holder.label || holder.type || 'pool vault'}</small>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <p className="muted-copy">LP belum terbaca dari pair aktif. Jika token masih dalam fase bonding curve, tunggu pair DEX muncul.</p>
          )}
        </div>

        <div className="forensic-card">
          <h3>Skor Wallet Holder</h3>
          <div className="wallet-score-list">
            {walletIntel.length ? walletIntel.slice(0, 8).map((wallet) => (
              <div className="wallet-score-row" key={`${wallet.rank}-${wallet.owner || wallet.label}`}>
                <div>
                  {wallet.owner ? (
                    <a
                      href={solscanAccountUrl(wallet.owner)}
                      target="_blank"
                      rel="noreferrer"
                      title={`Buka ${wallet.owner} di Solscan`}
                      className="address-link"
                    >
                      <strong>#{wallet.rank} {wallet.label || shortAddress(wallet.owner)}</strong>
                    </a>
                  ) : (
                    <strong>#{wallet.rank} {wallet.label || 'holder'}</strong>
                  )}
                  <span>{wallet.type || 'holder'} · {wallet.pct == null ? 'supply belum diketahui' : `${wallet.pct.toFixed(2)}% supply`}</span>
                </div>
                <em>{wallet.score}</em>
                <small>{wallet.tags?.length ? wallet.tags.join(', ') : formatSol(wallet.solBalance)}</small>
              </div>
            )) : (
              <p className="muted-copy">Skor wallet belum tersedia. Data akan terisi saat analisis holder on-chain aktif.</p>
            )}
          </div>
        </div>

        <div className="forensic-card">
          <h3>Kecocokan Materi &amp; Space</h3>
          <p className="card-note">Verdict di atas berakar pada prinsip-prinsip berikut. Klik tombol untuk membuka materi lengkap di Poyin Trading.</p>
          <div className="rule-match-list">
            {report.knowledgeHits.map((hit) => {
              const principle = ponyinPrinciples.find((p) => p.id === hit.id);
              return (
                <div className="rule-match" key={hit.id}>
                  <strong>{cleanPublicCopy(hit.title)}</strong>
                  <span>{cleanPublicCopy(hit.source)}</span>
                  <p>{cleanPublicCopy(hit.rule)}</p>
                  {principle?.materiId && (
                    <a
                      className="materi-link compact"
                      href={`/#${principle.materiId}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Buka materi ${principle.materiLabel}`}
                    >
                      Buka materi: {principle.materiLabel}
                      <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              );
            })}
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
              <MetricMini label="Volume 24 jam" value={formatUsd(madeOnSol.volume24hUsd)} />
              <MetricMini label="MEV 5m" value={formatOptionalPct(readWindow(madeOnSol.mevVolumePct, '5m'))} />
              <MetricMini label="Aliran KOL" value={madeOnSol.kolActivity?.signal || 'belum ada'} />
              <MetricMini label="Deployer" value={madeOnSol.deployer?.tier || 'belum diketahui'} />
            </div>
          ) : (
            <p className="muted-copy">Intelijen indeks pasar belum tersedia. Data ini muncul ketika token sudah terbaca oleh sumber indeks tambahan.</p>
          )}
        </div>

        <div className="forensic-card">
          <h3>Kesehatan Data</h3>
          <div className="provider-list">
            <ProviderLine label="Data pair" ok={Boolean(token.rawProviders?.dexPair)} detail={token.pairDex ? `${token.pairDex} aktif` : cleanPublicCopy(token.source)} />
            <ProviderLine label="Authority on-chain" ok={Boolean(token.rawProviders?.mint)} detail={flags.mintRevoked == null ? 'authority belum diketahui' : `mint ${flags.mintRevoked ? 'sudah di-revoke' : 'masih terbuka'}`} />
            <ProviderLine label="Intel holder" ok={Boolean(token.rawProviders?.holderMeta)} detail={token.rawProviders?.holderMeta?.tokenIntelProvider ? cleanPublicCopy(token.rawProviders.holderMeta.tokenIntelProvider) : 'Helius key belum diatur — pembacaan holder tidak tersedia'} />
            <ProviderLine label="Indeks pasar" ok={Boolean(madeOnSol)} detail={madeOnSol ? 'data indeks tambahan aktif' : 'MadeOnSol key belum diatur'} />
            <ProviderLine label="Registry wallet" ok={Number(token.rawProviders?.holderMeta?.smartWalletRegistrySize || flags.smartWalletRegistrySize || 0) > 0} detail={`${token.rawProviders?.holderMeta?.smartWalletRegistrySize || flags.smartWalletRegistrySize || 0} smart wallet termuat. Tambahkan SMART_WALLETS pada env untuk mengaktifkan.`} />
            <ProviderLine label="Trade stream" ok={Boolean(token.rawProviders?.pump || flags.pumpPortalTradeSeen)} detail={flags.pumpPortalTradeSeen ? 'trade terbaru terbaca' : 'PumpPortal WS kadang terputus di browser; sumber pair tetap berjalan'} />
            <ProviderLine label="Order / boost" ok={(flags.activeBoosts || 0) > 0} detail={`${flags.activeBoosts || 0} order/boost aktif`} />
            <ProviderLine label="Keyakinan data live" ok={report.confidence >= 45} detail={`${report.confidence}% confidence — ${report.confidence < 45 ? 'tambahkan HELIUS_API_KEY pada env Vercel untuk menaikkan' : report.primaryRisk}`} />
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

function MetricBox({ label, value, tone = '', hint = '' }) {
  return (
    <div className={`metric-box ${tone}`} title={hint || undefined}>
      <span>{label}{hint && <em className="metric-hint" aria-hidden="true">?</em>}</span>
      <strong>{value ?? 'belum diketahui'}</strong>
    </div>
  );
}

function DexScreenerChart({ token }) {
  if (!token?.ca) return null;

  // DexScreener embed accepts pairAddress untuk hasil paling akurat,
  // fallback ke CA token. Theme dark + sembunyikan trade panel & info biar fokus chart.
  const target = token.pairAddress || token.ca;
  const src = `https://dexscreener.com/solana/${target}?embed=1&theme=dark&trades=0&info=0`;
  const fullUrl = token.pairAddress
    ? `https://dexscreener.com/solana/${token.pairAddress}`
    : `https://dexscreener.com/solana/${token.ca}`;

  return (
    <div className="dex-chart-panel">
      <div className="dex-chart-head">
        <div>
          <span className="eyebrow compact">Chart Live</span>
          <strong>{token.name} {token.ticker ? `· $${token.ticker}` : ''}</strong>
        </div>
        <a href={fullUrl} target="_blank" rel="noreferrer">Buka penuh di DexScreener →</a>
      </div>
      <div className="dex-chart-frame">
        <iframe
          key={target}
          src={src}
          title={`DexScreener chart ${token.ticker || token.ca}`}
          loading="lazy"
          allow="clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
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
        <span>{check.status === 'pass' ? 'AMAN' : check.status === 'fail' ? 'GAGAL' : 'WASPADA'}</span>
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
  if (String(message).includes('Health endpoint')) return 'Status data belum tersedia pada pratinjau lokal';
  if (message === 'PumpPortal websocket error') return 'Stream transaksi sedang bermasalah';
  if (message === 'PumpPortal reconnecting') return 'Stream transaksi sedang menyambung ulang';
  if (message === 'No live tokens returned from DexScreener') return 'Belum ada token live dari sumber pair';
  return cleanPublicCopy(message);
}

function formatStreamStatus(status) {
  if (!status.streamConnected) return 'stream transaksi sedang menyambung ulang · data pair tetap aktif';
  if (!status.streamLastTokenAt) return 'stream transaksi tersambung · menunggu token baru';

  const seconds = Math.max(0, Math.floor((Date.now() - status.streamLastTokenAt) / 1000));
  if (seconds < 45) return `stream live · data ${seconds} detik lalu`;
  if (seconds < 180) return `stream sepi ${Math.floor(seconds / 60)} menit · data pair tetap aktif`;
  return 'stream belum mengirim data baru · data pair tetap aktif';
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
    // _fetchedAt = first time this token appeared in our feed (keep old)
    // _lastSeenAt = last time this token was seen from API (always update)
    const fetchedAt = previous?._fetchedAt || t._fetchedAt || Date.now();
    const enriched = {
      ...previous,
      ...t,
      _fetchedAt: fetchedAt,
      _lastSeenAt: Date.now(),
    };
    // Untuk token DexScreener, selalu pertahankan pairCreatedAt yang paling awal
    if (previous?.pairCreatedAt && !t.pairCreatedAt) {
      enriched.pairCreatedAt = previous.pairCreatedAt;
    }
    map.set(t.ca, enriched);
  });
  return Array.from(map.values()).sort((a, b) => {
    const rankA = feedRank(a);
    const rankB = feedRank(b);
    if (rankA !== rankB) return rankB - rankA;

    // Prioritas: pairCreatedAt (umur token asli) > _lastSeenAt > _fetchedAt
    const ageA = a.pairCreatedAt || a._lastSeenAt || a._fetchedAt || Date.now();
    const ageB = b.pairCreatedAt || b._lastSeenAt || b._fetchedAt || Date.now();
    return ageB - ageA;
  });
}

function pruneTokens(tokens) {
  const now = Date.now();
  const maxTokens = 220;

  // Push semua snapshot ke history store dulu — analisis rug & runner butuh ini.
  for (const token of tokens) {
    if (token?.ca) pushSnapshot(token.ca, token);
  }

  const annotated = tokens
    .filter((t) => Boolean(t?.ca))
    .map((token) => {
      const report = analyzeToken(token);
      const rug = analyzeRug(token);
      const runner = analyzeRunner(token);

      // Persistent blacklist check — sekali rugged, masuk Dead tab sampai TTL habis
      const blacklistEntry = getBlacklistEntry(token.ca);
      const isBlacklistedToken = Boolean(blacklistEntry);

      // Tambahkan ke blacklist kalau confirmed rugged / critical level
      if (rug.isRugged || rug.level === 'critical') {
        addToBlacklist(token.ca, {
          reason: rug.reasons.slice(0, 2).join('; ') || 'rug pattern terdeteksi',
          level: rug.level
        });
      }

      const isDead = rug.isDead || rug.isRugged || isBlacklistedToken || rug.level === 'critical' || rug.level === 'high';

      return {
        ...token,
        _report: report,
        _rug: rug,
        _runner: runner,
        _isDead: isDead,
        _isRugged: rug.isRugged || isBlacklistedToken,
        _isRunner: runner.isRunner,
        _runnerScore: runner.runnerScore,
        _blacklistEntry: blacklistEntry
      };
    });

  const filtered = annotated.filter((token) => {
    const report = token._report;
    const isPumpBondingCurve = token.provider === 'PumpPortal live websocket'
      || token.provider === 'Pump.fun frontend API'
      || token.lpStatus === 'Bonding curve';
    const lastSeenAgeMins = ((now - (token._lastSeenAt || token._fetchedAt || now)) / 60000);
    const entryScore = computeEntryScore(token, report);
    const isStrong = entryScore >= 74
      || report.score >= 68
      || token.liquidityUsd >= 30000
      || token.flags?.reportedVolume >= 50000
      || token._isRunner;

    // Token mati / rugged jangan dibuang — biar masuk tab Dead. Tapi tetap batasi umur.
    if (token._isDead) {
      // Tab Dead: simpan maksimal 1 hari
      const ageInFeed = lastSeenAgeMins;
      if (ageInFeed > 1440) return false;
      return true;
    }

    // Filter lemah
    if (entryScore < 38) return false;
    if (report.score <= 28 && entryScore < 60) return false;
    if (isPumpBondingCurve && entryScore < 50 && !token._isRunner) return false;
    if (!isPumpBondingCurve && token.liquidityUsd < 5000) return false;
    if (!isPumpBondingCurve && token.flags?.volumeLiquidityRatio > 12) return false;
    if (!isPumpBondingCurve && token.flags?.sells5m > (token.flags?.buys5m * 3.5) + 10) return false;

    // Sebelum tampil di feed normal, double-check pakai rug analyzer
    if (token._rug?.level === 'critical') return true; // tampil di Dead, sudah di-flag isDead di atas
    if (token._rug?.level === 'high') return true;

    // Token yang gak muncul di refresh tetap dipertahankan lebih lama (4 jam), asal pernah strong
    if (!isPumpBondingCurve && lastSeenAgeMins > 240 && !isStrong) return false;

    if (isPumpBondingCurve) {
      const feedAgeMins = token._fetchedAt ? (now - token._fetchedAt) / 60000 : 0;
      if (feedAgeMins > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (lastSeenAgeMins > 120 && !isStrong) return false;
    } else if (token.pairCreatedAt) {
      const ageMins = (now - token.pairCreatedAt) / 60000;
      if (ageMins > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (ageMins > 360 && !isStrong) return false;
    } else if (token.ageMinutes !== null) {
      if (token.ageMinutes > LIVE_FEED_MAX_AGE_MINUTES) return false;
      if (token.ageMinutes > 360 && !isStrong) return false;
    }

    return true;
  });

  if (filtered.length > maxTokens) {
    return filtered
      .sort((a, b) => feedRank(b) - feedRank(a))
      .slice(0, maxTokens);
  }

  return filtered;
}

function feedRank(token) {
  const now = Date.now();
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket'
    || token.provider === 'Pump.fun frontend API'
    || token.lpStatus === 'Bonding curve';
  const ageMinutes = token.pairCreatedAt ? Math.max(0, (now - token.pairCreatedAt) / 60000) : 0;
  const lastSeenAge = token._lastSeenAt ? Math.max(0, (now - token._lastSeenAt) / 1000) : 0;
  const txns = Number(token.flags?.txns5m || 0);
  const volume = Number(token.flags?.reportedVolume || 0);
  const liquidity = Number(token.liquidityUsd || 0);
  const entryScore = computeEntryScore(token);

  let score = entryScore * 8
    + (isPumpBondingCurve ? -120 : 0)
    + Math.max(0, 180 - Math.abs(ageMinutes - 90))
    + Math.max(0, 120 - lastSeenAge)
    + Math.min(txns * 3, 180)
    + Math.min(volume / 100, 120)
    + Math.min(liquidity / 1000, 80);

  if (token._isRunner) {
    const runnerScore = Number(token._runnerScore || 0);
    score += 320 + runnerScore * 2;
  }

  if (token._isDead) {
    score -= 1200;
  }

  return score;
}

function pipelineCount(tokens, key) {
  if (key === 'all') return tokens.filter((t) => !t._isDead).length;
  if (key === 'dead') return tokens.filter((t) => t._isDead).length;
  if (key === 'runner') return tokens.filter((t) => t._isRunner && !t._isDead).length;
  return tokens.filter((t) => t.phase === key && !t._isDead).length;
}

function filterByPipeline(token, key) {
  if (key === 'dead') return Boolean(token._isDead);
  if (key === 'runner') return Boolean(token._isRunner) && !token._isDead;
  if (key === 'all') return !token._isDead;
  return token.phase === key && !token._isDead;
}

function getFeedHealth(token) {
  const now = Date.now();
  const lastSeenAge = token._lastSeenAt ? (now - token._lastSeenAt) / 1000 : 0;
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket'
    || token.provider === 'Pump.fun frontend API'
    || token.lpStatus === 'Bonding curve';
  const entryScore = computeEntryScore(token);

  if (token._isRugged) return { tone: 'danger', label: 'RUGGED' };
  if (token._isDead) return { tone: 'danger', label: 'DEAD' };
  if (token._isRunner && (token._runnerScore || 0) >= 70) return { tone: 'live', label: 'RUNNER' };
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
  const isPumpBondingCurve = token.provider === 'PumpPortal live websocket'
    || token.provider === 'Pump.fun frontend API'
    || token.lpStatus === 'Bonding curve';
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

function solscanAccountUrl(address) {
  if (!address) return null;
  return `https://solscan.io/account/${encodeURIComponent(address)}`;
}

function solscanTokenUrl(address) {
  if (!address) return null;
  return `https://solscan.io/token/${encodeURIComponent(address)}`;
}

function formatLiveAge(token, currentTime = Date.now()) {
  if (!token?.ca) return '-';

  // Umur token = dari saat pair dibuat (DexScreener) atau saat pertama kali terlihat (PumpPortal/bonding)
  // Prioritas: pairCreatedAt (paling akurat) > _fetchedAt (first seen di feed) > _lastSeenAt (last update)
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
  // bonding curve token
  if (token.lpStatus === 'Bonding curve' || token.phase === 'new') {
    const mc = token.marketCap;
    if (typeof mc === 'number') return `${formatUsd(mc)} (bonding)`;
    if (mc && mc !== 'bonding' && mc !== '-') return `${mc} (bonding)`;
    return 'bonding';
  }
  const mc = token.marketCap;
  if (typeof mc === 'number') return formatUsd(mc);
  if (typeof mc === 'string' && mc.startsWith('$')) return mc; // already formatted
  if (mc) return String(mc);
  return 'belum diketahui';
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
  if (!Number.isFinite(num) || num <= 0) return 'belum diketahui';
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
