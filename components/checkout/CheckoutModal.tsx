"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  FileCheck,
  Lock,
  ArrowRight,
  ChevronLeft,
  Award,
  Sparkles,
  Smartphone,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    items,
    getSubtotalUSD,
    formatPrice,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState<"review" | "shipping" | "payment" | "confirmed">("review");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United States");
  const [postalCode, setPostalCode] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [isCedarBoxRequested, setIsCedarBoxRequested] = useState(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "klarna" | "cod">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  if (!isOpen) return null;

  const subtotalUSD = getSubtotalUSD();
  // Duties included for DDP guarantee; local sales tax / GST simulated
  const estimatedTaxUSD = country === "India" ? Math.round(subtotalUSD * 0.05) : 0;
  const shippingUSD = subtotalUSD > 1000 ? 0 : 45;
  const totalUSD = subtotalUSD + estimatedTaxUSD + shippingUSD;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && address && postalCode) {
      setStep("payment");
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = `RAMI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(orderId);
      setIsProcessing(false);
      setStep("confirmed");
      clearCart();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/75 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          if (step !== "confirmed") onClose();
        }}
      />

      {/* Main Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-surface-border bg-canvas-elevated flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-text-primary text-canvas-base flex items-center justify-center font-serif italic text-lg">
              R
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                Secure Settlement & Archival Protocol
              </span>
              <h3 id="checkout-modal-title" className="font-serif text-xl sm:text-2xl text-text-primary">
                {step === "confirmed" ? "Heirloom Order Confirmed" : "Atelier Checkout"}
              </h3>
            </div>
          </div>

          {step !== "confirmed" && (
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Indicator (if not confirmed) */}
        {step !== "confirmed" && (
          <div className="grid grid-cols-3 border-b border-surface-border bg-canvas-base text-[11px] font-mono uppercase tracking-widest text-center">
            <div
              className={`py-2.5 border-r border-surface-border ${
                step === "review"
                  ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                  : "text-text-tertiary"
              }`}
            >
              1. Atelier Review
            </div>
            <div
              className={`py-2.5 border-r border-surface-border ${
                step === "shipping"
                  ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                  : "text-text-tertiary"
              }`}
            >
              2. Shipping DDP
            </div>
            <div
              className={`py-2.5 ${
                step === "payment"
                  ? "bg-canvas-elevated font-medium text-text-primary border-b-2 border-b-text-primary"
                  : "text-text-tertiary"
              }`}
            >
              3. Settlement
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* STEP 1: REVIEW */}
          {step === "review" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <span className="text-xs font-mono tracking-widest text-text-tertiary uppercase block">
                  Archive Pieces in Acquisition ({items.length})
                </span>

                <div className="divide-y divide-surface-border/70 border border-surface-border rounded-xs bg-canvas-elevated">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4 items-center">
                      <div className="relative w-16 h-20 bg-canvas-base flex-shrink-0 border border-surface-border overflow-hidden">
                        <Image
                          src={item.product.images.hero}
                          alt={item.product.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-base text-text-primary truncate">
                          {item.product.title}
                        </div>
                        <div className="text-xs font-mono text-accent-zari-hover">
                          {item.product.culturalName}
                        </div>
                        <div className="text-[11px] font-mono text-text-secondary mt-0.5">
                          Tone: {item.selectedColorway.name} · Qty: {item.quantity}
                        </div>

                        {/* Customization Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 bg-canvas-base border border-surface-border text-text-primary uppercase">
                            Fall & Pico: {item.customizations?.fallPico || "Hand-Stitched Free"}
                          </span>
                          {item.withBlouse && (
                            <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 bg-canvas-base border border-accent-zari/40 text-accent-zari-hover uppercase">
                              Blouse: {item.customizations?.blouse.styleOption === "custom-tailored" ? "Bespoke Tailored" : "Unstitched Piece"}
                            </span>
                          )}
                          {item.customizations?.petticoat?.enabled && (
                            <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 bg-canvas-base border border-surface-border text-text-secondary uppercase">
                              Mermaid Shaper
                            </span>
                          )}
                          {item.customizations?.prePleated?.enabled && (
                            <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 bg-canvas-base border border-surface-border text-text-secondary uppercase">
                              Pre-Pleated ({item.customizations.prePleated.waistInches} in.)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="font-mono text-sm font-medium text-text-primary text-right">
                        {formatPrice(
                          (item.product.priceUSD +
                            (item.withBlouse && item.product.blouseOption
                              ? item.product.blouseOption.priceUSD +
                                (item.customizations?.blouse.styleOption === "custom-tailored" ? 65 : 0)
                              : 0) +
                            (item.customizations?.petticoat?.enabled ? 35 : 0) +
                            (item.customizations?.tassels?.enabled ? 25 : 0) +
                            (item.customizations?.prePleated?.enabled ? 35 : 0)) *
                            item.quantity
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trousseau Packaging & Gift Note */}
              <div className="p-5 bg-canvas-elevated border border-surface-border space-y-3 rounded-xs text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-primary font-medium">
                    <Award className="w-4 h-4 text-accent-zari" />
                    <span>Complimentary Acid-Free Cedarwood Archival Box</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isCedarBoxRequested}
                    onChange={(e) => setIsCedarBoxRequested(e.target.checked)}
                    className="accent-text-primary w-4 h-4"
                  />
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed font-light">
                  Every saree is wrapped in unbleached pure mul-mul cotton cloth inside an acid-free cedarwood preservation chest with natural dried vetiver sachet.
                </p>

                <div className="pt-2">
                  <label className="block text-text-tertiary uppercase text-[10px] mb-1">
                    Calligraphed Gift Message / Trousseau Dedication (Optional):
                  </label>
                  <input
                    type="text"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="e.g. For Radhika on her wedding day with all our blessings."
                    className="w-full bg-canvas-base border border-surface-border p-2 text-text-primary text-xs focus:outline-none focus:border-text-primary"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs font-mono">
                  <span className="text-text-tertiary">Subtotal: </span>
                  <span className="font-medium text-text-primary">{formatPrice(subtotalUSD)}</span>
                </div>

                <button
                  onClick={() => setStep("shipping")}
                  className="px-8 py-3 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>CONTINUE TO SHIPPING</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING */}
          {step === "shipping" && (
            <form onSubmit={handleProceedToPayment} className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-text-primary">
                  Global Express Courier & Landed Customs (DDP)
                </h4>
                <p className="text-xs text-text-secondary font-light">
                  All international consignments ship via insured DHL Express with Delivery Duty Paid (DDP). Zero surprise customs fees upon doorstep arrival.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="sm:col-span-2">
                  <label className="block text-text-secondary uppercase mb-1">Full Legal Name:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhika Sundaram"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">Email Address:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">Mobile / WhatsApp (for DHL delivery alert):</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-text-secondary uppercase mb-1">Street Address:</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apt 4B, 742 Evergreen Terrace"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">City:</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary uppercase mb-1">Country:</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  >
                    <option value="United States">United States (USD)</option>
                    <option value="India">India (INR)</option>
                    <option value="United Kingdom">United Kingdom (GBP)</option>
                    <option value="United Arab Emirates">United Arab Emirates (AED)</option>
                    <option value="Canada">Canada (CAD)</option>
                    <option value="Australia">Australia (AUD)</option>
                    <option value="Singapore">Singapore (SGD)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-text-secondary uppercase mb-1">Postal / ZIP Code:</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                    className="w-full bg-canvas-elevated border border-surface-border p-2.5 focus:outline-none focus:border-text-primary"
                  />
                </div>
              </div>

              {/* Transit Guarantee Banner */}
              <div className="p-3 bg-canvas-elevated border border-surface-border flex items-center gap-3 text-xs font-mono text-text-secondary">
                <Truck className="w-4 h-4 text-accent-zari flex-shrink-0" />
                <span>
                  Estimated Transit: 3–5 Business Days via DHL Express Global Air Priority with end-to-end temperature and humidity-controlled tracking.
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="px-4 py-2.5 border border-surface-border text-xs font-mono uppercase flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>PROCEED TO PAYMENT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT */}
          {step === "payment" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-text-primary">
                  Secure Settlement Gateway
                </h4>
                <p className="text-xs text-text-secondary font-light">
                  Encrypted with 256-bit bank-grade SSL. Choose your preferred luxury settlement channel.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {(
                  [
                    { id: "card", label: "Credit Card (Stripe)", icon: CreditCard },
                    { id: "upi", label: "UPI / Netbanking", icon: Smartphone },
                    { id: "klarna", label: "Klarna / 4× Split", icon: Sparkles },
                    { id: "cod", label: "Cash on Delivery", icon: Truck },
                  ] as const
                ).map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 border rounded-xs flex flex-col items-center justify-center gap-1.5 transition-colors ${
                        paymentMethod === m.id
                          ? "bg-text-primary text-canvas-base border-text-primary"
                          : "bg-canvas-elevated border-surface-border text-text-secondary hover:border-text-primary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] text-center">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Inputs Simulation */}
              {paymentMethod === "card" && (
                <div className="p-4 bg-canvas-elevated border border-surface-border space-y-3 rounded-xs text-xs font-mono animate-fadeIn">
                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Cardholder Name:</label>
                    <input
                      type="text"
                      defaultValue={fullName}
                      placeholder="Name on Card"
                      className="w-full bg-canvas-base border border-surface-border p-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary uppercase mb-1">Card Number:</label>
                    <div className="flex items-center bg-canvas-base border border-surface-border px-3 py-2">
                      <CreditCard className="w-4 h-4 text-text-tertiary mr-2" />
                      <input
                        type="text"
                        defaultValue="•••• •••• •••• 4242"
                        className="w-full bg-transparent focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-text-tertiary uppercase">VISA / AMEX</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-text-secondary uppercase mb-1">Expiry Date:</label>
                      <input
                        type="text"
                        defaultValue="08 / 28"
                        className="w-full bg-canvas-base border border-surface-border p-2 text-center focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary uppercase mb-1">Security CVC:</label>
                      <input
                        type="password"
                        defaultValue="884"
                        className="w-full bg-canvas-base border border-surface-border p-2 text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="p-4 bg-canvas-elevated border border-surface-border text-xs font-mono space-y-2 rounded-xs animate-fadeIn">
                  <span className="text-text-primary font-medium block">Instant UPI QR & Netbanking (Razorpay)</span>
                  <p className="text-text-secondary leading-relaxed font-light">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM, or any major Indian bank netbanking portal. Instant settlement confirmation.
                  </p>
                </div>
              )}

              {paymentMethod === "klarna" && (
                <div className="p-4 bg-canvas-elevated border border-surface-border text-xs font-mono space-y-2 rounded-xs animate-fadeIn">
                  <span className="text-text-primary font-medium block">Pay in 4 Interest-Free Installments</span>
                  <p className="text-text-secondary leading-relaxed font-light">
                    4 bi-weekly payments of {formatPrice(Math.round(totalUSD / 4))}. No hidden interest, no credit check impact.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 bg-canvas-elevated border border-surface-border text-xs font-mono space-y-2 rounded-xs animate-fadeIn">
                  <span className="text-text-primary font-medium block">Cash On Delivery with OTP Verification</span>
                  <p className="text-text-secondary leading-relaxed font-light">
                    Available for domestic PIN codes across India. A confirmation OTP will be dispatched to your registered phone number prior to courier dispatch.
                  </p>
                </div>
              )}

              {/* Order Totals Summary */}
              <div className="p-4 bg-canvas-elevated border border-surface-border space-y-2 text-xs font-mono">
                <div className="flex justify-between text-text-secondary">
                  <span>Acquisition Subtotal:</span>
                  <span>{formatPrice(subtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Estimated Tax & Duties:</span>
                  <span>{estimatedTaxUSD > 0 ? formatPrice(estimatedTaxUSD) : "INCLUDED (DDP)"}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>DHL Global Express Shipping:</span>
                  <span>{shippingUSD === 0 ? "COMPLIMENTARY" : formatPrice(shippingUSD)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium font-serif pt-2 border-t border-surface-border text-text-primary">
                  <span>Total Amount Authorized:</span>
                  <span className="font-mono">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="px-4 py-2.5 border border-surface-border text-xs font-mono uppercase flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? "SECURING HEIRLOOM..." : `AUTHORIZE ${formatPrice(totalUSD)}`}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED */}
          {step === "confirmed" && (
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-accent-zari/20 text-accent-zari-hover mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-text-tertiary block">
                  Heirloom Registry Reference: {confirmedOrderId}
                </span>
                <h3 className="font-serif text-3xl text-text-primary">
                  Welcome to the Rami Archive
                </h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed font-light">
                  Your piece has been recorded. Our master quality artisan is now inspecting your silk, hand-stitching your color-matched cotton fall, and preparing your acid-free cedarwood preservation chest.
                </p>
              </div>

              {/* Digital Certificate Box */}
              <div className="p-6 bg-canvas-elevated border border-surface-border text-left max-w-lg mx-auto space-y-4 rounded-xs">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-accent-zari" />
                    <span className="font-serif text-base text-text-primary">
                      Digital Loom Certificate Assigned
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-text-primary text-canvas-base px-2 py-0.5 uppercase">
                    AUTHENTICATED
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Acquired By:</span>
                    <span className="text-text-primary font-medium">{fullName || "Valued Connoisseur"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Silk Mark License:</span>
                    <span className="text-text-primary">SMOI-CENTRAL-2026-REG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Insured Courier:</span>
                    <span className="text-text-primary font-medium">DHL Global Air Express (Tracking Pending)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Dispatch Status:</span>
                    <span className="text-accent-zari-hover font-medium">In Atelier Finishing (48 Hours)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 bg-text-primary text-canvas-base text-xs font-mono tracking-widest uppercase hover:bg-accent-zari hover:text-text-primary transition-colors"
                >
                  RETURN TO ATELIER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
