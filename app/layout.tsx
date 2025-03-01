import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import UIProviders from './providers/ui-providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Metadata for the application
export const metadata: Metadata = {
  title: 'UI Designer with AI Integration',
  description: 'A modern UI designer with AI integration',
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
