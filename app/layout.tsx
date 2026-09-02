import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { WebMcpProvider } from '@/components/webmcp-provider';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://pulse.alx21.chatgpt.site'),
  title: 'Pulse — The open repair memory',
  description: 'Search real repair outcomes, troubleshoot with your AI agent, and contribute what worked back to the open web.',
  applicationName: 'Pulse',
  alternates: { canonical: '/' },
  keywords: ['repair evidence', 'right to repair', 'WebMCP', 'human in the loop', 'AI agents'],
  openGraph: {
    title: 'Pulse — The open repair memory',
    description: 'Humans test the fix. Agents remember what worked.',
    type: 'website',
    url: '/',
    siteName: 'Pulse',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Pulse repair evidence network' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse — The open repair memory',
    description: 'Humans test the fix. Agents remember what worked.',
    images: ['/og.png'],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pulse',
  url: 'https://pulse.alx21.chatgpt.site/',
  description: 'An open repair memory where people and AI agents search, test, and contribute structured repair evidence.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any modern web browser',
  isAccessibleForFree: true,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <WebMcpProvider />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
