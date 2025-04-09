import type { Metadata } from 'next'
import { ReactNode } from 'react'
import DashNavBar from '@/components/DashNavBar'

export const metadata: Metadata = {
  title: 'Painel do Estabelecimento',
  description: 'Gerencie seu restaurante com eficiência',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        <DashNavBar />
        <main className="min-h-screen px-2 sm:px-4 pt-4 bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  )
}
