import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://website-portfolio-murex-eight.vercel.app"),
  title: "Z Andrie | Professional Web Developer & Designer",
  description: "I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful. View my portfolio.",
  keywords: ["web developer", "portfolio", "web design", "full stack developer", "Z Andrie", "UI/UX", "frontend developer"],
  authors: [{ name: "Z Andrie" }],
  creator: "Z Andrie",
  openGraph: {
    title: "Z Andrie | Professional Web Developer & Designer",
    description: "I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful.",
    type: "website",
    url: "/",
    siteName: "Z Andrie Portfolio",
    images: [{
      url: "/image.jpg", // Update this to a real 1200x630 banner later
      width: 1200,
      height: 630,
      alt: "Z Andrie Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Z Andrie | Professional Web Developer & Designer",
    description: "I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful.",
    images: ["/image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Preloader, ScrollProgress, BackToTop } from "@/components/ClientUtilities";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        
        {/* Google Analytics Placeholder - Replace G-XXXXXXXXXX with your actual Measurement ID when ready */}
        {/*
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        */}
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-[var(--color-light-bg)] text-[var(--color-text-dark)] font-sans antialiased flex flex-col min-h-[100dvh]`}>
        <Preloader />
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
