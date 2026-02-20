import { Agent } from '../types';

interface Props {
  agents: Agent[];
  onAssignTask: (agent: Agent) => void;
  onCheckMemory: (agent: Agent) => void;
  onRestartGateway: () => void;
  onOpenSettings: () => void;
}

export default function QuickActions({ agents, onAssignTask, onCheckMemory, onRestartGateway, onOpenSettings }: Props) {
  return (
    <div className="quick-actions">
      <h3 className="section-title">Quick Actions</h3>

      <div className="qa-group">
        <h4 className="qa-group-title">Assign Task</h4>
        {agents.map(a => (
          <button key={a.id} className="btn qa-btn" style={{ '--agent-color': a.color } as React.CSSProperties} onClick={() => onAssignTask(a)}>
            {a.emoji} {a.name}
          </button>
        ))}
      </div>

      <div className="qa-group">
        <h4 className="qa-group-title">Check Memory</h4>
        {agents.map(a => (
          <button key={a.id} className="btn qa-btn" style={{ '--agent-color': a.color } as React.CSSProperties} onClick={() => onCheckMemory(a)}>
            📝 {a.name}
          </button>
        ))}
      </div>

      <div className="qa-group">
        <h4 className="qa-group-title">System</h4>
        <button className="btn qa-btn qa-system" onClick={onRestartGateway}>🔄 Gateway Status</button>
        <button className="btn qa-btn qa-system" onClick={onOpenSettings}>⚙️ Settings</button>
      </div>
    </div>
  );
}
