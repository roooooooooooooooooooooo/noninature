import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/i18n/context';
import { AuthProvider } from '../lib/auth/context';
import { CartProvider } from '../lib/cart/context';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'NoniNature | 100% Pure Organic Noni Products Bangladesh (নোনি নেচার)',
  description:
    'NoniNature offers 100% pure organic Morinda Citrifolia noni juice, healthy tree seedlings, sun-dried noni slices, and botanical skincare in Bangladesh. Nationwide Cash on Delivery.',
  keywords: [
    'Noni fruit Bangladesh',
    'Organic Noni Juice',
    'Noni plant saplings',
    'Morinda Citrifolia',
    'নোনি জুস বাংলাদেশ',
    'নোনি গাছ ও চারা',
    'নোনি ফল',
  ],
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-ivory text-botanicalDark">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <AnnouncementBar />
              <Header />
              <main className="flex-grow">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
