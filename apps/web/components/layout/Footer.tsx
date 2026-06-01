import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 p-8 text-sm md:grid-cols-4">
        <div>
          <div className="font-bold">Dogvanta</div>
          <p className="mt-2 text-slate-600">Useful products, delivered.</p>
        </div>
        <div>
          <div className="font-semibold">Shop</div>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><Link href="/shop">All products</Link></li>
            <li><Link href="/collections/phone-holders">Phone holders</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Help</div>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><Link href="/track-order">Track order</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Policies</div>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li><Link href="/shipping-policy">Shipping</Link></li>
            <li><Link href="/return-policy">Returns</Link></li>
            <li><Link href="/privacy-policy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 p-4 text-center text-xs text-slate-500">© Dogvanta</div>
    </footer>
  );
}
