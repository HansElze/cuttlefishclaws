"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { CuttlefishScene } from "./cuttlefish-scene"
import StateIndicator from "./state-indicator"
import { Button } from "@/components/ui/button"

export default function CuttlefishWidget() {
  const [useEnhancedModel, setUseEnhancedModel] = useState(false)
  const [currentState, setCurrentState] = useState("idle")

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true, alpha: true }} className="w-full h-full">
        <Suspense fallback={null}>
          <CuttlefishScene useEnhancedModel={useEnhancedModel} onStateChange={setCurrentState} />
        </Suspense>
      </Canvas>

      {/* Brand overlay */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl font-bold text-white/80 font-mono">🐙 Cuttlefish Labs</h1>
        <p className="text-sm text-white/60 mt-1 max-w-xs">Sovereign AI infrastructure, carbon-negative by design</p>
      </div>

      {/* Model toggle */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          variant={useEnhancedModel ? "default" : "outline"}
          size="sm"
          onClick={() => setUseEnhancedModel(!useEnhancedModel)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {useEnhancedModel ? "Enhanced Model" : "Basic Model"}
        </Button>
      </div>

      {/* State indicator */}
      <StateIndicator currentState={currentState} />

      {/* Interaction hint */}
      <div className="absolute bottom-8 right-8 z-10">
        <p className="text-xs text-white/40 font-mono">Move your cursor to interact</p>
        <p className="text-xs text-white/30 font-mono mt-1">
          {useEnhancedModel ? "Enhanced: Bubbles & Effects" : "Basic: Rainbow Shaders"}
        </p>
      </div>
    </div>
  )
}
