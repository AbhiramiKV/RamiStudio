"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Colorway } from "@/lib/types";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { SareeDrapeEngine, DrapeStyle } from "@/lib/physics/SareeDrapeEngine";
import { Fallback360Viewer } from "./Fallback360Viewer";
import { Hand, RefreshCw, Layers, Rotate3d } from "lucide-react";

interface TextileCanvasProps {
  colorway?: Colorway;
  fallbackImage?: string;
  title?: string;
  interactive?: boolean;
  className?: string;
}

// Anatomically Proportioned Faceless Figure
// Proportions: standing female model, ~1.77m virtual scale
// Structure: feet → calves → knees → thighs → hips → waist → ribcage → shoulders → neck stub
function createSculptedFacelessFigure(): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf0ece4,
    roughness: 0.72,
    metalness: 0.0,
  });

  const addCylinder = (
    rTop: number, rBot: number, h: number,
    segs: number, yBase: number,
    xOff = 0, zOff = 0, xRot = 0, zRot = 0,
    mat: THREE.Material = skinMat
  ) => {
    const geo = new THREE.CylinderGeometry(rTop, rBot, h, segs, 4);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(xOff, yBase + h / 2, zOff);
    mesh.rotation.x = xRot;
    mesh.rotation.z = zRot;
    group.add(mesh);
    return mesh;
  };

  const addSphere = (r: number, y: number, xOff = 0, zOff = 0, scaleY = 1.0, mat: THREE.Material = skinMat) => {
    const geo = new THREE.SphereGeometry(r, 24, 20);
    geo.scale(1, scaleY, 1);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(xOff, y, zOff);
    group.add(mesh);
    return mesh;
  };

  // ── FEET (small, anchored below ankle) ──
  addSphere(0.038, -0.92, -0.055, 0.025, 0.45);  // Left foot
  addSphere(0.038, -0.92,  0.055, 0.025, 0.45);  // Right foot

  // ── CALVES ──
  addCylinder(0.052, 0.046, 0.28, 20, -0.91, -0.055); // Left calf
  addCylinder(0.052, 0.046, 0.28, 20, -0.91,  0.055); // Right calf

  // ── KNEES ──
  addSphere(0.055, -0.63, -0.055, 0.0, 1.0);  // Left knee
  addSphere(0.055, -0.63,  0.055, 0.0, 1.0);  // Right knee

  // ── THIGHS ──
  addCylinder(0.075, 0.060, 0.30, 24, -0.63, -0.055); // Left thigh
  addCylinder(0.075, 0.060, 0.30, 24, -0.63,  0.055); // Right thigh

  // ── PELVIS / HIP JUNCTION (where thighs merge) ──
  // Wide ellipsoid spanning hip width
  const pelvisGeo = new THREE.SphereGeometry(0.145, 32, 20);
  pelvisGeo.scale(1.2, 0.72, 0.92);
  pelvisGeo.computeVertexNormals();
  const pelvis = new THREE.Mesh(pelvisGeo, skinMat);
  pelvis.position.set(0, -0.33, 0.006);
  group.add(pelvis);

  // ── WAIST — narrow, smooth taper ──
  const waistGeo = new THREE.CylinderGeometry(0.110, 0.148, 0.18, 36, 6);
  // Sculpt waist taper inward
  const wPos = waistGeo.attributes.position;
  for (let i = 0; i < wPos.count; i++) {
    const y = wPos.getY(i); // -0.09 to +0.09
    const t = (y + 0.09) / 0.18; // 0 = bottom, 1 = top
    const squeeze = 1.0 - Math.sin(t * Math.PI) * 0.08;
    wPos.setX(i, wPos.getX(i) * squeeze);
    wPos.setZ(i, wPos.getZ(i) * squeeze);
  }
  waistGeo.computeVertexNormals();
  const waist = new THREE.Mesh(waistGeo, skinMat);
  waist.position.set(0, -0.14, 0.002);
  group.add(waist);

  // ── RIBCAGE — flares naturally upward from waist ──
  const ribGeo = new THREE.CylinderGeometry(0.152, 0.118, 0.26, 36, 6);
  const rPos = ribGeo.attributes.position;
  for (let i = 0; i < rPos.count; i++) {
    const y = rPos.getY(i); // -0.13 to +0.13
    const t = (y + 0.13) / 0.26;
    // Slight front-projection at mid-ribcage for bust depth
    const bustFactor = Math.sin(t * Math.PI) * 0.022;
    rPos.setZ(i, rPos.getZ(i) + (rPos.getZ(i) > 0 ? bustFactor : 0));
  }
  ribGeo.computeVertexNormals();
  const ribcage = new THREE.Mesh(ribGeo, skinMat);
  ribcage.position.set(0, 0.085, 0.01);
  group.add(ribcage);

  // ── BUST PROJECTION (soft, anatomically subtle) ──
  addSphere(0.068, 0.195, -0.055, 0.09, 0.85);  // Left bust
  addSphere(0.068, 0.195,  0.055, 0.09, 0.85);  // Right bust

  // ── SHOULDERS ── (clavicle width ~0.38m)
  addSphere(0.065, 0.30, -0.165, 0.0, 0.82); // Left shoulder ball
  addSphere(0.065, 0.30,  0.165, 0.0, 0.82); // Right shoulder ball

  // ── UPPER ARMS (hanging naturally, slight inward angle) ──
  addCylinder(0.042, 0.036, 0.20, 16, 0.21, -0.195, 0.0, 0.0, 0.12);  // Left upper arm
  addCylinder(0.042, 0.036, 0.20, 16, 0.21,  0.195, 0.0, 0.0, -0.12); // Right upper arm

  // ── NECK STUMP (no head — faceless editorial aesthetic) ──
  addCylinder(0.052, 0.062, 0.10, 20, 0.37, 0, -0.005);

  return group;
}


// Sculpted Tailored Silk Blouse with boat neckline and tailored sleeves
function createTailoredBlouseMesh(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Fitted Bodice: spans from ribcage bottom (y=-0.05) up to clavicle (y=0.215)
  // Height = 0.265, centered at y = 0.0825
  const radialSegs = 52;
  const heightSegs = 20;
  // rTop matches shoulder width, rBot matches waist flare at blouse hem
  const bodiceGeo = new THREE.CylinderGeometry(0.158, 0.145, 0.265, radialSegs, heightSegs, true);
  const pos = bodiceGeo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // -0.1325 to +0.1325 (local coords)
    const x = pos.getX(i);
    const z = pos.getZ(i);

    // Bust projection at mid-bodice (local y = 0 to 0.06)
    if (z > 0 && y > -0.04 && y < 0.08) {
      const bustFactor = Math.sin(((y + 0.04) / 0.12) * Math.PI);
      pos.setZ(i, z + bustFactor * 0.026);
    }

    // Waist pinch at lower bodice (local y = -0.08 to -0.13)
    if (y < -0.06) {
      const pinch = (-y - 0.06) / 0.07;
      pos.setX(i, x * (1.0 - pinch * 0.06));
      pos.setZ(i, pos.getZ(i) * (1.0 - pinch * 0.05));
    }

    // Boat neckline dip at top front center
    if (y > 0.08 && z > 0) {
      const neckDip = (1.0 - Math.min(Math.abs(x) / 0.13, 1.0)) * 0.042;
      pos.setY(i, y - neckDip);
    }
  }
  bodiceGeo.computeVertexNormals();
  // Center the bodice at y = 0.0825 so it spans -0.05 to 0.215
  bodiceGeo.translate(0, 0.0825, 0.012);

  const bodice = new THREE.Mesh(bodiceGeo, material);
  group.add(bodice);

  // Short sleeves — positioned at shoulder ball centers (y=0.30, x=±0.165)
  const sleeveGeoL = new THREE.CylinderGeometry(0.055, 0.048, 0.13, 24);
  sleeveGeoL.rotateZ(Math.PI * 0.16);
  sleeveGeoL.translate(-0.205, 0.298, 0.005);
  sleeveGeoL.computeVertexNormals();
  const sleeveL = new THREE.Mesh(sleeveGeoL, material);
  group.add(sleeveL);

  const sleeveGeoR = new THREE.CylinderGeometry(0.055, 0.048, 0.13, 24);
  sleeveGeoR.rotateZ(-Math.PI * 0.16);
  sleeveGeoR.translate(0.205, 0.298, 0.005);
  sleeveGeoR.computeVertexNormals();
  const sleeveR = new THREE.Mesh(sleeveGeoR, material);
  group.add(sleeveR);

  return group;
}


// Multi-Pleated Diagonal Pallu Drape Sash layered OVER the blouse
function createDiagonalSashGeometry(style: DrapeStyle = "nivi"): THREE.BufferGeometry {
  const lengthSegments = 60;
  const widthSegments = 18;
  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Y range: waist tuck (y=-0.04) → shoulder peak (y=0.315)
  const yBottom = -0.04;
  const yTop = 0.315;
  const yRange = yTop - yBottom;

  for (let i = 0; i <= lengthSegments; i++) {
    const v = i / lengthSegments;

    let y: number;
    let centerAngle: number;
    let dAngle: number;

    if (style === "seedha") {
      y = THREE.MathUtils.lerp(yBottom, yTop, v);
      centerAngle = THREE.MathUtils.lerp(2.70, 0.42, v);
      dAngle = THREE.MathUtils.lerp(0.50, 0.36, v);
    } else if (style === "cape") {
      y = THREE.MathUtils.lerp(0.20, yTop, v);
      centerAngle = Math.PI * 0.5;
      dAngle = THREE.MathUtils.lerp(1.10, 0.50, v);
    } else {
      // Classic Nivi: from waist right, sweeping across bust to left shoulder
      y = THREE.MathUtils.lerp(yBottom, yTop, v);
      centerAngle = THREE.MathUtils.lerp(0.40, 2.70, v);
      dAngle = THREE.MathUtils.lerp(0.50, 0.36, v);
    }

    const vy = (y - yBottom) / yRange;

    // Blouse outer radius: rBot matches blouse hem (~0.152), rTop matches shoulder (~0.168)
    let rx = THREE.MathUtils.lerp(0.162, 0.172, vy);
    let rz = THREE.MathUtils.lerp(0.150, 0.168, vy);

    // Bust projection over the blouse (y = 0.04 to y = 0.20)
    if (y > 0.04 && y < 0.20) {
      const bustProg = Math.sin(((y - 0.04) / 0.16) * Math.PI);
      rz += bustProg * 0.042;
      rx += bustProg * 0.010;
    }

    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments;
      const angle = centerAngle + (u - 0.5) * dAngle;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // 3 distinct architectural pleats with folded crests
      const pleat = Math.sin(u * Math.PI * 6.0) * 0.008;
      const r = 1.0 + 0.016 + pleat;

      const px = cosA * rx * r;
      const pz = Math.max(sinA * rz * r, -0.04);
      const py = y + (u - 0.5) * 0.022;

      positions.push(px, py, pz);
      uvs.push(u, v);
    }
  }

  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (widthSegments + 1) + j;
      const d = c + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return geo;
}


// Procedural Nivi Pleated Saree Skirt tailored to human model anatomy with hip wrap tension
function createPleatedSkirtGeometry(pleatCount = 7): THREE.BufferGeometry {
  // Skirt spans from waistband (y = -0.055) down to floor (y = -0.92)
  const skirtTop = -0.055;
  const skirtBottom = -0.92;
  const height = skirtTop - skirtBottom; // 0.865
  const radialSegments = 92;
  const heightSegments = 36;

  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const py = skirtTop - v * height;

    let currentRadius: number;
    if (v < 0.20) {
      // Hip wrap: waistband tight, flaring to hip width
      currentRadius = THREE.MathUtils.lerp(0.165, 0.242, v / 0.20);
    } else {
      // Skirt body: gradual A-line flare to floor sweep
      currentRadius = THREE.MathUtils.lerp(0.242, 0.335, (v - 0.20) / 0.80);
    }

    // Subtle diagonal hip wrap tension lines across upper skirt (v < 0.25)
    let hipTension = 0;
    if (v < 0.25) {
      hipTension = Math.sin(v * Math.PI * 8.0) * 0.003 * (1.0 - v / 0.25);
    }

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const angle = u * Math.PI * 2;

      // Front knife-pleat cluster centered at +Z (angle = Math.PI / 2)
      const frontDist = Math.abs(angle - Math.PI / 2);
      let pleatOffset = 0;
      if (frontDist < 0.52) {
        const pleatPhase = (angle - (Math.PI / 2 - 0.52)) / 1.04;
        const rawWave = Math.sin(pleatPhase * Math.PI * pleatCount);
        // Sharpened knife pleat with asymmetric fold face
        const wave = Math.sign(rawWave) * Math.pow(Math.abs(rawWave), 0.72);
        pleatOffset = wave * (0.014 + v * 0.038);
      }

      const r = currentRadius + pleatOffset + hipTension;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;

      positions.push(px, py, pz);
      uvs.push(u, v);
    }
  }


  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const i1 = y * (radialSegments + 1) + x;
      const i2 = i1 + 1;
      const i3 = (y + 1) * (radialSegments + 1) + x;
      const i4 = i3 + 1;

      indices.push(i1, i3, i2);
      indices.push(i2, i3, i4);
    }
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return geo;
}

// Tailored Saree Waistband Cinch (Tuck Band)
function createWaistbandGeometry(): THREE.BufferGeometry {
  // Waist sits at y ≈ -0.05 on the new anatomical figure (bottom of blouse hem)
  const geo = new THREE.CylinderGeometry(0.152, 0.150, 0.030, 48, 1, true);
  geo.translate(0, -0.055, 0.008);
  geo.computeVertexNormals();
  return geo;
}


function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const testCanvas = document.createElement("canvas");
    return !!(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export const TextileCanvas: React.FC<TextileCanvasProps> = ({
  colorway,
  fallbackImage = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
  title = "Pure Silk Drape",
  interactive = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(isWebGLAvailable);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeDrape, setActiveDrape] = useState<DrapeStyle>("nivi");
  const [pleatCount, setPleatCount] = useState<number>(7);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);

  const {
    lightingMode,
    fabricWeight,
    zoomLevel,
    isMacroInspecting,
  } = useCanvasStore();

  const engineRef = useRef<SareeDrapeEngine | null>(null);
  const skirtMeshRef = useRef<THREE.Mesh | null>(null);
  const sashMeshRef = useRef<THREE.Mesh | null>(null);

  const uniformsRef = useRef<{
    uTime: { value: number };
    uWarpColor: { value: THREE.Color };
    uWeftColor: { value: THREE.Color };
    uZariColor: { value: THREE.Color };
    uTargetWarp: { value: THREE.Color };
    uTargetWeft: { value: THREE.Color };
    uTargetZari: { value: THREE.Color };
    uLightColor: { value: THREE.Color };
    uLightIntensity: { value: number };
    uLightPos: { value: THREE.Vector3 };
    uZoom: { value: number };
  } | null>(null);

  useEffect(() => {
    if (!uniformsRef.current || !colorway) return;
    uniformsRef.current.uTargetWarp.value.set(colorway.hex);
    uniformsRef.current.uTargetWeft.value.set(colorway.weftHex || colorway.hex);
    uniformsRef.current.uTargetZari.value.set(colorway.zariHex || "#C5A059");
  }, [colorway]);

  useEffect(() => {
    if (!uniformsRef.current) return;
    if (lightingMode === "candlelight") {
      uniformsRef.current.uLightColor.value.set("#FFB870");
      uniformsRef.current.uLightIntensity.value = 1.35;
      uniformsRef.current.uLightPos.value.set(1.5, 2.0, 3.5);
    } else if (lightingMode === "daylight") {
      uniformsRef.current.uLightColor.value.set("#F0F6FF");
      uniformsRef.current.uLightIntensity.value = 1.35;
      uniformsRef.current.uLightPos.value.set(-2.0, 4.0, 4.0);
    } else {
      uniformsRef.current.uLightColor.value.set("#FFFFFF");
      uniformsRef.current.uLightIntensity.value = 1.25;
      uniformsRef.current.uLightPos.value.set(2.0, 3.5, 4.0);
    }
  }, [lightingMode]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setFabricWeight(fabricWeight);
    }
  }, [fabricWeight]);

  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.uZoom.value = isMacroInspecting ? Math.max(zoomLevel, 2.0) : zoomLevel;
  }, [zoomLevel, isMacroInspecting]);

  const handleDrapeChange = (style: DrapeStyle) => {
    setActiveDrape(style);
    if (engineRef.current) {
      engineRef.current.setDrapeStyle(style);
    }
    if (sashMeshRef.current) {
      const oldGeo = sashMeshRef.current.geometry;
      sashMeshRef.current.geometry = createDiagonalSashGeometry(style);
      oldGeo.dispose();
    }
  };

  const handlePleatCountChange = (count: number) => {
    setPleatCount(count);
    if (skirtMeshRef.current) {
      const oldGeo = skirtMeshRef.current.geometry;
      skirtMeshRef.current.geometry = createPleatedSkirtGeometry(count);
      oldGeo.dispose();
    }
    if (engineRef.current) {
      engineRef.current.setPleatCount(count);
    }
  };

  const initThreeScene = useCallback(() => {
    const container = containerRef.current;
    const mount = canvasMountRef.current;
    if (!container || !mount) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, -0.02, 3.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      console.warn("WebGL unsupported:", err);
      setTimeout(() => setWebglSupported(false), 0);
      return;
    }

    const isMobileDevice =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse), (hover: none)").matches);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileDevice ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.85);
    keyLight.position.set(2.5, 4.0, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf5eee6, 1.25);
    fillLight.position.set(-2.5, 1.5, 3.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc5a059, 0.85);
    rimLight.position.set(0.0, 2.5, -3.0);
    scene.add(rimLight);

    const modelGroup = new THREE.Group();
    // Default 3/4 Editorial Stance (~20 degrees)
    modelGroup.rotation.y = 0.35;
    scene.add(modelGroup);

    const plinthGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.035, 36);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xedeae3,
      roughness: 0.8,
      metalness: 0.05,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -0.96;
    modelGroup.add(plinthMesh);

    const fallbackFigure = createSculptedFacelessFigure();
    modelGroup.add(fallbackFigure);

    const loader = new GLTFLoader();
    loader.load(
      "/models/mannequin.glb",
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xf6f3ec,
              roughness: 0.58,
              metalness: 0.02,
            });
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        loadedModel.position.set(0, -0.94, 0);
        loadedModel.scale.setScalar(0.98);

        modelGroup.remove(fallbackFigure);
        modelGroup.add(loadedModel);
      },
      undefined,
      (err) => {
        console.warn("Using procedural editorial figure:", err);
      }
    );

    const engine = new SareeDrapeEngine({
      drapeStyle: activeDrape,
      pleatCount,
      fabricWeight,
    });
    engineRef.current = engine;

    const initialWarp = new THREE.Color(colorway?.hex || "#FAF8F5");
    const initialWeft = new THREE.Color(colorway?.weftHex || "#EFEAE1");
    const initialZari = new THREE.Color(colorway?.zariHex || "#C5A059");

    const commonUniforms = {
      uTime: { value: 0 },
      uWarpColor: { value: initialWarp.clone() },
      uWeftColor: { value: initialWeft.clone() },
      uZariColor: { value: initialZari.clone() },
      uTargetWarp: { value: initialWarp.clone() },
      uTargetWeft: { value: initialWeft.clone() },
      uTargetZari: { value: initialZari.clone() },
      uLightColor: { value: new THREE.Color("#FFFFFF") },
      uLightIntensity: { value: 1.15 },
      uLightPos: { value: new THREE.Vector3(2.5, 4.0, 4.5) },
      uZoom: { value: 1.0 },
    };
    uniformsRef.current = commonUniforms;

    const vertexShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalMatrix * normal;
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewPosition = -(modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Million-Dollar Silk Fragment Shader (Anisotropic Sheen, SSS, and Electro-Lacquered Zari)
    const fragmentShader = `
      precision highp float;
      uniform vec3 uWarpColor;
      uniform vec3 uWeftColor;
      uniform vec3 uZariColor;
      uniform vec3 uLightColor;
      uniform float uLightIntensity;
      uniform vec3 uLightPos;
      uniform float uZoom;
      uniform float uTime;
      uniform int uBorderMode; // 0=none, 1=skirt_hem, 2=sash_edge, 3=pallu

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      float getWeaveBump(vec2 uv) {
        vec2 grid = uv * 240.0;
        float warpThread = cos(grid.x) * 0.5 + 0.5;
        float weftThread = sin(grid.y) * 0.5 + 0.5;
        return mix(warpThread, weftThread, step(0.5, fract(grid.x / 6.28318)));
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(uLightPos - vPosition);

        float weave = getWeaveBump(vUv);
        normal.xy += (vec2(weave) - 0.5) * 0.028;
        normal = normalize(normal);

        float NdotL = (dot(normal, lightDir) + 0.45) / 1.45;
        NdotL = clamp(NdotL, 0.0, 1.0);

        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnel = pow(1.0 - NdotV, 2.2);

        // Shot-silk two-tone luster
        vec3 baseSilk = mix(uWarpColor, uWeftColor, clamp(fresnel * 1.25, 0.0, 1.0));

        // 1. Anisotropic Silk Highlight along yarn filament direction
        vec3 yarnDir = normalize(vec3(0.0, 1.0, 0.0) - normal * normal.y);
        vec3 halfVec = normalize(lightDir + viewDir);
        float TdotH = dot(yarnDir, halfVec);
        float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
        float anisoSpec = pow(sinTH, 28.0) * max(dot(normal, lightDir), 0.0);
        vec3 silkShimmer = mix(uWarpColor, vec3(1.0, 0.98, 0.95), 0.6) * anisoSpec * 0.38;

        // 2. Subsurface Scattering Translucency Wrap
        float sss = pow(clamp(dot(viewDir, -lightDir), 0.0, 1.0), 3.0) * 0.28;
        vec3 sssColor = mix(baseSilk, vec3(1.0, 0.95, 0.90), 0.4) * sss;

        // 3. Selective Zari Borders
        float isBorder = 0.0;
        if (uBorderMode == 1) {
          isBorder = step(0.93, vUv.y);
        } else if (uBorderMode == 2) {
          isBorder = step(0.91, vUv.x);
        } else if (uBorderMode == 3) {
          isBorder = max(step(0.93, vUv.y), step(0.95, vUv.x));
        }

        // Electro-lacquered antique matte zari with fine micro-sparkle
        float zariMicroSparkle = fract(sin(dot(vUv * 120.0, vec2(12.9898, 78.233))) * 43758.5453);
        float zariSpec = pow(max(dot(normal, halfVec), 0.0), 16.0) * (0.8 + 0.3 * zariMicroSparkle);
        vec3 zariGlint = uZariColor * zariSpec * 1.1;

        float zariLuster = 0.92 + 0.16 * sin(vUv.y * 320.0);
        vec3 diffuse = mix(baseSilk, uZariColor * zariLuster, isBorder);
        
        float groundBounce = max(dot(normal, vec3(0.0, 1.0, 0.3)), 0.0) * 0.25;
        vec3 ambient = diffuse * (0.92 + groundBounce * 0.15);
        vec3 directional = diffuse * uLightColor * NdotL * (uLightIntensity * 0.4);
        vec3 finalColor = ambient + directional + silkShimmer + sssColor + (zariGlint * isBorder);

        gl_FragColor = vec4(finalColor, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `;

    const createComponentMaterial = (borderMode: number) => {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          ...commonUniforms,
          uBorderMode: { value: borderMode },
        },
        side: THREE.DoubleSide,
      });
    };

    const blouseMaterial = createComponentMaterial(0);
    const skirtMaterial = createComponentMaterial(1);
    const sashMaterial = createComponentMaterial(2);
    const palluMaterial = createComponentMaterial(3);

    const blouse = createTailoredBlouseMesh(blouseMaterial);
    modelGroup.add(blouse);

    const sashGeo = createDiagonalSashGeometry(activeDrape);
    const sashMesh = new THREE.Mesh(sashGeo, sashMaterial);
    modelGroup.add(sashMesh);
    sashMeshRef.current = sashMesh;

    const skirtGeo = createPleatedSkirtGeometry(pleatCount);
    const skirtMesh = new THREE.Mesh(skirtGeo, skirtMaterial);
    modelGroup.add(skirtMesh);
    skirtMeshRef.current = skirtMesh;

    const waistbandGeo = createWaistbandGeometry();
    const waistbandMesh = new THREE.Mesh(waistbandGeo, blouseMaterial);
    modelGroup.add(waistbandMesh);

    const palluGeo = new THREE.PlaneGeometry(0.68, 1.45, engine.gridW - 1, engine.gridH - 1);
    (palluGeo.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    engine.syncToBuffer(palluGeo.attributes.position as THREE.BufferAttribute);
    palluGeo.computeVertexNormals();

    const palluMesh = new THREE.Mesh(palluGeo, palluMaterial);
    modelGroup.add(palluMesh);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const planeIntersect = new THREE.Vector3();

    let isPointerDown = false;
    let isDraggingCloth = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let lastPointerX = 0;
    let angularVelocity = 0;
    let hasDecidedGesture = false;
    let isVerticalScroll = false;

    const getMouseNDC = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isPointerDown = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      lastPointerX = e.clientX;
      angularVelocity = 0;
      hasDecidedGesture = false;
      isVerticalScroll = false;

      getMouseNDC(e);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([palluMesh]);
      if (intersects.length > 0) {
        isDraggingCloth = true;
        hasDecidedGesture = true;
        setIsGrabbing(true);
        const hitPoint = intersects[0].point;
        engine.grab(hitPoint);

        const cameraDir = camera.getWorldDirection(new THREE.Vector3()).negate();
        dragPlane.setFromNormalAndCoplanarPoint(cameraDir, hitPoint);

        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {}
      } else {
        isDraggingCloth = false;
        // On desktop mouse, immediately allow orbit
        if (e.pointerType !== "touch") {
          setIsOrbiting(true);
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;

      // Smart Gesture Disambiguation on Mobile Touch:
      if (e.pointerType === "touch" && !hasDecidedGesture && !isDraggingCloth) {
        const dx = Math.abs(e.clientX - startPointerX);
        const dy = Math.abs(e.clientY - startPointerY);

        if (dy > dx && dy > 8) {
          // Dominant vertical gesture: let native page scroll proceed without capturing touch
          isVerticalScroll = true;
          hasDecidedGesture = true;
          isPointerDown = false;
          return;
        } else if (dx > 8) {
          // Dominant horizontal gesture: engage 3D turntable orbit
          hasDecidedGesture = true;
          setIsOrbiting(true);
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
        } else {
          return; // Deadzone threshold
        }
      }

      if (isVerticalScroll) return;

      getMouseNDC(e);
      raycaster.setFromCamera(mouse, camera);

      if (isDraggingCloth && engine.grabbedIndex !== null) {
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
          engine.updateGrab(planeIntersect);
        }
      } else {
        const deltaX = (e.clientX - lastPointerX) * 0.007;
        angularVelocity = deltaX;
        modelGroup.rotation.y += deltaX;
        lastPointerX = e.clientX;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      setIsOrbiting(false);

      if (isDraggingCloth && engine.grabbedIndex !== null) {
        engine.releaseGrab();
        setIsGrabbing(false);
      }
      isDraggingCloth = false;

      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // WebGL Context Preservation
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost. Pausing render loop.");
    };
    const handleContextRestored = () => {
      console.info("WebGL context restored.");
    };
    domEl.addEventListener("webglcontextlost", handleContextLost, false);
    domEl.addEventListener("webglcontextrestored", handleContextRestored, false);

    // Viewport Visibility Observer (Saves mobile GPU & battery when scrolled off-screen)
    let isVisibleInViewport = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleInViewport = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Skip GPU computation & rendering when scrolled out of view
      if (!isVisibleInViewport) return;

      const delta = Math.min(clock.getDelta(), 0.033);
      commonUniforms.uTime.value += delta;

      commonUniforms.uWarpColor.value.lerp(commonUniforms.uTargetWarp.value, 0.08);
      commonUniforms.uWeftColor.value.lerp(commonUniforms.uTargetWeft.value, 0.08);
      commonUniforms.uZariColor.value.lerp(commonUniforms.uTargetZari.value, 0.08);

      // Smooth Turntable Inertia with breathing sway
      if (!isPointerDown) {
        modelGroup.rotation.y += angularVelocity;
        angularVelocity *= 0.93; // Smooth inertial friction

        // Gentle breathing micro-sway when at rest
        if (Math.abs(angularVelocity) < 0.0005) {
          modelGroup.rotation.y += Math.sin(commonUniforms.uTime.value * 0.8) * 0.0006;
        }
      }

      // Step physics engine with aerodynamic air drag from turntable rotation
      engine.step(delta, angularVelocity);
      engine.syncToBuffer(palluGeo.attributes.position as THREE.BufferAttribute);
      palluGeo.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();
    setTimeout(() => setIsLoaded(true), 0);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      domEl.removeEventListener("webglcontextlost", handleContextLost);
      domEl.removeEventListener("webglcontextrestored", handleContextRestored);

      blouse.traverse((c) => {
        if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
      });
      sashGeo.dispose();
      skirtGeo.dispose();
      waistbandGeo.dispose();
      palluGeo.dispose();
      plinthGeo.dispose();
      blouseMaterial.dispose();
      skirtMaterial.dispose();
      sashMaterial.dispose();
      palluMaterial.dispose();
      renderer.dispose();
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      engineRef.current = null;
      skirtMeshRef.current = null;
      sashMeshRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  useEffect(() => {
    if (!webglSupported) return;
    const cleanup = initThreeScene();
    return () => {
      if (cleanup) cleanup();
    };
  }, [webglSupported, initThreeScene]);

  if (!webglSupported) {
    return <Fallback360Viewer imageSrc={fallbackImage} title={title} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] md:min-h-[660px] flex items-center justify-center select-none overflow-hidden ${
        isGrabbing
          ? "cursor-grabbing"
          : isOrbiting
          ? "cursor-ew-resize"
          : "cursor-grab"
      } ${className}`}
      data-cursor={isGrabbing ? "DRAPING SILK" : isOrbiting ? "ORBIT 360°" : "GRAB & DRAPE"}
    >
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Controls: Adaptive Responsive Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Authentic Saree Drape Style Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 bg-canvas-base/90 backdrop-blur-md border border-surface-border rounded-xs shadow-xs">
          {(
            [
              { id: "nivi", label: "Classic Nivi", short: "Nivi" },
              { id: "seedha", label: "Royal Seedha", short: "Seedha" },
              { id: "cape", label: "Atelier Cape", short: "Cape" },
            ] as { id: DrapeStyle; label: string; short: string }[]
          ).map((style) => (
            <button
              key={style.id}
              onClick={() => handleDrapeChange(style.id)}
              data-drape={style.id}
              className={`px-2 py-1 text-[10px] font-mono tracking-wider uppercase transition-all rounded-xs min-h-[30px] flex items-center justify-center ${
                activeDrape === style.id
                  ? "bg-text-primary text-canvas-base font-medium shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="sm:hidden">{style.short}</span>
              <span className="hidden sm:inline">{style.label}</span>
            </button>
          ))}
        </div>

        {/* Reset Drape & Pleat Count Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <div className="flex items-center gap-1 p-1 bg-canvas-base/90 backdrop-blur-md border border-surface-border rounded-xs shadow-xs">
            <Layers className="w-3 h-3 text-accent-zari ml-1" />
            <span className="text-[9px] font-mono tracking-wider text-text-tertiary uppercase mr-0.5 hidden sm:inline">
              Pleats:
            </span>
            {[5, 7, 9].map((count) => (
              <button
                key={count}
                onClick={() => handlePleatCountChange(count)}
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono tracking-wider transition-all rounded-xs ${
                  pleatCount === count
                    ? "bg-accent-zari text-canvas-base font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleDrapeChange(activeDrape)}
            className="h-8 px-2.5 bg-canvas-base/90 backdrop-blur-md border border-surface-border text-text-secondary hover:text-text-primary transition-colors rounded-xs flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase shadow-xs min-w-[36px] justify-center"
            title="Reset Saree Drape"
            aria-label="Reset Saree Drape"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Bottom Left: Genuine Draping Instruction Badge */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 pointer-events-none flex items-center justify-between sm:justify-start gap-2 bg-canvas-base/90 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[9px] sm:text-[10px] font-mono tracking-widest text-text-secondary uppercase shadow-xs">
        <div className="flex items-center gap-1.5 truncate">
          <Hand className="w-3 h-3 text-accent-zari flex-shrink-0" />
          <span className="truncate">
            {isGrabbing
              ? "DRAPING PALLU..."
              : isOrbiting
              ? "ROTATING 360°..."
              : "SWIPE 360° · DRAG PALLU TO DRAPE"}
          </span>
        </div>
        <span className="text-[8px] text-text-tertiary sm:hidden">TOUCH ENABLED</span>
      </div>

      {/* Bottom Right: Architectural Metrology Tag */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-canvas-base/90 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-tertiary uppercase shadow-xs">
        <Rotate3d className="w-3.5 h-3.5 text-accent-zari" />
        <span>EDITORIAL MODEL SILHOUETTE</span>
        <span className="w-1 h-1 rounded-full bg-accent-zari" />
        <span>LIVE DRAPE METROLOGY</span>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas-base/80 backdrop-blur-sm z-10 transition-opacity duration-500 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-accent-zari/40 border-t-accent-zari animate-spin" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-secondary">
              Synthesizing 3D Drape Atelier...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
