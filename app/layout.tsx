import './globals.css'
import { Inter } from 'next/font/google'
import UIProviders from './providers/ui-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UI Builder',
  description: 'Build beautiful UIs with drag and drop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <UIProviders>{children}</UIProviders>
      </body>
    </html>
  )
}
