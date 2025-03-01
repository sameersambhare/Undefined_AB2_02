import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import UIProviders from './providers/ui-providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Metadata for the application
export const metadata: Metadata = {
  title: 'SnapUI - AI-Powered UI Design Tool',
  description: 'Create beautiful user interfaces with SnapUI, an AI-powered design tool that helps designers and developers build stunning UIs with drag-and-drop simplicity',
  keywords: 'UI design, AI design tool, user interface, web design, drag and drop, component library, React components, UI components, design system, frontend development',
  authors: [{ name: 'SnapUI Team' }],
  creator: 'SnapUI',
  publisher: 'SnapUI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snapuiux.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SnapUI - AI-Powered UI Design Tool',
    description: 'Create beautiful user interfaces with SnapUI, an AI-powered design tool that helps designers and developers build stunning UIs with drag-and-drop simplicity',
    url: 'https://snapuiux.vercel.app',
    siteName: 'SnapUI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SnapUI - AI-Powered UI Design Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapUI - AI-Powered UI Design Tool',
    description: 'Create beautiful user interfaces with SnapUI, an AI-powered design tool that helps designers and developers build stunning UIs',
    images: ['/twitter-image.jpg'],
    creator: '@snapui',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'technology',
}

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col">
        <UIProviders>
          {/* We don't include Navbar and Footer here because they're client components 
              and should be included in each page to avoid hydration issues */}
          {children}
        </UIProviders>
      </body>
    </html>
  )
}
