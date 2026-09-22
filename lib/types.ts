export interface Colorway {
  id: string;
  name: string;
  hex: string;
  weftHex: string;
  zariHex: string;
}

export interface WeaveSpecs {
  gsm: number;
  weightGrams: number;
  warpCount: string;
  weftCount: string;
  composition: string;
  loomType: string;
  originRegion: string;
  zariPurity: string;
  weaveTimeDays: number;
  transparency: "Gossamer" | "Semi-Sheer" | "Opaque Architectural" | "Luminous Drape";
  dimensions: {
    sareeLengthMeters: number;
    sareeWidthInches: number;
    blouseLengthMeters: number;
  };
}

export interface ArtisanProvenance {
  masterArtisan: string;
  lineage: string;
  villageCluster: string;
  loomHeritage: string;
  completionDate: string;
  portraitUrl?: string;
  quote?: string;
}

export interface TrustCertification {
  silkMarkLicenseNo: string;
  silkMarkCertified: boolean;
  zariSilverPercentage: number;
  zariLabReportUrl?: string;
  handloomMarkCertified: boolean;
  craftClusterRegNo: string;
}

export interface BlouseOption {
  id: string;
  title: string;
  priceUSD: number;
  fabric: string;
  image: string;
}

export type FallPicoType = "hand-stitched-free" | "silk-rolled" | "unaltered";

export type BlouseNeckline =
  | "boat-neck"
  | "deep-round"
  | "sweetheart"
  | "square"
  | "high-collar";

export type BlouseSleeve =
  | "elbow-length"
  | "sleeveless"
  | "cap-sleeve"
  | "full-length";

export type BlouseBack =
  | "deep-u-potli"
  | "dori-tie-up"
  | "backless-tassels"
  | "classic-hook";

export type BlouseLining = "mul-mul-cotton" | "pure-silk" | "padded-cups";

export interface BlouseMeasurements {
  standardSize?: "XS (32)" | "S (34)" | "M (36)" | "L (38)" | "XL (40)" | "XXL (42)" | "Custom";
  bust?: number;
  underBust?: number;
  waist?: number;
  shoulder?: number;
  sleeveLength?: number;
  frontNeckDepth?: number;
  backNeckDepth?: number;
}

export interface BlouseCustomization {
  enabled: boolean;
  styleOption: "unstitched" | "custom-tailored";
  neckline?: BlouseNeckline;
  sleeve?: BlouseSleeve;
  back?: BlouseBack;
  lining?: BlouseLining;
  measurements?: BlouseMeasurements;
  priceUSD: number;
}

export interface PetticoatCustomization {
  enabled: boolean;
  type: "satin-shaper" | "cotton-traditional";
  waistSize: "S" | "M" | "L" | "XL";
  priceUSD: number;
}

export interface TasselCustomization {
  enabled: boolean;
  type: "hand-knotted-silk" | "pearl-beaded";
  priceUSD: number;
}

export interface PrePleatedCustomization {
  enabled: boolean;
  waistInches: number;
  heightFeet: string;
  priceUSD: number;
}

export interface SareeCustomizations {
  fallPico: FallPicoType;
  blouse: BlouseCustomization;
  petticoat?: PetticoatCustomization;
  tassels?: TasselCustomization;
  prePleated?: PrePleatedCustomization;
}

export interface CustomerReview {
  id: string;
  author: string;
  verified: boolean;
  location: string;
  rating: number;
  date: string;
  occasion: string;
  height: string;
  reviewText: string;
  photoUrl?: string;
}

export interface SareeProduct {
  id: string;
  slug: string;
  title: string;
  culturalName: string;
  subTitle: string;
  editionNumber: string;
  totalPieces: number;
  priceUSD: number;
  badge?: string;
  colorways: Colorway[];
  specs: WeaveSpecs;
  provenance: ArtisanProvenance;
  certification: TrustCertification;
  description: string;
  philosophy: string;
  auspiciousOccasions: string[];
  images: {
    hero: string;
    drape: string;
    macro: string;
    detail: string;
    palluSpread?: string;
    modelDrape?: string;
    unboxing?: string;
  };
  videoUrls?: {
    drapeWalkthrough?: string;
    loomProcess?: string;
  };
  blouseOption: BlouseOption;
  reviews: CustomerReview[];
}

export interface CartItem {
  id: string;
  product: SareeProduct;
  selectedColorway: Colorway;
  withBlouse: boolean;
  customizations?: SareeCustomizations;
  quantity: number;
  unitPriceUSD: number;
}

export type CurrencyCode = "USD" | "INR" | "GBP" | "EUR" | "AED";

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
}

export interface OrderConfirmationData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotalUSD: number;
  dutiesUSD: number;
  shippingUSD: number;
  totalUSD: number;
  currency: CurrencyCode;
  paymentMethod: string;
  dhlTrackingNumber: string;
  loomCertificateIds: string[];
}
