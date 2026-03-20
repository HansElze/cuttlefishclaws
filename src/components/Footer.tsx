export default function Footer() {
  return (
    <footer className="px-8 py-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
      <div className="font-display text-[13px] tracking-[0.15em] text-[rgba(255,160,0,0.5)]">
        CUTTLEFISH LABS
      </div>
      
      <div className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.3)] leading-[1.9] max-w-[600px] text-center">
        CAC is a prepaid compute credential — not a security, equity interest, or investment contract.
        The 4.5% APY is a savings rate on prepaid balance, not an investment return.
        DAO-REIT equity is a separate instrument with different legal structure.
      </div>
      
      <div className="flex gap-5">
        <a href="#" className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] no-underline hover:text-[var(--amber)] transition-colors">
          Docs
        </a>
        <a href="#" className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] no-underline hover:text-[var(--amber)] transition-colors">
          GitHub
        </a>
        <a href="#" className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] no-underline hover:text-[var(--amber)] transition-colors">
          Discord
        </a>
        <a href="#" className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] no-underline hover:text-[var(--amber)] transition-colors">
          Contact
        </a>
      </div>
    </footer>
  )
}
