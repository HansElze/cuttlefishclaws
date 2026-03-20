import { useState } from 'react'
import { SCENARIOS } from '../../lib/mockData'

interface Props {
  unlocked: boolean
  onUnlock: (code: string) => boolean
  onLock: () => void
}

export default function ReturnsSection({ unlocked, onUnlock, onLock }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onUnlock(code)) {
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!unlocked) {
    return (
      <section id="returns" className="px-8 py-20">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="reveal">
            <div className="w-16 h-16 mx-auto mb-6 border border-[var(--amber2)] flex items-center justify-center">
              <span className="text-[24px] text-[var(--amber)]">&#x1F512;</span>
            </div>
            <h2 className="font-display text-[28px] font-semibold text-white mb-2">
              VC Access Required
            </h2>
            <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] mb-8">
              Return projections are restricted to verified investors.
              Enter your access code to view scenario analysis.
            </p>

            <form onSubmit={handleSubmit} className="max-w-[320px] mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ENTER ACCESS CODE"
                  className={`w-full px-4 py-3 bg-[rgba(255,140,0,0.04)] border ${
                    error ? 'border-red-500' : 'border-[var(--border)]'
                  } focus:border-[var(--amber2)] outline-none text-center text-[12px] tracking-[0.2em] text-[var(--amber)] placeholder:text-[rgba(255,160,0,0.3)] font-mono`}
                />
                {error && (
                  <div className="mt-2 text-[9px] text-red-400">
                    Invalid access code
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Unlock Returns
              </button>
            </form>

            <p className="mt-6 text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.35)]">
              Request access at invest@cuttlefish.ai
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="returns" className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="section-label">Confidential</p>
            <h2 className="section-title">
              Return<br />
              <em>Scenarios</em>
            </h2>
            <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[560px] leading-[2] mt-4">
              Five-year projections based on AI infrastructure market growth.
              Conservative baseline assumes standard office conversion.
              Upside scenarios assume full compute deployment.
            </p>
          </div>
          <button
            onClick={onLock}
            className="text-[8px] tracking-[0.1em] uppercase text-[rgba(255,160,0,0.4)] hover:text-[var(--amber)] transition-colors bg-transparent border border-[var(--border)] hover:border-[var(--amber2)] px-3 py-1.5 cursor-pointer font-mono"
          >
            Lock &times;
          </button>
        </div>

        <div className="scenarios-grid grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.name}
              className={`reveal p-6 border transition-all ${
                scenario.featured
                  ? 'bg-[rgba(255,140,0,0.06)] border-[var(--amber2)]'
                  : 'bg-[rgba(255,140,0,0.02)] border-[var(--border)]'
              }`}
            >
              <div className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.4)] uppercase mb-3">
                {scenario.tier}
              </div>
              
              <h3 className="font-display text-[20px] font-semibold text-white mb-1">
                {scenario.name}
              </h3>
              <p className="text-[10px] tracking-[0.04em] text-[rgba(255,160,0,0.5)] mb-4">
                {scenario.subtitle}
              </p>

              <div 
                className="font-display text-[36px] font-bold mb-6"
                style={{ color: scenario.multipleColor }}
              >
                {scenario.multiple}
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                {scenario.metrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)]">
                      {metric.label}
                    </span>
                    <span className="text-[11px] tracking-[0.04em] text-[var(--amber)]">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-10 p-4 border border-[rgba(255,160,0,0.15)] bg-[rgba(255,140,0,0.02)]">
          <p className="text-[9px] tracking-[0.04em] text-[rgba(255,160,0,0.4)] leading-[1.9]">
            <strong className="text-[rgba(255,160,0,0.6)]">Disclaimer:</strong> These projections are forward-looking estimates and not guarantees of performance.
            Actual returns may vary significantly. Past performance of similar investments does not guarantee future results.
            This material is for qualified investors only and not for general distribution.
          </p>
        </div>
      </div>
    </section>
  )
}
