"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LogoMonogram } from "@/components/branding/LogoMonogram";

export const CinematicSareeLanding: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [fading, setFading] = useState<boolean>(false);
  const [logoRevealed, setLogoRevealed] = useState<boolean>(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const dismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 450);
  };

  useEffect(() => {
    // Always present the short 1.8s entrance splash on load and refresh
    const logoTimer = setTimeout(() => {
      setLogoRevealed(true);
    }, 700);

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1500);

    const endTimer = setTimeout(() => {
      setVisible(false);
    }, 1950);

    // Support manual replay event from header/footer
    const handleReplay = () => {
      setFading(false);
      setLogoRevealed(false);
      setVisible(true);
      setTimeout(() => setLogoRevealed(true), 700);
      setTimeout(() => setFading(true), 1500);
      setTimeout(() => setVisible(false), 1950);
    };

    window.addEventListener("replay-saree-film", handleReplay);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      window.removeEventListener("replay-saree-film", handleReplay);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const container = canvasContainerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene, Camera, Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf9f8f6, 0.05);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setTimeout(() => setVisible(false), 0);
      return;
    }

    const isMobile =
      width < 768 ||
      (typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse), (hover: none)").matches);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Realistic Saree Geometry (Wide 6-meter drape proportions)
    // Budgeted vertex density for mobile GPUs: 64x18 on mobile vs 120x28 on desktop
    const lengthSegments = isMobile ? 64 : 120;
    const widthSegments = isMobile ? 18 : 28;
    const geometry = new THREE.PlaneGeometry(14, 2.5, lengthSegments, widthSegments);

    // 3. Realistic Saree Shader with Pallu Bands & Selvedge Zari
    const uniforms = {
      uTime: { value: 0 },
      uWarpColor: { value: new THREE.Color("#FAF8F5") }, // Raw unbleached mulberry silk
      uWeftColor: { value: new THREE.Color("#EFEAE1") }, // Luminous golden undertone
      uZariColor: { value: new THREE.Color("#C5A059") }, // Antique matte zari
      uZariDark: { value: new THREE.Color("#8C6F32") },  // Deep oxidized gold weft
      uLightPos: { value: new THREE.Vector3(2.5, 4.0, 5.5) },
    };

    const vertexShader = `
      precision highp float;
      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;

        // Aerodynamic Flight Curve: Saree soars across the camera space
        float progress = uTime * 0.95;
        float s = uv.x * 6.28318;

        vec3 pos = position;

        // Elegant flight path across viewport
        float swoopX = (uv.x - 0.5) * 13.0 + sin(uTime * 1.1) * 0.9;
        float swoopY = sin(s * 0.7 - progress) * 1.8 + (uv.y - 0.5) * 0.5;
        float swoopZ = cos(s * 0.6 - progress) * 2.6 - (1.0 - uv.x) * 3.2 + 0.8;

        // Pleat folds & micro flutter across the 6 yards
        float pleatWave = sin(uv.x * 24.0 + uTime * 4.5) * 0.16 * sin(uv.y * 3.14159);
        float edgeFlutter = sin(uv.y * 12.0 + uTime * 3.8) * 0.12 * (step(0.85, uv.x) + step(uv.x, 0.15));

        pos.x = swoopX;
        pos.y = swoopY + pleatWave;
        pos.z = swoopZ + edgeFlutter;

        // Saree twist: graceful roll as the pallu sweeps forward
        float twist = sin(uv.x * 3.0 + uTime * 1.4) * 0.55;
        float cy = cos(twist);
        float sy = sin(twist);
        float origY = pos.y;
        pos.y = origY * cy - pos.z * sy * 0.35;

        // Normal perturbation
        vec3 displacedNormal = normal;
        displacedNormal.x += cos(uv.x * 24.0 + uTime * 4.0) * 0.2;
        displacedNormal.y += sin(uv.y * 12.0 + uTime * 3.0) * 0.2;
        displacedNormal = normalize(displacedNormal);

        vNormal = normalMatrix * displacedNormal;
        vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
        vViewPosition = -(modelViewMatrix * vec4(pos, 1.0)).xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec3 uWarpColor;
      uniform vec3 uWeftColor;
      uniform vec3 uZariColor;
      uniform vec3 uZariDark;
      uniform vec3 uLightPos;
      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(uLightPos - vPosition);

        float NdotL = max(dot(normal, lightDir), 0.0);
        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnel = pow(1.0 - NdotV, 2.2);

        // 1. Silk Body: Dual-Tone Shot-Silk (Dhoop-Chhaon)
        vec3 silkColor = mix(uWarpColor, uWeftColor, clamp(fresnel * 1.3, 0.0, 1.0));

        // 2. Selvedge Borders (Top & Bottom Zari Edges)
        float topBorder = step(0.88, vUv.y);
        float bottomBorder = step(vUv.y, 0.12);
        float isSelvedgeZari = max(topBorder, bottomBorder);

        // 3. The Pallu: Authentic heavy ornamental end-piece (last 20% of saree length)
        float isPalluZone = step(0.80, vUv.x);

        // Multi-band Kaddi Zari Stripes inside the Pallu
        float palluU = (vUv.x - 0.80) / 0.20; // 0.0 to 1.0
        float stripe1 = step(0.20, palluU) * (1.0 - step(0.28, palluU));
        float stripe2 = step(0.40, palluU) * (1.0 - step(0.55, palluU));
        float stripe3 = step(0.70, palluU) * (1.0 - step(0.92, palluU));
        float isPalluStripes = max(stripe1, max(stripe2, stripe3));

        // Pallu fringe tassel edge
        float isFringeEdge = step(0.98, vUv.x);

        // Total Zari Metallurgy mask
        float totalZari = clamp(isSelvedgeZari + (isPalluZone * isPalluStripes) + isFringeEdge, 0.0, 1.0);

        // Anisotropic Zari Specular Highlights
        vec3 halfVec = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfVec), 0.0), 30.0);
        vec3 zariGlint = mix(uZariColor, uZariDark, 0.2) * spec * 0.8;

        vec3 diffuse = mix(silkColor, uZariColor, totalZari);
        vec3 ambient = diffuse * 0.52;
        vec3 finalColor = ambient + (diffuse * NdotL * 0.75) + (zariGlint * totalZari);

        // Subtle gossamer fade at very tail
        float alpha = smoothstep(0.0, 0.03, vUv.x);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    const sareeMesh = new THREE.Mesh(geometry, material);
    scene.add(sareeMesh);

    // 4. Subtle gold dust particles in wind
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a059,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const dust = new THREE.Points(particleGeo, particleMat);
    scene.add(dust);

    // 5. Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      uniforms.uTime.value += delta;
      dust.rotation.y += delta * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      className={`fixed inset-0 z-[200] bg-canvas-base flex flex-col justify-between p-6 sm:p-8 md:p-14 select-none overflow-hidden cursor-pointer transition-opacity duration-500 ease-silk-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
      }}
      role="region"
      aria-label="Rami Studio Splash Entrance"
    >
      {/* 3D Flying Saree Canvas Layer */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-radial-vignette from-transparent to-canvas-base/60 pointer-events-none" />

      {/* Top Bar Indicator */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-zari animate-ping" />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-text-secondary">
            Rami Studio · Silk Architecture
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
          Tap to enter
        </span>
      </div>

      {/* Centerpiece Modern Brand Reveal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto space-y-4 sm:space-y-6 pointer-events-none">
        {/* Modern Monogram Icon */}
        <div
          className={`transition-all duration-700 ease-silk-out transform ${
            logoRevealed
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-4"
          }`}
        >
          <div className="p-4 sm:p-5 rounded-full border border-surface-border bg-canvas-base/60 backdrop-blur-md shadow-xl">
            <LogoMonogram size={52} className="text-text-primary sm:w-[64px] sm:h-[64px]" />
          </div>
        </div>

        {/* Editorial Wordmark Reveal with Fluid Letter-Spacing Expansion */}
        <div
          className={`transition-all duration-700 delay-150 ease-silk-out transform ${
            logoRevealed
              ? "opacity-100 translate-y-0 tracking-[0.25em] sm:tracking-[0.3em]"
              : "opacity-0 translate-y-2 tracking-[0.14em]"
          }`}
        >
          <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl text-text-primary font-light uppercase">
            Rami Studio
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 text-[9px] sm:text-[10px] font-mono tracking-[0.35em] sm:tracking-[0.45em] text-text-secondary uppercase">
            <span className="w-4 sm:w-6 h-[1px] bg-accent-zari/60" />
            <span>Featherweight Soft Silks</span>
            <span className="w-4 sm:w-6 h-[1px] bg-accent-zari/60" />
          </div>
        </div>
      </div>

      {/* Bottom Provenance Coordinate Bar */}
      <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-widest text-text-tertiary uppercase pointer-events-none">
        <span className="hidden sm:inline">DROP 01 / 2026</span>
        <span>KANCHIPURAM · VARANASI · ARANI</span>
        <span className="hidden sm:inline">ANTIQUE MATTE ZARI</span>
        <span className="sm:hidden text-accent-zari">PURE HANDLOOM</span>
      </div>
    </div>
  );
};
