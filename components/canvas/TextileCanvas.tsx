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

// ─────────────────────────────────────────────────────────────────────────────
// ANATOMICAL DRAPE COORDINATES (Calibrated to mannequin.glb @ pos(0,-0.94,0) scale=0.98)
//
// Landmarks in World Space:
//   Feet / Plinth Top:   y = -0.940
//   Floor-Skimming Hem:  y = -0.920
//   Knees:               y = -0.450
//   Hips:                y = -0.100 (half-width 0.245, depth 0.125)
//   Waist / Navel Tuck:  y = +0.080 (torso half-width 0.165, depth 0.210)
//   Under-Bust:          y = +0.190 (torso half-width 0.165, depth 0.232)
//   Bust Peak:           y = +0.300 (torso half-width 0.162, front Z max +0.161)
//   Upper Chest:         y = +0.420 (torso half-width 0.165, front Z max +0.147)
//   Shoulder Crest:      y = +0.505 (left x = -0.185, right x = +0.185)
//   Arms:                x = ±0.210, y = 0.220 to 0.480, r ≈ 0.048
//   Neck & Head:         y = +0.550 to +0.798
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Sculpted Editorial Faceless Figure (Fallback & Reference) ─────────────
function createSculptedFacelessFigure(): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xd6d0c4,
    roughness: 0.72,
    metalness: 0.02,
  });

  const addCyl = (
    rT: number, rB: number, h: number, segs: number,
    yB: number, xO = 0, zO = 0, xR = 0, zR = 0
  ) => {
    const g = new THREE.CylinderGeometry(rT, rB, h, segs, 4);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.position.set(xO, yB + h / 2, zO);
    m.rotation.x = xR; m.rotation.z = zR;
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const addSph = (r: number, y: number, xO = 0, zO = 0, sY = 1.0) => {
    const g = new THREE.SphereGeometry(r, 24, 20);
    g.scale(1, sY, 1);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.position.set(xO, y, zO);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // Feet & Ankles
  addSph(0.040, -0.92, -0.075, 0.035, 0.45);
  addSph(0.040, -0.92,  0.075, 0.035, 0.45);

  // Calves & Knees
  addCyl(0.062, 0.050, 0.36, 20, -0.90, -0.075, -0.02);
  addCyl(0.062, 0.050, 0.36, 20, -0.90,  0.075, -0.02);
  addSph(0.065, -0.52, -0.075, 0.01);
  addSph(0.065, -0.52,  0.075, 0.01);

  // Thighs
  addCyl(0.092, 0.070, 0.38, 24, -0.50, -0.075, 0.02);
  addCyl(0.092, 0.070, 0.38, 24, -0.50,  0.075, 0.02);

  // Pelvis / Hips
  const pelGeo = new THREE.SphereGeometry(0.18, 32, 20);
  pelGeo.scale(1.36, 0.80, 0.65);
  pelGeo.computeVertexNormals();
  const pelvis = new THREE.Mesh(pelGeo, mat);
  pelvis.position.set(0, -0.06, 0.035);
  pelvis.castShadow = true; pelvis.receiveShadow = true;
  group.add(pelvis);

  // Central Waist & Ribcage
  const wstGeo = new THREE.CylinderGeometry(0.165, 0.170, 0.18, 36, 6);
  wstGeo.computeVertexNormals();
  const waist = new THREE.Mesh(wstGeo, mat);
  waist.scale.set(1.0, 1.0, 0.72);
  waist.position.set(0, 0.14, 0.035);
  waist.castShadow = true; waist.receiveShadow = true;
  group.add(waist);

  // Upper Torso & Bust
  const chGeo = new THREE.CylinderGeometry(0.165, 0.165, 0.22, 36, 6);
  chGeo.computeVertexNormals();
  const chest = new THREE.Mesh(chGeo, mat);
  chest.scale.set(1.0, 1.0, 0.78);
  chest.position.set(0, 0.34, 0.025);
  chest.castShadow = true; chest.receiveShadow = true;
  group.add(chest);

  addSph(0.070, 0.30, -0.070, 0.115, 0.90);
  addSph(0.070, 0.30,  0.070, 0.115, 0.90);

  // Shoulders & Arms
  addSph(0.062, 0.505, -0.185, 0.005, 0.85);
  addSph(0.062, 0.505,  0.185, 0.005, 0.85);
  addCyl(0.046, 0.038, 0.26, 16, 0.22, -0.210, -0.015, 0, 0.06);
  addCyl(0.046, 0.038, 0.26, 16, 0.22,  0.210, -0.015, 0, -0.06);

  // Neck & Editorial Head Finial
  addCyl(0.052, 0.062, 0.15, 24, 0.53, 0, 0.035);
  addSph(0.052, 0.74, 0, 0.035, 0.85);

  return group;
}

// ── 2. Tailored Silk Blouse (Choli) with Zari Piping & Fitted Sleeves ─────────
function createTailoredBlouseMesh(
  blouseMaterial: THREE.Material,
  zariMaterial: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const rSegs = 64;
  const hSegs = 24;
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];

  // Bodice wraps cropped choli from under-bust (y = 0.23) to shoulder root (y = 0.495)
  for (let h = 0; h <= hSegs; h++) {
    const v = h / hSegs;
    const y = 0.23 + v * 0.265; // y = 0.23 to 0.495

    const rX = THREE.MathUtils.lerp(0.170, 0.178, v);
    const cZ = 0.028 - v * 0.015;

    // Asymmetric depth: fitted back, flattering bust contour
    const rZ_front = 0.134 + Math.sin(v * Math.PI * 0.70) * 0.016;
    const rZ_back  = 0.112 + Math.sin(v * Math.PI) * 0.015;

    for (let r = 0; r <= rSegs; r++) {
      const u = r / rSegs;
      const angle = u * Math.PI * 2;
      const sinA = Math.sin(angle);
      const rZ = sinA >= 0 ? rZ_front : rZ_back;

      const px = Math.cos(angle) * rX;
      const pz = cZ + sinA * rZ;
      let py = y;

      // Elegant sweetheart / scoop neckline dipping to y = 0.405 in front
      if (sinA > 0.35 && v > 0.65) {
        const neckProg = (v - 0.65) / 0.35;
        const frontCenter = (sinA - 0.35) / 0.65;
        py -= neckProg * frontCenter * 0.045;
      }

      pos.push(px, py, pz);
      uvs.push(u, v);
    }
  }

  for (let h = 0; h < hSegs; h++) {
    for (let r = 0; r < rSegs; r++) {
      const a = h * (rSegs + 1) + r;
      const b = a + 1;
      const c = (h + 1) * (rSegs + 1) + r;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }

  const bodiceGeo = new THREE.BufferGeometry();
  bodiceGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  bodiceGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  bodiceGeo.setIndex(idx);
  bodiceGeo.computeVertexNormals();
  const bodiceMesh = new THREE.Mesh(bodiceGeo, blouseMaterial);
  bodiceMesh.castShadow = true; bodiceMesh.receiveShadow = true;
  group.add(bodiceMesh);

  // Left Fitted Cap Sleeve & Zari Cuff (Hugs upper arm naturally)
  const slvGeoL = new THREE.CylinderGeometry(0.050, 0.045, 0.08, 24);
  slvGeoL.rotateZ(0.06);
  slvGeoL.translate(-0.198, 0.450, -0.005);
  slvGeoL.computeVertexNormals();
  const slvL = new THREE.Mesh(slvGeoL, blouseMaterial);
  slvL.castShadow = true;
  group.add(slvL);

  const cuffGeoL = new THREE.CylinderGeometry(0.046, 0.045, 0.014, 24);
  cuffGeoL.rotateZ(0.06);
  cuffGeoL.translate(-0.200, 0.405, -0.005);
  cuffGeoL.computeVertexNormals();
  const cuffL = new THREE.Mesh(cuffGeoL, zariMaterial);
  group.add(cuffL);

  // Right Fitted Cap Sleeve & Zari Cuff
  const slvGeoR = new THREE.CylinderGeometry(0.050, 0.045, 0.08, 24);
  slvGeoR.rotateZ(-0.06);
  slvGeoR.translate(0.198, 0.450, -0.005);
  slvGeoR.computeVertexNormals();
  const slvR = new THREE.Mesh(slvGeoR, blouseMaterial);
  slvR.castShadow = true;
  group.add(slvR);

  const cuffGeoR = new THREE.CylinderGeometry(0.046, 0.045, 0.014, 24);
  cuffGeoR.rotateZ(-0.06);
  cuffGeoR.translate(0.200, 0.405, -0.005);
  cuffGeoR.computeVertexNormals();
  const cuffR = new THREE.Mesh(cuffGeoR, zariMaterial);
  group.add(cuffR);

  return group;
}

// ── 3. Waistband Cinch / Tuck Knot at Natural Waist ──────────────────────────
function createWaistbandGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.178, 0.182, 0.030, 48, 1, true);
  geo.scale(1.0, 1.0, 0.70);
  geo.translate(0, 0.080, 0.038);
  geo.computeVertexNormals();
  return geo;
}

// ── 4. Authentic Saree Skirt with Cascading Knife Pleats (Patli) ──────────────
function createAuthenticSareeSkirt(
  pleatCount: number,
  silkMaterial: THREE.Material,
  zariMaterial: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  const skirtTop = 0.080;   // Waist tuck
  const skirtBottom = -0.920; // Floor hem
  const height = skirtTop - skirtBottom; // 1.00m

  // Part A: Petticoat & Contoured Base Wrap (Flared A-line silhouette)
  const rSegs = 96;
  const hSegs = 36;
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];

  for (let y = 0; y <= hSegs; y++) {
    const v = y / hSegs;
    const py = skirtTop - v * height;

    let rX: number, rZ: number, cZ: number;
    if (v < 0.20) {
      const t = v / 0.20;
      rX = THREE.MathUtils.lerp(0.176, 0.250, t);
      rZ = THREE.MathUtils.lerp(0.122, 0.128, t);
      cZ = THREE.MathUtils.lerp(0.038, 0.035, t);
    } else if (v < 0.60) {
      const t = (v - 0.20) / 0.40;
      rX = THREE.MathUtils.lerp(0.250, 0.208, t);
      rZ = THREE.MathUtils.lerp(0.128, 0.104, t);
      cZ = THREE.MathUtils.lerp(0.035, 0.015, t);
    } else {
      const t = (v - 0.60) / 0.40;
      rX = THREE.MathUtils.lerp(0.208, 0.286, t);
      rZ = THREE.MathUtils.lerp(0.104, 0.150, t);
      cZ = THREE.MathUtils.lerp(0.015, 0.000, t);
    }

    const hipTension = v < 0.22 ? Math.sin(v * Math.PI * 5.0) * 0.0018 * (1.0 - v / 0.22) : 0;

    for (let x = 0; x <= rSegs; x++) {
      const u = x / rSegs;
      const angle = u * Math.PI * 2;
      pos.push(Math.cos(angle) * (rX + hipTension), py, cZ + Math.sin(angle) * (rZ + hipTension));
      uvs.push(u, v);
    }
  }

  for (let y = 0; y < hSegs; y++) {
    for (let x = 0; x < rSegs; x++) {
      const i1 = y * (rSegs + 1) + x;
      const i2 = i1 + 1;
      const i3 = (y + 1) * (rSegs + 1) + x;
      const i4 = i3 + 1;
      idx.push(i1, i3, i2, i2, i3, i4);
    }
  }

  const baseGeo = new THREE.BufferGeometry();
  baseGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  baseGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  baseGeo.setIndex(idx);
  baseGeo.computeVertexNormals();
  const baseMesh = new THREE.Mesh(baseGeo, silkMaterial);
  baseMesh.castShadow = true; baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Part B: Distinct Overlapping Knife Pleats (Patli)
  // Each pleat is a separate folded ribbon overlapping right-to-left
  const pleatHeightSegs = 28;
  const pleatWidthSegs = 4;
  const pleatSpanX = 0.016; // 1.6cm lateral step per pleat

  for (let p = 0; p < pleatCount; p++) {
    const pPos: number[] = [];
    const pUvs: number[] = [];
    const pIdx: number[] = [];

    // Right-to-left overlap ordering
    const pleatOffsetU = (p - (pleatCount - 1) / 2);
    const startX = pleatOffsetU * pleatSpanX;
    const baseZ = 0.148 + p * 0.0035; // Staggered forward in Z for zero z-fighting

    for (let h = 0; h <= pleatHeightSegs; h++) {
      const v = h / pleatHeightSegs;
      const py = skirtTop - v * height;

      // Pleat ribbon curves outward slightly toward the hem
      const flare = THREE.MathUtils.lerp(0.045, 0.075, v);
      const curX = startX * (1.0 + v * 0.65);
      const curZ = baseZ + Math.sin(v * Math.PI * 0.8) * 0.015;

      for (let w = 0; w <= pleatWidthSegs; w++) {
        const u = w / pleatWidthSegs;
        // Crisp knife-pleat fold with tactile shadow crevice
        const crease = Math.pow(u, 1.3);
        const px = curX + (u - 0.5) * flare;
        const pz = curZ + crease * 0.022;

        pPos.push(px, py, pz);
        pUvs.push(u, v);
      }
    }

    for (let h = 0; h < pleatHeightSegs; h++) {
      for (let w = 0; w < pleatWidthSegs; w++) {
        const a = h * (pleatWidthSegs + 1) + w;
        const b = a + 1;
        const c = (h + 1) * (pleatWidthSegs + 1) + w;
        const d = c + 1;
        pIdx.push(a, b, c, b, d, c);
      }
    }

    const pleatGeo = new THREE.BufferGeometry();
    pleatGeo.setAttribute("position", new THREE.Float32BufferAttribute(pPos, 3));
    pleatGeo.setAttribute("uv", new THREE.Float32BufferAttribute(pUvs, 2));
    pleatGeo.setIndex(pIdx);
    pleatGeo.computeVertexNormals();

    const pleatMesh = new THREE.Mesh(pleatGeo, silkMaterial);
    pleatMesh.castShadow = true; pleatMesh.receiveShadow = true;
    group.add(pleatMesh);
  }

  // Part C: Solid 8.5cm Woven Zari Hem Border Band
  const hemSegsR = 96;
  const hemSegsH = 4;
  const hPos: number[] = [];
  const hUvs: number[] = [];
  const hIdx: number[] = [];

  for (let y = 0; y <= hemSegsH; y++) {
    const v = y / hemSegsH;
    const py = -0.920 + v * 0.085; // y = -0.920 to -0.835
    const rX = THREE.MathUtils.lerp(0.288, 0.272, v);
    const rZ = THREE.MathUtils.lerp(0.152, 0.142, v);

    for (let x = 0; x <= hemSegsR; x++) {
      const u = x / hemSegsR;
      const angle = u * Math.PI * 2;
      hPos.push(Math.cos(angle) * rX, py, Math.sin(angle) * rZ);
      hUvs.push(u, v);
    }
  }

  for (let y = 0; y < hemSegsH; y++) {
    for (let x = 0; x < hemSegsR; x++) {
      const i1 = y * (hemSegsR + 1) + x;
      const i2 = i1 + 1;
      const i3 = (y + 1) * (hemSegsR + 1) + x;
      const i4 = i3 + 1;
      hIdx.push(i1, i3, i2, i2, i3, i4);
    }
  }

  const hemGeo = new THREE.BufferGeometry();
  hemGeo.setAttribute("position", new THREE.Float32BufferAttribute(hPos, 3));
  hemGeo.setAttribute("uv", new THREE.Float32BufferAttribute(hUvs, 2));
  hemGeo.setIndex(hIdx);
  hemGeo.computeVertexNormals();
  const hemMesh = new THREE.Mesh(hemGeo, zariMaterial);
  hemMesh.castShadow = true; hemMesh.receiveShadow = true;
  group.add(hemMesh);

  return group;
}

// ── 5. Authentic Torso Drape (Midriff Wrap + Multi-Pleated Uparli) ────────────
function createAuthenticTorsoDrape(
  style: DrapeStyle = "nivi",
  silkMaterial: THREE.Material,
  zariMaterial: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  // Continuous Cross-Chest Pleated Uparli
  // In Nivi style: Sweeps diagonally from right waist, across the bust, onto the left shoulder
  // Right side of chest and bare midriff are naturally exposed
  const lSegs = 64;
  const wSegs = 24;
  const uPos: number[] = [];
  const uUvs: number[] = [];
  const uIdx: number[] = [];

  const yBottom = 0.08;
  const yTop = 0.505;
  const yRange = yTop - yBottom;

  for (let i = 0; i <= lSegs; i++) {
    const v = i / lSegs;
    const y = yBottom + v * yRange;

    let centerX: number, centerZ: number, dWidth: number;

    if (style === "seedha") {
      // Royal Seedha: Emerges tucked at left waist, sweeps across chest to right shoulder
      centerX = THREE.MathUtils.lerp(-0.12, 0.175, v);
      const bustProg = Math.sin(v * Math.PI);
      centerZ = THREE.MathUtils.lerp(0.09, 0.015, v) + bustProg * 0.065;
      dWidth = 0.16 + bustProg * 0.08;
    } else if (style === "cape") {
      // Atelier Cape: Symmetrical cowl drape across front chest
      centerX = 0;
      centerZ = THREE.MathUtils.lerp(0.06, 0.18, Math.sin(v * Math.PI));
      dWidth = THREE.MathUtils.lerp(0.34, 0.22, v);
    } else {
      // Classic Nivi: Emerges at right waist (x = +0.12), sweeps across bosom to left shoulder (x = -0.175)
      centerX = THREE.MathUtils.lerp(0.12, -0.175, v);
      const bustProg = Math.sin(v * Math.PI);
      centerZ = THREE.MathUtils.lerp(0.09, 0.020, v) + bustProg * 0.070;
      dWidth = 0.16 + bustProg * 0.08;
    }

    for (let j = 0; j <= wSegs; j++) {
      const u = j / wSegs;
      const offW = (u - 0.5) * dWidth;

      // Authentic pressed silk pleat waves across the drape width
      const pleatWave = Math.sin(u * Math.PI * 6.0) * 0.0035;

      const px = centerX + offW * 0.92 - 0.15 * pleatWave;
      const py = y + offW * 0.10;
      // +6mm forward relief ensures uparli sits proud of the choli
      const pz = centerZ + 0.006 + offW * 0.30 + 1.2 * pleatWave;

      uPos.push(px, py, pz);
      uUvs.push(u, v);
    }
  }

  for (let i = 0; i < lSegs; i++) {
    for (let j = 0; j < wSegs; j++) {
      const a = i * (wSegs + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (wSegs + 1) + j;
      const d = c + 1;
      uIdx.push(a, c, b, b, c, d);
    }
  }

  const uparliGeo = new THREE.BufferGeometry();
  uparliGeo.setAttribute("position", new THREE.Float32BufferAttribute(uPos, 3));
  uparliGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uUvs, 2));
  uparliGeo.setIndex(uIdx);
  uparliGeo.computeVertexNormals();

  const uparliMesh = new THREE.Mesh(uparliGeo, silkMaterial);
  uparliMesh.castShadow = true; uparliMesh.receiveShadow = true;
  group.add(uparliMesh);

  // Outer Zari Selvedge Piping along the exterior edge of the uparli
  const selvedgeSegsL = 64;
  const sPos: number[] = [];
  const sIdx: number[] = [];

  for (let i = 0; i <= selvedgeSegsL; i++) {
    const v = i / selvedgeSegsL;
    const y = yBottom + v * yRange;
    const bustProg = Math.sin(v * Math.PI);

    let centerX: number, centerZ: number, dWidth: number;
    if (style === "seedha") {
      centerX = THREE.MathUtils.lerp(-0.12, 0.175, v);
      centerZ = THREE.MathUtils.lerp(0.09, 0.015, v) + bustProg * 0.065;
      dWidth = 0.16 + bustProg * 0.08;
    } else if (style === "cape") {
      centerX = 0;
      centerZ = THREE.MathUtils.lerp(0.06, 0.18, Math.sin(v * Math.PI));
      dWidth = THREE.MathUtils.lerp(0.34, 0.22, v);
    } else {
      centerX = THREE.MathUtils.lerp(0.12, -0.175, v);
      centerZ = THREE.MathUtils.lerp(0.09, 0.020, v) + bustProg * 0.070;
      dWidth = 0.16 + bustProg * 0.08;
    }

    // Outer edge: u = 1.0 (offW = +0.5 * dWidth)
    const edgeX = centerX + 0.5 * dWidth * 0.92;
    const edgeY = y + 0.5 * dWidth * 0.10;
    const edgeZ = centerZ + 0.5 * dWidth * 0.30 + 0.001;

    // Small ribbon band of width 0.014m (1.4cm Zari piping)
    sPos.push(edgeX - 0.007, edgeY, edgeZ);
    sPos.push(edgeX + 0.007, edgeY, edgeZ + 0.002);
  }

  for (let i = 0; i < selvedgeSegsL; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = (i + 1) * 2;
    const d = c + 1;
    sIdx.push(a, c, b, b, c, d);
  }

  const selvedgeGeo = new THREE.BufferGeometry();
  selvedgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(sPos, 3));
  selvedgeGeo.setIndex(sIdx);
  selvedgeGeo.computeVertexNormals();

  const selvedgeMesh = new THREE.Mesh(selvedgeGeo, zariMaterial);
  group.add(selvedgeMesh);

  // Left Shoulder Gold Brooch / Safety Pin (Anchors the pleated drape to the choli)
  if (style === "nivi") {
    const pin = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 16, 24), zariMaterial);
    pin.position.set(-0.175, 0.505, 0.030);
    pin.rotation.x = Math.PI * 0.5;
    group.add(pin);
  }

  return group;
}

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
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

  const { lightingMode, fabricWeight, zoomLevel, isMacroInspecting } = useCanvasStore();

  const engineRef = useRef<SareeDrapeEngine | null>(null);
  const skirtGroupRef = useRef<THREE.Group | null>(null);
  const torsoDrapeGroupRef = useRef<THREE.Group | null>(null);
  const silkMaterialRef = useRef<THREE.Material | null>(null);
  const zariMaterialRef = useRef<THREE.Material | null>(null);

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
    if (torsoDrapeGroupRef.current && silkMaterialRef.current && zariMaterialRef.current) {
      const parent = torsoDrapeGroupRef.current.parent;
      if (parent) {
        parent.remove(torsoDrapeGroupRef.current);
        torsoDrapeGroupRef.current.traverse((c) => {
          if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
        });
        const newGroup = createAuthenticTorsoDrape(style, silkMaterialRef.current, zariMaterialRef.current);
        parent.add(newGroup);
        torsoDrapeGroupRef.current = newGroup;
      }
    }
  };

  const handlePleatCountChange = (count: number) => {
    setPleatCount(count);
    if (skirtGroupRef.current && silkMaterialRef.current && zariMaterialRef.current) {
      const parent = skirtGroupRef.current.parent;
      if (parent) {
        parent.remove(skirtGroupRef.current);
        skirtGroupRef.current.traverse((c) => {
          if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
        });
        const newSkirt = createAuthenticSareeSkirt(count, silkMaterialRef.current, zariMaterialRef.current);
        parent.add(newSkirt);
        skirtGroupRef.current = newSkirt;
      }
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
    const height = container.clientHeight || 800;

    const scene = new THREE.Scene();

    // Camera: Calibrated to frame 1.74m standing figure on plinth with headroom
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, -0.08, 3.65);
    camera.lookAt(0, -0.08, 0);

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

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(pointer: coarse), (hover: none)").matches);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = "pan-y";
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    // Haute Couture 3-Point Editorial Lighting with Soft Contact Shadows
    scene.add(new THREE.AmbientLight(0xffffff, 1.35));

    const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.85);
    keyLight.position.set(2.5, 4.0, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf0eae2, 1.15);
    fillLight.position.set(-2.5, 1.5, 3.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc5a059, 0.90);
    rimLight.position.set(0.0, 2.5, -3.0);
    scene.add(rimLight);

    const groundBounce = new THREE.DirectionalLight(0xf8f5ee, 0.30);
    groundBounce.position.set(0, -3.0, 2.0);
    scene.add(groundBounce);

    // Model group: default 3/4 Editorial Stance (~18 degrees)
    const modelGroup = new THREE.Group();
    modelGroup.rotation.y = 0.32;
    scene.add(modelGroup);

    // Architectural Plinth
    const plinthGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.035, 40);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xedeae3,
      roughness: 0.82,
      metalness: 0.04,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -0.96;
    plinthMesh.receiveShadow = true;
    modelGroup.add(plinthMesh);

    // Procedural Fallback Figure
    const fallbackFigure = createSculptedFacelessFigure();
    modelGroup.add(fallbackFigure);

    // Load High-Precision Mannequin GLB
    const loader = new GLTFLoader();
    loader.load(
      "/models/mannequin.glb",
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0xd6d0c4,
              roughness: 0.72,
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

    // ── Physics Engine for Dynamic Pallu ──────────────────────────────────
    const engine = new SareeDrapeEngine({
      drapeStyle: activeDrape,
      pleatCount,
      fabricWeight,
    });
    engineRef.current = engine;

    // ── Silk Shader Uniforms ─────────────────────────────────────────────
    // ── Silk Shader Uniforms with Real PBR Textures ─────────────────────
    const initialWarp = new THREE.Color(colorway?.hex || "#FAF8F5");
    const initialWeft = new THREE.Color(colorway?.weftHex || "#EFEAE1");
    const initialZari = new THREE.Color(colorway?.zariHex || "#C5A059");

    const textureLoader = new THREE.TextureLoader();
    const zariBorderTex = textureLoader.load("/textures/zari_border.png");
    zariBorderTex.wrapS = THREE.RepeatWrapping;
    zariBorderTex.wrapT = THREE.RepeatWrapping;

    const palluBrocadeTex = textureLoader.load("/textures/pallu_brocade.png");
    palluBrocadeTex.wrapS = THREE.RepeatWrapping;
    palluBrocadeTex.wrapT = THREE.ClampToEdgeWrapping;

    const silkNormalTex = textureLoader.load("/textures/silk_normal.png");
    silkNormalTex.wrapS = THREE.RepeatWrapping;
    silkNormalTex.wrapT = THREE.RepeatWrapping;

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
      uZariTex: { value: zariBorderTex },
      uPalluTex: { value: palluBrocadeTex },
      uNormalTex: { value: silkNormalTex },
    };
    uniformsRef.current = commonUniforms;

    // ── Vertex Shader ────────────────────────────────────────────────────
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

    // ── Fragment Shader: Anisotropic Silk Luster + SSS + Electro-Lacquered Zari ─
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
      uniform int uBorderMode; // 0=silk, 1=solid_zari, 2=pallu

      uniform sampler2D uZariTex;
      uniform sampler2D uPalluTex;
      uniform sampler2D uNormalTex;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);

        // Perturb normal with realistic 3-ply twisted silk micro-twill weave
        vec3 normSample = texture2D(uNormalTex, vUv * 8.0).rgb * 2.0 - 1.0;
        normal = normalize(normal + normSample * 0.12);

        vec3 viewDir = normalize(vViewPosition);
        vec3 lightDir = normalize(uLightPos - vPosition);

        float NdotL = clamp((dot(normal, lightDir) + 0.45) / 1.45, 0.0, 1.0);
        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnel = pow(1.0 - NdotV, 2.2);

        // Shot-silk two-tone luster (Dhoop-Chhaon optical shift)
        vec3 baseSilk = mix(uWarpColor, uWeftColor, clamp(fresnel * 1.30, 0.0, 1.0));

        // 1. Anisotropic Silk Highlight along yarn filament direction
        vec3 yarnDir = normalize(vec3(0.0, 1.0, 0.0) - normal * normal.y);
        vec3 halfVec = normalize(lightDir + viewDir);
        float TdotH = dot(yarnDir, halfVec);
        float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
        float anisoSpec = pow(sinTH, 28.0) * max(dot(normal, lightDir), 0.0);
        vec3 silkShimmer = mix(uWarpColor, vec3(1.0, 0.98, 0.95), 0.6) * anisoSpec * 0.36;

        // 2. Subsurface Scattering Translucency Wrap
        float sss = pow(clamp(dot(viewDir, -lightDir), 0.0, 1.0), 3.0) * 0.25;
        vec3 sssColor = mix(baseSilk, vec3(1.0, 0.95, 0.90), 0.4) * sss;

        // 3. Selective Zari Borders & Brocade Panel
        float isBorder = 0.0;
        vec3 borderCol = uZariColor;
        if (uBorderMode == 1) {
          isBorder = 1.0; // Solid woven Zari border with Korvai temple spires
          vec4 zTex = texture2D(uZariTex, vec2(vUv.x * 16.0, vUv.y));
          borderCol = mix(uZariColor * 0.85, uZariColor * 1.25, zTex.r);
        } else if (uBorderMode == 2) {
          // Dynamic Pallu: Grand Brocade End Panel (bottom 32%)
          if (vUv.y > 0.68) {
            float brocV = (vUv.y - 0.68) / 0.32;
            vec4 pTex = texture2D(uPalluTex, vec2(vUv.x * 2.5, brocV));
            isBorder = pTex.r;
            borderCol = mix(uZariColor * 0.90, uZariColor * 1.30, pTex.r);
          } else {
            isBorder = max(step(0.92, vUv.x), step(0.92, 1.0 - vUv.x));
            borderCol = uZariColor;
          }
        }

        // Electro-lacquered antique matte zari with fine micro-sparkle
        float zariMicroSparkle = fract(sin(dot(vUv * 120.0, vec2(12.9898, 78.233))) * 43758.5453);
        float zariSpec = pow(max(dot(normal, halfVec), 0.0), 16.0) * (0.80 + 0.30 * zariMicroSparkle);
        vec3 zariGlint = borderCol * zariSpec * 1.15;

        vec3 diffuse = mix(baseSilk, borderCol, isBorder);

        float groundBounceLight = max(dot(normal, vec3(0.0, 1.0, 0.3)), 0.0) * 0.22;
        vec3 ambient = diffuse * (0.92 + groundBounceLight * 0.15);
        vec3 directional = diffuse * uLightColor * NdotL * (uLightIntensity * 0.38);
        vec3 finalColor = ambient + directional + silkShimmer + sssColor + (zariGlint * isBorder);

        gl_FragColor = vec4(finalColor, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `;

    const createMat = (borderMode: number) =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          ...commonUniforms,
          uBorderMode: { value: borderMode },
        },
        side: THREE.DoubleSide,
      });

    const silkMat  = createMat(0);
    const zariMat  = createMat(1);
    const palluMat = createMat(2);

    silkMaterialRef.current = silkMat;
    zariMaterialRef.current = zariMat;

    // ── Contrasting Haute Couture Choli Material ──────────────────────────
    // Elegantly separates the cropped blouse from the draped saree silk
    const isDarkSaree = (initialWarp.r + initialWarp.g + initialWarp.b) / 3.0 < 0.45;
    const blouseColorHex = isDarkSaree ? 0xe5ded2 : 0x1f1e1c;
    const blouseMat = new THREE.MeshStandardMaterial({
      color: blouseColorHex,
      roughness: 0.68,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    // ── Build Garments ───────────────────────────────────────────────────

    // 1. Tailored Choli (Blouse) in Contrasting Raw Silk
    const blouse = createTailoredBlouseMesh(blouseMat, zariMat);
    modelGroup.add(blouse);

    // 2. Petticoat Waistband Cinch
    const waistbandGeo = createWaistbandGeometry();
    const waistbandMesh = new THREE.Mesh(waistbandGeo, silkMat);
    waistbandMesh.castShadow = true;
    modelGroup.add(waistbandMesh);

    // 3. Knife-Pleated Saree Skirt (Patli & Hem Border)
    const skirtGroup = createAuthenticSareeSkirt(pleatCount, silkMat, zariMat);
    modelGroup.add(skirtGroup);
    skirtGroupRef.current = skirtGroup;

    // 4. Authentic Torso Drape (Midriff Wrap + Pleated Uparli)
    const torsoDrapeGroup = createAuthenticTorsoDrape(activeDrape, silkMat, zariMat);
    modelGroup.add(torsoDrapeGroup);
    torsoDrapeGroupRef.current = torsoDrapeGroup;

    // 5. Dynamic Pallu Physics Plane
    const palluGeo = new THREE.PlaneGeometry(0.68, 1.35, engine.gridW - 1, engine.gridH - 1);
    (palluGeo.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    engine.syncToBuffer(palluGeo.attributes.position as THREE.BufferAttribute);
    palluGeo.computeVertexNormals();

    const palluMesh = new THREE.Mesh(palluGeo, palluMat);
    palluMesh.castShadow = true; palluMesh.receiveShadow = true;
    modelGroup.add(palluMesh);

    // ── Raycasting & Gesture Interactions ────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const planeIntersect = new THREE.Vector3();

    let isPointerDown = false;
    let isDraggingCloth = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let angVel = 0;
    let decidedGesture = false;
    let isVerticalScroll = false;

    const getMouseNDC = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      angVel = 0;
      decidedGesture = false;
      isVerticalScroll = false;

      getMouseNDC(e);
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([palluMesh]);
      if (intersects.length > 0) {
        isDraggingCloth = true;
        decidedGesture = true;
        setIsGrabbing(true);
        const hitPoint = intersects[0].point;
        engine.grab(hitPoint);

        const cameraDir = camera.getWorldDirection(new THREE.Vector3()).negate();
        dragPlane.setFromNormalAndCoplanarPoint(cameraDir, hitPoint);

        if (e.pointerType !== "touch") {
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
        }
      } else {
        isDraggingCloth = false;
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
      if (e.pointerType === "touch" && !decidedGesture) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);

        if (dy > dx && dy > 8) {
          isVerticalScroll = true;
          decidedGesture = true;
          isPointerDown = false;
          if (isDraggingCloth) {
            engine.releaseGrab();
            isDraggingCloth = false;
            setIsGrabbing(false);
          }
          return;
        } else if (dx > 8 || (isDraggingCloth && (dx > 6 || dy > 6))) {
          decidedGesture = true;
          if (isDraggingCloth) {
            setIsGrabbing(true);
          } else {
            setIsOrbiting(true);
          }
          try {
            renderer.domElement.setPointerCapture(e.pointerId);
          } catch {}
        } else {
          return;
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
        const deltaX = (e.clientX - lastX) * 0.007;
        angVel = deltaX;
        modelGroup.rotation.y += deltaX;
        lastX = e.clientX;
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

      if (!isVisibleInViewport) return;

      const delta = Math.min(clock.getDelta(), 0.033);
      commonUniforms.uTime.value += delta;

      // Smooth colorway transition
      commonUniforms.uWarpColor.value.lerp(commonUniforms.uTargetWarp.value, 0.08);
      commonUniforms.uWeftColor.value.lerp(commonUniforms.uTargetWeft.value, 0.08);
      commonUniforms.uZariColor.value.lerp(commonUniforms.uTargetZari.value, 0.08);

      // Smooth Turntable Inertia with subtle breathing micro-sway
      if (!isPointerDown) {
        modelGroup.rotation.y += angVel;
        angVel *= 0.93; // Inertial friction

        if (Math.abs(angVel) < 0.0005) {
          modelGroup.rotation.y += Math.sin(commonUniforms.uTime.value * 0.8) * 0.0006;
        }
      }

      // Step physics engine with aerodynamic air drag from turntable rotation
      engine.step(delta, angVel);
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
      skirtGroup.traverse((c) => {
        if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
      });
      torsoDrapeGroup.traverse((c) => {
        if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
      });
      waistbandGeo.dispose();
      palluGeo.dispose();
      plinthGeo.dispose();

      silkMat.dispose();
      zariMat.dispose();
      palluMat.dispose();
      plinthMat.dispose();

      renderer.dispose();
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      engineRef.current = null;
      skirtGroupRef.current = null;
      torsoDrapeGroupRef.current = null;
      silkMaterialRef.current = null;
      zariMaterialRef.current = null;
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
