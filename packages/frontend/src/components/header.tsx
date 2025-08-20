'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 ease-macos",
      scrolled 
        ? "bg-glass/80 backdrop-blur-xl border-b border-glass-border shadow-glass" 
        : "bg-transparent"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 animate-glow" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Bypass Tool Pro
              </h1>
              <p className="text-xs text-foreground-secondary font-medium">
                SEO Tracking Suite
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#projects" 
              className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors duration-200 ease-macos"
            >
              Projects
            </a>
            <a 
              href="#analytics" 
              className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors duration-200 ease-macos"
            >
              Analytics
            </a>
            <a 
              href="#settings" 
              className="text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors duration-200 ease-macos"
            >
              Settings
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors duration-200 ease-macos">
              Help
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-all duration-200 ease-macos hover:shadow-macos-hover transform hover:scale-105">
              Upgrade Pro
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
