import './globals.css'
import type { Metadata } from 'next'
import UIProviders from './providers/ui-providers'

export const metadata: Metadata = {
  title: 'UI Designer with AI Integration',
  description: 'A modern UI designer with AI integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UIProviders>
          {children}
        </UIProviders>
      </body>
    </html>
  )
}
