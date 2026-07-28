import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReverseLogistics.AI — AI-Powered Return Fraud Detection & Automated Logistics',
  description: 'Next-generation AI reverse logistics platform featuring automated photo verification, visual fraud inspection, and intelligent return rerouting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F8F9FA] text-slate-900 font-sans antialiased min-h-screen relative overflow-hidden flex">
        {children}
      </body>
    </html>
  )
}
