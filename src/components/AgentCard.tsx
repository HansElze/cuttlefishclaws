import { Agent } from '../types';

interface Props {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
}

const TRUST_SCORES: Record<string, number> = { main: 95, trib: 88, reef: 82 };

export default function AgentCard({ agent, selected, onSelect }: Props) {
  const trust = TRUST_SCORES[agent.id] || 80;

  return (
    <div
      className={`agent-card ${selected ? 'selected' : ''}`}
      style={{ '--agent-color': agent.color } as React.CSSProperties}
      onClick={onSelect}
    >
      <div className="agent-card-header">
        <span className="agent-emoji">{agent.emoji}</span>
        <div className="agent-info">
          <span className="agent-name">{agent.name}</span>
          <span className="agent-role">{agent.role}</span>
        </div>
        <span className={`status-dot ${agent.online ? 'online' : 'offline'}`} />
      </div>
      <div className="agent-card-meta">
        <span>{agent.id}</span>
        {agent.online && agent.activeSessions > 0 && (
          <span>{agent.activeSessions} session{agent.activeSessions !== 1 ? 's' : ''}</span>
        )}
        {!agent.online && <span>offline</span>}
      </div>
      <div className="trust-bar-container">
        <div className="trust-bar-label">
          <span>Trust</span>
          <span style={{ color: agent.color }}>{trust}</span>
        </div>
        <div className="trust-bar">
          <div
            className="trust-bar-fill"
            style={{ width: `${trust}%`, background: agent.color }}
          />
        </div>
      </div>
    </div>
  );
}
