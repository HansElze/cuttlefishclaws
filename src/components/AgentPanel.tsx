import type { Agent } from '../App'

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
}

export default function AgentPanel({ agent, selected, onClick }: Props) {
  const statusColor =
    agent.status === 'online'
      ? '#10b981'
      : agent.status === 'thinking'
        ? '#f59e0b'
        : '#64748b'

  const statusLabel =
    agent.status === 'online'
      ? 'Online'
      : agent.status === 'thinking'
        ? 'Thinking...'
        : 'Offline'

  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-4 border transition-all min-w-[220px] lg:min-w-0"
      style={{
        background: selected ? 'var(--ocean-lighter)' : 'var(--ocean-light)',
        borderColor: selected ? agent.color + '66' : 'var(--cyan-dim)',
        boxShadow: selected ? `0 0 12px ${agent.color}33` : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{agent.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm">{agent.name}</div>
          <div className="text-xs text-slate-400 truncate">{agent.role}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-2 h-2 rounded-full ${agent.status === 'online' ? 'status-blink' : ''}`}
            style={{ background: statusColor }}
          />
          <span className="text-xs" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-slate-500">Model</div>
          <div className="text-slate-300 truncate">{agent.model}</div>
        </div>
        <div>
          <div className="text-slate-500">Trust</div>
          <div className="flex items-center gap-1">
            <div
              className="h-1.5 rounded-full flex-1"
              style={{ background: 'var(--ocean)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${agent.trustScore}%`,
                  background: agent.color,
                }}
              />
            </div>
            <span style={{ color: agent.color }}>{agent.trustScore}</span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-slate-500">Last Active</div>
          <div className="text-slate-300">{agent.lastActive}</div>
        </div>
      </div>
    </button>
  )
}
