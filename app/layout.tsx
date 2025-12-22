import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "CookinFlips | Powered by SaintSal.ai + FlipEffective",
  description:
    "$3B+ in managed assets. $1B+ capital raised. 51 states. The nation's premier real estate investment firm powered by SaintSal™ AI. Wholesale, lending, investing, and brokerage services. Led by CEO Darren Brown and Founder Ryan Capatosto.",
  keywords:
    "real estate investment, wholesale properties, fix and flip loans, DSCR loans, commercial lending, distressed assets, SaintSal AI, SaintSal.ai, CookinFlips, FlipEffective, Darren Brown, Ryan Capatosto, JR Taber, Orange County real estate, affiliate program",
  authors: [
    { name: "Ryan Capatosto - Founder & Creator" },
    { name: "Darren Brown - CEO FlipEffective" },
    { name: "JR Taber - President" },
  ],
  openGraph: {
    title: "CookinFlips | Powered by SaintSal.ai + FlipEffective",
    description:
      "$3B+ in managed assets. The nation's premier real estate investment firm powered by SaintSal™ AI. Led by CEO Darren Brown.",
    url: "https://cookinflips.com",
    siteName: "CookinFlips",
    images: [
      {
        url: "/images/SAINTSALCOOKINKNOWELEDGENEON.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CookinFlips | Powered by SaintSal.ai + FlipEffective",
    description: "$3B+ in managed assets. The nation's premier real estate investment firm powered by SaintSal™ AI.",
    images: ["/images/SAINTSALCOOKINKNOWELEDGENEON.png"],
  },
  icons: {
    icon: "/images/TRANSPARENTSAINTSALLOGO.png",
    apple: "/images/TRANSPARENTSAINTSALLOGO.png",
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#d4af37",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Apollo.io Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
              o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
              o.onload=function(){window.trackingFunctions.onLoad({appId:"67f847b15d4e8f0011b44c34"})},
              document.head.appendChild(o)}initApollo();
            `,
          }}
        />
        {/* GHL Tracking */}
        <script
          src="https://link.msgsndr.com/js/external-tracking.js"
          data-tracking-id="tk_536af3445cba47f7bccd6946e71526bc"
          async
        />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>

        <main className="relative z-10">{children}</main>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  )
}
