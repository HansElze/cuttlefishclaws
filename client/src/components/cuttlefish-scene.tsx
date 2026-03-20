"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import CuttlefishModel from "./cuttlefish-model"
import EnhancedCuttlefishModel from "./enhanced-cuttlefish-model"

type EmotionalState = "idle" | "curious" | "thinking" | "excited" | "cautious"

interface CuttlefishSceneProps {
  useEnhancedModel?: boolean
  onStateChange?: (state: string) => void
}

export function CuttlefishScene({ useEnhancedModel = false, onStateChange }: CuttlefishSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { mouse, viewport } = useThree()

  const [emotionalState, setEmotionalState] = useState<EmotionalState>("idle")
  const [mouseActivity, setMouseActivity] = useState(0)

  // Auto-cycle through states for demo (matching enhanced model behavior)
  useFrame((frameState) => {
    const time = frameState.clock.getElapsedTime()
    const cycle = Math.floor(time / 4) % 5
    const states: EmotionalState[] = ["idle", "curious", "thinking", "cautious", "excited"]
    const newState = states[cycle]

    if (newState !== emotionalState) {
      setEmotionalState(newState)
      onStateChange?.(newState)
    }
  })

  // Track mouse movement for emotional states
  useEffect(() => {
    const handleMouseMove = () => {
      setMouseActivity((prev) => Math.min(prev + 0.1, 1))
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Decay mouse activity over time
    const interval = setInterval(() => {
      setMouseActivity((prev) => Math.max(prev - 0.02, 0))
    }, 50)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(interval)
    }
  }, [mouse])

  // Custom bioluminescent shader for basic model
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        emotionalState: { value: 0 }, // 0=idle, 1=curious, 2=thinking, 3=excited, 4=cautious
        intensity: { value: 1.0 },
        pulseSpeed: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 mousePos;
        uniform float emotionalState;
        uniform float intensity;
        uniform float pulseSpeed;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Rainbow color function
        vec3 rainbow(float t) {
          t = fract(t);
          float r = abs(t * 6.0 - 3.0) - 1.0;
          float g = 2.0 - abs(t * 6.0 - 2.0);
          float b = 2.0 - abs(t * 6.0 - 4.0);
          return clamp(vec3(r, g, b), 0.0, 1.0);
        }
        
        // Noise function for organic movement
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        void main() {
          vec3 pos = vPosition;
          vec3 normal = normalize(vNormal);
          
          // Base rainbow cycling
          float rainbowTime = time * 0.3 + pos.x * 0.5 + pos.y * 0.3;
          vec3 baseColor = rainbow(rainbowTime);
          
          // Emotional state modifications
          if (emotionalState > 0.5 && emotionalState < 1.5) { // curious
            baseColor = mix(baseColor, vec3(0.3, 0.8, 1.0), 0.4);
          } else if (emotionalState > 1.5 && emotionalState < 2.5) { // thinking
            baseColor = mix(baseColor, vec3(0.8, 0.3, 1.0), 0.3);
          } else if (emotionalState > 2.5 && emotionalState < 3.5) { // excited
            baseColor = baseColor * 1.5;
          } else if (emotionalState > 3.5) { // cautious
            baseColor = mix(baseColor, vec3(1.0, 0.5, 0.2), 0.5);
          }
          
          // Pulsing effect
          float pulse = sin(time * pulseSpeed * 2.0) * 0.5 + 0.5;
          pulse = mix(0.6, 1.0, pulse);
          
          // Fresnel glow effect
          float fresnel = 1.0 - dot(normal, vec3(0.0, 0.0, 1.0));
          fresnel = pow(fresnel, 2.0);
          
          // Organic noise for bioluminescent texture
          float organicNoise = noise(pos * 3.0 + time * 0.5) * 0.3;
          
          // Mouse interaction glow
          vec2 mouseInfluence = mousePos * 2.0;
          float mouseDistance = length(vUv - mouseInfluence * 0.5 - 0.5);
          float mouseGlow = exp(-mouseDistance * 3.0) * 0.5;
          
          // Combine all effects
          vec3 finalColor = baseColor * pulse * intensity;
          finalColor += fresnel * baseColor * 0.8;
          finalColor += organicNoise;
          finalColor += mouseGlow * baseColor;
          
          // Add transparency for ethereal effect
          float alpha = fresnel * 0.9 + 0.1;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  // Animation loop for basic model
  useFrame((state) => {
    if (useEnhancedModel) return // Skip if using enhanced model

    if (!meshRef.current || !materialRef.current) return

    const time = state.clock.elapsedTime

    // Update shader uniforms
    materialRef.current.uniforms.time.value = time
    materialRef.current.uniforms.mousePos.value.set(mouse.x, mouse.y)

    // Map emotional states to numbers
    const stateMap: Record<EmotionalState, number> = {
      idle: 0,
      curious: 1,
      thinking: 2,
      excited: 3,
      cautious: 4,
    }
    materialRef.current.uniforms.emotionalState.value = stateMap[emotionalState]

    // Adjust pulse speed based on emotional state
    const pulseSpeed = emotionalState === "excited" ? 3.0 : emotionalState === "curious" ? 1.5 : 1.0
    materialRef.current.uniforms.pulseSpeed.value = pulseSpeed

    // Smooth rotation and mouse following
    const targetRotationY = mouse.x * 0.3
    const targetRotationX = mouse.y * 0.2

    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05

    // Gentle floating motion
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.2
    meshRef.current.position.x = Math.cos(time * 0.5) * 0.1

    // Scale breathing effect
    const breathe = 1 + Math.sin(time * 1.2) * 0.05
    meshRef.current.scale.setScalar(breathe)
  })

  if (useEnhancedModel) {
    return (
      <>
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4ecdc4" />

        {/* Enhanced model with built-in state management */}
        <EnhancedCuttlefishModel mouse={mouse} />
      </>
    )
  }

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Basic model with GLTF loading and rainbow shaders */}
      <CuttlefishModel mouse={mouse} globalState={emotionalState} />

      {/* Fallback basic geometry if GLTF models don't load */}
      <mesh ref={meshRef} material={shaderMaterial} visible={false}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
      </mesh>

      {/* Tentacles for basic model */}
      {Array.from({ length: 8 }).map((_, i) => (
        <CuttlefishTentacle key={i} index={i} emotionalState={emotionalState} mouseActivity={mouseActivity} />
      ))}

      {/* Particle effects for basic model */}
      <CuttlefishParticles emotionalState={emotionalState} />
    </>
  )
}

function CuttlefishTentacle({
  index,
  emotionalState,
  mouseActivity,
}: {
  index: number
  emotionalState: EmotionalState
  mouseActivity: number
}) {
  const tentacleRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!tentacleRef.current) return

    const time = state.clock.elapsedTime
    const angle = (index / 8) * Math.PI * 2

    // Position tentacles around the body
    const radius = 1.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    tentacleRef.current.position.set(x, -0.5, z)

    // Animate tentacles based on emotional state
    const waveSpeed = emotionalState === "excited" ? 4.0 : emotionalState === "curious" ? 2.0 : 1.0

    const wave = Math.sin(time * waveSpeed + index) * 0.3
    tentacleRef.current.rotation.z = wave
    tentacleRef.current.rotation.y = angle + wave * 0.2
  })

  return (
    <group ref={tentacleRef}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.02, 1.5, 8]} />
        <meshBasicMaterial color={emotionalState === "excited" ? "#ff6b9d" : "#4ecdc4"} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function CuttlefishParticles({ emotionalState }: { emotionalState: EmotionalState }) {
  const particlesRef = useRef<THREE.Points>(null)

  const particleCount = emotionalState === "excited" ? 100 : 50

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [particleCount])

  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.elapsedTime
    particlesRef.current.rotation.y = time * 0.1
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={emotionalState === "excited" ? "#ff6b9d" : "#4ecdc4"}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}
