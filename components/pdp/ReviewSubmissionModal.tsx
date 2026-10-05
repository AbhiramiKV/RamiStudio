"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SareeProduct, CustomerReview } from "@/lib/types";
import { X, Star, Check, Sparkles, Upload } from "lucide-react";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  saree: SareeProduct;
  onSubmitReview: (review: CustomerReview) => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  saree,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [occasion, setOccasion] = useState("Bridal & Wedding");
  const [height, setHeight] = useState("5'5\"");
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!reviewText.trim() || reviewText.length < 20) {
      setError("Please share at least 20 characters describing the drape and handfeel.");
      return;
    }

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      verified: true,
      location: location.trim() || "Global Patron",
      rating,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      occasion,
      height,
      reviewText: reviewText.trim(),
    };

    onSubmitReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg bg-canvas-base border border-surface-border rounded-xs shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-canvas-elevated">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 border border-surface-border overflow-hidden rounded-xs shrink-0">
              <Image
                src={saree.images.hero}
                alt={saree.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-text-tertiary block">
                Atelier Registry
              </span>
              <h3 id="review-modal-title" className="font-serif text-lg text-text-primary">
                Review Your Heirloom
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-accent-zari/20 text-accent-zari flex items-center justify-center mx-auto border border-accent-zari/40">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl text-text-primary">
              Thank You for Chronicling
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed font-light max-w-sm mx-auto">
              Your connoisseur evaluation for <em>{saree.title}</em> has been appended to the atelier ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-mono">
                {error}
              </div>
            )}

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                Overall Craftsmanship & Drape Rating:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? "fill-accent-zari text-accent-zari"
                          : "text-surface-border"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-mono text-text-tertiary">
                  {rating === 5 ? "Peerless Heirloom" : `${rating} out of 5`}
                </span>
              </div>
            </div>

            {/* Author & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block mb-1">
                  Your Full Name / Moniker *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Menon"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-canvas-base border border-surface-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-text-primary"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block mb-1">
                  Location (City / Country)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Singapore / London"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-canvas-base border border-surface-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-text-primary"
                />
              </div>
            </div>

            {/* Occasion & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block mb-1">
                  Wearing Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-canvas-base border border-surface-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-text-primary"
                >
                  <option value="Bridal Wedding">Bridal & Muhurtham</option>
                  <option value="Evening Reception">Evening Reception</option>
                  <option value="Diwali / Festive">Diwali / Festive Soirée</option>
                  <option value="Gala Dinner">Gala & Diplomatic Dinner</option>
                  <option value="Heirloom Trousseau">Heirloom Trousseau Archiving</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block mb-1">
                  Wearer Height
                </label>
                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-canvas-base border border-surface-border p-2.5 text-xs text-text-primary focus:outline-none focus:border-text-primary"
                >
                  {["5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\""].map(
                    (h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
                  Detailed Critique (Drape, Lustre, Fall) *
                </label>
                <span className="text-[10px] font-mono text-text-tertiary">
                  {reviewText.length} chars
                </span>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Share your impressions of the zari sheen under evening light, the weight of the silk, and the pleat resilience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-canvas-base border border-surface-border p-3 text-xs text-text-primary leading-relaxed focus:outline-none focus:border-text-primary resize-none"
              />
            </div>

            {/* Photo Attachment Placeholder */}
            <div className="p-3 border border-dashed border-surface-border bg-canvas-elevated flex items-center justify-between text-xs font-mono text-text-tertiary">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-accent-zari-hover" />
                <span>Attach Draping Portrait (Optional)</span>
              </div>
              <span className="text-[10px] text-text-tertiary">JPG / PNG up to 10MB</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary border border-surface-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono uppercase tracking-widest hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Heirloom Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
