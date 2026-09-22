import * as THREE from "three";

export type DrapePose = "shoulder" | "loom" | "table";

export interface Constraint {
  p1: number;
  p2: number;
  restDist: number;
  stiffness: number;
}

export class ClothPhysicsSimulator {
  public w: number;
  public h: number;
  public numParticles: number;
  public pos: Float32Array;
  public prevPos: Float32Array;
  public origPos: Float32Array;
  public pinned: Uint8Array;
  public constraints: Constraint[] = [];

  public grabbedIndex: number | null = null;
  public grabTarget = new THREE.Vector3();
  public grabVelocity = new THREE.Vector3();
  private lastGrabPos = new THREE.Vector3();

  public gravity = -9.8;
  public damping = 0.982;
  public weightGsm = 210;
  public currentPose: DrapePose = "shoulder";

  private time = 0;

  constructor(w = 24, h = 32, clothWidth = 1.8, clothHeight = 2.4) {
    this.w = w;
    this.h = h;
    this.numParticles = w * h;

    this.pos = new Float32Array(this.numParticles * 3);
    this.prevPos = new Float32Array(this.numParticles * 3);
    this.origPos = new Float32Array(this.numParticles * 3);
    this.pinned = new Uint8Array(this.numParticles);

    const dx = clothWidth / (w - 1);
    const dy = clothHeight / (h - 1);

    // Initialize positions centered at origin
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 3;
        const px = (x - (w - 1) / 2) * dx;
        const py = ((h - 1) / 2 - y) * dy;
        const pz = 0;

        this.pos[i] = px;
        this.pos[i + 1] = py;
        this.pos[i + 2] = pz;

        this.prevPos[i] = px;
        this.prevPos[i + 1] = py;
        this.prevPos[i + 2] = pz;

        this.origPos[i] = px;
        this.origPos[i + 1] = py;
        this.origPos[i + 2] = pz;
      }
    }

    this.buildConstraints(dx, dy);
    this.setPose("shoulder");
  }

  private buildConstraints(dx: number, dy: number) {
    this.constraints = [];
    const diagDist = Math.sqrt(dx * dx + dy * dy);

    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const p1 = y * this.w + x;

        // 1. Structural: Horizontal warp constraint
        if (x < this.w - 1) {
          const p2 = y * this.w + (x + 1);
          this.constraints.push({ p1, p2, restDist: dx, stiffness: 0.95 });
        }

        // 2. Structural: Vertical weft constraint
        if (y < this.h - 1) {
          const p2 = (y + 1) * this.w + x;
          this.constraints.push({ p1, p2, restDist: dy, stiffness: 0.95 });
        }

        // 3. Shear: Diagonal cross constraints (weave stability)
        if (x < this.w - 1 && y < this.h - 1) {
          const p2 = (y + 1) * this.w + (x + 1);
          this.constraints.push({ p1, p2, restDist: diagDist, stiffness: 0.65 });
        }
        if (x > 0 && y < this.h - 1) {
          const p2 = (y + 1) * this.w + (x - 1);
          this.constraints.push({ p1, p2, restDist: diagDist, stiffness: 0.65 });
        }

        // 4. Bend: Silk bending stiffness (prevents rubbery collapsing)
        if (x < this.w - 2) {
          const p2 = y * this.w + (x + 2);
          this.constraints.push({ p1, p2, restDist: dx * 2, stiffness: 0.35 });
        }
        if (y < this.h - 2) {
          const p2 = (y + 2) * this.w + x;
          this.constraints.push({ p1, p2, restDist: dy * 2, stiffness: 0.35 });
        }
      }
    }
  }

  public setPose(pose: DrapePose) {
    this.currentPose = pose;
    this.pinned.fill(0);

    // Reset positions back to original plane layout with slight initial z-curve
    for (let i = 0; i < this.numParticles; i++) {
      const idx = i * 3;
      const x = i % this.w;
      const y = Math.floor(i / this.w);

      const px = this.origPos[idx];
      const py = this.origPos[idx + 1];
      // Subtle pre-curve along folds
      const pz = Math.sin((x / this.w) * Math.PI * 3) * 0.08;

      this.pos[idx] = px;
      this.pos[idx + 1] = py;
      this.pos[idx + 2] = pz;

      this.prevPos[idx] = px;
      this.prevPos[idx + 1] = py;
      this.prevPos[idx + 2] = pz;
    }

    if (pose === "shoulder") {
      // Pin along a gathered shoulder drape line (top-left gather)
      for (let x = 0; x < Math.floor(this.w * 0.45); x++) {
        const p = x;
        this.pinned[p] = 1;
        // Bunch together slightly to form natural pleated gathers
        const idx = p * 3;
        this.pos[idx] *= 0.65;
        this.pos[idx + 2] = -0.15 + (x / this.w) * 0.3;
        this.prevPos[idx] = this.pos[idx];
        this.prevPos[idx + 2] = this.pos[idx + 2];
      }
      // Pin rightmost shoulder anchor
      const rightAnchor = Math.floor(this.w * 0.85);
      this.pinned[rightAnchor] = 1;
    } else if (pose === "loom") {
      // Pin top row (horizontal display rail / loom beam)
      for (let x = 0; x < this.w; x++) {
        if (x % 2 === 0 || x === 0 || x === this.w - 1) {
          this.pinned[x] = 1;
        }
      }
    } else if (pose === "table") {
      // 4 corners pinned horizontally
      this.pinned[0] = 1;
      this.pinned[this.w - 1] = 1;
      this.pinned[(this.h - 1) * this.w] = 1;
      this.pinned[this.numParticles - 1] = 1;
    }
  }

  public setWeight(gsm: number) {
    this.weightGsm = gsm;
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
      // Transfer grab momentum to particle for natural throw/toss
      const idx = this.grabbedIndex * 3;
      this.prevPos[idx] = this.pos[idx] - this.grabVelocity.x * 0.8;
      this.prevPos[idx + 1] = this.pos[idx + 1] - this.grabVelocity.y * 0.8;
      this.prevPos[idx + 2] = this.pos[idx + 2] - this.grabVelocity.z * 0.8;
      this.grabbedIndex = null;
    }
  }

  public step(dt: number) {
    this.time += dt;
    const clampedDt = Math.min(dt, 0.025);
    const dtSq = clampedDt * clampedDt;

    // Weight factor: 64 GSM falls gently with high air lift; 210 GSM has heavier downward pull
    const normWeight = (this.weightGsm - 50) / 160; // 0 (featherweight) to 1 (heavy)
    const effectiveGravity = this.gravity * (0.4 + normWeight * 0.6);
    const effectiveDamping = this.damping - normWeight * 0.005;

    // Ambient Silk Flutter (Gentle Wind field)
    const windStrength = 0.4 + (1 - normWeight) * 0.6; // Lighter organza flutters more
    const windX = Math.sin(this.time * 1.8) * 0.25 * windStrength;
    const windZ = Math.cos(this.time * 2.2) * 0.35 * windStrength;

    // 1. Verlet Particle Position Update
    for (let i = 0; i < this.numParticles; i++) {
      if (this.pinned[i] === 1) continue;

      const idx = i * 3;

      if (i === this.grabbedIndex) {
        // Pinned to cursor
        this.pos[idx] = this.grabTarget.x;
        this.pos[idx + 1] = this.grabTarget.y;
        this.pos[idx + 2] = this.grabTarget.z;
        continue;
      }

      const px = this.pos[idx];
      const py = this.pos[idx + 1];
      const pz = this.pos[idx + 2];

      const vx = (px - this.prevPos[idx]) * effectiveDamping;
      const vy = (py - this.prevPos[idx + 1]) * effectiveDamping;
      const vz = (pz - this.prevPos[idx + 2]) * effectiveDamping;

      this.prevPos[idx] = px;
      this.prevPos[idx + 1] = py;
      this.prevPos[idx + 2] = pz;

      // Accelerations (Gravity + Wind Flutter)
      const ax = windX * (i % 2 === 0 ? 1 : 0.8);
      const ay = effectiveGravity;
      const az = windZ * (Math.sin(i + this.time) * 0.5 + 0.5);

      this.pos[idx] = px + vx + ax * dtSq;
      this.pos[idx + 1] = py + vy + ay * dtSq;
      this.pos[idx + 2] = pz + vz + az * dtSq;
    }

    // 2. Constraint Relaxation (Gauss-Seidel 3 passes)
    const numConstraints = this.constraints.length;
    for (let pass = 0; pass < 3; pass++) {
      for (let c = 0; c < numConstraints; c++) {
        const { p1, p2, restDist, stiffness } = this.constraints[c];

        const idx1 = p1 * 3;
        const idx2 = p2 * 3;

        const dx = this.pos[idx2] - this.pos[idx1];
        const dy = this.pos[idx2 + 1] - this.pos[idx1 + 1];
        const dz = this.pos[idx2 + 2] - this.pos[idx1 + 2];

        const currentDist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (currentDist < 0.0001) continue;

        const diff = (currentDist - restDist) / currentDist;
        const offsetFactor = diff * 0.5 * stiffness;

        const offX = dx * offsetFactor;
        const offY = dy * offsetFactor;
        const offZ = dz * offsetFactor;

        const p1Pinned = this.pinned[p1] || p1 === this.grabbedIndex;
        const p2Pinned = this.pinned[p2] || p2 === this.grabbedIndex;

        if (!p1Pinned && !p2Pinned) {
          this.pos[idx1] += offX;
          this.pos[idx1 + 1] += offY;
          this.pos[idx1 + 2] += offZ;

          this.pos[idx2] -= offX;
          this.pos[idx2 + 1] -= offY;
          this.pos[idx2 + 2] -= offZ;
        } else if (!p1Pinned) {
          this.pos[idx1] += offX * 2;
          this.pos[idx1 + 1] += offY * 2;
          this.pos[idx1 + 2] += offZ * 2;
        } else if (!p2Pinned) {
          this.pos[idx2] -= offX * 2;
          this.pos[idx2 + 1] -= offY * 2;
          this.pos[idx2 + 2] -= offZ * 2;
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
