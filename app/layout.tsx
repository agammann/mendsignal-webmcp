import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { WebMcpProvider } from '@/components/webmcp-provider';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mendsignal.alx21.chatgpt.site'),
  title: 'MendSignal — The open repair memory',
  description: 'Search real repair outcomes, troubleshoot with your AI agent, and contribute what worked back to the open web.',
  openGraph: {
    title: 'MendSignal — The open repair memory',
    description: 'Humans test the fix. Agents remember what worked.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'MendSignal repair evidence network' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MendSignal — The open repair memory',
    description: 'Humans test the fix. Agents remember what worked.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <WebMcpProvider />
      </body>
    </html>
  );
}
