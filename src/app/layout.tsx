import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Recommendation App',
  description: 'Discover and book personalized travel experiences',
  keywords: 'travel, recommendations, booking, experiences, vacation',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <main className="min-h-screen bg-background flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
} 