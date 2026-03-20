import { useState, useEffect, useRef } from 'react'

const entities = [
  { name: 'Navigator', score: 92, role: 'Operator' },
  { name: 'Ceph', score: 87, role: 'Builder Agent' },
  { name: 'Tributary', score: 78, role: 'Public Agent' },
  { name: 'API Service', score: 55, role: 'External' },
  { name: 'New Agent', score: 12, role: 'Unknown' },
]

function getLevel(score: number) {
  if (score >= 80) return { label: 'Trusted', color: '#00d4aa' }
  if (score >= 50) return { label: 'Neutral', color: '#06b6d4' }
  if (score >= 20) return { label: 'Cautious', color: '#f59e0b' }
  return { label: 'Adversarial', color: '#ef4444' }
}

export default function AnimatedTrustGraph() {
  const [animated, setAnimated] = useState(false)
  const [scores, setScores] = useState(entities.map(() => 0))
  const [violated, setViolated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true)
          // Animate bars filling up
          const targetScores = entities.map(e => e.score)
          const steps = 40
          let step = 0
          const interval = setInterval(() => {
            step++
            setScores(targetScores.map(t => Math.round((t * step) / steps)))
            if (step >= steps) clearInterval(interval)
          }, 25)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated])

  const simulateViolation = () => {
    if (violated) return
    setViolated(true)
    // Drop "API Service" (index 3) from current score to 15
    const targetScore = 15
    const currentScore = scores[3]
    const steps = 20
    let step = 0
    const interval = setInterval(() => {
      step++
      setScores(prev => {
        const next = [...prev]
        next[3] = Math.round(currentScore - ((currentScore - targetScore) * step) / steps)
        return next
      })
      if (step >= steps) clearInterval(interval)
    }, 30)
  }

  return (
    <div ref={ref} className="bg-gray-900/80 border border-teal-500/20 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Live Trust Scores</h4>
        <button
          onClick={simulateViolation}
          disabled={violated}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
            violated
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 cursor-pointer'
          }`}
        >
          {violated ? '⚠ Violation Logged' : '⚡ Simulate Violation'}
        </button>
      </div>

      <div className="space-y-3">
        {entities.map((entity, i) => {
          const score = scores[i]
          const level = getLevel(score)
          const isViolated = violated && i === 3

          return (
            <div key={entity.name} className="flex items-center gap-3">
              <div className="w-20 text-right">
                <span className="text-xs text-gray-400 font-medium">{entity.name}</span>
              </div>
              <div className="flex-1 h-7 bg-gray-800/80 rounded-full overflow-hidden relative border border-gray-700/50">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${score}%`,
                    backgroundColor: level.color,
                    boxShadow: `0 0 12px ${level.color}40`,
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/80">
                  {score}
                </span>
              </div>
              <div
                className="w-20 text-left"
                style={{ color: level.color }}
              >
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border`} style={{ borderColor: `${level.color}30`, backgroundColor: `${level.color}10` }}>
                  {level.label}
                </span>
              </div>
              {isViolated && (
                <span className="text-[10px] text-red-400 animate-pulse">-40 pts</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Trust is asymmetric: earning from 0→80 takes weeks of positive interactions. A single violation drops score instantly. 
          {violated && <span className="text-red-400"> API Service violated a constitutional boundary — trust dropped from 55 to 15 in one action.</span>}
        </p>
      </div>
    </div>
  )
}
