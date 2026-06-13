import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, ExternalLink, BadgeCheck } from 'lucide-react';
import { signOut } from '../../services/auth';
import { useAuth } from './AuthGate';

export default function UserChip() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!auth?.profile) return null;

  const { profile } = auth;
  const handle = profile.x_handle || 'user';
  const initial = handle.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    setOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.warn('[UserChip] logout failed:', err);
    }
  };

  return (
    <div className="user-chip-wrap" ref={wrapRef}>
      <button
        type="button"
        className="user-chip"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="user-chip-avatar">
          {profile.x_avatar ? <img src={profile.x_avatar} alt="" /> : initial}
        </span>
        <span className="user-chip-handle">
          <span>@{handle}</span>
          <small>{profile.follow_claimed ? 'Follower terverifikasi' : 'Belum follow'}</small>
        </span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="user-chip-menu" role="menu">
          <div className="user-chip-menu-info">
            <strong>@{handle}</strong>
            <small>
              {profile.follow_claimed
                ? 'Status: follower @ponyin (klaim)'
                : 'Status: belum klaim follow'}
            </small>
          </div>
          <a
            href={`https://x.com/${handle}`}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
          >
            <ExternalLink size={14} />
            Lihat profil X
          </a>
          {profile.follow_claimed && (
            <span style={{ padding: '8px 12px', fontSize: '0.78rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BadgeCheck size={14} />
              Akses penuh aktif
            </span>
          )}
          <button type="button" className="danger" onClick={handleLogout} role="menuitem">
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
