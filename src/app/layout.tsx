import type { Metadata, Viewport } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import CartDrawer from "@/components/CartDrawer";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sherred & Sons — Handcrafted Walking Sticks & Shillelaghs",
    template: "%s · Sherred & Sons",
  },
  description:
    "Handmade walking sticks, traditional Irish blackthorn shillelaghs, dress canes and support sticks — shaped the old way and finished by hand.",
};

export const viewport: Viewport = {
  themeColor: "#0b0c0a",
  // Keep the layout fixed — no pinch/zoom.
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <NewsletterSignup />
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
