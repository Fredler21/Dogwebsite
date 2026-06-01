export interface Category { id: string; name: string; slug: string; image?: string; }
export interface ProductVariant { id: string; label: string; priceDelta?: number; }
export interface Product {
  id: string; title: string; slug: string; description: string; categoryId: string;
  images: string[]; price: number; compareAtPrice?: number; variants?: ProductVariant[];
  status: 'active' | 'draft' | 'archived';
  benefits?: string[]; whatsIncluded?: string[]; faq?: { q: string; a: string }[];
}
export interface CartItem { productId: string; variantId?: string; title: string; image?: string; unitPrice: number; quantity: number; }
