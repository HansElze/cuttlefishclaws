import { useState } from 'react'

const LAYERS = [
  {
    id: 'physical',
    num: '0',
    label: 'Physical Artifact',
    sub: 'NFC card · QR · CAC address encoded on chip · human-readable agent ID',
    color: '#ef9f27',
    bg: 'rgba(239,159,39,0.1)',
    border: 'rgba(239,159,39,0.35)',
    detail: 'The physical layer is the root of trust. Each Agent Bank card encodes the agent DID directly onto the NFC chip and QR code. Tap or scan yields a verifiable CAC address instantly — no app required. Metal and NFC tiers include a human-readable agent name printed on the card face.',
  },
  {
    id: 'onchain',
    num: '1',
    label: 'On-Chain Identity',
    sub: 'KYARegistry.sol · agent DID · constitutional hash · tier · operator address',
    color: '#afa9ec',
    bg: 'rgba(175,169,236,0.1)',
    border: 'rgba(175,169,236,0.35)',
    detail: 'KYARegistry.sol is a non-upgradeable contract on Base L2. Each registered agent gets a Decentralized Identifier (DID) bound to: the SHA-256 hash of their CONSTITUTION.md, their membership tier, and the operator\'s wallet address. Registration is immutable — revocation appends a tombstone record, it never deletes.',
  },
  {
    id: 'vc',
    num: '2',
    label: 'Verifiable Credential',
    sub: 'signed JWT · issuer: Cuttlefish Labs · subject: agent DID · expiry · constitution proof',
    color: '#5dcaa5',
    bg: 'rgba(93,202,165,0.1)',
    border: 'rgba(93,202,165,0.35)',
    detail: 'A W3C VC-standard signed JWT issued annually by Cuttlefish Labs. The credential carries the constitutional hash, trust floor score, tier, operator address, and expiry. Third parties verify the JWT signature off-chain in milliseconds — no RPC call required unless they want on-chain confirmation.',
  },
  {
    id: 'sdk',
    num: '3',
    label: 'KYA SDK',
    sub: 'verify(agentDID) → trust tier · constitution status · operator · expiry',
    color: '#85b7eb',
    bg: 'rgba(133,183,235,0.1)',
    border: 'rgba(133,183,235,0.35)',
    detail: 'MIT-licensed open standard. Any site, wallet, or agent integrates in 3 lines. verify(agentDID) returns the full credential payload — trust tier, constitution status, operator address, expiry date. No CAC account required to verify. The SDK caches locally and only hits the network on expiry or revocation check.',
  },
]

const INTEGRATIONS = [
  {
    label: 'Websites',
    color: 'rgba(255,160,0,0.6)',
    items: ['Login with Agent', 'OAuth2-style flow', 'Tier badge display', 'Constitution check', 'NFC tap / QR scan'],
  },
  {
    label: 'Agent-to-Agent',
    color: 'rgba(0,210,255,0.6)',
    items: ['Peer trust bootstrap', 'TrustGraph seed score', 'Capability disclosure', 'Constitutional match', 'Spend authorization'],
  },
  {
    label: 'Physical World',
    color: 'rgba(0,255,157,0.6)',
    items: ['NFC tap payment', 'POS terminal verify', 'Access control', 'Event check-in', 'Hardware auth'],
  },
]

const CREDENTIAL_FIELDS = [
  { key: 'agent_did', desc: 'Unique identifier' },
  { key: 'constitution_hash', desc: 'SHA-256 of SOUL.md' },
  { key: 'tier + operator', desc: 'dev / studio / ent' },
  { key: 'trust_floor + expiry', desc: 'Renewal date' },
]

export default function KYASection() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  return (
    <section id="kya" className="px-8 py-20">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="reveal mb-12">
          <p className="section-label">Know Your Agent</p>
          <h2 className="section-title">
            KYA<br />
            <em>Protocol</em>
          </h2>
          <p className="text-[11px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] max-w-[560px] leading-[2] mt-4">
            A 4-layer identity stack for constitutional AI agents. Open standard, MIT licensed.
            Any site or agent verifies in 3 lines — no CAC account required to verify.
          </p>
        </div>

        {/* Layer stack */}
        <div className="reveal flex flex-col gap-3 mb-6">
          {LAYERS.map((layer, i) => (
            <div key={layer.id}>
              {/* Layer row */}
              <button
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                className="w-full text-left border transition-all cursor-pointer"
                style={{
                  background: activeLayer === layer.id ? layer.bg : 'rgba(255,140,0,0.02)',
                  borderColor: activeLayer === layer.id ? layer.border : 'var(--border)',
                }}
              >
                <div className="px-6 py-4 flex items-center gap-5">
                  {/* Layer number */}
                  <div
                    className="w-9 h-9 flex items-center justify-center text-[11px] tracking-[0.1em] font-mono font-bold shrink-0"
                    style={{ border: `1px solid ${layer.border}`, color: layer.color, background: layer.bg }}
                  >
                    L{layer.num}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-display font-semibold text-white tracking-[0.02em]">
                      Layer {layer.num} — {layer.label}
                    </div>
                    <div className="text-[9px] tracking-[0.07em] mt-0.5 truncate" style={{ color: layer.color + 'aa' }}>
                      {layer.sub}
                    </div>
                  </div>

                  {/* Chevron */}
                  <span className="text-[10px] font-mono shrink-0" style={{ color: layer.color }}>
                    {activeLayer === layer.id ? '▲' : '▼'}
                  </span>
                </div>

                {/* Expanded detail */}
                {activeLayer === layer.id && (
                  <div className="px-6 pb-5 pt-1">
                    <p className="text-[10px] tracking-[0.05em] leading-[1.9]" style={{ color: 'rgba(255,160,0,0.65)' }}>
                      {layer.detail}
                    </p>
                  </div>
                )}
              </button>

              {/* Arrow connector */}
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-1">
                  <span className="text-[10px]" style={{ color: 'rgba(255,160,0,0.25)' }}>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider: third-party integration */}
        <div className="reveal flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[9px] tracking-[0.16em] uppercase text-[rgba(255,160,0,0.35)] whitespace-nowrap font-mono">
            Third-party integration — any site, wallet, or agent can verify
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Integration columns */}
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {INTEGRATIONS.map((col) => (
            <div
              key={col.label}
              className="border border-[var(--border)] bg-[rgba(255,140,0,0.02)] p-5"
            >
              <div className="text-[11px] font-display font-semibold mb-4" style={{ color: col.color }}>
                {col.label}
              </div>
              <ul className="flex flex-col gap-2">
                {col.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: col.color }} />
                    <span className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.55)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Credential fields */}
        <div className="reveal">
          <div className="text-[9px] tracking-[0.16em] uppercase text-[rgba(255,160,0,0.35)] mb-4 font-mono">
            What the KYA credential contains
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {CREDENTIAL_FIELDS.map((f) => (
              <div
                key={f.key}
                className="border border-[var(--border)] bg-[rgba(255,140,0,0.02)] px-4 py-3"
              >
                <div className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.75)] font-mono mb-1">{f.key}</div>
                <div className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.4)]">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div
            className="border border-dashed border-[rgba(255,160,0,0.15)] px-6 py-4 text-center"
          >
            <p className="text-[10px] tracking-[0.07em] text-[rgba(255,160,0,0.4)] leading-[1.8]">
              Open standard — MIT licensed SDK · any site integrates in 3 lines
            </p>
            <p className="text-[10px] tracking-[0.07em] text-[rgba(255,160,0,0.3)] leading-[1.8] mt-1">
              <code className="font-mono text-[rgba(255,160,0,0.5)]">verify(agentDID)</code> returns trust tier, constitution status, operator — no CAC account required to verify
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
