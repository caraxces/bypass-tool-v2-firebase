import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bypass Tool Pro - SEO Keyword Tracking Tool',
  description: 'Professional SEO keyword tracking and ranking monitoring tool with macOS-inspired design',
  keywords: 'SEO, keyword tracking, Google ranking, website monitoring',
  authors: [{ name: 'Bypass Tool Pro Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        <div className="relative min-h-screen">
          {/* Background Pattern */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,122,255,0.03),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,199,89,0.02),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,149,0,0.02),transparent_50%)]" />
          </div>
          
          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="relative z-10 mt-auto py-6 text-center text-sm text-foreground-secondary">
            <div className="mx-auto max-w-7xl px-4">
              <p className="font-medium">
                Built with ❤️ using Next.js, Tailwind CSS, and Fastify
              </p>
              <p className="mt-1 text-xs">
                © 2024 Bypass Tool Pro. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
