import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import PageScroller from '../components/PageScroller';

export const metadata: Metadata = {
  title: 'Virsaa Gifts | Sustainable & Customizable Corporate Gifting',
  description: 'Gifts That Carry Your Story. Handcrafted sustainable corporate gifts using reclaimed wood, cork, bamboo, and preserved moss art. Personalized Indian craftsmanship.',
  keywords: ['corporate gifts India', 'sustainable gifts', 'preserved moss art', 'custom wooden corporate gifts', 'cork accessories', 'bamboo stationery'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#FAF8F5] text-[#1C1917]">
        <AuthProvider>
          <PageScroller>{children}</PageScroller>
        </AuthProvider>
      </body>
    </html>
  );
}
