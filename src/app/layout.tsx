import type { Metadata } from "next";
import "./globals.css";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IVP Africa | Talent Placement Platform",
  description: "Connecting qualified talent with employers across Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lg:h-full antialiased">
      <body className="flex flex-col font-sans lg:min-h-full">{children}</body>
    </html>
  );
}