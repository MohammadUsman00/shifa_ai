'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import FlaticonIcon from '@/components/FlaticonIcon'
import {
  Activity, Search, Calendar, Shield, ArrowRight, ChevronRight,
  Microscope, HeartPulse, ClipboardList, Star, Check, Sparkles
} from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
  { icon: Search, title: 'Smart Medicine Search', desc: 'Search by name, symptom, or use voice input. Get complete drug information instantly.', color: '#527d56' },
  { icon: Microscope, title: 'Deep Drug Analysis', desc: 'Chemical composition, interactions, dosages and side effects — all in one view.', color: '#4a9e8e' },
  { icon: HeartPulse, title: 'Prescription Scanner', desc: 'Upload your prescription and extract medicine information automatically with AI.', color: '#e07b5a' },
  { icon: Calendar, title: 'Appointment Booking', desc: 'Find and book doctors nearby. Set reminders and manage your health schedule.', color: '#8b7fb8' },
  { icon: ClipboardList, title: 'Medication Reminders', desc: 'Never miss a dose. Smart reminders that adapt to your schedule and timezone.', color: '#527d56' },
  { icon: Shield, title: 'Privacy First', desc: 'Your health data stays yours. End-to-end encrypted and never sold to third parties.', color: '#4a9e8e' },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Patient', text: 'MedWise helped me understand my prescriptions so clearly. I feel informed and confident now.', rating: 5 },
  { name: 'Dr. Arjun Mehta', role: 'General Physician', text: 'I recommend this to all my patients. The drug info accuracy is impressive and the UI is beautiful.', rating: 5 },
  { name: 'Fatima Al-Rashid', role: 'Caregiver', text: 'Managing my mother\'s medications has never been easier. The reminders are a lifesaver.', rating: 5 },
]

const stats = [
  { value: '50K+', label: 'Medicines in database' },
  { value: '200K+', label: 'Active users' },
  { value: '99.9%', label: 'Uptime reliability' },
  { value: '4.9★', label: 'App store rating' },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero stagger entrance
      const tl = gsap.timeline({ delay: 0.3 })

      tl.fromTo(blobRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }
      )
      .fromTo(titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=1.0'
      )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )

      // Stats counter
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(statsRef.current?.children || [],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          )
        },
        once: true
      })

      // Features cascade
      const featureCards = featuresRef.current?.querySelectorAll('.feature-card') || []
      featureCards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(card,
              { y: 40, opacity: 0, scale: 0.97 },
              { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: (i % 3) * 0.08 }
            )
          },
          once: true
        })
      })

      // Parallax on blob
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(blobRef.current, { y: self.progress * 80 })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen noise-overlay">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background blobs */}
        <div ref={blobRef} className="absolute inset-0 pointer-events-none">
          <div className="blob absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-sage-200/40 opacity-60" />
          <div className="blob absolute bottom-[5%] left-[10%] w-[300px] h-[300px] bg-cream-300/60 opacity-40" style={{ animationDelay: '-3s' }} />
          <div className="blob absolute top-[40%] left-[40%] w-[200px] h-[200px] bg-sage-100/50 opacity-30" style={{ animationDelay: '-6s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Hero Text */}
          <div>
            <div className="pill bg-sage-100 text-sage-700 mb-6 inline-flex items-center gap-1.5">
              <Sparkles size={12} />
              AI-Powered Health Companion
            </div>

            <h1
              ref={titleRef}
              className="font-display hero-title text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-sage-900 mb-6"
            >
              Your medicine,{' '}
              <span className="gradient-text">understood.</span>
            </h1>

            <p ref={subtitleRef} className="text-sage-500 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
              Search any medicine by name or voice. Get real-time pricing, composition, dosage, and side-effect info — all in one beautiful interface.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
              <Link href="/dashboard" className="btn-primary text-base py-3.5 px-6">
                Search Medicines <ArrowRight size={16} />
              </Link>
              <Link href="/appointments" className="btn-ghost text-base py-3.5 px-6">
                Book Appointment <ChevronRight size={16} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {['#527d56', '#4a9e8e', '#e07b5a', '#8b7fb8', '#cab87e'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                    {['P', 'D', 'A', 'S', 'R'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-cream-500 text-cream-500" />
                  ))}
                </div>
                <p className="text-xs text-sage-400 mt-0.5">Trusted by 200K+ users</p>
              </div>
            </div>
          </div>

          {/* Right: Auth Card */}
          <div className="glass rounded-3xl p-8 shadow-xl border border-cream-200/60 card-lift">
            {/* Tab Toggle */}
            <div className="flex bg-cream-100 rounded-2xl p-1 mb-8">
              {(['signup', 'signin'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    authMode === mode
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-500 hover:text-sage-700'
                  }`}
                >
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-sage-600 mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    className="input-elegant"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-sage-600 mb-2 uppercase tracking-wide">Email</label>
                <input
                  className="input-elegant"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-600 mb-2 uppercase tracking-wide">Password</label>
                <input
                  className="input-elegant"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Link href="/dashboard" className="btn-primary w-full justify-center mt-2 text-sm py-3.5">
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-cream-200" />
              <span className="text-xs text-sage-300 font-medium">or continue with</span>
              <div className="h-px flex-1 bg-cream-200" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              {['Google', 'Apple'].map((p) => (
                <button key={p} className="btn-ghost text-sm py-2.5 justify-center">
                  <FlaticonIcon
                    icon={p === 'Google' ? 'fi-brands-google' : 'fi-brands-apple'}
                    className="text-sm"
                  />
                  {p}
                </button>
              ))}
            </div>

            {/* Features listed */}
            <div className="mt-6 pt-5 border-t border-cream-200">
              {['Free forever plan available', 'No credit card required', 'HIPAA-compliant & secure'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-sage-500 mt-2">
                  <Check size={13} className="text-sage-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="bg-sage-800 py-12">
        <div ref={statsRef} className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl lg:text-4xl font-bold text-cream-200 mb-1">{stat.value}</div>
              <div className="text-sage-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="pill bg-sage-100 text-sage-600 mx-auto mb-4">Everything you need</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-sage-900 mb-4">Built for modern health</h2>
            <p className="text-sage-400 text-lg max-w-xl mx-auto">Powerful tools that make understanding and managing your medications effortless.</p>
          </div>

          <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="feature-card glass rounded-2xl p-7 card-lift cursor-default opacity-0"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0"
                    style={{ background: `${feature.color}18` }}
                  >
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-sage-800 mb-2">{feature.title}</h3>
                  <p className="text-sage-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-sage-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="pill bg-sage-700 text-sage-300 mx-auto mb-4">What people say</div>
            <h2 className="font-display text-4xl font-bold text-cream-100">Loved by patients & doctors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-dark rounded-2xl p-7 card-lift">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-cream-400 text-cream-400" />
                  ))}
                </div>
                <p className="text-cream-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-cream-100 text-sm font-semibold">{t.name}</div>
                    <div className="text-sage-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="blob bg-sage-200/50 w-32 h-32 mx-auto flex items-center justify-center mb-8">
            <Activity size={36} className="text-sage-600" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-sage-900 mb-4">
            Take charge of your health today.
          </h2>
          <p className="text-sage-400 text-lg mb-10">
            Join over 200,000 people who trust MedWise to understand their medications and manage their health smartly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-base py-4 px-8">
              Start for free <ArrowRight size={16} />
            </Link>
            <Link href="/appointments" className="btn-ghost text-base py-4 px-8">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-sage-900 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-sage-400" />
            <span className="font-display text-cream-200 font-semibold">MedWise</span>
          </div>
          <p className="text-sage-500 text-sm">© {new Date().getFullYear()} MedWise. All rights reserved.</p>
          <div className="flex gap-6 text-sage-500 text-sm">
            <Link href="#" className="hover:text-sage-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-sage-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-sage-300 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
