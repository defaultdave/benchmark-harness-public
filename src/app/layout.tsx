import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dependency Benchmark Harness",
  description: "Side-by-side comparison of frontend dependencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
