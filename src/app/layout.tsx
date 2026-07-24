import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
