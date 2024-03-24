import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import 'react-photo-view/dist/react-photo-view.css'
import './globals.css'

import { Header } from '@/components/modules/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Backblaze Oss Interface',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="min-h-screen overflow-y-auto bg-[#fafafa] py-6 pt-20">
          {children}
        </div>
        <Toaster richColors />
      </body>
    </html>
  )
}