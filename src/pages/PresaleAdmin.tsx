import { useEffect, useMemo, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { usePalette } from '../hooks/usePalette'

interface ReservationRecord {
  id: string
  full_name: string
  email: string
  participant_type: string
  payment_rail: string
  reservation_tier?: string
  reservation_amount_usd: number
  payment_status?: string
  status: string
  kya_status?: string
  wallet_address: string | null
  intended_wallet_address?: string | null
  tx_hash: string | null
  operator_name?: string | null
  owner_jurisdiction?: string | null
  stripe_checkout_session_id?: string | null
  stripe_payment_intent_id?: string | null
  paid_at?: string | null
  followup_submitted_at?: string | null
  wallet_bound_at?: string | null
  created_at: string
  updated_at?: string
}

interface AdminResponse {
  success: boolean
  count: number
  summary: Record<string, number>
  paymentSummary?: Record<string, number>
  railSummary?: Record<string, number>
  reservations: ReservationRecord[]
  error?: string
}

type FilterValue = 'all' | 'stripe' | 'usdc_base' | 'payment_confirmed' | 'pending_payment' | 'payment_submitted' | 'pending_confirmation' | 'confirmed' | 'kya_pending' | 'wallet_pending' | 'ready_for_issuance' | 'issued'

const ADMIN_KEY_STORAGE = 'presale_admin_key'

function exportRows(fileName: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export default function PresaleAdmin() {
  const { palette, togglePalette } = usePalette()
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [summary, setSummary] = useState<Record<string, number>>({})
  const [paymentSummary, setPaymentSummary] = useState<Record<string, number>>({})
  const [railSummary, setRailSummary] = useState<Record<string, number>>({})
  const [reservations, setReservations] = useState<ReservationRecord[]>([])
  const [railFilter, setRailFilter] = useState<'all' | 'stripe' | 'usdc_base'>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'payment_confirmed' | 'payment_submitted' | 'pending_payment'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_confirmation' | 'confirmed' | 'wallet_pending' | 'kya_pending' | 'ready_for_issuance' | 'issued'>('all')

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (stored) {
      setAdminKey(stored)
    }
  }, [])

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const railMatch = railFilter === 'all' || reservation.payment_rail === railFilter
      const paymentMatch = paymentFilter === 'all' || reservation.payment_status === paymentFilter
      const statusMatch = statusFilter === 'all' || reservation.status === statusFilter
      return railMatch && paymentMatch && statusMatch
    })
  }, [paymentFilter, railFilter, reservations, statusFilter])

  const newReservations = filteredReservations.filter((reservation) => {
    const createdAt = new Date(reservation.created_at).getTime()
    return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000
  })

  const paidReservations = reservations.filter(
    (reservation) => reservation.payment_status === 'payment_confirmed'
  )

  const unpaidReservations = reservations.filter(
    (reservation) => reservation.payment_status !== 'payment_confirmed'
  )

  const followupCompleted = reservations.filter(
    (reservation) => Boolean(reservation.followup_submitted_at || reservation.wallet_bound_at)
  )

  const readyForIssuance = reservations.filter(
    (reservation) =>
      reservation.status === 'ready_for_issuance' ||
      (
        reservation.payment_status === 'payment_confirmed' &&
        reservation.kya_status === 'approved' &&
        Boolean(reservation.intended_wallet_address || reservation.wallet_bound_at)
      )
  )

  const pendingFulfillment = reservations.filter(
    (reservation) =>
      reservation.payment_status === 'payment_confirmed' &&
      reservation.status !== 'issued'
  )

  const updateReservation = async (
    reservationId: string,
    patch: { status?: string; kyaStatus?: string; paymentStatus?: string }
  ) => {
    setErrorMessage('')

    try {
      const response = await fetch('/.netlify/functions/presale-admin-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          reservationId,
          status: patch.status,
          kyaStatus: patch.kyaStatus,
          paymentStatus: patch.paymentStatus,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Unable to update reservation.')
        return
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId
            ? {
                ...reservation,
                status: data.status || reservation.status,
                kya_status: data.kyaStatus || reservation.kya_status,
                payment_status: data.paymentStatus || reservation.payment_status,
                updated_at: new Date().toISOString(),
              }
            : reservation
        )
      )
      setSummary((current) => {
        const next = { ...current }
        const prior = reservations.find((reservation) => reservation.id === reservationId)?.status
        if (prior && next[prior]) next[prior] -= 1
        if (data.status) next[data.status] = (next[data.status] || 0) + 1
        return next
      })
    } catch (error) {
      console.error('[presale-admin] update failed', error)
      setErrorMessage('Unable to update reservation right now.')
    }
  }

  const loadReservations = async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/.netlify/functions/presale-admin?limit=100', {
        headers: {
          'x-admin-key': adminKey,
        },
      })

      const data = (await response.json()) as AdminResponse

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Unable to load reservations.')
        return
      }

      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey)
      setSummary(data.summary || {})
      setPaymentSummary(data.paymentSummary || {})
      setRailSummary(data.railSummary || {})
      setReservations(data.reservations || [])
    } catch (error) {
      console.error('[presale-admin] load failed', error)
      setErrorMessage('Unable to reach the reservation admin endpoint right now.')
    } finally {
      setLoading(false)
    }
  }

  const exportContacts = () => {
    exportRows(
      'presale-reservations.csv',
      [
        [
          'full_name',
          'email',
          'payment_rail',
          'payment_status',
          'status',
          'kya_status',
          'wallet_or_tx',
          'reservation_id',
        ],
        ...reservations.map((reservation) => [
          reservation.full_name,
          reservation.email,
          reservation.payment_rail,
          reservation.payment_status || '',
          reservation.status,
          reservation.kya_status || '',
          reservation.intended_wallet_address || reservation.wallet_address || reservation.tx_hash || '',
          reservation.id,
        ]),
      ]
    )
  }

  const exportIssuanceQueue = () => {
    exportRows(
      'cac-issuance-queue.csv',
      [
        [
          'full_name',
          'email',
          'wallet',
          'operator_name',
          'owner_jurisdiction',
          'payment_status',
          'kya_status',
          'status',
        ],
        ...readyForIssuance.map((reservation) => [
          reservation.full_name,
          reservation.email,
          reservation.intended_wallet_address || reservation.wallet_address || '',
          reservation.operator_name || '',
          reservation.owner_jurisdiction || '',
          reservation.payment_status || '',
          reservation.kya_status || '',
          reservation.status,
        ]),
      ]
    )
  }

  const noop = () => {}

  const filters: Array<{
    label: string
    value: FilterValue
    active: boolean
    onClick: () => void
  }> = [
    { label: 'All', value: 'all', active: railFilter === 'all' && paymentFilter === 'all' && statusFilter === 'all', onClick: () => { setRailFilter('all'); setPaymentFilter('all'); setStatusFilter('all') } },
    { label: 'Stripe', value: 'stripe', active: railFilter === 'stripe', onClick: () => setRailFilter('stripe') },
    { label: 'USDC', value: 'usdc_base', active: railFilter === 'usdc_base', onClick: () => setRailFilter('usdc_base') },
    { label: 'Paid', value: 'payment_confirmed', active: paymentFilter === 'payment_confirmed', onClick: () => setPaymentFilter('payment_confirmed') },
    { label: 'Unpaid', value: 'payment_submitted', active: paymentFilter === 'payment_submitted', onClick: () => setPaymentFilter('payment_submitted') },
    { label: 'Ready', value: 'ready_for_issuance', active: statusFilter === 'ready_for_issuance', onClick: () => setStatusFilter('ready_for_issuance') },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg0)]">
      <div className="scanline" />
      <Nav scrollTo={noop} palette={palette} togglePalette={togglePalette} />

      <section className="pt-36 pb-14 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="section-label">Internal Admin</p>
          <h1 className="font-display text-[clamp(28px,5vw,56px)] font-bold text-white leading-[1.05] mb-4">
            Presale Reservation Dashboard
          </h1>
          <p className="text-[10px] tracking-[0.08em] text-[rgba(255,160,0,0.48)] max-w-[780px] leading-[2]">
            This page is the operating console for the CAC card presale. Use it to see new reservations,
            distinguish paid from unpaid submissions, separate Stripe from Base USDC, export contacts,
            and move qualified reservations into the CAC issuance queue.
          </p>
        </div>
      </section>

      <section className="px-8 pb-12">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[340px,1fr] gap-8">
          <div className="space-y-6">
            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)] h-fit">
              <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Access</p>
              <label className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase block mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full bg-[rgba(255,140,0,0.04)] border border-[var(--border)] text-[var(--amber)] font-mono text-[11px] px-4 py-3 outline-none focus:border-[var(--amber2)] transition-colors placeholder:text-[rgba(255,160,0,0.2)]"
                placeholder="PRESALE_ADMIN_KEY"
              />
              <button
                type="button"
                onClick={loadReservations}
                className="btn-primary w-full mt-4 text-center"
                disabled={!adminKey || loading}
              >
                {loading ? 'Loading...' : 'Load Reservations'}
              </button>

              {errorMessage ? (
                <div className="border border-[var(--pink)] bg-[rgba(255,51,153,0.05)] p-4 mt-4">
                  <p className="text-[8px] tracking-[0.08em] text-[rgba(255,120,180,0.85)] leading-[1.8]">
                    {errorMessage}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
              <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Fulfillment Sequence</p>
              <ol className="space-y-3 text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.45)] leading-[1.9]">
                <li>1. Reservation is recorded with payment rail and contact data.</li>
                <li>2. Payment is confirmed manually or via future Stripe reconciliation.</li>
                <li>3. Wallet binding and KYA intake are collected through follow-up.</li>
                <li>4. Reservation is marked ready for CAC issuance after approval.</li>
                <li>5. CAC record is created, then physical card fulfillment is scheduled.</li>
              </ol>
            </div>

            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
              <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Ops Notes</p>
              <ul className="space-y-2 text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.42)] leading-[1.9]">
                <li>Use `Confirm` when payment is verified and the reservation is real.</li>
                <li>Use `KYA Review` after the holder submits owner and wallet details.</li>
                <li>Use `Ready` only when payment is confirmed, KYA is approved, and a wallet is bound.</li>
                <li>`Issued` should be the final step after CAC record creation and fulfillment scheduling.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-2">Total Loaded</p>
                <p className="font-display text-[32px] text-white">{reservations.length}</p>
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-2">New (7 Days)</p>
                <p className="font-display text-[32px] text-white">{newReservations.length}</p>
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-2">Paid</p>
                <p className="font-display text-[32px] text-white">{paidReservations.length}</p>
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-2">Ready Queue</p>
                <p className="font-display text-[32px] text-white">{readyForIssuance.length}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Payment Summary</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(paymentSummary).length === 0 ? (
                    <span className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">Load reservations to see payment states.</span>
                  ) : (
                    Object.entries(paymentSummary).map(([status, count]) => (
                      <span key={status} className="px-3 py-1.5 border border-[var(--border)] bg-[rgba(255,140,0,0.05)] text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.55)]">
                        {status}: {count}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Rail Summary</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(railSummary).length === 0 ? (
                    <span className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">Load reservations to see payment rails.</span>
                  ) : (
                    Object.entries(railSummary).map(([rail, count]) => (
                      <span key={rail} className="px-3 py-1.5 border border-[var(--border)] bg-[rgba(255,140,0,0.05)] text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.55)]">
                        {rail}: {count}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Status Summary</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(summary).length === 0 ? (
                    <span className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">Load reservations to see status states.</span>
                  ) : (
                    Object.entries(summary).map(([status, count]) => (
                      <span key={status} className="px-3 py-1.5 border border-[var(--border)] bg-[rgba(255,140,0,0.05)] text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.55)]">
                        {status}: {count}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr,auto,auto] gap-4 items-start">
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Quick Filters</p>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={`${filter.label}-${filter.value}`}
                      type="button"
                      onClick={filter.onClick}
                      className={`px-3 py-2 border text-[8px] tracking-[0.12em] uppercase ${
                        filter.active
                          ? 'border-[var(--amber2)] bg-[rgba(255,140,0,0.12)] text-[var(--amber)]'
                          : 'border-[var(--border)] bg-[rgba(255,140,0,0.03)] text-[rgba(255,160,0,0.45)]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-ghost w-full text-center" onClick={exportContacts}>
                Export Contacts
              </button>
              <button type="button" className="btn-primary w-full text-center" onClick={exportIssuanceQueue}>
                Export Ready Queue
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Needs Payment Review</p>
                {unpaidReservations.length === 0 ? (
                  <p className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">No unpaid reservations in the current load.</p>
                ) : (
                  <div className="space-y-2">
                    {unpaidReservations.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-3 py-2">
                        <div className="text-[9px] text-white">{reservation.full_name}</div>
                        <div className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.38)] uppercase">
                          {reservation.payment_rail} / {reservation.payment_status || 'unknown'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Follow-Up Submitted</p>
                {followupCompleted.length === 0 ? (
                  <p className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">No follow-up records submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {followupCompleted.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-3 py-2">
                        <div className="text-[9px] text-white">{reservation.full_name}</div>
                        <div className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.38)] uppercase">
                          {reservation.owner_jurisdiction || 'jurisdiction pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
                <p className="text-[8px] tracking-[0.14em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Ready for CAC Issuance</p>
                {readyForIssuance.length === 0 ? (
                  <p className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.35)]">No reservations are ready for issuance yet.</p>
                ) : (
                  <div className="space-y-2">
                    {readyForIssuance.map((reservation) => (
                      <div key={reservation.id} className="border border-[var(--green)] bg-[rgba(0,255,204,0.05)] px-3 py-2">
                        <div className="text-[9px] text-white">{reservation.full_name}</div>
                        <div className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.38)] uppercase">
                          {reservation.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border border-[var(--border)] bg-[rgba(255,140,0,0.03)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
                <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase">Reservation Queue</p>
                <p className="text-[8px] tracking-[0.1em] text-[rgba(255,160,0,0.35)] uppercase">
                  Showing {filteredReservations.length} of {reservations.length}
                </p>
              </div>

              {filteredReservations.length === 0 ? (
                <div className="p-8">
                  <p className="text-[9px] tracking-[0.08em] text-[rgba(255,160,0,0.4)]">
                    No reservation records match the current filter set.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1060px]">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {['Name', 'Contact', 'Payment', 'Ops Status', 'Wallet / Jurisdiction', 'Actions', 'Updated'].map((label) => (
                          <th
                            key={label}
                            className="text-left px-5 py-3 text-[8px] tracking-[0.14em] uppercase text-[rgba(255,160,0,0.45)] font-normal"
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b border-[rgba(255,140,0,0.08)] align-top">
                          <td className="px-5 py-4 text-[10px] text-white">
                            <div>{reservation.full_name}</div>
                            <div className="text-[8px] tracking-[0.08em] text-[rgba(255,160,0,0.32)] uppercase mt-1">
                              {reservation.participant_type} / {reservation.reservation_tier || 'builder'}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[9px] text-[rgba(255,160,0,0.55)] leading-[1.8]">
                            <div>{reservation.email}</div>
                            <div className="mt-2 font-mono text-[8px] text-[rgba(255,160,0,0.35)]">{reservation.id}</div>
                          </td>
                          <td className="px-5 py-4 text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.55)] leading-[1.9]">
                            <div>{reservation.payment_rail}</div>
                            <div>{reservation.payment_status || 'unknown'}</div>
                            <div className="text-[rgba(255,160,0,0.35)]">${reservation.reservation_amount_usd}</div>
                            {reservation.paid_at ? (
                              <div className="text-[rgba(255,160,0,0.35)] normal-case">
                                paid {new Date(reservation.paid_at).toLocaleString()}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-5 py-4 text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.55)] leading-[1.9]">
                            <div>{reservation.status}</div>
                            <div className="text-[rgba(255,160,0,0.35)]">KYA: {reservation.kya_status || 'not_started'}</div>
                            <div className="text-[rgba(255,160,0,0.35)]">
                              {reservation.followup_submitted_at ? 'follow-up received' : 'follow-up pending'}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[8px] text-[rgba(255,160,0,0.45)] font-mono leading-[1.8]">
                            <div>{reservation.intended_wallet_address || reservation.wallet_address || reservation.tx_hash || 'Not provided'}</div>
                            <div className="mt-2 text-[7px] text-[rgba(255,160,0,0.32)] font-sans">
                              {reservation.owner_jurisdiction || 'Jurisdiction pending'}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[8px] text-[rgba(255,160,0,0.45)]">
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => updateReservation(reservation.id, { status: 'confirmed', paymentStatus: 'payment_confirmed' })}
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => updateReservation(reservation.id, { status: 'kya_pending', kyaStatus: 'under_review' })}
                              >
                                KYA Review
                              </button>
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => updateReservation(reservation.id, { status: 'ready_for_issuance', kyaStatus: 'approved', paymentStatus: 'payment_confirmed' })}
                              >
                                Ready
                              </button>
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => updateReservation(reservation.id, { status: 'issued' })}
                              >
                                Issued
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[8px] text-[rgba(255,160,0,0.45)]">
                            {new Date(reservation.updated_at || reservation.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-6 border border-[var(--border)] bg-[rgba(255,140,0,0.03)]">
              <p className="text-[8px] tracking-[0.16em] text-[rgba(255,160,0,0.45)] uppercase mb-3">Pending Fulfillment Queue</p>
              <p className="text-[9px] tracking-[0.06em] text-[rgba(255,160,0,0.42)] leading-[2] mb-4">
                These reservations have already been paid and still need one or more fulfillment steps before the presale is fully closed out.
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-4 py-4">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.45)] mb-2">Paid, Follow-Up Pending</p>
                  <p className="font-display text-[22px] text-white">
                    {pendingFulfillment.filter((reservation) => !reservation.followup_submitted_at).length}
                  </p>
                </div>
                <div className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-4 py-4">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.45)] mb-2">Paid, KYA Pending</p>
                  <p className="font-display text-[22px] text-white">
                    {pendingFulfillment.filter((reservation) => reservation.kya_status !== 'approved').length}
                  </p>
                </div>
                <div className="border border-[var(--border)] bg-[rgba(255,140,0,0.04)] px-4 py-4">
                  <p className="text-[8px] tracking-[0.12em] uppercase text-[rgba(255,160,0,0.45)] mb-2">Paid, Not Yet Issued</p>
                  <p className="font-display text-[22px] text-white">{pendingFulfillment.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
