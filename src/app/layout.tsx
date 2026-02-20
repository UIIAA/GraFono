import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://gracielefono.com.br"),
  title: "GracieleFono | Graciele Costa - Fonoaudiologia Infantil",
  description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil para desenvolvimento da fala, linguagem e expressão com confiança e alegria.",
  keywords: ["fonoaudiologia infantil", "desenvolvimento da fala", "linguagem infantil", "Graciele Costa", "GracieleFono", "atraso na fala", "trocas de sons", "gagueira infantil", "Barueri", "Bethaville"],
  authors: [{ name: "Graciele Costa - GracieleFono" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "GracieleFono | Graciele Costa - Fonoaudiologia Infantil",
    description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil.",
    url: "https://gracielefono.com.br",
    siteName: "GracieleFono",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GracieleFono - Fonoaudiologia Infantil Especializada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GracieleFono | Graciele Costa - Fonoaudiologia Infantil",
    description: "Transformando vidas através da comunicação. Atendimento especializado em fonoaudiologia infantil.",
    images: ["/og-image.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
};

// JSON-LD Structured Data - static content, safe for inline rendering
const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GracieleFono - Graciele Costa",
  description: "Fonoaudiologia infantil especializada em desenvolvimento da fala, linguagem e comunicacao.",
  url: "https://gracielefono.com.br",
  telephone: "+55-11-99155-6534",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Trindade, 254 - Sala 710, Bethaville I",
    addressLocality: "Barueri",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  priceRange: "$$",
  image: "https://gracielefono.com.br/og-image.png",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script type="application/ld+json">{jsonLdString}</script>
      </head>
      <body
        className={`antialiased bg-background text-foreground`}
      >
        {children}
        {/* <Toaster /> */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
