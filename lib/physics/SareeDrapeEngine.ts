import * as THREE from "three";

export type DrapeStyle = "nivi" | "seedha" | "cape";

export interface DrapeEngineOptions {
  pleatCount: number;
  drapeStyle: DrapeStyle;
  fabricWeight: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SareeDrapeEngine: High-Performance Verlet Cloth Physics for the Pallu
//
// Calibrated to 1.77m standing mannequin coordinates:
//  Shoulder crest (pin anchor): y = +0.505, x = -0.185 (Nivi) / +0.185 (Seedha)
//  Width at shoulder: 0.18m
//  Hem cascade: y = -0.55 (mid-calf level), width = 0.48m
// ─────────────────────────────────────────────────────────────────────────────

export class SareeDrapeEngine {
  public drapeStyle: DrapeStyle = "nivi";
  public pleatCount: number = 7;
  public fabricWeight: number = 210;

  // Pallu Verlet Simulation Grid — 22 columns × 32 rows for supple silk drape
  public gridW = 22;
  public gridH = 32;
  public numParticles: number;
  public pos: Float32Array;
  public prevPos: Float32Array;
  public origPos: Float32Array;
  public pinned: Uint8Array;
  public constraints: { p1: number; p2: number; restDist: number; stiffness: number }[] = [];

  // Interaction Grab State
  public grabbedIndex: number | null = null;
  public grabTarget = new THREE.Vector3();
  public grabVelocity = new THREE.Vector3();
  private lastGrabPos = new THREE.Vector3();

  // Anatomical collision volumes (measured from mannequin.glb central torso & hips)
  private torsoRX = 0.170; // torso half-width
  private torsoRZ = 0.125; // torso half-depth
  private hipRX   = 0.225; // hip half-width
  private hipRZ   = 0.135; // hip half-depth
  private legRX   = 0.185; // lower leg / skirt half-width
  private legRZ   = 0.110; // lower leg / skirt half-depth

  private time = 0;

  constructor(options?: Partial<DrapeEngineOptions>) {
    if (options?.pleatCount) this.pleatCount = options.pleatCount;
    if (options?.drapeStyle) this.drapeStyle = options.drapeStyle;
    if (options?.fabricWeight) this.fabricWeight = options.fabricWeight;

    this.numParticles = this.gridW * this.gridH;
    this.pos = new Float32Array(this.numParticles * 3);
    this.prevPos = new Float32Array(this.numParticles * 3);
    this.origPos = new Float32Array(this.numParticles * 3);
    this.pinned = new Uint8Array(this.numParticles);

    this.setDrapeStyle(this.drapeStyle);
  }

  private buildConstraints() {
    this.constraints = [];
    const getDist = (p1: number, p2: number) => {
      const i1 = p1 * 3, i2 = p2 * 3;
      const dx = this.pos[i2]   - this.pos[i1];
      const dy = this.pos[i2+1] - this.pos[i1+1];
      const dz = this.pos[i2+2] - this.pos[i1+2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    for (let y = 0; y < this.gridH; y++) {
      for (let x = 0; x < this.gridW; x++) {
        const p = y * this.gridW + x;

        // Structural Horizontal
        if (x < this.gridW - 1) {
          this.constraints.push({ p1: p, p2: p + 1, restDist: getDist(p, p + 1), stiffness: 0.95 });
        }
        // Structural Vertical
        if (y < this.gridH - 1) {
          this.constraints.push({ p1: p, p2: p + this.gridW, restDist: getDist(p, p + this.gridW), stiffness: 0.95 });
        }
        // Shear Diagonal
        if (x < this.gridW - 1 && y < this.gridH - 1) {
          this.constraints.push({ p1: p, p2: p + this.gridW + 1, restDist: getDist(p, p + this.gridW + 1), stiffness: 0.65 });
        }
        if (x > 0 && y < this.gridH - 1) {
          this.constraints.push({ p1: p, p2: p + this.gridW - 1, restDist: getDist(p, p + this.gridW - 1), stiffness: 0.65 });
        }
        // Bending resistance (silk crease retention)
        if (x < this.gridW - 2) {
          this.constraints.push({ p1: p, p2: p + 2, restDist: getDist(p, p + 2), stiffness: 0.35 });
        }
        if (y < this.gridH - 2) {
          this.constraints.push({ p1: p, p2: p + this.gridW * 2, restDist: getDist(p, p + this.gridW * 2), stiffness: 0.35 });
        }
      }
    }
  }

  public setDrapeStyle(style: DrapeStyle) {
    this.drapeStyle = style;
    this.pinned.fill(0);

    if (style === "nivi") {
      // Classic Nivi: Pinned across left shoulder crest (y = 0.505, x = -0.185)
      // Cascades gracefully down the back to y = -0.55 (mid-calf level)
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          // Shoulder width 0.18m fanning out to 0.48m at the hem
          const width = THREE.MathUtils.lerp(0.18, 0.48, v);
          const centerX = THREE.MathUtils.lerp(-0.185, -0.06, v);

          const anchorX = centerX + (u - 0.5) * width;
          // Falls from shoulder (y = 0.505) down by 1.05m to y = -0.545
          const anchorY = 0.505 - v * 1.05;
          // Starts at shoulder z = 0.005, curves down along the back (z negative)
          const anchorZ =
            THREE.MathUtils.lerp(0.005, -0.15, Math.min(v * 2.2, 1.0))
            - Math.sin(v * Math.PI * 0.55) * 0.045
            + (u - 0.5) * 0.025;

          this.pos[i]     = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;
          this.prevPos[i]     = anchorX;
          this.prevPos[i + 1] = anchorY;
          this.prevPos[i + 2] = anchorZ;
        }
      }
      // Pin top row at shoulder
      for (let x = 0; x < this.gridW; x++) {
        this.pinned[x] = 1;
      }
    } else if (style === "seedha") {
      // Royal Seedha Pallu: Pinned at right shoulder (y = 0.505, x = +0.185), fanning forward across chest
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          const width = THREE.MathUtils.lerp(0.18, 0.44, v);
          const centerX = THREE.MathUtils.lerp(0.185, 0.02, v);

          const anchorX = centerX - (u - 0.5) * width;
          const anchorY = 0.505 - v * 0.95;
          const anchorZ =
            THREE.MathUtils.lerp(0.005, 0.20, Math.min(v * 2.0, 1.0))
            + Math.sin(v * Math.PI * 0.6) * 0.040;

          this.pos[i]     = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;
          this.prevPos[i]     = anchorX;
          this.prevPos[i + 1] = anchorY;
          this.prevPos[i + 2] = anchorZ;
        }
      }
      for (let x = 0; x < this.gridW; x++) {
        this.pinned[x] = 1;
      }
    } else {
      // Atelier Cape: Symmetrical bilateral cowl drape across shoulders
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          const width = THREE.MathUtils.lerp(0.40, 0.62, v);
          const anchorX = (u - 0.5) * width;
          const anchorY = 0.505 - v * 1.05;
          const anchorZ =
            THREE.MathUtils.lerp(0.005, -0.16, Math.min(v * 2.0, 1.0))
            - Math.sin(v * Math.PI * 0.55) * 0.045;

          this.pos[i]     = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;
          this.prevPos[i]     = anchorX;
          this.prevPos[i + 1] = anchorY;
          this.prevPos[i + 2] = anchorZ;
        }
      }
      for (let x = 0; x < this.gridW; x++) {
        if (x < 4 || x > this.gridW - 5) {
          this.pinned[x] = 1;
        }
      }
    }

    this.origPos.set(this.pos);
    this.buildConstraints();
    this.resolveMannequinCollision();
  }

  public setPleatCount(count: number) {
    this.pleatCount = count;
  }

  public setFabricWeight(gsm: number) {
    this.fabricWeight = gsm;
  }

  public grab(hitPoint: THREE.Vector3): number {
    let nearestIdx = -1;
    let minDistSq = Infinity;

    for (let i = 0; i < this.numParticles; i++) {
      const idx = i * 3;
      const dx = this.pos[idx]     - hitPoint.x;
      const dy = this.pos[idx + 1] - hitPoint.y;
      const dz = this.pos[idx + 2] - hitPoint.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDistSq) {
        minDistSq = distSq;
        nearestIdx = i;
      }
    }

    if (nearestIdx !== -1) {
      this.grabbedIndex = nearestIdx;
      this.grabTarget.copy(hitPoint);
      this.lastGrabPos.copy(hitPoint);
      this.grabVelocity.set(0, 0, 0);
    }

    return nearestIdx;
  }

  public updateGrab(newPoint: THREE.Vector3) {
    if (this.grabbedIndex === null) return;
    this.grabVelocity.subVectors(newPoint, this.lastGrabPos);
    this.lastGrabPos.copy(newPoint);
    this.grabTarget.copy(newPoint);
  }

  public releaseGrab() {
    if (this.grabbedIndex !== null) {
      const idx = this.grabbedIndex * 3;
      this.prevPos[idx]     = this.pos[idx]     - this.grabVelocity.x * 0.85;
      this.prevPos[idx + 1] = this.pos[idx + 1] - this.grabVelocity.y * 0.85;
      this.prevPos[idx + 2] = this.pos[idx + 2] - this.grabVelocity.z * 0.85;
      this.grabbedIndex = null;
    }
  }

  public step(dt: number, angularVelocity = 0) {
    this.time += dt;
    const clampedDt = Math.min(dt, 0.025);
    const dtSq = clampedDt * clampedDt;

    const normWeight = (this.fabricWeight - 50) / 160;
    const gravity = -9.8 * (0.45 + normWeight * 0.55);
    const damping = 0.982 - normWeight * 0.005;

    // Aerodynamic rotation wind + subtle organic micro-sway
    const rotWind = -angularVelocity * 2.8;
    const wind = (
      Math.sin(this.time * 2.2) * 0.08 +
      Math.sin(this.time * 0.71) * 0.035 +
      rotWind
    ) * (1 - normWeight * 0.35);

    // 1. Verlet Integration
    for (let i = 0; i < this.numParticles; i++) {
      if (this.pinned[i] === 1) continue;

      const idx = i * 3;
      if (i === this.grabbedIndex) {
        this.pos[idx]     = this.grabTarget.x;
        this.pos[idx + 1] = this.grabTarget.y;
        this.pos[idx + 2] = this.grabTarget.z;
        continue;
      }

      const px = this.pos[idx];
      const py = this.pos[idx + 1];
      const pz = this.pos[idx + 2];

      const vx = (px - this.prevPos[idx])     * damping;
      const vy = (py - this.prevPos[idx + 1]) * damping;
      const vz = (pz - this.prevPos[idx + 2]) * damping;

      this.prevPos[idx]     = px;
      this.prevPos[idx + 1] = py;
      this.prevPos[idx + 2] = pz;

      const ax = wind * 0.35;
      const ay = gravity;
      const az = wind * (Math.cos(i * 0.12 + this.time) * 0.5 + 0.5);

      this.pos[idx]     = px + vx + ax * dtSq;
      this.pos[idx + 1] = py + vy + ay * dtSq;
      this.pos[idx + 2] = pz + vz + az * dtSq;
    }

    // 2. Constraint Relaxation (5 passes for supple silk)
    const numConstraints = this.constraints.length;
    for (let pass = 0; pass < 5; pass++) {
      for (let c = 0; c < numConstraints; c++) {
        const { p1, p2, restDist, stiffness } = this.constraints[c];
        const idx1 = p1 * 3;
        const idx2 = p2 * 3;

        const dx = this.pos[idx2]     - this.pos[idx1];
        const dy = this.pos[idx2 + 1] - this.pos[idx1 + 1];
        const dz = this.pos[idx2 + 2] - this.pos[idx1 + 2];

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.0001) continue;

        const diff = (dist - restDist) / dist;
        const off = diff * 0.5 * stiffness;

        const p1Pin = this.pinned[p1] || p1 === this.grabbedIndex;
        const p2Pin = this.pinned[p2] || p2 === this.grabbedIndex;

        if (!p1Pin && !p2Pin) {
          this.pos[idx1]     += dx * off;
          this.pos[idx1 + 1] += dy * off;
          this.pos[idx1 + 2] += dz * off;
          this.pos[idx2]     -= dx * off;
          this.pos[idx2 + 1] -= dy * off;
          this.pos[idx2 + 2] -= dz * off;
        } else if (!p1Pin) {
          this.pos[idx1]     += dx * off * 2;
          this.pos[idx1 + 1] += dy * off * 2;
          this.pos[idx1 + 2] += dz * off * 2;
        } else if (!p2Pin) {
          this.pos[idx2]     -= dx * off * 2;
          this.pos[idx2 + 1] -= dy * off * 2;
          this.pos[idx2 + 2] -= dz * off * 2;
        }
      }

      this.resolveMannequinCollision();
    }
  }

  // Precise anatomical collision preventing pallu from clipping into mannequin body
  private resolveMannequinCollision() {
    const margin = 0.012;

    for (let i = 0; i < this.numParticles; i++) {
      if (this.pinned[i] === 1 || i === this.grabbedIndex) continue;

      const idx = i * 3;
      const px = this.pos[idx];
      const py = this.pos[idx + 1];
      const pz = this.pos[idx + 2];

      // 1. Upper Torso & Shoulder Blades (y = 0.20 to 0.52)
      if (py >= 0.20 && py <= 0.52) {
        const cz = 0.025;
        const rx = this.torsoRX + margin;
        const rz = this.torsoRZ + margin;
        const dSq = (px * px) / (rx * rx) + ((pz - cz) * (pz - cz)) / (rz * rz);
        if (dSq < 1.0 && dSq > 0.0001) {
          const s = 1.0 / Math.sqrt(dSq);
          this.pos[idx]     = px * s;
          this.pos[idx + 2] = cz + (pz - cz) * s;
        }
      }

      // 2. Waist & Hips (y = -0.15 to 0.20)
      if (py < 0.20 && py >= -0.15) {
        const cz = 0.038;
        const rx = this.hipRX + margin;
        const rz = this.hipRZ + margin;
        const dSq = (px * px) / (rx * rx) + ((pz - cz) * (pz - cz)) / (rz * rz);
        if (dSq < 1.0 && dSq > 0.0001) {
          const s = 1.0 / Math.sqrt(dSq);
          this.pos[idx]     = px * s;
          this.pos[idx + 2] = cz + (pz - cz) * s;
        }
      }

      // 3. Lower Skirt / Thighs (y = -0.75 to -0.15)
      if (py < -0.15 && py >= -0.75) {
        const cz = 0.010;
        const rx = this.legRX + margin;
        const rz = this.legRZ + margin;
        const dSq = (px * px) / (rx * rx) + ((pz - cz) * (pz - cz)) / (rz * rz);
        if (dSq < 1.0 && dSq > 0.0001) {
          const s = 1.0 / Math.sqrt(dSq);
          this.pos[idx]     = px * s;
          this.pos[idx + 2] = cz + (pz - cz) * s;
        }
      }
    }
  }

  public syncToBuffer(positionAttr: THREE.BufferAttribute) {
    (positionAttr.array as Float32Array).set(this.pos);
    positionAttr.needsUpdate = true;
  }
}
