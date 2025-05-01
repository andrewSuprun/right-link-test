import './globals.css';
import type { Metadata } from 'next';
import { Unbounded } from 'next/font/google';

const inter = Unbounded({
  subsets: ['latin'], // or ['cyrillic'], depending on your needs
});

export const metadata: Metadata = {
  title: 'Test Catalog',
  description: 'Lot catalog with filters and pagination',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
