"use client";

import React, { useState } from "react";
import { SareeProduct } from "@/lib/types";
import { MessageCircle, Video, X, Check, ArrowRight } from "lucide-react";

interface WhatsAppConciergeProps {
  saree?: SareeProduct;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({ saree }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<"options" | "calendar" | "confirmed">("options");
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedTime, setSelectedTime] = useState("3:00 PM EST");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const phoneNumber = "+919840012345"; // Rami Studio Flagship Concierge Line
  const defaultMessage = saree
    ? `Hello Rami Studio Atelier, I am inspecting the ${saree.title} (${saree.culturalName}) listed at $${saree.priceUSD}. Could you share an unedited 30-second studio video of the pallu under natural daylight?`
    : "Hello Rami Studio Atelier, I would like to speak with a senior bridal and handloom stylist regarding an upcoming occasion.";

  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName && clientPhone) {
      setBookingStep("confirmed");
    }
  };

  return (
    <>
      {/* Floating Concierge Pill (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-text-primary text-canvas-base px-4 py-3 rounded-full border border-surface-border shadow-2xl hover:bg-accent-zari hover:text-text-primary transition-all duration-300 flex items-center gap-2.5 text-xs font-mono tracking-wider group"
          aria-label="Open Luxury Saree Concierge"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-text-primary" />
          <span className="hidden sm:inline">ATELIER CONCIERGE</span>
        </button>
      </div>

      {/* Concierge Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-text-primary/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="relative w-full max-w-lg bg-canvas-base border border-surface-border rounded-xs shadow-2xl p-6 sm:p-8 z-10 space-y-6 my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="concierge-modal-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                    White-Glove Private Client Services
                  </span>
                  <h3 id="concierge-modal-title" className="font-serif text-2xl text-text-primary">
                    Private Stylist Concierge
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingStep === "options" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  Every saree is a significant heirloom investment. Our stylists are available 7 days a week from our flagship Chennai and Varanasi ateliers to share live unedited footage, drape advice, and blouse pairing options.
                </p>

                {/* WhatsApp Action */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-canvas-elevated border border-surface-border hover:border-emerald-500/60 transition-all rounded-xs group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif text-base text-text-primary group-hover:text-emerald-700 transition-colors">
                          Live WhatsApp Consultation
                        </div>
                        <div className="text-[11px] font-mono text-text-tertiary">
                          Typically responds in &lt; 5 minutes · Share video requests
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* FaceTime / Video Booking Action */}
                <button
                  onClick={() => setBookingStep("calendar")}
                  className="w-full text-left p-4 bg-canvas-elevated border border-surface-border hover:border-text-primary transition-all rounded-xs group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-text-primary text-canvas-base flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif text-base text-text-primary group-hover:underline">
                          Book a 20-Min FaceTime / Zoom Drape
                        </div>
                        <div className="text-[11px] font-mono text-text-tertiary">
                          1-on-1 private video inspection of pallu, weight, and border
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <div className="pt-2 text-center text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  Atelier Hours: 9:00 AM – 9:00 PM IST · Direct Phone: +91 (0) 44 2811 4455
                </div>
              </div>
            )}

            {bookingStep === "calendar" && (
              <form onSubmit={handleBookingSubmit} className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-text-primary">
                    Reserve a Private Video Appointment
                  </h4>
                  <p className="text-xs text-text-secondary font-light">
                    Our stylist will bring the saree in front of HD cameras with professional studio CRI-98 daylight fixtures.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-text-secondary uppercase mb-1">
                      Select Day:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Today", "Tomorrow", "In 2 Days"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`p-2 border rounded-xs ${
                            selectedDate === d
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-elevated border-surface-border text-text-secondary"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase mb-1">
                      Select Time Slot:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["11:00 AM EST", "3:00 PM EST", "8:00 PM EST"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`p-2 border rounded-xs ${
                            selectedTime === t
                              ? "bg-text-primary text-canvas-base border-text-primary"
                              : "bg-canvas-elevated border-surface-border text-text-secondary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Radhika Menon"
                      className="w-full bg-canvas-elevated border border-surface-border p-2.5 text-text-primary focus:outline-none focus:border-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary uppercase mb-1">
                      WhatsApp / Mobile Number (with country code):
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834 or +91 98400..."
                      className="w-full bg-canvas-elevated border border-surface-border p-2.5 text-text-primary focus:outline-none focus:border-text-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep("options")}
                    className="px-4 py-2.5 border border-surface-border text-xs font-mono uppercase"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors"
                  >
                    CONFIRM RESERVATION
                  </button>
                </div>
              </form>
            )}

            {bookingStep === "confirmed" && (
              <div className="p-6 bg-canvas-elevated border border-surface-border text-center space-y-4 rounded-xs animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-accent-zari/20 text-accent-zari-hover mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl text-text-primary">
                  Appointment Confirmed
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto font-light">
                  Thank you, {clientName}. Your 20-minute private video walkthrough for <strong>{selectedDate} at {selectedTime}</strong> has been assigned to our senior draping specialist. A calendar invite and FaceTime/WhatsApp video link have been dispatched to {clientPhone}.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setBookingStep("options");
                  }}
                  className="px-6 py-2.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase"
                >
                  RETURN TO ATELIER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
