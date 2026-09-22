import { create } from "zustand";
import { Colorway } from "../types";

export type LightingMode = "candlelight" | "studio" | "daylight";

interface CanvasState {
  activeColorway: Colorway | null;
  lightingMode: LightingMode;
  fabricWeight: number; // GSM
  zoomLevel: number; // 1 to 8
  isMacroInspecting: boolean;
  drapeAngle: number;
  setActiveColorway: (colorway: Colorway) => void;
  setLightingMode: (mode: LightingMode) => void;
  setFabricWeight: (gsm: number) => void;
  setZoomLevel: (zoom: number) => void;
  setMacroInspecting: (inspecting: boolean) => void;
  setDrapeAngle: (angle: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  activeColorway: null,
  lightingMode: "studio",
  fabricWeight: 210,
  zoomLevel: 1,
  isMacroInspecting: false,
  drapeAngle: 0,

  setActiveColorway: (colorway) => set({ activeColorway: colorway }),
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setFabricWeight: (gsm) => set({ fabricWeight: gsm }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setMacroInspecting: (inspecting) => set({ isMacroInspecting: inspecting }),
  setDrapeAngle: (angle) => set({ drapeAngle: angle }),
}));
