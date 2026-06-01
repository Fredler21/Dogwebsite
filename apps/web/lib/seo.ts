/** Build Product JSON-LD for a PDP. */
export function productJsonLd(p: {
  id: string; title: string; description: string;
  imageUrls: string[]; price: number; currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  url: string;
}): string {
  const AV: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder'
  };
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.description,
    image: p.imageUrls,
    sku: p.id,
    offers: {
      '@type': 'Offer',
      url: p.url,
      priceCurrency: p.currency,
      price: (p.price / 100).toFixed(2),
      availability: AV[p.availability]
    }
  });
}
