import { useEffect } from 'react';

/**
 * useSecurity — Proteksi konten web:
 *   • Blokir klik kanan / context menu
 *   • Blokir copy, cut, paste, drag, selectstart
 *   • Blokir PrintScreen, Ctrl+A, Ctrl+S, Ctrl+C/X/V
 */
export function useSecurity() {
  useEffect(() => {
    /* ── 1. Blokir klik kanan ─────────────────────────────────── */
    const blockContextMenu = (e) => { e.preventDefault(); return false; };

    /* ── 2. Blokir clipboard & drag & select ─────────────────── */
    const blockAction = (e) => { e.preventDefault(); return false; };

    /* ── 3. Blokir keyboard shortcuts copy/screenshot ─────────── */
    const blockKeys = (e) => {
      const key = (e.key || '').toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (e.keyCode === 44)  { e.preventDefault(); return false; }                   // PrintScreen
      if (ctrl && key === 'S') { e.preventDefault(); return false; }                 // Ctrl+S (Save)
      if (ctrl && key === 'A') { e.preventDefault(); return false; }                 // Ctrl+A (Select All)
      if (ctrl && ['C','X','V'].includes(key)) { e.preventDefault(); return false; } // Ctrl+C/X/V
    };

    /* ── Attach semua listeners ──────────────────────────────── */
    document.addEventListener('contextmenu',  blockContextMenu, true);
    document.addEventListener('copy',         blockAction,      true);
    document.addEventListener('cut',          blockAction,      true);
    document.addEventListener('paste',        blockAction,      true);
    document.addEventListener('dragstart',    blockAction,      true);
    document.addEventListener('selectstart',  blockAction,      true);
    document.addEventListener('keydown',      blockKeys,        true);

    return () => {
      document.removeEventListener('contextmenu',  blockContextMenu, true);
      document.removeEventListener('copy',         blockAction,      true);
      document.removeEventListener('cut',          blockAction,      true);
      document.removeEventListener('paste',        blockAction,      true);
      document.removeEventListener('dragstart',    blockAction,      true);
      document.removeEventListener('selectstart',  blockAction,      true);
      document.removeEventListener('keydown',      blockKeys,        true);
    };
  }, []);
}
