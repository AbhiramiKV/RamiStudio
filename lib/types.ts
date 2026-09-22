export interface Colorway {
  id: string;
  name: string;
  hex: string;
  weftHex: string;
  zariHex: string;
}

export interface WeaveSpecs {
  gsm: number;
  warpCount: string;
  weftCount: string;
  composition: string;
  loomType: string;
  originRegion: string;
  zariPurity: string;
  weaveTimeDays: number;
  transparency: "Gossamer" | "Semi-Sheer" | "Opaque Architectural";
}

export interface BlouseOption {
  id: string;
  title: string;
  priceUSD: number;
  fabric: string;
  image: string;
}

export interface SareeProduct {
  id: string;
  slug: string;
  title: string;
  subTitle: string;
  editionNumber: string;
  totalPieces: number;
  priceUSD: number;
  badge?: string;
  colorways: Colorway[];
  specs: WeaveSpecs;
  description: string;
  philosophy: string;
  images: {
    hero: string;
    drape: string;
    macro: string;
    detail: string;
  };
  blouseOption: BlouseOption;
}

export interface CartItem {
  id: string;
  product: SareeProduct;
  selectedColorway: Colorway;
  withBlouse: boolean;
  quantity: number;
}

export type CurrencyCode = "USD" | "INR" | "GBP" | "EUR" | "AED";

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
}
