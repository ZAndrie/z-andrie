import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Z Andrie - Portfolio",
  description: "Professional Web Developer & Designer Portfolio",
  keywords: "web developer, portfolio, web design, full stack developer, Z Andrie",
  authors: [{ name: "Z Andrie" }],
  openGraph: {
    title: "Z Andrie - Portfolio",
    description: "Professional Web Developer & Designer",
    type: "website",
    url: "https://website-portfolio-murex-eight.vercel.app",
    images: ["https://website-portfolio-murex-eight.vercel.app/image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-[var(--color-light-bg)] text-[var(--color-text-dark)] font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
