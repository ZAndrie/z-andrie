import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://z-andrie.vercel.app"),
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
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import SitePreloader from "@/components/SitePreloader";
import { preloaderInitScript } from "@/lib/preloader";
import { ScrollProgress, BackToTop } from "@/components/ClientUtilities";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether the intro plays (once per session). */}
        <script dangerouslySetInnerHTML={{ __html: preloaderInitScript }} />
        <noscript>
          <style>{`.site-preloader{display:none!important}html{overflow:auto!important}`}</style>
        </noscript>
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
      <body className={`${inter.variable} ${playfair.variable} bg-[var(--color-light-bg)] text-[var(--color-text-dark)] font-sans antialiased flex flex-col min-h-[100dvh] overflow-x-hidden relative`}>
        {/* Architectural Backdrop Grid (Driezie Blueprint) */}
        <div className="grid-backdrop pointer-events-none fixed inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
          <div className="max-w-[1400px] h-full mx-auto px-[5%] md:px-[8%] relative">
            <span className="absolute top-0 bottom-0 left-[5%] md:left-[8%] w-[1px] bg-[var(--color-border)]/60"></span>
            <span className="absolute top-0 bottom-0 left-[33.333%] w-[1px] bg-[var(--color-border)]/40 hidden md:block"></span>
            <span className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-[var(--color-border)]/45"></span>
            <span className="absolute top-0 bottom-0 left-[66.666%] w-[1px] bg-[var(--color-border)]/40 hidden md:block"></span>
            <span className="absolute top-0 bottom-0 right-[5%] md:right-[8%] w-[1px] bg-[var(--color-border)]/60"></span>
          </div>
        </div>

        {/* Subtle Paper Grain Texture */}
        <div className="grain-overlay pointer-events-none fixed inset-0 z-[999] opacity-80" aria-hidden="true" />

        <SitePreloader />
        <SmoothScroll />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden relative z-10">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
