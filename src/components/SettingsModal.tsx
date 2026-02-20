import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: Props) {
  const [token, setToken] = useState(() => localStorage.getItem('oc_token') || '');
  const [wsUrl, setWsUrl] = useState(() => localStorage.getItem('oc_ws_url') || 'ws://127.0.0.1:18789');

  const save = () => {
    localStorage.setItem('oc_token', token);
    localStorage.setItem('oc_ws_url', wsUrl);
    onClose();
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">🐙 Gateway Connection</h2>

        <label className="modal-label">
          Gateway WebSocket URL
          <input className="modal-input" value={wsUrl} onChange={e => setWsUrl(e.target.value)} placeholder="ws://127.0.0.1:18789" />
        </label>

        <label className="modal-label">
          Auth Token
          <input className="modal-input" type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="Enter gateway token..." />
        </label>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save & Reconnect</button>
        </div>
      </div>
    </div>
  );
}
