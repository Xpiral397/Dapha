import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DHAP - Dynamic Holistic Assistance Platform",
  description:
    "Transforming Lives, One Soul at a Time. Christ-centered digital platform for emotional, spiritual, mental, academic, financial, and social wellness.",
  keywords: "mental health, spiritual wellness, journal, counseling, life coaching, Christian platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
