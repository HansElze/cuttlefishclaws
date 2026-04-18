import type { PaletteKey } from '../hooks/usePalette'

interface NavProps {
  scrollTo: (id: string) => void
  palette: PaletteKey
  togglePalette: () => void
}

export default function Nav({ scrollTo: _scrollTo }: NavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-3.5 flex items-center justify-between border-b border-[var(--border)] bg-[rgba(6,2,0,0.85)] backdrop-blur-sm">
      <a href="/" className="font-display text-base font-bold tracking-[0.2em] text-[var(--amber)] no-underline">
        Tributary
      </a>
      
      <ul className="hidden md:flex gap-7 list-none">
        <li>
          <a
            href="/#cac"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            CAC Protocol
          </a>
        </li>
        <li>
          <a
            href="/#cac-spec"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Spec Docs
          </a>
        </li>
        <li>
          <a
            href="/#agents"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Agents
          </a>
        </li>
        <li>
          <a
            href="/#trustgraph"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            TrustGraph
          </a>
        </li>
        <li>
          <a
            href="/#bill-of-rights"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Bill of Rights
          </a>
        </li>
        <li>
          <a
            href="/#capital"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Capital Stack
          </a>
        </li>
        <li>
          <a
            href="/#contracts"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Contracts
          </a>
        </li>
        <li>
          <a
            href="/#agent-bank"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            Agent Bank
          </a>
        </li>
        <li>
          <a
            href="/#kya"
            className="text-[10px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.6)] hover:text-[var(--amber)] transition-colors font-mono no-underline"
          >
            KYA Protocol
          </a>
        </li>
      </ul>
      
      <div className="flex items-center gap-3">
        <a
          href="/presale"
          className="text-[10px] tracking-[0.14em] uppercase py-1.5 px-4 border border-[var(--green)] text-[var(--green)] bg-[rgba(0,255,204,0.08)] hover:bg-[rgba(0,255,204,0.18)] transition-all font-mono no-underline"
        >
          Reserve &rarr;
        </a>
        <a
          href="/#invest"
          className="text-[10px] tracking-[0.14em] uppercase py-1.5 px-4 border border-[var(--amber2)] text-[var(--amber)] bg-[rgba(255,140,0,0.08)] hover:bg-[rgba(255,140,0,0.18)] transition-all cursor-pointer font-mono no-underline"
        >
          Invest &rarr;
        </a>
      </div>
    </nav>
  )
}
