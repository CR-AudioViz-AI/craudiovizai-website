import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import CRBar from "@/components/layout/CRBar";
import CreditsBar from "@/components/layout/CreditsBar";
import Footer from "@/components/layout/Footer";
import { JavariProvider } from '@/contexts/javari-context';
import JavariFloatingButton from '@/components/javari-floating-button';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CR AudioViz AI - Create Apps, Games, Websites & More with AI",
  description: "Empower your creativity with 60+ AI-powered tools, 1200+ games, and Javari AI assistant. Build apps, websites, games, and digital content with no coding required.",
  keywords: "AI tools, app builder, game creator, website builder, Javari AI, no-code platform, creative tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JavariProvider>
          <Header />
          <CRBar />
          <CreditsBar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <JavariFloatingButton />
        </JavariProvider>
      </body>
    </html>
  );
}
