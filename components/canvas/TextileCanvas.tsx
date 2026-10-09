"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Colorway } from "@/lib/types";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { SareeDrapeEngine, DrapeStyle } from "@/lib/physics/SareeDrapeEngine";
import { Fallback360Viewer } from "./Fallback360Viewer";
import { Hand, RefreshCw, Layers, Rotate3d } from "lucide-react";

interface TextileCanvasProps {
  colorway?: Colorway;
  fallbackImage?: string;
  modelImage?: string;
  palluImage?: string;
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

// ── 1. Sculpted Haute Couture Indian Human Model Avatar ──────────────────────
function createCoutureHumanModel(zariMat?: THREE.Material): THREE.Group {
  const group = new THREE.Group();

  // Melanin-Rich Radiant South Asian Golden-Olive Skin Tone
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xc4936e,
    roughness: 0.52,
    metalness: 0.02,
  });

  // Satin Lips with Terracotta Crimson Tint
  const lipsMat = new THREE.MeshStandardMaterial({
    color: 0x9e4343,
    roughness: 0.38,
    metalness: 0.02,
  });

  // Glossy Raven Hair
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x141210,
    roughness: 0.35,
    metalness: 0.08,
  });

  // Fresh Mogra / Jasmine White Floral Garland
  const gajraMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f2,
    roughness: 0.72,
    metalness: 0.01,
  });

  // Traditional Sacred Forehead Bindi
  const bindiMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.35,
    metalness: 0.12,
  });

  // Eyelash & Iris
  const darkFeatureMat = new THREE.MeshStandardMaterial({
    color: 0x12100e,
    roughness: 0.25,
    metalness: 0.05,
  });

  // Antique South Indian Temple Gold
  const goldMat =
    zariMat ||
    new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      roughness: 0.25,
      metalness: 0.90,
    });

  // Natural Basra Pearls
  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0xfaf9f5,
    roughness: 0.20,
    metalness: 0.20,
  });

  const addCyl = (
    rT: number,
    rB: number,
    h: number,
    segs: number,
    yB: number,
    xO = 0,
    zO = 0,
    xR = 0,
    zR = 0,
    mat: THREE.Material = skinMat
  ) => {
    const g = new THREE.CylinderGeometry(rT, rB, h, segs, 4);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.position.set(xO, yB + h / 2, zO);
    m.rotation.x = xR;
    m.rotation.z = zR;
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const addSph = (
    r: number,
    y: number,
    xO = 0,
    zO = 0,
    sX = 1.0,
    sY = 1.0,
    sZ = 1.0,
    mat: THREE.Material = skinMat
  ) => {
    const g = new THREE.SphereGeometry(r, 28, 20);
    g.scale(sX, sY, sZ);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.position.set(xO, y, zO);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // ── A. Feet & Bridal Juttis resting on plinth (y = -0.96) ──
  addSph(0.040, -0.935, -0.075, 0.035, 0.85, 0.45, 1.45, goldMat);
  addSph(0.040, -0.935, 0.075, 0.035, 0.85, 0.45, 1.45, goldMat);

  // ── B. Calves & Knees (Inside skirt) ──
  addCyl(0.052, 0.044, 0.38, 20, -0.92, -0.075, -0.015);
  addCyl(0.052, 0.044, 0.38, 20, -0.92, 0.075, -0.015);

  // ── C. Exposed Bare Midriff between blouse bottom (y = 0.22) & waist tuck (y = 0.08) ──
  const wstGeo = new THREE.CylinderGeometry(0.155, 0.162, 0.14, 36, 4);
  wstGeo.computeVertexNormals();
  const waist = new THREE.Mesh(wstGeo, skinMat);
  waist.scale.set(1.0, 1.0, 0.70);
  waist.position.set(0, 0.15, 0.025);
  waist.castShadow = true;
  waist.receiveShadow = true;
  group.add(waist);

  // Delicate Navel Dimple
  addSph(0.006, 0.100, 0, 0.138, 1.0, 0.8, 0.5, darkFeatureMat);

  // ── D. Sculpted Décolletage & Upper Torso (Seamlessly fills sweetheart neckline & supports neck) ──
  const decolletageGeo = new THREE.CylinderGeometry(0.145, 0.155, 0.120, 36, 4);
  decolletageGeo.computeVertexNormals();
  const decolletage = new THREE.Mesh(decolletageGeo, skinMat);
  decolletage.scale.set(1.0, 1.0, 0.65);
  decolletage.position.set(0, 0.405, 0.020);
  decolletage.castShadow = true;
  decolletage.receiveShadow = true;
  group.add(decolletage);

  // Subtle Clavicle Ridge Contours
  const clavicleL = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.10, 16), skinMat);
  clavicleL.rotation.z = 1.35;
  clavicleL.position.set(-0.055, 0.455, 0.038);
  group.add(clavicleL);

  const clavicleR = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.10, 16), skinMat);
  clavicleR.rotation.z = -1.35;
  clavicleR.position.set(0.055, 0.455, 0.038);
  group.add(clavicleR);

  // ── E. Shoulders & Arms ──
  addSph(0.036, 0.435, -0.158, 0.000, 0.82);
  addSph(0.036, 0.435, 0.158, 0.000, 0.82);

  addCyl(0.035, 0.030, 0.15, 20, 0.26, -0.170, -0.010, 0, 0.05);
  addCyl(0.035, 0.030, 0.15, 20, 0.26, 0.170, -0.010, 0, -0.05);
  addCyl(0.030, 0.024, 0.16, 20, 0.10, -0.175, 0.000, 0, 0.03);
  addCyl(0.030, 0.024, 0.16, 20, 0.10, 0.175, 0.000, 0, -0.03);

  // Gracefully sculpted hands
  addSph(0.022, 0.060, -0.178, 0.008, 0.85, 1.35, 0.70);
  addSph(0.022, 0.060, 0.178, 0.008, 0.85, 1.35, 0.70);

  // Stacked Gold Bangles (Kadas) on both wrists (y = 0.120)
  for (let k = -1; k <= 1; k++) {
    const bangleL = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.003, 16, 28), goldMat);
    bangleL.rotation.x = Math.PI * 0.5;
    bangleL.position.set(-0.176, 0.120 + k * 0.010, 0.000);
    group.add(bangleL);

    const bangleR = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.003, 16, 28), goldMat);
    bangleR.rotation.x = Math.PI * 0.5;
    bangleR.position.set(0.176, 0.120 + k * 0.010, 0.000);
    group.add(bangleR);
  }

  // ── F. Slender Columnar Neck (Height 0.062m, y = 0.455 to 0.517) ──
  addCyl(0.029, 0.036, 0.062, 24, 0.455, 0, 0.014);

  // Royal Antique Gold Hasli (Choker Necklace) resting along the clavicle
  const hasli = new THREE.Mesh(
    new THREE.TorusGeometry(0.046, 0.0042, 16, 36, Math.PI * 1.3),
    goldMat
  );
  hasli.rotation.x = Math.PI * 0.40;
  hasli.rotation.z = Math.PI * 0.85;
  hasli.position.set(0, 0.465, 0.026);
  group.add(hasli);

  for (let d = -3; d <= 3; d++) {
    const angle = d * 0.18;
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.003, 12, 10), goldMat);
    drop.position.set(
      Math.sin(angle) * 0.046,
      0.458 - Math.abs(d) * 0.002,
      0.042 + Math.cos(angle) * 0.010
    );
    group.add(drop);
  }

  // ── G. Sculpted Indian Couture Head & Face (y = 0.510 to 0.635) ──
  addSph(0.056, 0.575, 0, 0.010, 0.88, 1.05, 0.94);
  addSph(0.022, 0.526, 0, 0.030, 0.88, 0.72, 0.88);

  // High Cheekbones
  addSph(0.018, 0.558, -0.036, 0.030, 0.8, 0.8, 0.7);
  addSph(0.018, 0.558, 0.036, 0.030, 0.8, 0.8, 0.7);

  // Slender Sculpted Nose Bridge & Tip
  const noseBridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0035, 0.005, 0.022, 12),
    skinMat
  );
  noseBridge.rotation.x = 0.22;
  noseBridge.position.set(0, 0.560, 0.053);
  group.add(noseBridge);
  addSph(0.0055, 0.550, 0, 0.058, 0.95, 0.85, 0.95);

  // Cupid's-Bow Lips with Terracotta Crimson Satin Finish
  const upperLip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0028, 0.0028, 0.014, 16),
    lipsMat
  );
  upperLip.rotation.z = Math.PI * 0.5;
  upperLip.position.set(0, 0.536, 0.052);
  group.add(upperLip);
  addSph(0.0065, 0.529, 0, 0.050, 1.45, 0.85, 0.85, lipsMat);

  // Expressive Almond Eyes & Dark Lashes
  for (const side of [-1, 1]) {
    const eyeX = side * 0.021;
    const lash = new THREE.Mesh(
      new THREE.TorusGeometry(0.0075, 0.0016, 8, 16, Math.PI * 0.8),
      darkFeatureMat
    );
    lash.position.set(eyeX, 0.566, 0.048);
    lash.rotation.z = side * 0.15;
    lash.rotation.x = -0.15;
    group.add(lash);

    const brow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0014, 0.0020, 0.019, 10),
      darkFeatureMat
    );
    brow.rotation.z = side * 1.35;
    brow.position.set(eyeX, 0.580, 0.049);
    group.add(brow);

    // Natural delicate ears close to cranium
    addSph(0.010, 0.550, side * 0.050, 0.004, 0.40, 1.15, 0.70);

    // Chandelier Jhumka Earrings dangling from earlobes
    const jhumkaGroup = new THREE.Group();
    jhumkaGroup.position.set(side * 0.052, 0.542, 0.004);

    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.0028, 12, 12), goldMat);
    jhumkaGroup.add(stud);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0010, 0.0010, 0.010, 8), goldMat);
    stem.position.y = -0.006;
    jhumkaGroup.add(stem);

    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.010, 16, 1, true), goldMat);
    bell.rotation.x = Math.PI;
    bell.position.y = -0.012;
    jhumkaGroup.add(bell);

    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.0025, 12, 12), pearlMat);
    pearl.position.y = -0.018;
    jhumkaGroup.add(pearl);

    group.add(jhumkaGroup);
  }

  // Sacred Vermilion Forehead Bindi
  const bindi = new THREE.Mesh(new THREE.CylinderGeometry(0.0030, 0.0030, 0.0015, 20), bindiMat);
  bindi.rotation.x = Math.PI * 0.5;
  bindi.position.set(0, 0.585, 0.052);
  group.add(bindi);

  // ── H. Traditional Haute Couture Hairstyle (Kesh Alankara) ──
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.057, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hairMat
  );
  hairCap.scale.set(0.90, 1.05, 0.97);
  hairCap.position.set(0, 0.580, 0.005);
  group.add(hairCap);

  // Center Parting (Maang)
  const maangPart = new THREE.Mesh(new THREE.CylinderGeometry(0.0010, 0.0010, 0.05, 8), skinMat);
  maangPart.rotation.x = 1.35;
  maangPart.position.set(0, 0.612, 0.025);
  group.add(maangPart);

  // Traditional low bridal chignon / hair bun (Juda)
  const juda = new THREE.Mesh(new THREE.SphereGeometry(0.035, 28, 20), hairMat);
  juda.scale.set(1.10, 0.90, 0.85);
  juda.position.set(0, 0.540, -0.045);
  group.add(juda);

  // Fresh White Mogra / Jasmine Flower Garland (Gajra) wrapping the bun
  const gajra = new THREE.Mesh(
    new THREE.TorusGeometry(0.038, 0.009, 16, 32, Math.PI * 1.5),
    gajraMat
  );
  gajra.rotation.x = Math.PI * 0.45;
  gajra.rotation.z = Math.PI * 0.75;
  gajra.position.set(0, 0.542, -0.040);
  group.add(gajra);

  for (let b = 0; b < 10; b++) {
    const angle = (b / 9) * Math.PI * 1.4 - Math.PI * 0.7;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.0040, 10, 8), gajraMat);
    const rG = 0.040;
    petal.position.set(
      Math.sin(angle) * rG,
      0.542 + Math.cos(angle) * 0.014,
      -0.040 - Math.abs(Math.sin(angle)) * 0.014
    );
    group.add(petal);
  }

  return group;
}

// ── 2. Tailored Silk Blouse (Choli) with Sweetheart Neckline, Gota Patti & Fitted Sleeves ─
function createTailoredBlouseMesh(
  blouseMaterial: THREE.Material,
  zariMaterial: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  const rSegs = 64;
  const hSegs = 28;
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];

  // Bodice spans from under-bust (y = 0.22) to shoulder crest (y = 0.465)
  for (let h = 0; h <= hSegs; h++) {
    const v = h / hSegs;
    const y = 0.22 + v * 0.245;

    const rX = THREE.MathUtils.lerp(0.158, 0.166, v);
    const cZ = 0.025 - v * 0.010;

    const bustLobe = Math.sin(v * Math.PI * 0.85);
    const rZ_front = 0.132 + bustLobe * 0.022;
    const rZ_back = 0.110 + Math.sin(v * Math.PI) * 0.010;

    for (let r = 0; r <= rSegs; r++) {
      const u = r / rSegs;
      const angle = u * Math.PI * 2;
      const sinA = Math.sin(angle);
      const rZ = sinA >= 0 ? rZ_front : rZ_back;

      const px = Math.cos(angle) * rX;
      const pz = cZ + sinA * rZ;
      let py = y;

      // Flattering sweetheart neckline dipping to y = 0.365 in front center
      if (sinA > 0.25 && v > 0.55) {
        const neckProg = (v - 0.55) / 0.45;
        const frontCenter = (sinA - 0.25) / 0.75;
        py -= neckProg * frontCenter * 0.060;
      }

      // Scooped back cutout dipping in back center
      if (sinA < -0.35 && v > 0.45) {
        const backProg = (v - 0.45) / 0.55;
        const backCenter = (-sinA - 0.35) / 0.65;
        py -= backProg * backCenter * 0.040;
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
  bodiceMesh.castShadow = true;
  bodiceMesh.receiveShadow = true;
  group.add(bodiceMesh);

  // Sweetheart Neckline 3D Gota Patti Gold Piping Border
  const neckBorderPts: THREE.Vector3[] = [];
  const neckSteps = 32;
  for (let i = 0; i <= neckSteps; i++) {
    const t = i / neckSteps;
    const angle = Math.PI * 0.15 + t * Math.PI * 0.70;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const px = cosA * 0.160;
    const pz = 0.015 + sinA * 0.145;
    const dip = Math.sin(t * Math.PI);
    const py = 0.455 - dip * 0.088;
    neckBorderPts.push(new THREE.Vector3(px, py, pz));
  }
  const neckCurve = new THREE.CatmullRomCurve3(neckBorderPts);
  const neckBorderGeo = new THREE.TubeGeometry(neckCurve, 32, 0.0032, 8, false);
  const neckBorderMesh = new THREE.Mesh(neckBorderGeo, zariMaterial);
  group.add(neckBorderMesh);

  // Back Tie Dori Strings & Dangling Latkans (Tassels)
  const doriL = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, 0.12, 8), zariMaterial);
  doriL.rotation.z = 0.18;
  doriL.position.set(-0.022, 0.28, -0.090);
  group.add(doriL);

  const doriR = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0012, 0.12, 8), zariMaterial);
  doriR.rotation.z = -0.18;
  doriR.position.set(0.022, 0.28, -0.090);
  group.add(doriR);

  const latkanL = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.014, 12), zariMaterial);
  latkanL.rotation.x = Math.PI;
  latkanL.position.set(-0.035, 0.21, -0.090);
  group.add(latkanL);

  const latkanR = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.014, 12), zariMaterial);
  latkanR.rotation.x = Math.PI;
  latkanR.position.set(0.035, 0.21, -0.090);
  group.add(latkanR);

  // Left Fitted Half-Sleeve & Woven Zari Cuff
  const slvGeoL = new THREE.CylinderGeometry(0.040, 0.034, 0.115, 24);
  slvGeoL.rotateZ(0.05);
  slvGeoL.translate(-0.170, 0.385, -0.010);
  slvGeoL.computeVertexNormals();
  const slvL = new THREE.Mesh(slvGeoL, blouseMaterial);
  slvL.castShadow = true;
  group.add(slvL);

  const cuffGeoL = new THREE.CylinderGeometry(0.036, 0.034, 0.020, 24);
  cuffGeoL.rotateZ(0.05);
  cuffGeoL.translate(-0.170, 0.332, -0.010);
  cuffGeoL.computeVertexNormals();
  const cuffL = new THREE.Mesh(cuffGeoL, zariMaterial);
  group.add(cuffL);

  // Right Fitted Half-Sleeve & Woven Zari Cuff
  const slvGeoR = new THREE.CylinderGeometry(0.040, 0.034, 0.115, 24);
  slvGeoR.rotateZ(-0.05);
  slvGeoR.translate(0.170, 0.385, -0.010);
  slvGeoR.computeVertexNormals();
  const slvR = new THREE.Mesh(slvGeoR, blouseMaterial);
  slvR.castShadow = true;
  group.add(slvR);

  const cuffGeoR = new THREE.CylinderGeometry(0.036, 0.034, 0.020, 24);
  cuffGeoR.rotateZ(-0.05);
  cuffGeoR.translate(0.170, 0.332, -0.010);
  cuffGeoR.computeVertexNormals();
  const cuffR = new THREE.Mesh(cuffGeoR, zariMaterial);
  group.add(cuffR);

  return group;
}

// ── 3. Petticoat Waistband Cinch / Tuck Knot at Natural Waist ────────────────
function createWaistbandGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.172, 0.176, 0.028, 48, 1, true);
  geo.scale(1.0, 1.0, 0.70);
  geo.translate(0, 0.080, 0.035);
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
      rX = THREE.MathUtils.lerp(0.170, 0.235, t);
      rZ = THREE.MathUtils.lerp(0.118, 0.124, t);
      cZ = THREE.MathUtils.lerp(0.035, 0.032, t);
    } else if (v < 0.60) {
      const t = (v - 0.20) / 0.40;
      rX = THREE.MathUtils.lerp(0.235, 0.205, t);
      rZ = THREE.MathUtils.lerp(0.124, 0.106, t);
      cZ = THREE.MathUtils.lerp(0.032, 0.015, t);
    } else {
      const t = (v - 0.60) / 0.40;
      rX = THREE.MathUtils.lerp(0.205, 0.285, t);
      rZ = THREE.MathUtils.lerp(0.106, 0.145, t);
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
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Part B: Distinct Overlapping Knife Pleats (Patli)
  const pleatHeightSegs = 32;
  const pleatWidthSegs = 6;
  const pleatSpanX = 0.018;

  for (let p = 0; p < pleatCount; p++) {
    const pPos: number[] = [];
    const pUvs: number[] = [];
    const pIdx: number[] = [];

    const pleatOffsetU = p - (pleatCount - 1) / 2;
    const startX = pleatOffsetU * pleatSpanX;
    const baseZ = 0.160 + p * 0.0035;

    for (let h = 0; h <= pleatHeightSegs; h++) {
      const v = h / pleatHeightSegs;
      const py = skirtTop - v * height;

      const flare = THREE.MathUtils.lerp(0.052, 0.085, v);
      const curX = startX * (1.0 + v * 0.65);
      const curZ = baseZ + Math.sin(v * Math.PI * 0.75) * 0.014;

      for (let w = 0; w <= pleatWidthSegs; w++) {
        const u = w / pleatWidthSegs;
        const crease = Math.pow(u, 1.4);
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
    pleatMesh.castShadow = true;
    pleatMesh.receiveShadow = true;
    group.add(pleatMesh);
  }

  // Part C: Solid 9cm Woven Zari Hem Border Band with Korvai Temple Spire Texture
  const hemSegsR = 96;
  const hemSegsH = 4;
  const hPos: number[] = [];
  const hUvs: number[] = [];
  const hIdx: number[] = [];

  for (let y = 0; y <= hemSegsH; y++) {
    const v = y / hemSegsH;
    const py = -0.920 + v * 0.090;
    const rX = THREE.MathUtils.lerp(0.287, 0.270, v);
    const rZ = THREE.MathUtils.lerp(0.147, 0.138, v);

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
  hemMesh.castShadow = true;
  hemMesh.receiveShadow = true;
  group.add(hemMesh);

  return group;
}

// ── 5. Authentic Torso Drape (Midriff Wrap + Multi-Pleated Uparli + Kamarbandh) ──
function createAuthenticTorsoDrape(
  style: DrapeStyle = "nivi",
  silkMaterial: THREE.Material,
  zariMaterial: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  // Continuous Cross-Chest Pleated Uparli
  // In Nivi style: Sweeps proudly across bust onto left shoulder with generous clearance
  const lSegs = 72;
  const wSegs = 28;
  const uPos: number[] = [];
  const uUvs: number[] = [];
  const uIdx: number[] = [];

  const yBottom = 0.080;
  const yTop = 0.465;
  const yRange = yTop - yBottom;

  for (let i = 0; i <= lSegs; i++) {
    const v = i / lSegs;
    const y = yBottom + v * yRange;

    // Exact contour conforming to blouse and bust anatomy with guaranteed +10mm forward relief
    let choliZ: number;
    if (y < 0.22) {
      choliZ = 0.144;
    } else {
      const vB = Math.min(1.0, Math.max(0, (y - 0.22) / 0.245));
      const cZ = 0.025 - vB * 0.010;
      const bustLobe = Math.sin(vB * Math.PI * 0.85);
      const rZ_front = 0.132 + bustLobe * 0.022;
      choliZ = cZ + rZ_front;
      if (vB > 0.80) {
        // Taper smoothly over the shoulder crest
        const sT = (vB - 0.80) / 0.20;
        choliZ = THREE.MathUtils.lerp(choliZ, 0.065, sT);
      }
    }
    const centerZ = choliZ + 0.010;

    let centerX: number, dWidth: number;
    if (style === "seedha") {
      centerX = THREE.MathUtils.lerp(-0.12, 0.170, v);
      dWidth = 0.22 + Math.sin(v * Math.PI) * 0.05;
    } else if (style === "cape") {
      centerX = 0;
      dWidth = THREE.MathUtils.lerp(0.34, 0.22, v);
    } else {
      // Classic Nivi:
      // Emerges at right waist (x = +0.130) -> sweeps across midriff & left bust -> left shoulder (x = -0.165)
      centerX = THREE.MathUtils.lerp(0.130, -0.165, v);
      dWidth = 0.23 + Math.sin(v * Math.PI * 0.95) * 0.04;
    }

    for (let j = 0; j <= wSegs; j++) {
      const u = j / wSegs;
      const offW = (u - 0.5) * dWidth;

      // Authentic pressed silk knife-pleat waves across the drape width
      const pleatWave = Math.sin(u * Math.PI * 6.0) * 0.0035;

      const px = centerX + offW * 0.92 - 0.12 * pleatWave;
      const py = y + offW * 0.06;
      // Gentle convex contour conforming across the chest curve
      const chestContour = Math.cos((u - 0.5) * Math.PI * 0.65) * 0.010;
      const pz = centerZ + chestContour + (u - 0.5) * 0.006 + 1.2 * pleatWave;

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
  uparliMesh.castShadow = true;
  uparliMesh.receiveShadow = true;
  group.add(uparliMesh);

  // Outer 2.5cm Woven Zari Selvedge Piping along the diagonal leading edge
  const selvedgeSegsL = 72;
  const sPos: number[] = [];
  const sUvs: number[] = [];
  const sIdx: number[] = [];

  for (let i = 0; i <= selvedgeSegsL; i++) {
    const v = i / selvedgeSegsL;
    const y = yBottom + v * yRange;

    let choliZ: number;
    if (y < 0.22) {
      choliZ = 0.144;
    } else {
      const vB = Math.min(1.0, Math.max(0, (y - 0.22) / 0.245));
      const cZ = 0.025 - vB * 0.010;
      const bustLobe = Math.sin(vB * Math.PI * 0.85);
      const rZ_front = 0.132 + bustLobe * 0.022;
      choliZ = cZ + rZ_front;
      if (vB > 0.80) {
        const sT = (vB - 0.80) / 0.20;
        choliZ = THREE.MathUtils.lerp(choliZ, 0.065, sT);
      }
    }
    const centerZ = choliZ + 0.010;

    let centerX: number, dWidth: number;
    if (style === "seedha") {
      centerX = THREE.MathUtils.lerp(-0.12, 0.170, v);
      dWidth = 0.22 + Math.sin(v * Math.PI) * 0.05;
    } else if (style === "cape") {
      centerX = 0;
      dWidth = THREE.MathUtils.lerp(0.34, 0.22, v);
    } else {
      centerX = THREE.MathUtils.lerp(0.130, -0.165, v);
      dWidth = 0.23 + Math.sin(v * Math.PI * 0.95) * 0.04;
    }

    const edgeX = centerX + 0.5 * dWidth * 0.92;
    const edgeY = y + 0.5 * dWidth * 0.06;
    const edgeZ = centerZ + 0.012;

    sPos.push(edgeX - 0.010, edgeY, edgeZ);
    sUvs.push(0, v);
    sPos.push(edgeX + 0.010, edgeY, edgeZ + 0.002);
    sUvs.push(1, v);
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
  selvedgeGeo.setAttribute("uv", new THREE.Float32BufferAttribute(sUvs, 2));
  selvedgeGeo.setIndex(sIdx);
  selvedgeGeo.computeVertexNormals();

  const selvedgeMesh = new THREE.Mesh(selvedgeGeo, zariMaterial);
  group.add(selvedgeMesh);

  // Left Shoulder Gold Brooch / Safety Pin (Anchors the pleated drape to the choli)
  if (style === "nivi") {
    const pin = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 16, 24), zariMaterial);
    pin.position.set(-0.165, 0.465, 0.028);
    pin.rotation.x = Math.PI * 0.5;
    group.add(pin);

    const gem = new THREE.Mesh(
      new THREE.SphereGeometry(0.004, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.1, metalness: 0.8 })
    );
    gem.position.set(-0.165, 0.465, 0.030);
    group.add(gem);
  }

  // Royal Antique Gold Kamarbandh / Oddiyanam (Waist Belt) holding pleat tuck at navel
  const beltGeo = new THREE.CylinderGeometry(0.176, 0.178, 0.022, 48, 1, true);
  beltGeo.scale(1.0, 1.0, 0.70);
  beltGeo.translate(0, 0.080, 0.035);
  beltGeo.computeVertexNormals();
  const beltMesh = new THREE.Mesh(beltGeo, zariMaterial);
  group.add(beltMesh);

  // Central ornate Oddiyanam buckle medallion at navel (y = 0.080, z = 0.165)
  const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.005, 24), zariMaterial);
  buckle.rotation.x = Math.PI * 0.5;
  buckle.position.set(0, 0.080, 0.165);
  group.add(buckle);

  const buckleGem = new THREE.Mesh(
    new THREE.SphereGeometry(0.005, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.1, metalness: 0.8 })
  );
  buckleGem.position.set(0, 0.080, 0.170);
  group.add(buckleGem);

  return group;
}

// ── 6. Sculpted Photorealistic Haute Couture Human Model Avatar ──────────────
function createPhotorealisticCoutureAvatar(
  frontTexture: THREE.Texture,
  backTexture: THREE.Texture,
  zariMaterial: THREE.Material
): THREE.Group {
  const avatarGroup = new THREE.Group();

  const width = 0.82;
  const height = 1.74;
  const xSegs = 32;
  const ySegs = 48;

  // Exact 1:1 photograph aspect ratio framing to prevent stretching or squishing
  const aspect = width / height; // ~0.471
  const uOffset = 0.5 - aspect / 2; // ~0.264

  const pos: number[] = [];
  const uvs: number[] = [];
  const indicesFront: number[] = [];
  const indicesBack: number[] = [];

  for (let y = 0; y <= ySegs; y++) {
    const v = y / ySegs;
    const py = -0.94 + v * height;

    // Architectural curved arch at top 16% of height
    const archFactor = v > 0.84 ? Math.cos(((v - 0.84) / 0.16) * (Math.PI * 0.5)) : 1.0;
    const bodyTaper = (1.0 - Math.sin(v * Math.PI) * 0.05) * archFactor;

    for (let x = 0; x <= xSegs; x++) {
      const u = x / xSegs;
      const nx = (u - 0.5) * 2; // -1 to +1
      const px = (u - 0.5) * width * bodyTaper;

      // Volumetric forward curvature: front curves forward toward center (+6.5cm depth)
      const pz = (1.0 - nx * nx) * 0.065;

      pos.push(px, py, pz);
      // Sample the centered slice of the photograph
      const texU = THREE.MathUtils.clamp(uOffset + u * aspect, 0, 1);
      uvs.push(texU, v);
    }
  }

  // CCW winding for Front: normal points in +Z towards camera
  for (let y = 0; y < ySegs; y++) {
    for (let x = 0; x < xSegs; x++) {
      const i1 = y * (xSegs + 1) + x;
      const i2 = i1 + 1;
      const i3 = (y + 1) * (xSegs + 1) + x;
      const i4 = i3 + 1;
      indicesFront.push(i1, i2, i3, i2, i4, i3);
      indicesBack.push(i1, i3, i2, i2, i3, i4);
    }
  }

  // Front face: Radiant South Asian human model wearing authentic blouse and saree
  const frontGeo = new THREE.BufferGeometry();
  frontGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  frontGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  frontGeo.setIndex(indicesFront);
  frontGeo.computeVertexNormals();

  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.FrontSide,
  });

  const frontMesh = new THREE.Mesh(frontGeo, frontMat);
  frontMesh.castShadow = true;
  frontMesh.receiveShadow = true;
  avatarGroup.add(frontMesh);

  // Back face: Model seen from behind showing blouse back cutout with dori ties and pallu cascade
  const backGeo = new THREE.BufferGeometry();
  const backPos = pos.map((val, idx) => {
    if (idx % 3 === 0) return -val; // Mirror X so left shoulder matches
    if (idx % 3 === 2) return -val - 0.015; // Curve backwards
    return val;
  });
  const backUvs = uvs.map((val, idx) => (idx % 2 === 0 ? 1.0 - val : val));

  backGeo.setAttribute("position", new THREE.Float32BufferAttribute(backPos, 3));
  backGeo.setAttribute("uv", new THREE.Float32BufferAttribute(backUvs, 2));
  backGeo.setIndex(indicesBack);
  backGeo.computeVertexNormals();

  const backMat = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.FrontSide,
  });

  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.castShadow = true;
  avatarGroup.add(backMesh);

  return avatarGroup;
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
  fallbackImage = "/images/products/alabaster-model.jpg",
  modelImage = "/images/products/alabaster-model.jpg",
  palluImage = "/images/products/alabaster-pallu.jpg",
  title = "Pure Silk Drape",
  interactive = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(isWebGLAvailable);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeDrape, setActiveDrape] = useState<DrapeStyle>("swatch");
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
  };

  const handlePleatCountChange = (count: number) => {
    setPleatCount(count);
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

    // Model group: default front silhouette facing camera
    const modelGroup = new THREE.Group();
    modelGroup.rotation.y = 0.0;
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

    // ── Architectural Atelier Brushed Brass Suspension Stand ─────────────
    const standGroup = new THREE.Group();

    // Brushed 24K electro-lacquered antique gold brass material
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.28,
    });

    // Slender Vertical Mast (cantilevered at rear)
    const mastGeo = new THREE.CylinderGeometry(0.007, 0.007, 1.48, 24);
    const mastMesh = new THREE.Mesh(mastGeo, brassMat);
    mastMesh.position.set(0, -0.22, -0.09);
    mastMesh.castShadow = true;
    standGroup.add(mastMesh);

    // Architectural Cantilever Top Arms
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.10, 16), brassMat);
    armL.rotation.x = Math.PI * 0.5;
    armL.position.set(-0.28, 0.52, -0.045);
    standGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.10, 16), brassMat);
    armR.rotation.x = Math.PI * 0.5;
    armR.position.set(0.28, 0.52, -0.045);
    standGroup.add(armR);

    // Crossbar connecting mast to arms
    const bracketGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.58, 20);
    const bracketMesh = new THREE.Mesh(bracketGeo, brassMat);
    bracketMesh.rotation.z = Math.PI * 0.5;
    bracketMesh.position.set(0, 0.52, -0.09);
    standGroup.add(bracketMesh);

    // Horizontal Brushed Brass Suspension Rod (width 0.82m)
    const rodGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.82, 32);
    const rodMesh = new THREE.Mesh(rodGeo, brassMat);
    rodMesh.rotation.z = Math.PI * 0.5;
    rodMesh.position.set(0, 0.52, 0);
    rodMesh.castShadow = true;
    standGroup.add(rodMesh);

    // Turned Architectural Spherical Finials with Collar Rings
    const finialGeo = new THREE.SphereGeometry(0.016, 24, 24);
    const finialL = new THREE.Mesh(finialGeo, brassMat);
    finialL.position.set(-0.418, 0.52, 0);
    finialL.castShadow = true;
    standGroup.add(finialL);

    const finialR = new THREE.Mesh(finialGeo, brassMat);
    finialR.position.set(0.418, 0.52, 0);
    finialR.castShadow = true;
    standGroup.add(finialR);

    // Atelier Ring Fasteners holding the top selvedge
    const ringGeo = new THREE.TorusGeometry(0.013, 0.0025, 16, 24);
    [-0.26, -0.09, 0.09, 0.26].forEach((xPos) => {
      const ring = new THREE.Mesh(ringGeo, brassMat);
      ring.position.set(xPos, 0.52, 0);
      ring.rotation.y = Math.PI * 0.5;
      ring.castShadow = true;
      standGroup.add(ring);
    });

    modelGroup.add(standGroup);

    // ── Dynamic Pure Silk Swatch Physics Plane ────────────────────────────
    const palluGeo = new THREE.PlaneGeometry(0.68, 1.25, engine.gridW - 1, engine.gridH - 1);
    (palluGeo.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    engine.syncToBuffer(palluGeo.attributes.position as THREE.BufferAttribute);
    palluGeo.computeVertexNormals();

    const swatchTex = textureLoader.load(palluImage || modelImage || fallbackImage);
    swatchTex.colorSpace = THREE.SRGBColorSpace;

    const dynamicPalluMat = new THREE.MeshStandardMaterial({
      map: swatchTex,
      normalMap: silkNormalTex,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughness: 0.45,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });

    const palluMesh = new THREE.Mesh(palluGeo, dynamicPalluMat);
    palluMesh.castShadow = true;
    palluMesh.receiveShadow = true;
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

      standGroup.traverse((c) => {
        if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
      });
      palluGeo.dispose();
      plinthGeo.dispose();

      dynamicPalluMat.dispose();
      brassMat.dispose();
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
              { id: "swatch", label: "Atelier Hang", short: "Atelier" },
              { id: "nivi", label: "Nivi Bias", short: "Nivi" },
              { id: "seedha", label: "Royal Flow", short: "Royal" },
              { id: "cape", label: "Cascade", short: "Cascade" },
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
              ? "TESTING SILK SUPPLENESS..."
              : isOrbiting
              ? "ROTATING ATELIER STAND..."
              : "TOUCH & DRAG SILK TO TEST SUPPLENESS"}
          </span>
        </div>
        <span className="text-[8px] text-text-tertiary sm:hidden">TOUCH ENABLED</span>
      </div>

      {/* Bottom Right: Architectural Metrology Tag */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none hidden md:flex items-center gap-3 bg-canvas-base/90 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-tertiary uppercase shadow-xs">
        <Rotate3d className="w-3.5 h-3.5 text-accent-zari" />
        <span>BRUSHED BRASS ATELIER STAND</span>
        <span className="w-1 h-1 rounded-full bg-accent-zari" />
        <span>TACTILE SILK WEAVE LAB</span>
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
