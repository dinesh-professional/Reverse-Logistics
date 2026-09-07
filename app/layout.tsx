import './globals.css'
import type { Metadata } from 'next'
import MotionBackground from '../components/MotionBackground'

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="text-[#F1F5F9] font-sans antialiased min-h-screen relative flex flex-col overflow-x-hidden">
        {/* Animated Motion Background System */}
        <div className="vortex-bg" aria-hidden="true">
          <div className="aurora-beam aurora-beam-1" />
          <div className="aurora-beam aurora-beam-2" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
          <div className="orb orb-5" />
          <div className="orb orb-6" />
          <div className="orb orb-7" />
        </div>
        <div className="grid-overlay" aria-hidden="true" />
        <div className="scanline-overlay" aria-hidden="true" />

        {/* Real-time Interactive Motion Canvas (Particles, Constellations, Fluid Cyber Waves) */}
        <MotionBackground />

        {/* Main Application Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}