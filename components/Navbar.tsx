'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { signOut, useSession } from 'next-auth/react'
import { Activity, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Medicine Search' },
  { href: '/appointments', label: 'Appointments' },
]

export default function Navbar() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const handleAuthClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) return
    event.preventDefault()
    void signOut({ callbackUrl: '/' })
  }

  useEffect(() => {
    // GSAP entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo(logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 0.5 }
      )
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <div ref={logoRef}>
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <Activity size={18} className="text-white" />
                </div>
                <span className="font-display text-xl font-bold text-sage-800">Shifa <span className="text-sage-500">AI</span></span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-sage-700 active'
                      : 'text-sage-500 hover:text-sage-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" onClick={handleAuthClick} className="btn-ghost text-sm py-2 px-4">
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </Link>
              </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 rounded-lg text-sage-700 hover:bg-sage-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 glass shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-sage-100 text-sage-800'
                    : 'text-sage-600 hover:bg-sage-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col gap-2">
              <Link
                href="/"
                onClick={(event) => {
                  setMenuOpen(false)
                  handleAuthClick(event)
                }}
                className="btn-ghost w-full justify-center text-sm"
              >
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
