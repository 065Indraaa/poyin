import { getSnapshots, getVelocity, getFirst } from './snapshotStore';

export function analyzeRunner(token) {
  if (!token?.ca) return emptyResult();

  const snapshots = getSnapshots(token.ca);
  const flags = token.flags || {};
  const priceChange = token.priceChange || {};
  const liquidityUsd = Number(token.liquidityUsd || 0);
  const lpStatus = String(token.lpStatus || '').toLowerCase();
  const isBondingCurve = token.provider === 'PumpPortal live websocket'
    || token.provider === 'Pump.fun frontend API'
    || lpStatus.includes('bonding');

  const txns5m = Number(flags.txns5m || 0);
  const buys5m = Number(flags.buys5m || 0);
  const sells5m = Number(flags.sells5m || 0);
  const volume5m = Number(flags.reportedVolume || 0);
  const volumeRatio = Number(flags.volumeLiquidityRatio || 0);

  // Hard exclusions — token tidak boleh jadi runner kalau kondisi ini terjadi
  if (isBondingCurve && liquidityUsd === 0) return emptyResult();
  if (liquidityUsd < 4000) return emptyResult();
  if ((priceChange.h1 || 0) < -10) return emptyResult();
  if ((priceChange.m5 || 0) < -8) return emptyResult();
  if (sells5m > buys5m * 1.8) return emptyResult();
  if (volumeRatio > 7) return emptyResult();

  // Age sweet spot 5min - 6jam (untuk pair) atau new bonding
  const ageMinutes = token.ageMinutes
    || (token.pairCreatedAt ? Math.floor((Date.now() - token.pairCreatedAt) / 60000) : null);
  if (ageMinutes != null) {
    if (ageMinutes > 8 * 60) return emptyResult();
  }

  let score = 0;
  const signals = [];

  // 1. Price momentum
  if ((priceChange.m5 || 0) > 3) {
    score += 14;
    signals.push(`m5 +${priceChange.m5.toFixed(1)}%`);
  }
  if ((priceChange.h1 || 0) > 8 && (priceChange.h1 || 0) < 250) {
    score += 14;
    signals.push(`h1 +${priceChange.h1.toFixed(1)}%`);
  }

  // 2. Buy dominance
  const totalTx = buys5m + sells5m;
  const buyRatio = totalTx > 0 ? buys5m / totalTx : 0.5;
  if (buyRatio >= 0.62 && totalTx >= 15) {
    score += 16;
    signals.push(`buy ratio ${(buyRatio * 100).toFixed(0)}%`);
  } else if (buyRatio >= 0.55 && totalTx >= 25) {
    score += 8;
    signals.push(`buy ratio ${(buyRatio * 100).toFixed(0)}%`);
  }

  // 3. Real volume (volume tinggi tanpa wash signal)
  if (volume5m > liquidityUsd * 0.5 && volume5m < liquidityUsd * 4 && totalTx >= 20) {
    score += 14;
    signals.push(`vol/LP ${volumeRatio.toFixed(2)}x sehat`);
  }

  // 4. Velocity dari snapshot
  const velocity = getVelocity(token.ca);
  if (velocity) {
    if (velocity.priceTrend > 0.3 && velocity.priceM5Delta > 0) {
      score += 14;
      signals.push('momentum naik konsisten');
    }
    if (velocity.volume5mTrend > 0.3 && velocity.volume5mDelta > 0) {
      score += 12;
      signals.push('volume akselerasi');
    }
    if (velocity.txnsTrend > 0.3 && velocity.txnsDelta > 0) {
      score += 8;
      signals.push('transaksi naik');
    }
    if (velocity.buyRatioTrend > 0.2) {
      score += 6;
      signals.push('buy pressure menguat');
    }
    if (velocity.liquidityRatePerMin > 0) {
      score += 4;
      signals.push('LP nambah');
    } else if (velocity.liquidityRatePerMin < -50) {
      score -= 10;
    }
  } else if (snapshots.length < 2) {
    // Tanpa history, tidak bisa konfirmasi runner — beri grace tapi cap rendah
    if ((priceChange.m5 || 0) > 12 && totalTx >= 30 && buyRatio >= 0.6) {
      score += 18;
      signals.push('momentum awal kuat (belum ada history)');
    }
  }

  // 5. Bonus LP cukup besar
  if (liquidityUsd >= 20000) score += 4;
  if (liquidityUsd >= 60000) score += 4;

  // 6. Aktivitas mature
  if (txns5m >= 50) {
    score += 6;
    signals.push(`${txns5m} tx/5m`);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const isRunner = score >= 60 && signals.length >= 3 && (velocity ? velocity.priceTrend >= 0 : true);

  return {
    isRunner,
    runnerScore: score,
    signals,
    hasHistory: snapshots.length >= 2,
    ageMinutes
  };
}

function emptyResult() {
  return { isRunner: false, runnerScore: 0, signals: [], hasHistory: false, ageMinutes: null };
}
