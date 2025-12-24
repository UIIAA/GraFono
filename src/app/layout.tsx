import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grafono - Fonoaudiologia Infantil | Graciele Costa",
  description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil para desenvolvimento da fala, linguagem e expressão com confiança e alegria.",
  keywords: ["fonoaudiologia infantil", "desenvolvimento da fala", "linguagem infantil", "Graciele Costa", "Grafono", "atraso na fala", "trocas de sons", "gagueira infantil"],
  authors: [{ name: "Graciele Costa - Grafono" }],
  openGraph: {
    title: "Grafono - Fonoaudiologia Infantil | Graciele Costa",
    description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil.",
    url: "https://grafono.com.br",
    siteName: "Grafono",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grafono - Fonoaudiologia Infantil | Graciele Costa",
    description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
