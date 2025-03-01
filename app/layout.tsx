import './globals.css'
import type { Metadata } from 'next'
import UIProviders from './providers/ui-providers'

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
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
        <UIProviders>
          {children}
        </UIProviders>
      </body>
    </html>
  )
}
