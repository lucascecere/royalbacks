import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['700', '900'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://royalbacks.com'),
  title: {
    default: 'Royal Backs | Custom Hats & Embroidery, Milton MA',
    template: '%s | Royal Backs',
  },
  description:
    'Custom hats, apparel, and embroidery services in Milton, MA. Serving the South Shore since 2017.',
  icons: {
    icon: '/brand/royalbacks logo 2.jpeg',
    apple: '/brand/royalbacks logo 2.jpeg',
  },
  openGraph: {
    siteName: 'Royal Backs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Royal Backs',
  url: 'https://royalbacks.com',
  email: 'info@royalbacks.com',
  foundingDate: '2017',
  areaServed: 'South Shore Massachusetts',
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Royal Backs',
  url: 'https://royalbacks.com',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]),
          }}
        />
      </head>
      <body>
        {children}
        <Script
          defer
          data-domain="royalbacks.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
