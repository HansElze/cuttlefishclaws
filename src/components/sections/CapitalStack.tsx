import { useState } from 'react'
import { STACK_LAYERS } from '../../lib/mockData'

export default function CapitalStack() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section id="capital" className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal">
          <p className="section-label">$31M Acquisition</p>
          <h2 className="section-title">
            Capital<br />
            <em>Stack</em>
          </h2>
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[560px] leading-[2] mt-4 mb-10">
            Non-recourse debt structure with C-PACE retrofit financing.
            Minimal founder capital at risk. Property transfers encumbered debt.
            DAO-REIT equity tranche now open.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr,400px] mt-10">
          {/* Stack Visualization */}
          <div className="reveal flex flex-col gap-2">
            {STACK_LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                className="relative cursor-pointer transition-all duration-300"
                style={{ 
                  flex: `0 0 ${parseFloat(layer.percent) * 1.8}px`,
                  minHeight: '60px'
                }}
                onClick={() => setExpanded(expanded === layer.name ? null : layer.name)}
              >
                <div 
                  className={`absolute inset-0 border transition-all ${
                    expanded === layer.name ? 'scale-[1.02]' : ''
                  }`}
                  style={{
                    background: layer.bgColor,
                    borderColor: layer.borderColor
                  }}
                />
                <div className="relative p-4 flex items-center justify-between h-full">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-2 h-full min-h-[20px]"
                      style={{ background: layer.color }}
                    />
                    <div>
                      <div 
                        className="font-display text-[16px] font-semibold"
                        style={{ color: layer.color }}
                      >
                        {layer.name}
                      </div>
                      <div className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] mt-0.5">
                        {layer.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="font-display text-[20px] font-bold"
                      style={{ color: layer.color }}
                    >
                      {layer.amount}
                    </div>
                    <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)]">
                      {layer.percent}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === layer.name && (
                  <div 
                    className="relative mt-2 p-4 border-t"
                    style={{ borderColor: layer.borderColor }}
                  >
                    <p className="text-[10px] tracking-[0.04em] text-[rgba(255,160,0,0.65)] leading-[1.9]">
                      {layer.details}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="reveal">
            <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.02)]">
              <h3 className="font-display text-[14px] font-semibold text-white mb-4">
                Acquisition Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    Total Capitalization
                  </span>
                  <span className="font-display text-[18px] font-semibold text-[var(--amber)]">
                    $31M
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    Senior Debt (C-PACE)
                  </span>
                  <span className="text-[12px] text-[var(--green)]">$25.5M</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    SBA 504 (CDC + Private)
                  </span>
                  <span className="text-[12px] text-[var(--amber)]">$4.95M</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    DAO-REIT Equity
                  </span>
                  <span className="text-[12px] text-[var(--pink)]">$550K</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    Founder Capital at Risk
                  </span>
                  <span className="text-[12px] text-white">~$55K</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.5)]">
                    Personal Guarantee
                  </span>
                  <span className="text-[12px] text-[var(--green)]">None</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] uppercase mb-2">
                  Key Terms
                </div>
                <div className="text-[9px] tracking-[0.04em] text-[rgba(255,160,0,0.5)] leading-[1.9]">
                  C-PACE transfers with property. No personal guarantee required.
                  Delaware Series LLC structure isolates each asset.
                  DAO governance from day one via smart contracts.
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 border border-[var(--pink)] bg-[rgba(255,51,153,0.05)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--pink)] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="text-[8px] tracking-[0.12em] text-[var(--pink)] uppercase">
                  Now Open
                </span>
              </div>
              <div className="font-display text-[14px] font-semibold text-white mb-1">
                DAO-REIT Equity Tranche
              </div>
              <div className="text-[9px] tracking-[0.04em] text-[rgba(255,160,0,0.5)]">
                $550K total · Minimum $25K · Tokenized via Delaware Series LLC
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
