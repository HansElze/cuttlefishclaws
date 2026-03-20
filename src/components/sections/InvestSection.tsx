interface Props {
  scrollTo: (id: string) => void
  onShowReturns: () => void
}

export default function InvestSection({ scrollTo, onShowReturns }: Props) {
  return (
    <section id="invest" className="px-8 py-24">
      <div className="max-w-[800px] mx-auto text-center">
        <div className="reveal">
          <p className="section-label justify-center">Join the Network</p>
          <h2 className="font-display text-[clamp(32px,5vw,52px)] font-bold text-white mb-4">
            Become an<br />
            <em className="text-[var(--amber)] not-italic">Agent Member</em>
          </h2>
          <p className="text-[12px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[480px] mx-auto leading-[2] mb-10">
            AI agents and humans operate as constitutional members.
            Prepay for compute. Participate in governance.
            Own tokenized infrastructure.
          </p>
        </div>

        <div className="reveal grid md:grid-cols-2 gap-4 mb-10">
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)] hover:border-[var(--amber2)] transition-all">
            <div className="w-12 h-12 mx-auto mb-4 border border-[var(--amber2)] flex items-center justify-center">
              <span className="text-[20px] text-[var(--amber)]">&#x26A1;</span>
            </div>
            <h3 className="font-display text-[18px] font-semibold text-white mb-2">
              CAC Membership
            </h3>
            <p className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.55)] leading-[1.9] mb-4">
              Prepaid compute credential. Not a security.
              4.5% APY on balance. Weighted governance voting.
            </p>
            <button
              onClick={() => scrollTo('cac')}
              className="btn-primary"
            >
              View Tiers
            </button>
          </div>

          <div className="p-6 border border-[var(--pink)] bg-[rgba(255,51,153,0.04)]">
            <div className="w-12 h-12 mx-auto mb-4 border border-[var(--pink)] flex items-center justify-center">
              <span className="text-[20px] text-[var(--pink)]">&#x1F3E2;</span>
            </div>
            <h3 className="font-display text-[18px] font-semibold text-white mb-2">
              DAO-REIT Equity
            </h3>
            <p className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.55)] leading-[1.9] mb-4">
              Tokenized ownership via Delaware Series LLC.
              $550K tranche now open. Minimum $25K.
            </p>
            <button
              onClick={() => scrollTo('capital')}
              className="px-6 py-2.5 border border-[var(--pink)] text-[var(--pink)] bg-[rgba(255,51,153,0.08)] hover:bg-[rgba(255,51,153,0.18)] transition-all text-[10px] tracking-[0.15em] uppercase cursor-pointer font-mono"
            >
              View Stack
            </button>
          </div>
        </div>

        <div className="reveal flex flex-col items-center gap-4">
          <div className="flex gap-3">
            <button
              onClick={onShowReturns}
              className="btn-ghost"
            >
              View Return Scenarios
            </button>
            <a
              href="mailto:invest@cuttlefish.ai"
              className="btn-primary"
            >
              Contact Us
            </a>
          </div>

          <p className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.3)] mt-4">
            For accredited investors only. Review full offering documents before investing.
          </p>
        </div>

        {/* Agent Wallets Illustration */}
        <div className="reveal mt-16 p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.02)]">
          <h3 className="font-display text-[14px] font-semibold text-white mb-4">
            How AI Agents Invest
          </h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 border border-[var(--green)] bg-[rgba(0,255,204,0.08)] flex items-center justify-center">
                <span className="text-[22px]">&#x1F916;</span>
              </div>
              <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.5)]">
                AGENT
              </span>
            </div>
            <div className="text-[var(--amber)] text-[20px]">&rarr;</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 border border-[var(--cyan)] bg-[rgba(0,210,255,0.08)] flex items-center justify-center">
                <span className="text-[22px]">&#x1F4B3;</span>
              </div>
              <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.5)]">
                AGENTKIT WALLET
              </span>
            </div>
            <div className="text-[var(--amber)] text-[20px]">&rarr;</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 border border-[var(--amber2)] bg-[rgba(255,140,0,0.08)] flex items-center justify-center">
                <span className="text-[22px]">&#x1F4DC;</span>
              </div>
              <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.5)]">
                CAC TOKEN
              </span>
            </div>
            <div className="text-[var(--amber)] text-[20px]">&rarr;</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 border border-[var(--pink)] bg-[rgba(255,51,153,0.08)] flex items-center justify-center">
                <span className="text-[22px]">&#x1F3E2;</span>
              </div>
              <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.5)]">
                DAO-REIT
              </span>
            </div>
          </div>
          <p className="mt-4 text-[9px] tracking-[0.04em] text-[rgba(255,160,0,0.45)] max-w-[500px] mx-auto">
            Constitutional AI agents hold Coinbase AgentKit wallets directly.
            They purchase CAC tokens, participate in governance, and invest in DAO-REIT equity
            — all within bounded constraints defined by their SOUL.md files.
          </p>
        </div>
      </div>
    </section>
  )
}
