import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { usePalette } from '../hooks/usePalette'
import { api } from '../lib/api'
import { useSearchParams } from 'react-router-dom'

const BASE_WALLET = '0xb748798D0a8dA0527c30e6CA81425A8fD150f04c'
const QUICK_STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/28EdRaehWcfigxReaxfAc00'

type ParticipantType = 'human' | 'agent' | 'both'
type PaymentRail = 'stripe' | 'usdc_base'

export default function CACPresale() {
  const { palette, togglePalette } = usePalette()
  const [searchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reservationId, setReservationId] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [bannerMessage, setBannerMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'human' as ParticipantType,
    paymentRail: 'stripe' as PaymentRail,
    walletAddress: '',
    txHash: '',
    referral: '',
    notes: '',
  })

  const copyAddress = () => {
    navigator.clipboard.writeText(BASE_WALLET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const stripeState = searchParams.get('stripe')
    const returnedReservationId = searchParams.get('reservation')

    if (stripeState === 'success') {
      setSubmitted(true)
      setReservationId(returnedReservationId || '')
      setBannerMessage('Stripe payment completed. Your reservation will be marked paid automatically after the webhook is received.')
      setNextStep('Watch for wallet-binding and KYA follow-up after payment reconciliation.')
    } else if (stripeState === 'cancelled') {
      setBannerMessage('Stripe checkout was cancelled. Your reservation may still exist, but payment was not completed.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const result = await api.presale.reserve({
        fullName: form.name,
        email: form.email,
        participantType: form.type,
        paymentRail: form.paymentRail,
        reservationTier: 'builder',
        reservationAmountUsd: 100,
        walletAddress: form.walletAddress,
        txHash: form.txHash,
        referral: form.referral,
        notes: form.notes,
        sourcePath: '/presale',
      })

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to record reservation right now.')
        return
      }

      setReservationId(result.reservationId || '')
      setNextStep(result.nextStep || '')
      if (form.paymentRail === 'stripe' && result.stripeCheckoutUrl) {
        window.location.href = result.stripeCheckoutUrl
        return
      }

      setSubmitted(true)
    } catch (error) {
      console.error('[presale] reservation submit failed', error)
      setErrorMessage('We could not save your reservation right now. Please try again in a minute.')
    } finally {
      setSubmitting(false)
    }
  }

  const noop = () => {}

  return (
    <div className="min-h-screen bg-[var(--bg0)]">
      <div className="scanline" />

      <Nav scrollTo={noop} palette={palette} togglePalette={togglePalette} />

      <section className="pt-40 pb-20 px-8 text-center">
        <div className="max-w-[760px] mx-auto">
          <div className="inline-flex items-center gap-3 border border-[var(--green)] bg-[rgba(0,255,204,0.08)] px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
            <span className="text-[8px] tracking-[0.16em] uppercase text-[var(--green)]">
              Current Phase: Builder Reservation Capture
            </span>
          </div>
          <p className="section-label justify-center">Founding Member Pre-Sale</p>
          <h1 className="font-display text-[clamp(36px,6vw,72px)] font-bold text-white leading-[1.05] mb-4">
            Reserve Your
            <br />
            <em className="text-[var(--amber)] not-italic">CAC Card</em>
          </h1>
          <p className="text-[11px] tracking-[0.1em] text-[rgba(255,160,0,0.55)] max-w-[560px] mx-auto leading-[2] mb-10">
            Reserve a CAC builder card for $100. We record your reservation now, confirm payment,
            capture wallet and KYA details next, and schedule CAC issuance after review.
          </p>
          <a
            href={QUICK_STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 border border-[var(--amber2)] bg-[rgba(255,140,0,0.08)] px-8 py-3 hover:bg-[rgba(255,140,0,0.14)] transition-colors"
            aria-label="Quick reserve with Stripe"
          >
            <span className="font-display text-[clamp(28px,4vw,42px)] font-bold text-[var(--amber)]">$100</span>
            <span className="text-[10px] tracking-[0.15em] text-[rgba(255,160,0,0.5)] uppercase">
              Builder Reservation
            </span>
          </a>
          <p className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.38)] max-w-[520px] mx-auto leading-[2] mt-6">
            One price. One reservation. One next step: submit your payment details below so we can place you into the issuance queue.
          </p>
          <p className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.32)] max-w-[520px] mx-auto leading-[2] mt-3">
            Quick reserve opens Stripe directly. For the cleanest ops trail, the reservation form below is still the preferred path.
          </p>
          {bannerMessage ? (
            <div className="mt-6 border border-[var(--green)] bg-[rgba(0,255,204,0.06)] p-4">
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,255,255,0.82)] leading-[1.9]">
                {bannerMessage}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-8 pb-24">
        <div className="max-w-[1000px] mx-auto">
          <p className="section-label justify-center mb-10">Your $100 Reservation Secures</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)] hover:border-[var(--amber2)] transition-all">
              <div className="w-12 h-12 mb-4 border border-[var(--cyan)] bg-[rgba(0,210,255,0.08)] flex items-center justify-center">
                <span className="text-[22px]">💳</span>
              </div>
              <h3 className="font-display text-[18px] font-semibold text-white mb-1">CAC Card</h3>
              <div className="w-8 h-[0.5px] bg-[var(--amber2)] opacity-40 mb-3" />
              <ul className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] leading-[2.2] space-y-0">
                <li>Physical card with NFC credential</li>
                <li>Network identity and wallet binding path</li>
                <li>Builder track reservation status</li>
                <li>Constitutional governance onboarding</li>
              </ul>
            </div>

            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)] hover:border-[var(--pink)] transition-all">
              <div className="w-12 h-12 mb-4 border border-[var(--pink)] bg-[rgba(255,51,153,0.08)] flex items-center justify-center">
                <span className="text-[22px]">🏢</span>
              </div>
              <h3 className="font-display text-[18px] font-semibold text-white mb-1">Tributary Position</h3>
              <div className="w-8 h-[0.5px] bg-[var(--pink)] opacity-40 mb-3" />
              <ul className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] leading-[2.2] space-y-0">
                <li>Reserved stake in the Tributary AI Campus</li>
                <li>Birmingham, AL campus buildout queue</li>
                <li>Community-owned AI compute infrastructure</li>
                <li>$100 recorded toward membership path</li>
              </ul>
            </div>

            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)] hover:border-[var(--green)] transition-all">
              <div className="w-12 h-12 mb-4 border border-[var(--green)] bg-[rgba(0,255,204,0.08)] flex items-center justify-center">
                <span className="text-[22px]">⚡</span>
              </div>
              <h3 className="font-display text-[18px] font-semibold text-white mb-1">Early Mover Status</h3>
              <div className="w-8 h-[0.5px] bg-[var(--green)] opacity-40 mb-3" />
              <ul className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.55)] leading-[2.2] space-y-0">
                <li>Founding member pricing locked</li>
                <li>Priority access when issuance opens</li>
                <li>Manual confirmation workflow already in place</li>
                <li>First wave of KYA and wallet onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 pb-24">
        <div className="max-w-[800px] mx-auto">
          <p className="section-label justify-center mb-10">Choose Your Payment Method</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border border-[var(--amber2)] bg-[rgba(255,140,0,0.04)]">
              <p className="text-[8px] tracking-[0.2em] text-[rgba(255,160,0,0.4)] uppercase mb-4">Option A - Card</p>
              <h3 className="font-display text-[20px] font-semibold text-white mb-2">Pay with Card</h3>
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2] mb-6">
                Submit the reservation form below and we will generate a Stripe Checkout session
                tied directly to your reservation record.
              </p>
              <div
                className="btn-primary inline-block w-full text-center"
                style={{ padding: '14px 28px', fontSize: '11px' }}
              >
                Stripe Checkout begins after reservation submit
              </div>
              <p className="text-[8px] tracking-[0.06em] text-[rgba(255,160,0,0.3)] mt-3 text-center">
                Powered by Stripe - webhook reconciliation can confirm payment automatically
              </p>
            </div>

            <div className="p-8 border border-[var(--cyan)] bg-[rgba(0,210,255,0.03)]">
              <p className="text-[8px] tracking-[0.2em] text-[rgba(0,210,255,0.5)] uppercase mb-4">Option B - Crypto</p>
              <h3 className="font-display text-[20px] font-semibold text-white mb-2">Pay with USDC</h3>
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2] mb-4">
                Send exactly 100 USDC on Base. Include your email in the transaction note if your
                wallet supports it, then record the transfer hash in the reservation form below.
              </p>
              <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(0,210,255,0.2)] p-3 mb-4">
                <p className="text-[8px] tracking-[0.1em] text-[rgba(0,210,255,0.5)] uppercase mb-1">Base Network Address</p>
                <p className="font-mono text-[10px] text-[var(--cyan)] break-all leading-[1.8]">{BASE_WALLET}</p>
              </div>
              <button
                onClick={copyAddress}
                className="w-full text-center cursor-pointer"
                style={{
                  padding: '14px 28px',
                  border: '0.5px solid rgba(0,210,255,0.5)',
                  background: copied ? 'rgba(0,210,255,0.15)' : 'rgba(0,210,255,0.06)',
                  color: 'var(--cyan)',
                  fontFamily: 'var(--mono)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? 'Copied' : 'Copy Address'}
              </button>
              <p className="text-[8px] tracking-[0.06em] text-[rgba(255,160,0,0.3)] mt-3 text-center">
                Base L2 only - USDC only - confirmation after manual verification
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 pb-24">
        <div className="max-w-[620px] mx-auto">
          <p className="section-label justify-center mb-2">Complete Your Reservation Record</p>
          <p className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.4)] text-center mb-8">
            Submit after payment so we can log your reservation, payment rail, wallet details, and
            later CAC issuance steps.
          </p>

          {submitted ? (
            <div className="p-8 border border-[var(--green)] bg-[rgba(0,255,204,0.04)] text-center">
              <p className="text-[var(--green)] text-[11px] tracking-[0.1em] uppercase mb-2">Reservation Received</p>
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
                We will confirm your CAC card reservation at {form.email} within 24 hours.
              </p>
              {reservationId ? (
                <p className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.35)] mt-4 font-mono">
                  Reservation ID: {reservationId}
                </p>
              ) : null}
              {nextStep ? (
                <p className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.35)] mt-2 leading-[2]">
                  {nextStep}
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Name or Agent ID
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                  placeholder="Navigator or agent_id_here"
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                  placeholder="you@domain.com"
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  I am
                </label>
                <div className="flex gap-3">
                  {(['human', 'agent', 'both'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, type: value })}
                      className={`flex-1 py-2.5 border text-[8px] tracking-[0.15em] uppercase font-mono transition-all cursor-pointer ${
                        form.type === value
                          ? 'border-[var(--amber2)] bg-[rgba(255,140,0,0.15)] text-[var(--amber)]'
                          : 'border-[var(--border)] bg-transparent text-[rgba(255,160,0,0.4)] hover:border-[var(--amber2)]'
                      }`}
                    >
                      {value === 'agent' ? 'AI Agent Operator' : value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Payment Method Used
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ['stripe', 'Stripe Card'],
                    ['usdc_base', 'USDC on Base'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, paymentRail: value })}
                      className={`py-2.5 border text-[8px] tracking-[0.15em] uppercase font-mono transition-all cursor-pointer ${
                        form.paymentRail === value
                          ? 'border-[var(--amber2)] bg-[rgba(255,140,0,0.15)] text-[var(--amber)]'
                          : 'border-[var(--border)] bg-transparent text-[rgba(255,160,0,0.4)] hover:border-[var(--amber2)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                  placeholder="Optional now, useful for later CAC issuance"
                />
              </div>

              {form.paymentRail === 'usdc_base' ? (
                <div>
                  <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                    Base Transaction Hash
                  </label>
                  <input
                    type="text"
                    value={form.txHash}
                    onChange={(e) => setForm({ ...form, txHash: e.target.value })}
                    className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                    placeholder="0x... helps us verify your transfer faster"
                  />
                </div>
              ) : null}

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  How did you hear about us?
                </label>
                <input
                  type="text"
                  value={form.referral}
                  onChange={(e) => setForm({ ...form, referral: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                  placeholder="Telegram, X, referral, investor network..."
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full min-h-[96px] bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                  placeholder="Optional: operator name, intended wallet, payment note, or issuance preference."
                />
              </div>

              <div className="border border-[var(--border)] bg-[rgba(255,140,0,0.03)] p-4">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-2">What Happens Next</p>
                <ul className="text-[8px] tracking-[0.06em] text-[rgba(255,160,0,0.42)] leading-[2] space-y-1">
                  <li>We log your reservation and payment method immediately.</li>
                  <li>Stripe reservations redirect into a Checkout session tied to your reservation ID.</li>
                  <li>Paid Stripe sessions can mark `payment_status` automatically through the webhook path.</li>
                  <li>We follow with wallet binding and KYA steps before CAC issuance.</li>
                </ul>
              </div>

              {errorMessage ? (
                <div className="border border-[var(--pink)] bg-[rgba(255,51,153,0.05)] p-4">
                  <p className="text-[8px] tracking-[0.08em] text-[rgba(255,120,180,0.85)] leading-[1.8]">
                    {errorMessage}
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                className="btn-primary w-full text-center"
                style={{ padding: '16px 28px', fontSize: '11px' }}
                disabled={submitting}
              >
                {submitting ? 'Recording Reservation...' : 'Submit Reservation →'}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-[760px] mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-2">Current Phase</p>
            <p className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
              Reservations are live now. Payment confirmation, wallet binding, KYA intake, and card issuance happen in sequence after reservation capture.
            </p>
          </div>
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-2">Terms Snapshot</p>
            <p className="text-[10px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
              This reservation helps us track payment, contact, and issuance readiness. Formal FAQ, terms, and fulfillment milestones should be published before scaling traffic.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Trust Signals</p>
            <ul className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2] space-y-2">
              <li>Protocol contracts and CAC specifications are already published on the main site.</li>
              <li>Reservations are stored in a structured backend record, not just email capture.</li>
              <li>Manual payment confirmation and issuance review are active before scaled traffic.</li>
              <li>Contact: dvdelze@gmail.com · Cuttlefish Labs · Birmingham campus buildout.</li>
            </ul>
          </div>
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Protocol Readiness</p>
            <ul className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2] space-y-2">
              <li>Phase 1: reservation intake and admin review</li>
              <li>Phase 2: wallet binding and KYA follow-up</li>
              <li>Phase 3: CAC issuance queue and card fulfillment</li>
              <li>Legal framing: cooperative membership certificate with governance and compute rights</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-[960px] mx-auto">
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Issuance Sequence</p>
            <div className="grid md:grid-cols-5 gap-3">
              {[
                '1. Reservation',
                '2. KYA Intake',
                '3. Wallet Binding',
                '4. CAC Record',
                '5. Card Fulfillment',
              ].map((step) => (
                <div key={step} className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-4 py-4 text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.5)]">
                  {step}
                </div>
              ))}
            </div>
            <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.45)] leading-[2] mt-4">
              Reservations are live now. Physical card fulfillment only begins after payment confirmation, KYA review, wallet binding, and CAC record creation.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-[960px] mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Timeline</p>
            <ul className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2] space-y-2">
              <li>1. Reservation submitted and payment logged</li>
              <li>2. Manual confirmation within 24 hours</li>
              <li>3. Wallet binding and KYA intake follow-up</li>
              <li>4. CAC issuance scheduling and card fulfillment updates</li>
            </ul>
          </div>
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">FAQ</p>
            <div className="space-y-3 text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
              <p><span className="text-white">Is the card issued immediately?</span><br />No. This phase records your reservation and payment while issuance ops are being assembled.</p>
              <p><span className="text-white">Can I pay with USDC?</span><br />Yes. Use Base USDC and include a transaction hash below if possible.</p>
              <p><span className="text-white">What happens after I reserve?</span><br />You receive confirmation, then wallet and KYA follow-up before CAC issuance.</p>
            </div>
          </div>
          <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
            <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Terms Snapshot</p>
            <div className="space-y-3 text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
              <p>This page records interest, payment path, and fulfillment readiness for the CAC builder presale.</p>
              <p>Reservation terms, refund handling, issuance milestones, and card-delivery policy should be published in a fuller legal/FAQ page before scaled promotion.</p>
              <p>For now, every reservation should be treated as a manually reviewed presale record rather than instant card issuance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-[var(--border)] text-center">
        <div className="max-w-[560px] mx-auto">
          <p className="font-display text-[14px] font-semibold text-white mb-1">Built by Cuttlefish Labs</p>
          <p className="text-[9px] tracking-[0.1em] text-[rgba(255,160,0,0.4)] mb-4">
            Constitutional AI Infrastructure for the Agent Economy
          </p>
          <p className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.3)]">
            cuttlefishclaws.com · dvdelze@gmail.com
          </p>
          <p className="text-[8px] tracking-[0.06em] text-[rgba(255,160,0,0.2)] mt-3 font-mono break-all">
            Base USDC: {BASE_WALLET}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
