import { Session } from '../types';

interface Props {
  sessions: Session[];
  onSelect: (sessionKey: string) => void;
}

export default function SessionList({ sessions, onSelect }: Props) {
  if (sessions.length === 0) {
    return <div className="session-list-empty">No active sessions</div>;
  }

  return (
    <div className="session-list">
      <h3 className="section-title">Active Sessions</h3>
      {sessions.map(s => (
        <div key={s.key} className="session-item" onClick={() => onSelect(s.key)}>
          <div className="session-item-top">
            <span className="session-agent">{s.agentId}</span>
            <span className="session-kind">{s.kind}</span>
          </div>
          <div className="session-item-bottom">
            <span className="session-key-label">{s.key}</span>
            {s.lastActivity && (
              <span className="session-time">{new Date(s.lastActivity).toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
