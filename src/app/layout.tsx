import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://z-andrie.vercel.app"),
  title: "Z Andrie | Creative Developer & Full-Stack Technologist",
  description: "Portfolio of Z Andrie, a creative developer from the Philippines building immersive WebGL experiences, 3D websites, and modern web applications.",
  keywords: [
    "Z Andrie",
    "Creative Developer",
    "Full-Stack Developer",
    "Three.js",
    "WebGL",
    "GSAP",
    "React 19",
    "Next.js",
    "Philippines",
    "Interactive Portfolio",
  ],
  authors: [{ name: "Z Andrie", url: "https://z-andrie.vercel.app" }],
  creator: "Z Andrie",
  openGraph: {
    title: "Z Andrie | Creative Developer & Full-Stack Technologist",
    description: "Immersive WebGL room with aiming spotlight physics, vertical scrub showcase, dynamic odometer rolls, and high-velocity systems.",
    type: "website",
    url: "/",
    siteName: "Z Andrie Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z Andrie | Creative Developer & Full-Stack Technologist",
    description: "Immersive WebGL room with aiming spotlight physics, vertical scrub showcase, dynamic odometer rolls, and high-velocity systems.",
    creator: "@ZAndrie",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Z Andrie",
  jobTitle: "Creative Developer & Full-Stack Technologist",
  url: "https://z-andrie.vercel.app",
  address: {
    "@type": "PostalAddress",
    addressCountry: "Philippines",
  },
  sameAs: [
    "https://github.com/ZAndrie",
  ],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Three.js",
    "WebGL",
    "GSAP",
    "Tailwind CSS",
    "PHP",
  ],
};

import {
  Navbar,
  Footer,
  CustomCursor,
  SmoothScroll,
  SitePreloader,
  ScrollProgress,
  BackToTop,
} from "@/components";
import { preloaderInitScript } from "@/lib/preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Decides before first paint whether the intro plays (once per session). */}
        <script dangerouslySetInnerHTML={{ __html: preloaderInitScript }} />
        <noscript>
          <style>{`.site-preloader{display:none!important}html{overflow:auto!important}`}</style>
        </noscript>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil:opsz,wght@10..72,400..800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Silkscreen:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-[var(--color-light-bg)] text-[var(--color-text-dark)] font-sans antialiased flex flex-col min-h-[100dvh] overflow-x-clip relative`}>
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
        <main className="flex-1 flex flex-col w-full overflow-x-clip relative z-10">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}