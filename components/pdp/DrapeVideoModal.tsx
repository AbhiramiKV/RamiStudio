"use client";

import React, { useEffect, useRef } from "react";
import { SareeProduct } from "@/lib/types";
import { X, Play, Pause, Volume2, VolumeX, Award } from "lucide-react";

interface DrapeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: SareeProduct;
}

export const DrapeVideoModal: React.FC<DrapeVideoModalProps> = ({
  isOpen,
  onClose,
  saree,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-text-primary/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-4xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl z-10 overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        {/* Top Bar */}
        <div className="p-4 border-b border-surface-border bg-canvas-elevated flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-zari animate-pulse" />
            <span
              id="video-modal-title"
              className="text-xs font-mono tracking-widest text-text-primary uppercase"
            >
              4K Drape Motion Walkthrough · {saree.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-[16/9] w-full bg-black">
          <video
            ref={videoRef}
            src={saree.videoUrls?.drapeWalkthrough || "https://assets.mixkit.co/videos/preview/mixkit-folds-of-a-luxurious-white-fabric-41712-large.mp4"}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Video Overlay Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2.5 bg-canvas-base/85 backdrop-blur-md border border-surface-border text-text-primary rounded-xs hover:bg-canvas-base transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2.5 bg-canvas-base/85 backdrop-blur-md border border-surface-border text-text-primary rounded-xs hover:bg-canvas-base transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="bg-canvas-base/85 backdrop-blur-md px-3 py-1.5 border border-surface-border text-[10px] font-mono tracking-widest text-text-secondary uppercase">
              STUDIO SUNLIGHT CRI-98 · NATURAL 24-FPS
            </div>
          </div>
        </div>

        {/* Footnote Details */}
        <div className="p-4 sm:p-6 bg-canvas-base border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-text-primary font-medium">
              Weave Density: {saree.specs.weightGrams}g Total Weight · {saree.specs.gsm} GSM
            </div>
            <div className="text-text-secondary text-[11px]">
              Observed dynamic: crisp knife-pleat memory, zero deadweight sag, fluid pallu cascade.
            </div>
          </div>

          <div className="flex items-center gap-2 text-accent-zari-hover">
            <Award className="w-4 h-4" />
            <span className="uppercase tracking-wider text-[11px]">
              CERTIFIED UNFILTERED ATELIER FOOTAGE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
