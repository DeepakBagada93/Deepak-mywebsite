import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://saasnext.app'),
  title: 'Hardened SaaS Application',
  description: 'Production-ready SaaS with hardened billing and auth.',
  openGraph: {
    title: 'Hardened SaaS Application',
    description: 'Production-ready SaaS with hardened billing and auth.',
    url: 'https://saasnext.app',
    siteName: 'Hardened SaaS',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hardened SaaS Application',
    description: 'Production-ready SaaS with hardened billing and auth.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
