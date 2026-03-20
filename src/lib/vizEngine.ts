export interface VizEngine {
  destroy: () => void
  setPalette: (p: string) => void
  setVisibleLayers: (v: Record<string, boolean>) => void
  tog: (key: string) => void
  toggleExplode: () => void
  toggleFly: () => void
  toggleLayer: (type: string) => void
  reset: () => void
}

interface Node {
  type: string
  x: number
  y: number
  z: number
  r: number
  rings: number
  name: string
  label: string
  rotOff: number
  tvl: number
  apr: number
  id: string
  conns: Node[]
  orbit: Orbit | null
}

interface Orbit {
  parent: Node
  radius: number
  speed: number
  phase: number
  incl: number
  tilt: number
}

interface Edge {
  a: Node
  b: Node
  w: number
}

interface Palette {
  bg0: string
  bg1: string
  tunnel: string
  streak: string
  uiC: string
  uiT: string
  border: string
  bg: string
  scan: string
  corner: string
  types: Record<string, string>
}

const PAL: Record<string, Palette> = {
  amber: {
    bg0: '#0e0600',
    bg1: '#060200',
    tunnel: 'rgba(210,120,0,',
    streak: 'rgba(255,160,20,',
    uiC: 'rgba(255,145,0,',
    uiT: '#ffbb33',
    border: 'rgba(210,120,0,0.28)',
    bg: 'rgba(160,80,0,0.06)',
    scan: 'rgba(255,145,0,0.1)',
    corner: 'rgba(210,120,0,0.36)',
    types: {
      core: '#00ffcc',
      pool: '#ffaa00',
      tranche: '#ff6600',
      dao: '#ff3300',
      inst: '#ffdd44',
      agent: '#44ffaa',
      retail: '#7a5200'
    }
  },
  cyan: {
    bg0: '#00101e',
    bg1: '#000810',
    tunnel: 'rgba(0,145,215,',
    streak: 'rgba(0,195,255,',
    uiC: 'rgba(0,195,255,',
    uiT: '#00d2ff',
    border: 'rgba(0,165,255,0.25)',
    bg: 'rgba(0,125,255,0.05)',
    scan: 'rgba(0,195,255,0.1)',
    corner: 'rgba(0,165,255,0.32)',
    types: {
      core: '#00ffcc',
      pool: '#00aaff',
      tranche: '#ffaa00',
      dao: '#ff3399',
      inst: '#aa88ff',
      agent: '#00ffaa',
      retail: '#1a5a7a'
    }
  }
}

export function initVizEngine(canvas: HTMLCanvasElement, wrap: HTMLElement): VizEngine {
  const ctx = canvas.getContext('2d')!
  
  // Create tooltip
  const tip = document.createElement('div')
  tip.style.cssText = 'position:absolute;border-radius:2px;padding:8px 11px;font-size:9px;pointer-events:none;display:none;z-index:30;line-height:1.85;letter-spacing:.06em;white-space:pre;background:rgba(6,2,0,0.95);border:0.5px solid rgba(255,140,0,0.45);color:#ffbb33;font-family:Share Tech Mono,monospace;'
  wrap.appendChild(tip)

  let W = 0, H = 0
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  
  function resize() {
    W = wrap.offsetWidth
    H = wrap.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  let palKey = 'amber'
  let pal = PAL.amber

  function hexA(hex: string, a: number): string {
    if (!hex || hex[0] !== '#') return `rgba(128,128,128,${a})`
    return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`
  }

  const vis: Record<string, boolean> = { core: true, pool: true, dao: true, tranche: true, inst: true, agent: true, retail: true }
  const st: Record<string, boolean> = { stream: true, tunnel: true, rotate: true, labels: false }

  const PI2 = Math.PI * 2
  const rng = (a: number, b: number) => a + Math.random() * (b - a)
  
  const TDEF: Record<string, { r: number; rings: number; name: string }> = {
    core: { r: 46, rings: 4, name: 'TRIBUTARY CORE' },
    pool: { r: 25, rings: 3, name: 'REIT POOL' },
    tranche: { r: 14, rings: 2, name: 'YIELD TRANCHE' },
    dao: { r: 19, rings: 3, name: 'DAO GOVERNANCE' },
    inst: { r: 9, rings: 2, name: 'INST LP' },
    agent: { r: 5, rings: 1, name: 'GHOST AGENT' },
    retail: { r: 2.5, rings: 0, name: 'RETAIL LP' }
  }

  const nodes: Node[] = []
  const edges: Edge[] = []

  function mkN(type: string, x: number, y: number, z: number, lbl?: string): Node {
    const t = TDEF[type]
    const n: Node = {
      type, x, y, z, r: t.r, rings: t.rings, name: t.name,
      label: lbl || t.name,
      rotOff: rng(0, PI2),
      tvl: rng(2, 80),
      apr: rng(3, 14),
      id: 'N' + Math.floor(rng(1000, 9999)),
      conns: [],
      orbit: null
    }
    nodes.push(n)
    return n
  }

  function addE(a: Node, b: Node, w: number) {
    edges.push({ a, b, w })
    a.conns.push(b)
    b.conns.push(a)
  }

  function mkOrbit(parent: Node, radius: number, speed: number, phase: number, incl?: number, tilt?: number): Orbit {
    return { parent, radius, speed, phase, incl: incl || 0, tilt: tilt || 0 }
  }

  // Build scene
  const core = mkN('core', 0, 0, 0, 'TRIBUTARY CAMPUS')
  core.orbit = null

  const pools: Node[] = []
  const POOL_LABELS = ['POOL-ALPHA', 'POOL-BETA', 'POOL-GAMMA', 'OPP-ZONE-A', 'OPP-ZONE-B', 'GROWTH-01', 'INCOME-02']
  for (let i = 0; i < 7; i++) {
    const n = mkN('pool', 0, 0, 0, POOL_LABELS[i])
    n.orbit = mkOrbit(core, 138 + rng(-8, 8), 0.00028 + rng(0, 0.00012), (i / 7) * PI2, rng(0, 0.35), rng(0, 0.2))
    pools.push(n)
  }

  const daos: Node[] = []
  const DAO_LABELS = ['DAO-ALPHA', 'DAO-BETA', 'DAO-GAMMA', 'DAO-DELTA']
  for (let i = 0; i < 4; i++) {
    const n = mkN('dao', 0, 0, 0, DAO_LABELS[i])
    n.orbit = mkOrbit(core, 95 + rng(-8, 8), 0.00042 + rng(0, 0.0002), (i / 4) * PI2 + 0.9, rng(0.2, 0.6), rng(0, 0.3))
    daos.push(n)
  }

  const tranches: Node[] = []
  for (let i = 0; i < 16; i++) {
    const n = mkN('tranche', 0, 0, 0)
    const parentPool = pools[i % pools.length]
    n.orbit = mkOrbit(parentPool, 55 + rng(-8, 8), 0.0006 + rng(0, 0.0004), rng(0, PI2), rng(0, 0.5), rng(0, 0.4))
    tranches.push(n)
  }

  for (let i = 0; i < 55; i++) {
    const n = mkN('inst', 0, 0, 0)
    const parentPool = pools[i % pools.length]
    n.orbit = mkOrbit(parentPool, 75 + rng(-15, 15), 0.0004 + rng(0, 0.0003), rng(0, PI2), rng(0, 0.8), rng(0, 0.5))
  }

  for (let i = 0; i < 312; i++) {
    const n = mkN('agent', 0, 0, 0)
    const parent = Math.random() > 0.35 ? pools[Math.floor(rng(0, pools.length))] : core
    const baseR = parent === core ? rng(160, 280) : rng(40, 90)
    n.orbit = mkOrbit(parent, baseR, 0.0009 + rng(0, 0.0008), rng(0, PI2), rng(0, 1.2), rng(0, 0.8))
  }

  for (let i = 0; i < 2769; i++) {
    const n = mkN('retail', 0, 0, 0)
    n.orbit = mkOrbit(core, rng(200, 520), 0.00008 + rng(0, 0.00012), rng(0, PI2), rng(0, 1.4), rng(0, 1.0))
  }

  // Build edges
  pools.forEach(p => addE(core, p, 2.4))
  daos.forEach(d => { addE(d, core, 1.6); addE(d, pools[Math.floor(rng(0, pools.length))], 0.9) })
  tranches.forEach(t => { if (t.orbit) { addE(t, t.orbit.parent, 0.85); if (Math.random() > 0.5) addE(t, core, 0.45) } })
  nodes.filter(n => n.type === 'inst').forEach(n => { if (n.orbit) addE(n, n.orbit.parent, 0.65) })
  nodes.filter(n => n.type === 'agent').forEach((n, i) => {
    if (n.orbit) {
      addE(n, n.orbit.parent, i % 4 === 0 ? 0.38 : 0.25)
      if (i % 5 === 0) addE(n, tranches[Math.floor(rng(0, tranches.length))], 0.2)
    }
  })

  // Camera state
  let camAng = 0, camPitch = 22, tAng = 0, tPitch = 22, camZ = 1
  let explodeScale = 1, explodeTarget = 1
  let flyMode = false, camX = 0, camY = 0, camZ2 = 0, flyYaw = 0, flyPitch2 = 0
  const keys: Record<string, boolean> = {}
  let diveZ = 0, diveSpd = 0, diving = false
  let drag = false, lmx = 0, lmy = 0, mx = 0, my = 0
  let tick = 0, hov: Node | null = null, hovTick = 0
  let rafId: number

  function getWorldPos(n: Node, t: number): { x: number; y: number; z: number } {
    if (!n.orbit) return { x: 0, y: 0, z: 0 }
    const o = n.orbit
    const angle = o.phase + t * o.speed
    const r = o.radius * explodeScale
    const lx = Math.cos(angle) * r
    const lz = Math.sin(angle) * r
    const ly = lz * Math.sin(o.incl)
    const lz2 = lz * Math.cos(o.incl)
    const fx = lx * Math.cos(o.tilt) - ly * Math.sin(o.tilt)
    const fy = lx * Math.sin(o.tilt) + ly * Math.cos(o.tilt)
    const fz = lz2
    const parent = o.parent
    const pp = parent.orbit ? getWorldPos(parent, t) : { x: 0, y: 0, z: 0 }
    return { x: pp.x + fx, y: pp.y + fy * 0.5, z: pp.z + fz }
  }

  function proj(x: number, y: number, z: number): { sx: number; sy: number; sz: number; sc: number } {
    if (flyMode) {
      const rx = x - camX, ry = y - camY, rz = z - camZ2
      const yr = flyYaw * Math.PI / 180, pr = flyPitch2 * Math.PI / 180
      const cx = rx * Math.cos(yr) + rz * Math.sin(yr)
      const cz = -rx * Math.sin(yr) + rz * Math.cos(yr)
      const cy = ry * Math.cos(pr) - cz * Math.sin(pr)
      const cz2 = ry * Math.sin(pr) + cz * Math.cos(pr)
      if (cz2 < 2) return { sx: W / 2, sy: H / 2, sz: 9999, sc: 0 }
      const fov = 500 / cz2
      return { sx: W / 2 + cx * fov, sy: H / 2 + cy * fov * 0.88, sz: cz2, sc: fov }
    }
    const ang = camAng * Math.PI / 180, pitch = camPitch * Math.PI / 180
    const rx = x * Math.cos(ang) + z * Math.sin(ang), rz = -x * Math.sin(ang) + z * Math.cos(ang)
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch), rz2 = y * Math.sin(pitch) + rz * Math.cos(pitch)
    const fov = 478 / ((camZ * 875) + (rz2 + diveZ) * 0.21)
    return { sx: W / 2 + rx * fov, sy: H / 2 + ry * fov * 0.5, sz: rz2, sc: fov }
  }

  // Streaks for tunnel effect
  const streaks: { angle: number; dist: number; z: number; spd: number; len: number; alpha: number; w: number }[] = []
  for (let i = 0; i < 220; i++) {
    streaks.push({
      angle: rng(0, PI2), dist: rng(25, 460), z: rng(-900, 900),
      spd: rng(0.5, 3.2), len: rng(55, 240), alpha: rng(0.04, 0.19), w: rng(0.3, 1.2)
    })
  }

  function drawTunnel() {
    const p = pal, ang = camAng * Math.PI / 180, pitch = camPitch * Math.PI / 180
    function p2(x: number, y: number, z: number) {
      const rx = x * Math.cos(ang) + z * Math.sin(ang), rz = -x * Math.sin(ang) + z * Math.cos(ang)
      const ry = y * Math.cos(pitch) - rz * Math.sin(pitch), rz2 = y * Math.sin(pitch) + rz * Math.cos(pitch)
      const fov = 478 / ((camZ * 875) + (rz2 + diveZ) * 0.21)
      return { sx: W / 2 + rx * fov, sy: H / 2 + ry * fov * 0.5, ok: fov > 0 }
    }
    for (const s of streaks) {
      s.z += s.spd * (diving ? 2.8 : 1)
      if (s.z > 920) s.z = -920
      const sx = Math.cos(s.angle) * s.dist, sy = Math.sin(s.angle) * s.dist * 0.44
      const pa = p2(sx, sy, s.z), pb = p2(sx, sy, s.z - s.len)
      if (!pa.ok || !pb.ok) continue
      const g = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(0.5, p.streak + s.alpha * 0.55 + ')')
      g.addColorStop(0.85, p.streak + s.alpha + ')')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.moveTo(pa.sx, pa.sy)
      ctx.lineTo(pb.sx, pb.sy)
      ctx.strokeStyle = g
      ctx.lineWidth = s.w
      ctx.stroke()
    }
    for (let d = 0; d < 7; d++) {
      const rz = (((tick * 0.65 + d * 132) % 924) - 462)
      const segs = 52, pts: { sx: number; sy: number }[] = []
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * PI2
        pts.push(p2(Math.cos(a) * 330, Math.sin(a) * 330 * 0.44, rz))
      }
      const fade = Math.max(0, 0.065 - Math.abs(rz) * 0.00013)
      if (fade < 0.004) continue
      ctx.beginPath()
      pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.sx, pt.sy) : ctx.lineTo(pt.sx, pt.sy))
      ctx.strokeStyle = p.tunnel + fade + ')'
      ctx.lineWidth = 0.45
      ctx.stroke()
    }
  }

  function drawNode(n: Node, sx: number, sy: number, sc: number, depth: number, alpha: number) {
    if (alpha < 0.01) return
    const color = pal.types[n.type]
    if (!color) return
    const r = n.r * sc
    if (r < 0.28) return
    const depthFade = Math.max(0.05, Math.min(1, 1 - depth * 0.00048))
    const fade = depthFade * alpha
    const rot = tick * 0.0025 + n.rotOff
    const isHov = n === hov

    if (n.type === 'retail') {
      ctx.beginPath()
      ctx.arc(sx, sy, Math.max(r, 0.65), 0, PI2)
      ctx.fillStyle = hexA(color, fade * 0.72)
      ctx.fill()
      return
    }
    if (n.type === 'agent') {
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, PI2)
      ctx.fillStyle = hexA(color, fade * 0.12)
      ctx.fill()
      ctx.strokeStyle = hexA(color, fade * 0.58)
      ctx.lineWidth = 0.65
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(sx, sy, r * 0.36, 0, PI2)
      ctx.fillStyle = hexA(color, fade * 0.82)
      ctx.fill()
      return
    }

    // Glow
    ctx.beginPath()
    ctx.arc(sx, sy, r * 3.0, 0, PI2)
    ctx.fillStyle = hexA(color, fade * 0.052)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(sx, sy, r * 1.75, 0, PI2)
    ctx.fillStyle = hexA(color, fade * 0.072)
    ctx.fill()

    // Gate rings
    for (let ring = 0; ring < n.rings; ring++) {
      const rr = r * (0.44 + ring * 0.3)
      ctx.beginPath()
      ctx.arc(sx, sy, rr, 0, PI2)
      ctx.strokeStyle = hexA(color, fade * (0.72 - ring * 0.14))
      ctx.lineWidth = Math.max(0.4, (1.2 - ring * 0.25) * sc * 0.7)
      ctx.stroke()
      if (rr > 4) {
        const ticks = ring === 0 ? 16 : 10
        for (let t = 0; t < ticks; t++) {
          const a = (t / ticks) * PI2 + rot * (ring % 2 === 0 ? 1 : -0.65)
          const inner = rr - sc * 1.3, outer = rr + sc * 1.3
          ctx.beginPath()
          ctx.moveTo(sx + Math.cos(a) * inner, sy + Math.sin(a) * inner)
          ctx.lineTo(sx + Math.cos(a) * outer, sy + Math.sin(a) * outer)
          ctx.strokeStyle = hexA(color, fade * 0.42)
          ctx.lineWidth = 0.55
          ctx.stroke()
        }
      }
    }

    // Center disc
    ctx.beginPath()
    ctx.arc(sx, sy, r * 0.2, 0, PI2)
    ctx.fillStyle = hexA(color, fade * 0.92)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(sx - r * 0.07, sy - r * 0.07, r * 0.07, 0, PI2)
    ctx.fillStyle = `rgba(255,255,255,${fade * 0.32})`
    ctx.fill()

    // Crosshair
    if (n.rings >= 3 && r > 7) {
      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate(rot * 0.3)
      const cl = r * 0.5
      ctx.strokeStyle = hexA(color, fade * 0.18)
      ctx.lineWidth = 0.45
      ctx.beginPath()
      ctx.moveTo(-cl, 0)
      ctx.lineTo(cl, 0)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -cl)
      ctx.lineTo(0, cl)
      ctx.stroke()
      ctx.restore()
    }

    // Hover rings
    if (isHov) {
      for (let ring = 0; ring < 2; ring++) {
        const phase = (tick * 0.22 + ring * 45) % 90
        const rr = r * 1.7 + phase
        const ra = Math.max(0, 0.2 - phase * 0.0022)
        ctx.beginPath()
        ctx.arc(sx, sy, rr, 0, PI2)
        ctx.strokeStyle = hexA(color, ra * fade)
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // Labels
    if ((st.labels && r > 4) || n.type === 'core' || (n.type === 'pool' && r > 8) || isHov) {
      ctx.fillStyle = hexA(color, Math.min(1, fade * 1.4))
      ctx.font = `${Math.round(Math.min(10, r * 0.56))}px 'Courier New',monospace`
      ctx.textAlign = 'center'
      ctx.fillText(n.label, sx, sy + r * 2 + 10 * sc)
    }
  }

  // Streams
  const streams: { a: Node; b: Node; t: number; spd: number; w: number }[] = []
  function spawnStream() {
    const e = edges[Math.floor(rng(0, Math.min(edges.length, 140)))]
    if (!vis[e.a.type] || !vis[e.b.type]) return
    const fwd = Math.random() > 0.25
    streams.push({ a: fwd ? e.a : e.b, b: fwd ? e.b : e.a, t: 0, spd: 0.006 + rng(0, 0.013), w: e.w })
  }

  function findHov() {
    hovTick++
    if (hovTick % 3 !== 0) return
    let best: Node | null = null, bd = 9999
    for (const n of nodes) {
      if (!vis[n.type]) continue
      if (n.type === 'retail' && Math.random() > 0.06) continue
      const wp = n.orbit ? getWorldPos(n, tick) : { x: 0, y: 0, z: 0 }
      const pp = proj(wp.x, wp.y, wp.z)
      const d = Math.sqrt((pp.sx - mx) ** 2 + (pp.sy - my) ** 2)
      const hr = Math.max(n.r * pp.sc * 2.1, 13)
      if (d < hr && d < bd) { best = n; bd = d }
    }
    hov = best
    if (best) {
      const color = pal.types[best.type]
      const ex = best.type === 'pool' ? `\nTVL:     $${best.tvl.toFixed(1)}M` :
                 best.type === 'tranche' ? `\nAPR:     ${best.apr.toFixed(1)}%` :
                 best.type === 'core' ? `\nPOOL:    $142.6M` : ''
      tip.style.display = 'block'
      tip.style.left = (mx + 15) + 'px'
      tip.style.top = (my - 8) + 'px'
      tip.innerHTML = `<span style="color:${color}">${best.label}</span>\nTYPE:    ${best.name}\nID:      ${best.id}${ex}`
    } else {
      tip.style.display = 'none'
    }
  }

  function draw() {
    rafId = requestAnimationFrame(draw)
    tick++
    ctx.clearRect(0, 0, W, H)

    // Background
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8)
    bg.addColorStop(0, pal.bg0 + 'dd')
    bg.addColorStop(1, pal.bg1 + 'ff')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    if (flyMode) {
      const spd = explodeTarget > 1 ? 6 : 2.5
      const yr = flyYaw * Math.PI / 180, pr = flyPitch2 * Math.PI / 180
      const fx = Math.sin(yr) * Math.cos(pr), fy = -Math.sin(pr), fz = Math.cos(yr) * Math.cos(pr)
      const rx = Math.cos(yr), rz = -Math.sin(yr)
      if (keys['KeyW'] || keys['ArrowUp']) { camX += fx * spd; camY += fy * spd; camZ2 += fz * spd }
      if (keys['KeyS'] || keys['ArrowDown']) { camX -= fx * spd; camY -= fy * spd; camZ2 -= fz * spd }
      if (keys['KeyA'] || keys['ArrowLeft']) { camX -= rx * spd; camZ2 -= rz * spd }
      if (keys['KeyD'] || keys['ArrowRight']) { camX += rx * spd; camZ2 += rz * spd }
      if (keys['KeyQ']) camY += spd
      if (keys['KeyE']) camY -= spd
    } else {
      if (st.rotate && !drag) tAng += 0.07
      camAng += (tAng - camAng) * 0.032
      camPitch += (tPitch - camPitch) * 0.032
    }

    if (diving) {
      diveSpd += 0.45
      diveZ += diveSpd
      if (diveZ > 960) { diveZ = 0; diveSpd = 0; diving = false }
    }

    // Smooth explode scale
    explodeScale += (explodeTarget - explodeScale) * 0.035
    if (Math.abs(explodeScale - explodeTarget) < 0.001) explodeScale = explodeTarget

    if (st.tunnel) drawTunnel()
    findHov()

    // Draw edges
    for (const e of edges) {
      if (!vis[e.a.type] || !vis[e.b.type]) continue
      const wpa = e.a.orbit ? getWorldPos(e.a, tick) : { x: 0, y: 0, z: 0 }
      const wpb = e.b.orbit ? getWorldPos(e.b, tick) : { x: 0, y: 0, z: 0 }
      const pa = proj(wpa.x, wpa.y, wpa.z), pb = proj(wpb.x, wpb.y, wpb.z)
      const depth = (pa.sz + pb.sz) / 2, fade = Math.max(0.01, Math.min(0.19, 0.19 - depth * 0.00046))
      const g = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy)
      g.addColorStop(0, hexA(pal.types[e.a.type], fade * 0.52))
      g.addColorStop(1, hexA(pal.types[e.b.type], fade * 0.52))
      ctx.beginPath()
      ctx.moveTo(pa.sx, pa.sy)
      ctx.lineTo(pb.sx, pb.sy)
      ctx.strokeStyle = g
      ctx.lineWidth = e.w * pa.sc * 0.4
      ctx.stroke()
    }

    // Spawn streams
    if (st.stream && tick % 2 === 0) spawnStream()
    for (let i = streams.length - 1; i >= 0; i--) {
      const s = streams[i]
      s.t += s.spd
      if (s.t >= 1) { streams.splice(i, 1); continue }
      const t0 = Math.max(0, s.t - 0.15)
      const wa = s.a.orbit ? getWorldPos(s.a, tick) : { x: 0, y: 0, z: 0 }
      const wb = s.b.orbit ? getWorldPos(s.b, tick) : { x: 0, y: 0, z: 0 }
      const px1 = wa.x + (wb.x - wa.x) * s.t, py1 = wa.y + (wb.y - wa.y) * s.t, pz1 = wa.z + (wb.z - wa.z) * s.t
      const px0 = wa.x + (wb.x - wa.x) * t0, py0 = wa.y + (wb.y - wa.y) * t0, pz0 = wa.z + (wb.z - wa.z) * t0
      const pp1 = proj(px1, py1, pz1), pp0 = proj(px0, py0, pz0)
      const streamFade = Math.sin(s.t * Math.PI), col = pal.types[s.a.type]
      const g = ctx.createLinearGradient(pp0.sx, pp0.sy, pp1.sx, pp1.sy)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, hexA(col, streamFade * 0.95))
      ctx.beginPath()
      ctx.moveTo(pp0.sx, pp0.sy)
      ctx.lineTo(pp1.sx, pp1.sy)
      ctx.strokeStyle = g
      ctx.lineWidth = Math.max(0.7, s.w * pp1.sc * 0.52)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(pp1.sx, pp1.sy, Math.max(1, 2.1 * pp1.sc * streamFade), 0, PI2)
      ctx.fillStyle = hexA(col, streamFade * 0.88)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pp1.sx, pp1.sy, Math.max(1.5, 4.2 * pp1.sc * streamFade), 0, PI2)
      ctx.fillStyle = hexA(col, streamFade * 0.17)
      ctx.fill()
    }

    // Draw nodes sorted by depth
    const projArr = nodes.map(n => {
      const wp = n.orbit ? getWorldPos(n, tick) : { x: 0, y: 0, z: 0 }
      const pp = proj(wp.x, wp.y, wp.z)
      return { ...pp, n, wx: wp.x, wy: wp.y, wz: wp.z }
    })
    projArr.sort((a, b) => b.sz - a.sz)
    for (const { n, sx, sy, sc, sz } of projArr) {
      if (!vis[n.type]) continue
      drawNode(n, sx, sy, sc, sz, 1)
    }
  }

  // Event handlers
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 2) { e.preventDefault(); return }
    drag = true
    lmx = e.clientX
    lmy = e.clientY
    if (!flyMode) st.rotate = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    const r = wrap.getBoundingClientRect()
    mx = e.clientX - r.left
    my = e.clientY - r.top
    if (flyMode) {
      if (drag) {
        flyYaw -= (e.clientX - lmx) * 0.44
        flyPitch2 = Math.max(-80, Math.min(80, flyPitch2 + (e.clientY - lmy) * 0.28))
        lmx = e.clientX
        lmy = e.clientY
      }
      return
    }
    if (drag) {
      tAng -= (e.clientX - lmx) * 0.44
      tPitch = Math.max(-78, Math.min(78, tPitch + (e.clientY - lmy) * 0.28))
      lmx = e.clientX
      lmy = e.clientY
    }
  }

  const handleMouseUp = () => { drag = false }

  const handleWheel = (e: WheelEvent) => {
    if (flyMode) {
      const spd = e.deltaY * 0.15
      const yr = flyYaw * Math.PI / 180, pr = flyPitch2 * Math.PI / 180
      camX += Math.sin(yr) * Math.cos(pr) * spd
      camY -= Math.sin(pr) * spd
      camZ2 += Math.cos(yr) * Math.cos(pr) * spd
    } else {
      camZ = Math.max(0.22, Math.min(3.0, camZ + e.deltaY * 0.001))
    }
    e.preventDefault()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true
    if (e.code === 'Escape' && flyMode) toggleFly()
  }

  const handleKeyUp = (e: KeyboardEvent) => { keys[e.code] = false }

  wrap.addEventListener('mousedown', handleMouseDown)
  wrap.addEventListener('mousemove', handleMouseMove)
  wrap.addEventListener('mouseup', handleMouseUp)
  wrap.addEventListener('wheel', handleWheel, { passive: false })
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  // Start animation
  rafId = requestAnimationFrame(draw)

  function toggleExplode() {
    explodeTarget = explodeTarget === 1 ? 3.2 : 1
  }

  function toggleFly() {
    flyMode = !flyMode
    if (flyMode) {
      st.rotate = false
      camX = 0
      camY = 0
      camZ2 = 0
      flyYaw = camAng
      flyPitch2 = camPitch
    }
  }

  function resetView() {
    tAng = 0
    tPitch = 22
    camZ = 1
    diveZ = 0
    diveSpd = 0
    diving = false
    if (flyMode) toggleFly()
    explodeTarget = 1
  }

  return {
    destroy: () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      wrap.removeEventListener('mousedown', handleMouseDown)
      wrap.removeEventListener('mousemove', handleMouseMove)
      wrap.removeEventListener('mouseup', handleMouseUp)
      wrap.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (tip.parentNode) tip.parentNode.removeChild(tip)
    },
    setPalette: (p: string) => { palKey = p; pal = PAL[p] || PAL.amber },
    setVisibleLayers: (v: Record<string, boolean>) => { Object.assign(vis, v) },
    tog: (k: string) => { st[k] = !st[k] },
    toggleExplode,
    toggleFly,
    toggleLayer: (type: string) => { vis[type] = !vis[type] },
    reset: resetView,
  }
}
