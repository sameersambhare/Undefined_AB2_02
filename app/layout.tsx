import './globals.css'
import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
