import { useEffect } from 'react';

/**
 * useSecurity — Proteksi konten web:
 *   • Blokir klik kanan / context menu
 *   • Blokir copy, cut, paste, drag, selectstart
 *   • Blokir keyboard shortcuts berbahaya (F12, Ctrl+Shift+I/J/C, Ctrl+U/S/A/C/X/V, PrintScreen)
 *   • Deteksi DevTools terbuka via resize heuristic → redirect ke layar hitam
 */
export function useSecurity() {
  useEffect(() => {
    /* ── 1. Blokir klik kanan ─────────────────────────────────── */
    const blockContextMenu = (e) => { e.preventDefault(); return false; };

    /* ── 2. Blokir clipboard & drag & select ─────────────────── */
    const blockAction = (e) => { e.preventDefault(); return false; };

    /* ── 3. Blokir keyboard shortcuts berbahaya ─────────────── */
    const blockKeys = (e) => {
      const key = (e.key || '').toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.keyCode === 123) { e.preventDefault(); return false; }                          // F12
      if (ctrl && e.shiftKey && ['I','J','C'].includes(key)) { e.preventDefault(); return false; } // Ctrl+Shift+I/J/C
      if (ctrl && key === 'U') { e.preventDefault(); return false; }                        // Ctrl+U (View Source)
      if (ctrl && key === 'S') { e.preventDefault(); return false; }                        // Ctrl+S
      if (ctrl && key === 'A') { e.preventDefault(); return false; }                        // Ctrl+A (Select All)
      if (ctrl && ['C','X','V'].includes(key)) { e.preventDefault(); return false; }        // Ctrl+C/X/V
      if (e.keyCode === 44)  { e.preventDefault(); return false; }                          // PrintScreen
    };

    /* ── 4. Deteksi DevTools via resize heuristic ────────────── */
    const BLOCKED_HTML =
      '<div style="display:flex;flex-direction:column;align-items:center;' +
      'justify-content:center;height:100vh;background:#000;color:#fff;' +
      'font-family:sans-serif;text-align:center;padding:2rem;gap:12px;">' +
      '<span style="font-size:2.5rem;">🔒</span>' +
      '<span style="font-size:1.4rem;font-weight:600;">Konten ini dilindungi.</span>' +
      '<span style="font-size:.95rem;opacity:.5;">Tutup Developer Tools dan muat ulang halaman.</span>' +
      '</div>';

    const detectDevTools = () => {
      const wDiff = window.outerWidth  - window.innerWidth;
      const hDiff = window.outerHeight - window.innerHeight;
      if (wDiff > 160 || hDiff > 160) {
        document.body.innerHTML = BLOCKED_HTML;
      }
    };

    /* ── Attach semua listeners ──────────────────────────────── */
    document.addEventListener('contextmenu',  blockContextMenu, true);
    document.addEventListener('copy',         blockAction,      true);
    document.addEventListener('cut',          blockAction,      true);
    document.addEventListener('paste',        blockAction,      true);
    document.addEventListener('dragstart',    blockAction,      true);
    document.addEventListener('selectstart',  blockAction,      true);
    document.addEventListener('keydown',      blockKeys,        true);
    window.addEventListener('resize',         detectDevTools);

    detectDevTools(); // cek sekali saat mount

    return () => {
      document.removeEventListener('contextmenu',  blockContextMenu, true);
      document.removeEventListener('copy',         blockAction,      true);
      document.removeEventListener('cut',          blockAction,      true);
      document.removeEventListener('paste',        blockAction,      true);
      document.removeEventListener('dragstart',    blockAction,      true);
      document.removeEventListener('selectstart',  blockAction,      true);
      document.removeEventListener('keydown',      blockKeys,        true);
      window.removeEventListener('resize',         detectDevTools);
    };
  }, []);
}
