"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface CuttlefishModelProps {
  mouse: { x: number; y: number }
  globalState?: string
}

export default function CuttlefishModel({ mouse, globalState = "idle" }: CuttlefishModelProps) {
  const group = useRef<THREE.Group>(null)
  const tentacleRefs = useRef<THREE.Mesh[]>([])

  // Rainbow shader material based on your HTML code
  const rainbowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        intensity: { value: 1.0 },
        speed: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform float speed;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Rainbow color cycling based on time and position
          float glow = sin(vUv.y * 10.0 + time * speed * 5.0) * 0.5 + 0.5;
          
          // Enhanced rainbow colors with emotional state influence
          vec3 color = vec3(
            0.5 + 0.5 * sin(time * speed + 0.0),
            0.5 + 0.5 * sin(time * speed + 2.0),
            0.5 + 0.5 * sin(time * speed + 4.0)
          ) * glow * intensity;
          
          // Add some depth-based variation
          float depth = (vPosition.z + 1.0) * 0.5;
          color *= (0.8 + 0.4 * depth);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }, [])

  const cuttlefishGeometry = useMemo(() => {
    const geometry = new THREE.Group()

    // Main body (mantle)
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.5, 4, 8)
    const body = new THREE.Mesh(bodyGeometry, rainbowMaterial)
    body.position.set(0, 0, 0)
    geometry.add(body)

    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 8, 6)
    const head = new THREE.Mesh(headGeometry, rainbowMaterial)
    head.position.set(0, 0.8, 0)
    geometry.add(head)

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 6, 4)
    const leftEye = new THREE.Mesh(eyeGeometry, rainbowMaterial)
    leftEye.position.set(-0.25, 0.9, 0.3)
    const rightEye = new THREE.Mesh(eyeGeometry, rainbowMaterial)
    rightEye.position.set(0.25, 0.9, 0.3)
    geometry.add(leftEye)
    geometry.add(rightEye)

    return geometry
  }, [rainbowMaterial])

  // Create floating tentacles
  const tentacles = useMemo(() => {
    const tentacleGroup = new THREE.Group()
    const tentacleCount = 8

    for (let i = 0; i < tentacleCount; i++) {
      const angle = (i / tentacleCount) * Math.PI * 2
      const tentacleGeometry = new THREE.CylinderGeometry(0.05, 0.02, 1.2, 4)
      const tentacle = new THREE.Mesh(tentacleGeometry, rainbowMaterial)

      tentacle.position.set(Math.cos(angle) * 0.3, -0.8, Math.sin(angle) * 0.3)
      tentacle.rotation.z = Math.cos(angle) * 0.2
      tentacle.rotation.x = Math.sin(angle) * 0.2

      tentacleGroup.add(tentacle)
      tentacleRefs.current[i] = tentacle
    }

    return tentacleGroup
  }, [rainbowMaterial])

  // State-based parameters for the shader
  const stateParams = {
    idle: { intensity: 0.8, speed: 1.0 },
    excited: { intensity: 2.0, speed: 3.0 },
    curious: { intensity: 1.2, speed: 1.5 },
    thinking: { intensity: 0.6, speed: 0.5 },
    cautious: { intensity: 1.5, speed: 2.0 },
  }

  useFrame((frameState) => {
    if (!group.current) return

    const time = frameState.clock.getElapsedTime()
    const params = stateParams[globalState as keyof typeof stateParams] || stateParams.idle

    // Update shader uniforms
    rainbowMaterial.uniforms.time.value = time
    rainbowMaterial.uniforms.intensity.value = params.intensity
    rainbowMaterial.uniforms.speed.value = params.speed

    tentacleRefs.current.forEach((tentacle, i) => {
      if (tentacle) {
        const waveOffset = (i / tentacleRefs.current.length) * Math.PI * 2
        tentacle.rotation.z = Math.sin(time * 2 + waveOffset) * 0.3
        tentacle.position.y = -0.8 + Math.sin(time * 1.5 + waveOffset) * 0.1
      }
    })

    // State-based animations
    switch (globalState) {
      case "excited":
        // Rapid movement and rotation
        group.current.position.y = Math.sin(time * 6) * 0.2
        group.current.rotation.z = Math.sin(time * 4) * 0.1
        group.current.scale.setScalar(1.1 + Math.sin(time * 8) * 0.05)
        break
      case "curious":
        // Gentle bobbing and tilting
        group.current.position.y = Math.sin(time * 3) * 0.1
        group.current.rotation.z = Math.sin(time * 2) * 0.05
        break
      case "thinking":
        // Slow pulsing scale
        const thinkingScale = 1 + Math.sin(time * 1.5) * 0.05
        group.current.scale.setScalar(thinkingScale)
        group.current.rotation.y += 0.002 // Slow rotation
        break
      case "cautious":
        // Shrink and move carefully
        group.current.scale.setScalar(0.9)
        group.current.position.y = Math.sin(time * 1) * 0.05
        break
      default: // idle
        // Reset transformations with gentle floating
        group.current.position.y = Math.sin(time * 1.5) * 0.05
        group.current.scale.setScalar(1)
        group.current.rotation.z = 0
        group.current.rotation.y += 0.005 // Gentle rotation like in your HTML
    }

    // Mouse tracking - smooth interpolation
    const targetX = (mouse.y * Math.PI) / 8
    const targetY = (mouse.x * Math.PI) / 4
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.1
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.1

    // Add subtle floating motion
    group.current.position.x = Math.sin(time * 0.5) * 0.1
    group.current.position.z = Math.cos(time * 0.7) * 0.1
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={cuttlefishGeometry} />
      <primitive object={tentacles} />
    </group>
  )
}
