export interface Category { id: string; name: string; slug: string; image?: string; }

/**
 * Product variant — Shopify-style.
 * Money fields are integer cents. `costCents` and `supplierSku` are admin-only
 * and must never be exposed in customer-facing API responses.
 */
export interface ProductVariant {
  id: string;
  label: string;
  priceDelta?: number;
  /** Optional absolute price override in cents */
  price?: number;
  sku?: string;
  barcode?: string;
  inventoryQuantity?: number;
  weightGrams?: number;
  // Sourcing (admin-only)
  supplierId?: string;
  supplierSku?: string;
  costCents?: number;
}

export interface Product {
  id: string; title: string; slug: string; description: string; categoryId: string;
  images: string[]; price: number; compareAtPrice?: number; variants?: ProductVariant[];
  status: 'active' | 'draft' | 'archived';
  benefits?: string[]; whatsIncluded?: string[]; faq?: { q: string; a: string }[];

  // Shopify-style merchandising
  vendor?: string;
  productType?: string;
  tags?: string[];
  rating?: number;        // 0–5, used for storefront review stars
  reviewCount?: number;
  badge?: string;         // e.g. "Best seller", "New" — shown as a card pill

  // Sourcing / customs (admin-only, used by suppliers + shipping calc)
  supplierId?: string;
  supplierSku?: string;
  costCents?: number;
  customsValueCents?: number;
  hsCode?: string;
  originCountry?: string;        // ISO alpha-2, e.g. "CN"
  weightGrams?: number;
  dimensionsCm?: { l: number; w: number; h: number };
  hazmat?: boolean;
  qcChecklist?: string[];

  // Pricing safety flags (set by margin guardrail / supplier price changes)
  pendingPriceReview?: boolean;
  lastCostChangeAt?: number;
}

export interface CartItem { productId: string; variantId?: string; title: string; image?: string; unitPrice: number; quantity: number; }

/**
 * Supplier — sourcing + vetting record, admin-readable only.
 * Stored at /suppliers/{id}; vetting docs in /suppliers/{id}/vetting/*.
 * Customer-facing surfaces must never expose any field on this type.
 */
export interface Supplier {
  id: string;
  name: string;
  legalEntityName?: string;
  businessLicenseNumber?: string;

  contactEmail: string;
  contactName?: string | null;
  phone?: string;
  chatChannel?: 'wechat' | 'whatsapp' | 'alibaba' | 'skype' | 'email';
  chatHandle?: string;
  timezone?: string;

  platform: 'alibaba' | 'aliexpress' | 'cjdropshipping' | 'private' | 'other';
  platformStoreUrl?: string;
  tradeAssurance?: boolean;
  goldSupplier?: boolean;
  yearsOnPlatform?: number;

  region: string;
  countryCode?: string;
  port?: string;

  // Commercial terms
  currency?: string;             // ISO 4217
  paymentTerms?: string;         // "T/T 30/70", "Trade Assurance", "PayPal"
  incoterms?: 'EXW' | 'FOB' | 'CIF' | 'DDP' | 'DAP';
  minimumOrderValueCents?: number;

  // Lead times (split — production vs shipping)
  defaultLeadTimeDays: number;
  shippingLeadTimeDays?: number;
  defaultShippingMethod?: string;

  // Sample workflow
  sampleCostCents?: number;
  sampleLeadTimeDays?: number;
  sampleReceived?: boolean;

  // Compliance
  certifications?: string[];     // ["CE","FDA","CPSIA","REACH","FCC","ISO9001"]

  // Performance / scorecard
  active: boolean;
  totalOrdersFulfilled?: number;
  defectRatePct?: number;
  onTimeShipPct?: number;
  refundRatePct?: number;
  scorecard?: number;

  notes?: string | null;
  createdAt?: number;
  updatedAt?: number;
}
