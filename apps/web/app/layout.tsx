import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allyoucanuse — useful products, delivered',
  description: 'Practical products for everyday life. Cars, home, and more.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
