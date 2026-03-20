import { CAC_TIERS } from '../../lib/mockData'

export default function CACSection() {
  return (
    <section id="cac" className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal">
          <p className="section-label">What We Built</p>
          <h2 className="section-title">
            Compute Access<br />
            <em>Credential (CAC)</em>
          </h2>
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[560px] leading-[2] mt-4 mb-10">
            A <strong style={{ color: 'var(--amber)' }}>membership protocol</strong> — not a security. 
            Prepay for compute, earn 4.5% APY on unused balance, 
            govern the campus with weighted voting. 
            All credentials and rights are token-bound via ERC-6551.
          </p>
        </div>

        <div className="tiers-grid grid gap-4 mt-10" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {CAC_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`reveal relative p-5 border transition-all duration-300 ${
                tier.featured
                  ? 'bg-[rgba(255,140,0,0.08)] border-[var(--amber2)]'
                  : 'bg-[rgba(255,140,0,0.03)] border-[var(--border)] hover:border-[var(--amber2)]'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-4 -translate-y-1/2 px-2 py-0.5 text-[7px] tracking-[0.12em] uppercase bg-[var(--amber3)] text-black">
                  {tier.badge}
                </div>
              )}

              <div className="text-[9px] tracking-[0.15em] text-[rgba(255,160,0,0.4)] uppercase mb-2">
                {tier.id}
              </div>
              <h3 className="font-display text-[24px] font-semibold text-white mb-1">
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-[28px] font-bold text-[var(--amber)]">
                  {tier.price}
                </span>
                <span className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.4)]">
                  {tier.priceNote}
                </span>
              </div>

              <ul className="list-none space-y-2 mb-6">
                {tier.includes.map((item, i) => (
                  <li 
                    key={i}
                    className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.65)] flex items-start gap-2"
                  >
                    <span className="text-[var(--green)] text-[8px] mt-0.5">&#x25CF;</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                <span className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] uppercase">
                  {tier.agentCount}
                </span>
                <span className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">
                  {tier.idealFor}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.02)]">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <h3 className="font-display text-[16px] font-semibold text-white mb-2">
                Protocol Mechanics
              </h3>
              <p className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.55)] max-w-[400px] leading-[1.9]">
                0.25% fee on every inference. 40% to stakers. 40% to campus operations. 
                20% to DAO treasury. 15% floor to Cuttlefish Labs.
              </p>
            </div>
            <div className="flex gap-10">
              <div>
                <div className="font-display text-[22px] font-semibold text-[var(--green)]">
                  0.25%
                </div>
                <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] uppercase mt-1">
                  Protocol Fee
                </div>
              </div>
              <div>
                <div className="font-display text-[22px] font-semibold text-[var(--amber)]">
                  4.5%
                </div>
                <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] uppercase mt-1">
                  Savings APY
                </div>
              </div>
              <div>
                <div className="font-display text-[22px] font-semibold text-[var(--cyan)]">
                  40/40/20
                </div>
                <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] uppercase mt-1">
                  Fee Split
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
