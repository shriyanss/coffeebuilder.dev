import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#6F4E37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Coffee Builder - Build Your Perfect Cup",
    template: "%s | Coffee Builder",
  },
  description: "Discover and build your perfect coffee based on your preferences. Choose grind size, milk, temperature, and cup type to find your ideal brew.",
  keywords: ["coffee", "coffee builder", "coffee recipes", "espresso", "latte", "cappuccino", "barista tools", "coffee guide", "brewing methods"],
  authors: [{ name: "Coffee Builder Team" }],
  creator: "Coffee Builder",
  metadataBase: new URL("https://coffeebuilder.dev"),
  openGraph: {
    title: "Coffee Builder - Build Your Perfect Cup",
    description: "Discover and build your perfect coffee based on your preferences. Expert recipes for Espresso, Latte, Cold Brew, and more.",
    url: "https://coffeebuilder.dev",
    siteName: "Coffee Builder",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // We should probably create this or at least define the path
        width: 1200,
        height: 630,
        alt: "Coffee Builder App Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee Builder - Build Your Perfect Cup",
    description: "Discover and build your perfect coffee based on your preferences.",
    images: ["/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
