import type { Metadata } from "next";

import { Geist, Geist_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import StoreSettingsHead from "@/components/StoreSettingsHead";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost";
  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  return {
    title: "Mundo Web",
    description: "Tienda de tecnología",
    icons: {
      icon: isLocal
        ? "/favicon.ico"
        : "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">

        <CartProvider>
          <FavoritesProvider>
            <StoreSettingsProvider>
              <StoreSettingsHead />

              {children}

            </StoreSettingsProvider>
          </FavoritesProvider>
        </CartProvider>

        <Toaster />

      </body>
    </html>
  );
}