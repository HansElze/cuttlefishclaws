import React, { useRef, useEffect, useState } from 'react';

interface ModelViewerProps {
  src: string;
  alt?: string;
  className?: string;
  isThinking?: boolean;
}

export default function ModelViewerComponent({ src, alt = "3D Logo", className = "", isThinking = false }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const targetOrbit = useRef({ azimuth: 0, elevation: 90 });
  const currentOrbit = useRef({ azimuth: 0, elevation: 90 });
  const animationFrame = useRef<number>();
  const wiggleTimer = useRef<number | null>(null);
  const wiggleDirection = useRef(1);
  const wiggleAngle = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', src);
    modelViewer.setAttribute('alt', alt);
    modelViewer.setAttribute('disable-zoom', '');
    modelViewer.setAttribute('disable-pan', '');
    modelViewer.setAttribute('shadow-intensity', '0');
    modelViewer.setAttribute('environment-image', 'neutral');
    modelViewer.setAttribute('exposure', '1');
    modelViewer.setAttribute('tone-mapping', 'commerce');
    modelViewer.setAttribute('interaction-prompt', 'none');
    modelViewer.setAttribute('camera-controls', 'false');
    modelViewer.setAttribute('camera-orbit', '180deg 90deg 1.5m');

    modelViewer.style.width = '100%';
    modelViewer.style.height = '200px';
    modelViewer.style.background = 'black';
    modelViewer.style.pointerEvents = 'none';

    modelViewer.addEventListener('load', () => {
      setIsLoaded(true);
      setHasError(false);
    });
    modelViewer.addEventListener('error', () => {
      setHasError(true);
      setIsLoaded(false);
    });

    containerRef.current.appendChild(modelViewer);
    modelViewerRef.current = modelViewer;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetOrbit.current.azimuth = -x * 30;
      targetOrbit.current.elevation = 90 - y * 15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      currentOrbit.current.azimuth += (targetOrbit.current.azimuth - currentOrbit.current.azimuth) * 0.1;
      currentOrbit.current.elevation += (targetOrbit.current.elevation - currentOrbit.current.elevation) * 0.1;
      if (modelViewerRef.current && !wiggleTimer.current) {
        modelViewerRef.current.cameraOrbit = `${180 + currentOrbit.current.azimuth}deg ${currentOrbit.current.elevation}deg 2m`;
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [src, alt]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const startWiggle = () => {
      wiggleTimer.current = window.setInterval(() => {
        wiggleAngle.current += wiggleDirection.current * 5;
        if (Math.abs(wiggleAngle.current) > 15) wiggleDirection.current *= -1;
        modelViewer.cameraOrbit = `${180 + wiggleAngle.current}deg 90deg 2m`;
      }, 100);
      modelViewer.style.filter = 'hue-rotate(180deg) saturate(1.5)';
    };

    const stopWiggle = () => {
      if (wiggleTimer.current) {
        clearInterval(wiggleTimer.current);
        wiggleTimer.current = null;
        wiggleAngle.current = 0;
      }
      modelViewer.style.filter = '';
    };

    if (isThinking) startWiggle();
    else stopWiggle();

    return () => stopWiggle();
  }, [isThinking]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-[200px] bg-transparent rounded-lg overflow-visible ${className}`}
      aria-label={alt}
      style={{ background: 'none', pointerEvents: 'none' }}
    />
  );
}