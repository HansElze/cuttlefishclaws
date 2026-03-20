import { AGENTS } from '../../lib/mockData'

interface Props {
  onOpenChat: (agentId: string) => void
}

export default function AgentsSection({ onOpenChat }: Props) {
  const govAgents = AGENTS.filter(a => a.type === 'governance')
  const invAgents = AGENTS.filter(a => a.type === 'investor')
  const sysAgents = AGENTS.filter(a => a.type === 'system')

  return (
    <section id="agents" className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal">
          <p className="section-label">AI-Native Operations</p>
          <h2 className="section-title">
            Agent<br />
            <em>Directory</em>
          </h2>
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[560px] leading-[2] mt-4 mb-10">
            Constitutional AI agents govern the campus. Each operates within 
            bounded constraints defined in SOUL.md and CONSTITUTION.md. 
            TrustGraph scores all actions.
          </p>
        </div>

        {/* Governance Agents */}
        <div className="mb-12">
          <h3 className="text-[9px] tracking-[0.18em] text-[rgba(255,160,0,0.4)] uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
            Governance Agents
          </h3>
          <div className="agents-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {govAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onChat={onOpenChat} />
            ))}
          </div>
        </div>

        {/* Investor Agents */}
        <div className="mb-12">
          <h3 className="text-[9px] tracking-[0.18em] text-[rgba(255,160,0,0.4)] uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--amber)]" />
            Investor Agents
          </h3>
          <div className="agents-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {invAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onChat={onOpenChat} />
            ))}
          </div>
        </div>

        {/* System Agents */}
        <div>
          <h3 className="text-[9px] tracking-[0.18em] text-[rgba(255,160,0,0.4)] uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--purple)]" />
            System Contracts
          </h3>
          <div className="agents-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {sysAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onChat={onOpenChat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface AgentCardProps {
  agent: typeof AGENTS[number]
  onChat: (id: string) => void
}

function AgentCard({ agent, onChat }: AgentCardProps) {
  return (
    <div className="reveal p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.02)] hover:border-[var(--amber2)] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
            style={{ 
              background: `${agent.color}18`,
              border: `1px solid ${agent.color}44`,
              color: agent.color
            }}
          >
            {agent.name[0]}
          </div>
          <div>
            <h4 className="font-display text-[16px] font-semibold text-white">
              {agent.name}
            </h4>
            <div className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.5)]">
              {agent.role}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className={`w-1.5 h-1.5 rounded-full ${
              agent.status === 'online' ? 'bg-[var(--green)]' :
              agent.status === 'standby' ? 'bg-[var(--amber)]' : 'bg-[var(--purple)]'
            } animate-[pulse-dot_2s_ease-in-out_infinite]`}
          />
          <span className="text-[8px] tracking-[0.1em] uppercase text-[rgba(255,160,0,0.4)]">
            {agent.status}
          </span>
        </div>
      </div>

      <p className="text-[10px] tracking-[0.04em] text-[rgba(255,160,0,0.55)] leading-[1.8] mb-4">
        {agent.description}
      </p>

      {agent.trustScore && (
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] uppercase">
            Trust
          </div>
          <div className="flex-1 h-1 bg-[rgba(255,140,0,0.1)] rounded overflow-hidden">
            <div 
              className="h-full bg-[var(--green)]"
              style={{ width: `${agent.trustScore}%` }}
            />
          </div>
          <div className="text-[10px] tracking-[0.05em] text-[var(--green)]">
            {agent.trustScore}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.files.slice(0, 3).map((file, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-[8px] tracking-[0.08em] border border-[var(--border)] text-[rgba(255,160,0,0.5)]"
          >
            {file.name}
          </span>
        ))}
        {agent.files.length > 3 && (
          <span className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.3)]">
            +{agent.files.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.35)]">
          {agent.version}
        </span>
        <button
          onClick={() => onChat(agent.id)}
          className="px-3 py-1 text-[8px] tracking-[0.1em] uppercase border border-[var(--amber2)] text-[var(--amber)] bg-[rgba(255,140,0,0.08)] hover:bg-[rgba(255,140,0,0.18)] transition-all cursor-pointer font-mono"
        >
          Chat &rarr;
        </button>
      </div>
    </div>
  )
}
