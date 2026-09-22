import * as THREE from "three";

export type DrapeStyle = "nivi" | "seedha" | "cape";

export interface DrapeEngineOptions {
  pleatCount: number;
  drapeStyle: DrapeStyle;
  fabricWeight: number;
}

export class SareeDrapeEngine {
  public drapeStyle: DrapeStyle = "nivi";
  public pleatCount: number = 7;
  public fabricWeight: number = 210;

  // Pallu Verlet Simulation Grid — 22×32 for smoother silk folds
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

  // Model Collision Dimensions (Proportioned to anatomical faceless figure)
  public torsoRadiusX = 0.22;
  public torsoRadiusZ = 0.17;
  public hipRadiusX = 0.25;
  public hipRadiusZ = 0.19;

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

    for (let y = 0; y < this.gridH; y++) {
      for (let x = 0; x < this.gridW; x++) {
        const p1 = y * this.gridW + x;
        const idx1 = p1 * 3;

        const getDist = (p2: number) => {
          const idx2 = p2 * 3;
          const dx = this.pos[idx2] - this.pos[idx1];
          const dy = this.pos[idx2 + 1] - this.pos[idx1 + 1];
          const dz = this.pos[idx2 + 2] - this.pos[idx1 + 2];
          return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };

        // Structural Horizontal
        if (x < this.gridW - 1) {
          const p2 = p1 + 1;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.95 });
        }
        // Structural Vertical
        if (y < this.gridH - 1) {
          const p2 = p1 + this.gridW;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.95 });
        }
        // Shear Diagonal
        if (x < this.gridW - 1 && y < this.gridH - 1) {
          const p2 = p1 + this.gridW + 1;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.65 });
        }
        if (x > 0 && y < this.gridH - 1) {
          const p2 = p1 + this.gridW - 1;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.65 });
        }
        // Bend
        if (x < this.gridW - 2) {
          const p2 = p1 + 2;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.35 });
        }
        if (y < this.gridH - 2) {
          const p2 = p1 + this.gridW * 2;
          this.constraints.push({ p1, p2, restDist: getDist(p2), stiffness: 0.35 });
        }
      }
    }
  }

  public setDrapeStyle(style: DrapeStyle) {
    this.drapeStyle = style;
    this.pinned.fill(0);

    if (style === "nivi") {
      // Classic Nivi: Gathered shoulder pleats (width 0.14m) flaring to expansive back cascade (width 0.50m)
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          const width = THREE.MathUtils.lerp(0.14, 0.48, v);
          const centerX = THREE.MathUtils.lerp(-0.165, -0.21, v);

          const anchorX = centerX + (u - 0.5) * width;
          const anchorY = 0.52 - v * 1.36;
          const anchorZ = THREE.MathUtils.lerp(0.01, -0.15, Math.min(v * 2.0, 1.0)) - Math.sin(v * Math.PI * 0.5) * 0.10 + (u - 0.5) * 0.04;

          this.pos[i] = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;

          this.prevPos[i] = this.pos[i];
          this.prevPos[i + 1] = this.pos[i + 1];
          this.prevPos[i + 2] = this.pos[i + 2];
        }
      }

      // Pin top row across left shoulder
      for (let x = 0; x < this.gridW; x++) {
        this.pinned[x] = 1;
      }
    } else if (style === "seedha") {
      // Royal Seedha Pallu: Gathered at right shoulder (width 0.14m), fanning forward across chest
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          const width = THREE.MathUtils.lerp(0.14, 0.46, v);
          const centerX = THREE.MathUtils.lerp(0.165, 0.05, v);

          const anchorX = centerX - (u - 0.5) * width;
          const anchorY = 0.52 - v * 1.28;
          const anchorZ = THREE.MathUtils.lerp(0.02, 0.21, Math.min(v * 2.0, 1.0)) + Math.sin(v * Math.PI * 0.6) * 0.06;

          this.pos[i] = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;

          this.prevPos[i] = this.pos[i];
          this.prevPos[i + 1] = this.pos[i + 1];
          this.prevPos[i + 2] = this.pos[i + 2];
        }
      }

      // Pin at right shoulder top row
      for (let x = 0; x < this.gridW; x++) {
        this.pinned[x] = 1;
      }
    } else {
      // Contemporary Atelier Cape: Symmetrical bilateral shoulder drape
      for (let y = 0; y < this.gridH; y++) {
        for (let x = 0; x < this.gridW; x++) {
          const i = (y * this.gridW + x) * 3;
          const u = x / (this.gridW - 1);
          const v = y / (this.gridH - 1);

          const width = THREE.MathUtils.lerp(0.42, 0.65, v);
          const anchorX = (u - 0.5) * width;
          const anchorY = 0.52 - v * 1.35;
          const anchorZ = THREE.MathUtils.lerp(0.01, -0.16, Math.min(v * 2.0, 1.0)) - Math.sin(v * Math.PI * 0.5) * 0.08;

          this.pos[i] = anchorX;
          this.pos[i + 1] = anchorY;
          this.pos[i + 2] = anchorZ;

          this.prevPos[i] = this.pos[i];
          this.prevPos[i + 1] = this.pos[i + 1];
          this.prevPos[i + 2] = this.pos[i + 2];
        }
      }

      // Pin both left and right shoulder nodes
      for (let x = 0; x < this.gridW; x++) {
        if (x < 4 || x > this.gridW - 5) {
          this.pinned[x] = 1;
        }
      }
    }

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
      const dx = this.pos[idx] - hitPoint.x;
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
      this.prevPos[idx] = this.pos[idx] - this.grabVelocity.x * 0.85;
      this.prevPos[idx + 1] = this.pos[idx + 1] - this.grabVelocity.y * 0.85;
      this.prevPos[idx + 2] = this.pos[idx + 2] - this.grabVelocity.z * 0.85;
      this.grabbedIndex = null;
    }
  }

  public step(dt: number, angularVelocity: number = 0) {
    this.time += dt;
    const clampedDt = Math.min(dt, 0.025);
    const dtSq = clampedDt * clampedDt;

    const normWeight = (this.fabricWeight - 50) / 160;
    const gravity = -9.8 * (0.45 + normWeight * 0.55);
    const damping = 0.982 - normWeight * 0.005;

    // Ambient flutter — primary oscillation + secondary slow frequency for organic motion
    const rotWind = -angularVelocity * 2.8;
    const wind = (
      Math.sin(this.time * 2.2) * 0.09 +
      Math.sin(this.time * 0.71) * 0.04 +
      rotWind
    ) * (1 - normWeight * 0.35);


    // 1. Verlet Integration
    for (let i = 0; i < this.numParticles; i++) {
      if (this.pinned[i] === 1) continue;

      const idx = i * 3;
      if (i === this.grabbedIndex) {
        this.pos[idx] = this.grabTarget.x;
        this.pos[idx + 1] = this.grabTarget.y;
        this.pos[idx + 2] = this.grabTarget.z;
        continue;
      }

      const px = this.pos[idx];
      const py = this.pos[idx + 1];
      const pz = this.pos[idx + 2];

      const vx = (px - this.prevPos[idx]) * damping;
      const vy = (py - this.prevPos[idx + 1]) * damping;
      const vz = (pz - this.prevPos[idx + 2]) * damping;

      this.prevPos[idx] = px;
      this.prevPos[idx + 1] = py;
      this.prevPos[idx + 2] = pz;

      const ax = wind * 0.35;
      const ay = gravity;
      const az = wind * (Math.cos(i * 0.12 + this.time) * 0.5 + 0.5);

      this.pos[idx] = px + vx + ax * dtSq;
      this.pos[idx + 1] = py + vy + ay * dtSq;
      this.pos[idx + 2] = pz + vz + az * dtSq;
    }

    // 2. Constraints Relaxation (5 iterations — smoother silk cloth)
    const numConstraints = this.constraints.length;
    for (let pass = 0; pass < 5; pass++) {
      for (let c = 0; c < numConstraints; c++) {
        const { p1, p2, restDist, stiffness } = this.constraints[c];
        const idx1 = p1 * 3;
        const idx2 = p2 * 3;

        const dx = this.pos[idx2] - this.pos[idx1];
        const dy = this.pos[idx2 + 1] - this.pos[idx1 + 1];
        const dz = this.pos[idx2 + 2] - this.pos[idx1 + 2];

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.0001) continue;

        const diff = (dist - restDist) / dist;
        const off = diff * 0.5 * stiffness;

        const p1Pin = this.pinned[p1] || p1 === this.grabbedIndex;
        const p2Pin = this.pinned[p2] || p2 === this.grabbedIndex;

        if (!p1Pin && !p2Pin) {
          this.pos[idx1] += dx * off;
          this.pos[idx1 + 1] += dy * off;
          this.pos[idx1 + 2] += dz * off;
          this.pos[idx2] -= dx * off;
          this.pos[idx2 + 1] -= dy * off;
          this.pos[idx2 + 2] -= dz * off;
        } else if (!p1Pin) {
          this.pos[idx1] += dx * off * 2;
          this.pos[idx1 + 1] += dy * off * 2;
          this.pos[idx1 + 2] += dz * off * 2;
        } else if (!p2Pin) {
          this.pos[idx2] -= dx * off * 2;
          this.pos[idx2 + 1] -= dy * off * 2;
          this.pos[idx2 + 2] -= dz * off * 2;
        }
      }

      this.resolveMannequinCollision();
    }
  }

  // Realistic collision preventing cloth from penetrating female model anatomy
  private resolveMannequinCollision() {
    const margin = 0.025;

    for (let i = 0; i < this.numParticles; i++) {
      if (this.pinned[i] === 1 || i === this.grabbedIndex) continue;

      const idx = i * 3;
      const px = this.pos[idx];
      const py = this.pos[idx + 1];
      const pz = this.pos[idx + 2];

      // Torso / Bust / Ribcage (between y = 0.05 and y = 0.60)
      if (py >= 0.05 && py <= 0.60) {
        // Waist taper around y = 0.15
        const waistFactor = 1.0 - Math.exp(-Math.pow(py - 0.18, 2) * 14) * 0.18;
        const rx = (this.torsoRadiusX + margin) * waistFactor;
        const rz = (this.torsoRadiusZ + margin) * waistFactor;

        const dSq = (px * px) / (rx * rx) + (pz * pz) / (rz * rz);
        if (dSq < 1.0 && dSq > 0.0001) {
          const scale = 1.0 / Math.sqrt(dSq);
          this.pos[idx] = px * scale;
          this.pos[idx + 2] = pz * scale;
        }
      }

      // Hips / Lower Body (between y = -0.85 and y = 0.05)
      if (py < 0.05 && py >= -0.85) {
        const flare = 1.0 + (-py) * 0.25;
        const rx = (this.hipRadiusX + margin) * flare;
        const rz = (this.hipRadiusZ + margin) * flare;

        const dSq = (px * px) / (rx * rx) + (pz * pz) / (rz * rz);
        if (dSq < 1.0 && dSq > 0.0001) {
          const scale = 1.0 / Math.sqrt(dSq);
          this.pos[idx] = px * scale;
          this.pos[idx + 2] = pz * scale;
        }
      }
    }
  }

  public syncToBuffer(positionAttr: THREE.BufferAttribute) {
    const array = positionAttr.array as Float32Array;
    array.set(this.pos);
    positionAttr.needsUpdate = true;
  }
}
