import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import CRBar from "@/components/layout/CRBar";
import CreditsBar from "@/components/layout/CreditsBar";
import Footer from "@/components/layout/Footer";
import JavariWidget from '@/components/JavariWidget';

const inter = Inter({ subsets: ["latin"] });

/**
 * Viewport configuration for mobile-first design
 * CRITICAL: Prevents iOS zoom, enables proper mobile scaling
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility, but controlled
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
}

export const metadata: Metadata = {
  title: "CR AudioViz AI - Create Apps, Games, Websites & More with AI",
  description: "Empower your creativity with 60+ AI-powered tools, 1200+ games, and Javari AI assistant. Build apps, websites, games, and digital content with no coding required.",
  keywords: "AI tools, app builder, game creator, website builder, Javari AI, no-code platform, creative tools",
  authors: [{ name: "CR AudioViz AI, LLC" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CR AudioViz AI',
    title: 'CR AudioViz AI - Your Story. Our Design.',
    description: 'Create apps, games, and websites with AI-powered tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CR AudioViz AI',
    description: 'Create apps, games, and websites with AI-powered tools',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {/* Mobile-optimized header */}
        <Header />
        
        {/* Top bars */}
        <CRBar />
        <CreditsBar />
        
        {/* Main content with safe area insets for notch devices */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Javari widget */}
        <JavariWidget />
      </body>
    </html>
  );
}
