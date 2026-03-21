'use client'

import { useState, useRef, useEffect } from 'react'

// ── Card tier data ────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'dev',
    name: 'Developer',
    price: '$500/yr',
    card: 'Virtual Visa',
    physical: false,
    color: '#ffaa00',
    colorDim: 'rgba(255,170,0,0.12)',
    border: 'rgba(255,170,0,0.3)',
    features: [
      'Virtual Visa — instant provisioning',
      'Micropayment rails for inference billing',
      'CAC token staking via AgentWallet.sol',
      'Agent identity on Base L2',
      'KYA-verified agent registration',
    ],
    stat: '1 Agent',
    cardLabel: 'VIRTUAL',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$2,000/yr',
    card: 'Physical NFC Visa',
    physical: true,
    color: '#00d2ff',
    colorDim: 'rgba(0,210,255,0.12)',
    border: 'rgba(0,210,255,0.3)',
    features: [
      'Physical NFC Visa — $20 issuance fee',
      'NFC/QR encoded with CAC address + agent ID',
      'Agent-to-agent lending settlement',
      'Insurance pool participation',
      'Tap-to-pay for physical world ops',
    ],
    stat: '5 Agents',
    cardLabel: 'NFC ENABLED',
    badge: 'MOST POPULAR',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$7,500/yr',
    card: 'Metal Mastercard',
    physical: true,
    color: '#ff3399',
    colorDim: 'rgba(255,51,153,0.12)',
    border: 'rgba(255,51,153,0.3)',
    features: [
      'Metal Mastercard — free issuance',
      'Agent treasury management',
      'Full governance voting weight',
      'Custom card design + agent portrait',
      'Priority KYA review + human override',
    ],
    stat: '25 Agents',
    cardLabel: 'METAL',
  },
]

// ── Animated card canvas ──────────────────────────────────────────────
function CardCanvas({ tier, active }: { tier: typeof TIERS[0]; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width = 280
    const H = canvas.height = 170
    let tick = 0

    // Particle data for digital surface
    const pts = Array.from({ length: 28 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: .8 + Math.random() * 1.4, ph: Math.random() * Math.PI * 2,
    }))

    function draw() {
      rafRef.current = requestAnimationFrame(draw)
      tick++
      ctx.clearRect(0, 0, W, H)

      // Card body
      const rr = 12
      ctx.beginPath()
      ctx.moveTo(rr, 0); ctx.lineTo(W - rr, 0); ctx.quadraticCurveTo(W, 0, W, rr)
      ctx.lineTo(W, H - rr); ctx.quadraticCurveTo(W, H, W - rr, H)
      ctx.lineTo(rr, H); ctx.quadraticCurveTo(0, H, 0, H - rr)
      ctx.lineTo(0, rr); ctx.quadraticCurveTo(0, 0, rr, 0)
      ctx.closePath()

      // Fill — dark with color tint
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, tier.id === 'enterprise' ? '#1a0010' : tier.id === 'studio' ? '#000c14' : '#100800')
      bg.addColorStop(1, '#060200')
      ctx.fillStyle = bg
      ctx.fill()

      // Border glow
      ctx.strokeStyle = tier.color + (active ? 'cc' : '66')
      ctx.lineWidth = active ? 1.5 : 1
      ctx.stroke()

      // Circuit trace lines
      ctx.save()
      ctx.globalAlpha = .07
      ctx.strokeStyle = tier.color
      ctx.lineWidth = .6
      for (let i = 0; i < 4; i++) {
        const y = 30 + i * 32
        ctx.beginPath()
        ctx.moveTo(10, y)
        ctx.lineTo(W * (.3 + i * .08), y)
        ctx.lineTo(W * (.3 + i * .08) + 15, y + 15)
        ctx.lineTo(W - 10, y + 15)
        ctx.stroke()
      }
      ctx.restore()

      // Particles — bioluminescent surface
      pts.forEach(p => {
        p.ph += .04; p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        const s = Math.sin(p.ph) * .3 + .7
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * s, 0, Math.PI * 2)
        ctx.fillStyle = tier.color
        ctx.globalAlpha = .12 * s * (active ? 1.5 : 1)
        ctx.fill(); ctx.globalAlpha = 1
      })

      // Chip (if physical)
      if (tier.physical) {
        const cx = 30, cy = 60, cw = 38, ch = 28
        ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 4)
        const chipGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch)
        chipGrad.addColorStop(0, tier.color + '40')
        chipGrad.addColorStop(.5, tier.color + '20')
        chipGrad.addColorStop(1, tier.color + '50')
        ctx.fillStyle = chipGrad; ctx.fill()
        ctx.strokeStyle = tier.color + '88'; ctx.lineWidth = .8; ctx.stroke()
        // Chip lines
        ctx.strokeStyle = tier.color + '44'; ctx.lineWidth = .6
        for (let i = 1; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(cx + cw * i / 3, cy + 4); ctx.lineTo(cx + cw * i / 3, cy + ch - 4); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(cx + 4, cy + ch * i / 3); ctx.lineTo(cx + cw - 4, cy + ch * i / 3); ctx.stroke()
        }
      }

      // NFC symbol (studio)
      if (tier.id === 'studio') {
        const nx = 85, ny = 73
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(nx, ny, 8 + i * 7, -Math.PI / 4, Math.PI / 4)
          ctx.strokeStyle = tier.color + (active ? 'cc' : '66')
          ctx.lineWidth = 1.5; ctx.stroke()
        }
      }

      // Card label (type)
      ctx.font = 'bold 7px "Share Tech Mono", monospace'
      ctx.fillStyle = tier.color + 'aa'
      ctx.letterSpacing = '2px'
      ctx.fillText(tier.cardLabel, 14, H - 12)

      // Visa / MC logo
      ctx.font = 'bold 11px "Rajdhani", sans-serif'
      ctx.fillStyle = tier.color + 'cc'
      ctx.textAlign = 'right'
      ctx.fillText(tier.id === 'enterprise' ? 'MASTERCARD' : 'VISA', W - 12, H - 10)
      ctx.textAlign = 'left'

      // CAC address strip
      ctx.font = '7px "Share Tech Mono", monospace'
      ctx.fillStyle = tier.color + '55'
      ctx.fillText('CAC-' + tier.id.toUpperCase() + '-' + 'XXXXXXXX', 14, H - 24)

      // Pulse glow when active
      if (active) {
        const pulse = Math.sin(tick * .04) * .08 + .12
        ctx.strokeStyle = tier.color
        ctx.lineWidth = 6
        ctx.globalAlpha = pulse
        ctx.beginPath()
        ctx.moveTo(rr, 0); ctx.lineTo(W - rr, 0); ctx.quadraticCurveTo(W, 0, W, rr)
        ctx.lineTo(W, H - rr); ctx.quadraticCurveTo(W, H, W - rr, H)
        ctx.lineTo(rr, H); ctx.quadraticCurveTo(0, H, 0, H - rr)
        ctx.lineTo(0, rr); ctx.quadraticCurveTo(0, 0, rr, 0)
        ctx.closePath(); ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [tier.id, active])

  return <canvas ref={canvasRef} width={280} height={170} style={{ width: '100%', height: 'auto', display: 'block' }} />
}

// ── Flow steps ────────────────────────────────────────────────────────
const FLOW = [
  { n: '01', label: 'Register Agent', desc: 'Submit agent ID + CAC tier. KYA validation via Fuse AI — constitutional compliance check.', color: '#ffaa00' },
  { n: '02', label: 'Provision Account', desc: 'FinLego core banking spins up a multi-currency account. AgentWallet.sol deployed on Base L2.', color: '#00d2ff' },
  { n: '03', label: 'Issue Card', desc: 'Virtual card: instant. Physical NFC card: shipped in 5-7 days via Stripe Issuing API.', color: '#aa88ff' },
  { n: '04', label: 'Activate & Transact', desc: 'Tap NFC for physical payments. CAC address encoded on chip. 0.25% fee on all transactions routes to campus.', color: '#00ffcc' },
]

// ── Main section ──────────────────────────────────────────────────────
export default function AgentBankSection() {
  const [activeTier, setActiveTier] = useState(1) // studio default

  return (
    <section id="agent-bank" className="py-28" style={{ background: 'var(--bg1)', fontFamily: 'var(--mono)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--amber)', opacity: .6 }}>
              AGENT BANKING PROTOCOL
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6" style={{ fontFamily: 'var(--display)', color: 'var(--amber)' }}>
            Your Agent Has a Bank Account.
          </h2>
          <p className="text-center max-w-2xl mx-auto" style={{ fontSize: 14, color: 'rgba(255,180,50,.55)', lineHeight: 1.8 }}>
            Built on FinLego neobank infrastructure + Fuse AI origination + CAC smart contracts.
            Physical NFC cards. Real spending rails. Constitutional governance on every transaction.
          </p>
        </div>

        {/* ── Tier cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TIERS.map((tier, i) => (
            <div
              key={tier.id}
              onClick={() => setActiveTier(i)}
              data-testid="agent-bank-tier-card" data-tier={tier.id} aria-selected={i === activeTier}
              className="cursor-pointer transition-all duration-300 relative"
              style={{
                border: `1px solid ${i === activeTier ? tier.color + 'aa' : tier.border}`,
                background: i === activeTier ? tier.colorDim : 'rgba(10,4,0,0.6)',
                padding: '24px 20px',
                boxShadow: i === activeTier ? `0 0 30px ${tier.color}22, inset 0 0 20px ${tier.color}08` : 'none',
              }}
            >
              {/* Corner ticks */}
              <span style={{ position:'absolute',top:-1,left:-1,width:10,height:10,borderTop:`1.5px solid ${tier.color}`,borderLeft:`1.5px solid ${tier.color}` }} />
              <span style={{ position:'absolute',bottom:-1,right:-1,width:10,height:10,borderBottom:`1.5px solid ${tier.color}`,borderRight:`1.5px solid ${tier.color}` }} />

              {/* Badge */}
              {tier.badge && (
                <div style={{ position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',
                  background: tier.color, color: '#000', fontSize: 7, letterSpacing: '.18em',
                  padding: '3px 10px', fontWeight: 700 }}>
                  {tier.badge}
                </div>
              )}

              {/* Card canvas */}
              <div className="mb-5">
                <CardCanvas tier={tier} active={i === activeTier} />
              </div>

              {/* Tier info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '.18em', color: tier.color, opacity: .7, marginBottom: 3 }}>
                    {tier.name.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: tier.color, fontFamily: 'var(--display)' }}>
                    {tier.price}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, letterSpacing: '.14em', color: tier.color, opacity: .6 }}>AGENTS</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: tier.color }}>{tier.stat}</div>
                </div>
              </div>

              {/* Card type badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px',
                border: `1px solid ${tier.color}44`, marginBottom: 14 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color,
                  boxShadow: `0 0 5px ${tier.color}`, animation: 'agentBankPulse 1.8s infinite' }} />
                <span style={{ fontSize: 8, letterSpacing: '.14em', color: tier.color + 'bb' }}>
                  {tier.card.toUpperCase()}
                </span>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {tier.features.map((f, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 10, color: 'rgba(255,180,50,.55)', lineHeight: 1.5 }}>
                    <span style={{ color: tier.color, flexShrink: 0, marginTop: 1 }}>→</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <div className="mb-20">
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: 'var(--amber)', opacity: .5, marginBottom: 16, textAlign: 'center' }}>
            — PROVISIONING FLOW —
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
            {FLOW.map((step, i) => (
              <div key={i} style={{ background: 'var(--bg1)', padding: '20px 18px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: step.color, opacity: .25, fontFamily: 'var(--display)', lineHeight: 1, marginBottom: 10 }}>
                  {step.n}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: step.color, marginBottom: 6, letterSpacing: '.04em', fontFamily: 'var(--display)' }}>
                  {step.label}
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,180,50,.5)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stack info ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16" style={{ background: 'var(--border)' }}>
          {[
            {
              label: 'Banking Infrastructure',
              color: '#00d2ff',
              value: 'FinLego',
              items: ['Core banking + ledger', 'Multi-currency accounts', 'Card issuing + KYC/AML', 'Crypto wallets + FX'],
            },
            {
              label: 'AI Origination & KYA',
              color: '#aa88ff',
              value: 'Fuse AI',
              items: ['Document reading agents', 'Constitutional compliance check', '200+ integration connectors', '2.4× conversion rate'],
            },
            {
              label: 'On-Chain Settlement',
              color: '#ffaa00',
              value: 'CAC Protocol',
              items: ['AgentWallet.sol on Base L2', '0.25% fee → campus treasury', 'TrustGraph credit scoring', 'Governance weight on balance'],
            },
          ].map((stack, i) => (
            <div key={i} style={{ background: 'var(--bg1)', padding: '20px 18px' }}>
              <div style={{ fontSize: 8, letterSpacing: '.18em', color: stack.color, opacity: .6, marginBottom: 6 }}>
                {stack.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: stack.color, fontFamily: 'var(--display)', marginBottom: 12 }}>
                {stack.value}
              </div>
              {stack.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: stack.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,180,50,.5)' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: 'var(--amber)', opacity: .45, marginBottom: 12 }}>
            COMING Q2 2026
          </div>
          <h3 style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--display)', marginBottom: 8 }}>
            "My agent paid for coffee."
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,180,50,.45)', marginBottom: 20 }}>
            Give your agent a card. The first AI-native bank built on constitutional governance.
          </p>
          <button style={{
            border: '1px solid var(--amber)', color: 'var(--amber)',
            padding: '10px 32px', fontSize: 10, letterSpacing: '.16em',
            background: 'transparent', cursor: 'pointer', fontFamily: 'var(--mono)',
            transition: 'all .2s',
          }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,187,51,.08)' }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            JOIN WAITLIST — AGENT BANK
          </button>
        </div>

      </div>

      <style>{`
        @keyframes agentBankPulse {
          0%,100% { opacity:1; }
          50% { opacity:.25; }
        }
      `}</style>
    </section>
  )
}
