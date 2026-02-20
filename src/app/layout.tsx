import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoothIQ - Political Intelligence Platform",
  description:
    "The premium AI-driven political intelligence platform for Indian democracy. Gain the winning edge with hyper-local data, predictive modeling, and real-time booth management.",
  keywords: [
    "booth management",
    "political intelligence",
    "voter analytics",
    "knowledge graph",
    "election technology",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-dark text-cream font-display min-h-screen flex flex-col antialiased relative" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
