import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sacred Dust Editor",
  description: "A WebGL sacred dust particle editor for z33energy and Akult Inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-hidden">{children}</body>
    </html>
  );
}
