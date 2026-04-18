import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { usePalette } from '../hooks/usePalette'
import { api } from '../lib/api'

export default function PresaleFollowup() {
  const { palette, togglePalette } = usePalette()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState('')
  const [kyaStatus, setKyaStatus] = useState('')
  const [form, setForm] = useState({
    reservationId: searchParams.get('reservation') || '',
    walletAddress: '',
    operatorName: '',
    ownerJurisdiction: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const result = await api.presale.followup({
        reservationId: form.reservationId,
        walletAddress: form.walletAddress,
        operatorName: form.operatorName,
        ownerJurisdiction: form.ownerJurisdiction,
        notes: form.notes,
      })

      if (!result.success) {
        setErrorMessage(result.error || 'Unable to save follow-up details.')
        return
      }

      setStatus(result.status || '')
      setKyaStatus(result.kyaStatus || '')
      setSubmitted(true)
    } catch (error) {
      console.error('[presale-follow-up] submit failed', error)
      setErrorMessage('Unable to save follow-up details right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const noop = () => {}

  return (
    <div className="min-h-screen bg-[var(--bg0)]">
      <div className="scanline" />
      <Nav scrollTo={noop} palette={palette} togglePalette={togglePalette} />

      <section className="pt-36 pb-14 px-8">
        <div className="max-w-[760px] mx-auto">
          <p className="section-label">Issuance Follow-Up</p>
          <h1 className="font-display text-[clamp(28px,5vw,56px)] font-bold text-white leading-[1.05] mb-4">
            Wallet Binding and KYA Intake
          </h1>
          <p className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.48)] max-w-[720px] leading-[2]">
            Use this follow-up form after your reservation is recorded so we can connect your intended wallet
            and ownership jurisdiction before CAC issuance.
          </p>
        </div>
      </section>

      <section className="px-8 pb-10">
        <div className="max-w-[760px] mx-auto border border-[var(--border)] bg-[rgba(255,140,0,0.03)] p-5">
          <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Follow-Up Sequence</p>
          <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.45)] leading-[2]">
            Reservation recorded → wallet and owner details submitted here → KYA review → admin marks ready for issuance → CAC record created → physical card fulfillment.
          </p>
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-[620px] mx-auto">
          {submitted ? (
            <div className="p-8 border border-[var(--green)] bg-[rgba(0,255,204,0.04)] text-center">
              <p className="text-[var(--green)] text-[11px] tracking-[0.1em] uppercase mb-2">Follow-Up Received</p>
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.5)] leading-[2]">
                Your reservation is now in <span className="text-white">{status}</span> with KYA status{' '}
                <span className="text-white">{kyaStatus}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Reservation ID
                </label>
                <input
                  type="text"
                  required
                  value={form.reservationId}
                  onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors"
                  placeholder="Paste your reservation ID"
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Intended Wallet Address
                </label>
                <input
                  type="text"
                  required
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Operator Name
                </label>
                <input
                  type="text"
                  value={form.operatorName}
                  onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors"
                  placeholder="Human operator or entity contact"
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Owner Jurisdiction
                </label>
                <input
                  type="text"
                  required
                  value={form.ownerJurisdiction}
                  onChange={(e) => setForm({ ...form, ownerJurisdiction: e.target.value })}
                  className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors"
                  placeholder="Delaware, USA"
                />
              </div>

              <div>
                <label className="text-[8px] tracking-[0.18em] text-[rgba(255,160,0,0.5)] uppercase block mb-1.5">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full min-h-[96px] bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors"
                  placeholder="Optional KYA notes or issuance context."
                />
              </div>

              {errorMessage ? (
                <div className="border border-[var(--pink)] bg-[rgba(255,51,153,0.05)] p-4">
                  <p className="text-[8px] tracking-[0.08em] text-[rgba(255,120,180,0.85)] leading-[1.8]">
                    {errorMessage}
                  </p>
                </div>
              ) : null}

              <button type="submit" className="btn-primary w-full text-center" disabled={submitting}>
                {submitting ? 'Saving Follow-Up...' : 'Submit Follow-Up →'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
