import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: { default: 'Allyoucanuse — Useful products, delivered', template: '%s | Allyoucanuse' },
  description: 'Practical car accessories you will actually use. Honest shipping, real support.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
