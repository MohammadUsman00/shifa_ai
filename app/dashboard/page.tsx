'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import Navbar from '@/components/Navbar'
import FlaticonIcon from '@/components/FlaticonIcon'
import {
  Search, Mic, MicOff, Upload, X, ChevronDown, ChevronUp,
  Pill, AlertTriangle, Activity, DollarSign, FlaskConical,
  Stethoscope, ShieldCheck, Clock, ExternalLink, Loader2, FileText
} from 'lucide-react'

// ---- Mock medicine database ----
const MOCK_DB: Record<string, MedicineData> = {
  paracetamol: {
    name: 'Paracetamol (Acetaminophen)',
    brand: 'Calpol, Panadol, Tylenol',
    chemical: 'C₈H₉NO₂ — para-acetylaminophenol',
    category: 'Analgesic / Antipyretic',
    uses: ['Fever reduction', 'Mild to moderate pain relief', 'Headache', 'Toothache', 'Muscle aches', 'Cold & flu symptoms'],
    dosage: { adult: '325–1000 mg every 4–6 hours', child: '10–15 mg/kg every 4–6 hours', max: '4000 mg/day for adults' },
    sideEffects: ['Generally well-tolerated at recommended doses', 'Nausea (rare)', 'Skin rash (rare)', 'Liver damage (overdose)'],
    prevention: ['Do not exceed recommended dose', 'Avoid alcohol consumption', 'Check other medications for paracetamol content', 'Consult doctor if liver disease present'],
    prices: [
      { store: 'Apollo Pharmacy', price: '₹28', generic: true, available: true },
      { store: '1mg', price: '₹32', generic: false, available: true },
      { store: 'Netmeds', price: '₹26', generic: true, available: true },
      { store: 'PharmEasy', price: '₹30', generic: false, available: true },
    ],
    interactions: ['Warfarin (blood thinner)', 'Alcohol'],
    pregnancy: 'Generally considered safe in recommended doses',
    controlled: false,
  },
  ibuprofen: {
    name: 'Ibuprofen',
    brand: 'Brufen, Advil, Nurofen',
    chemical: 'C₁₃H₁₈O₂ — (RS)-2-(4-(2-methylpropyl)phenyl)propanoic acid',
    category: 'NSAID — Non-Steroidal Anti-Inflammatory Drug',
    uses: ['Pain relief', 'Inflammation reduction', 'Fever', 'Arthritis', 'Menstrual cramps', 'Dental pain'],
    dosage: { adult: '200–400 mg every 4–6 hours', child: '5–10 mg/kg every 6–8 hours', max: '1200 mg/day OTC; 3200 mg/day prescribed' },
    sideEffects: ['Stomach upset or pain', 'Heartburn', 'Nausea', 'Dizziness', 'Increased blood pressure', 'Kidney issues (prolonged use)'],
    prevention: ['Take with food or milk', 'Avoid if kidney or heart disease', 'Not for use during third trimester pregnancy', 'Limit alcohol intake'],
    prices: [
      { store: 'Apollo Pharmacy', price: '₹42', generic: true, available: true },
      { store: '1mg', price: '₹38', generic: true, available: true },
      { store: 'Netmeds', price: '₹45', generic: false, available: false },
      { store: 'PharmEasy', price: '₹39', generic: true, available: true },
    ],
    interactions: ['Aspirin', 'Blood thinners', 'ACE inhibitors', 'Lithium'],
    pregnancy: 'Avoid in third trimester; use with caution in first and second',
    controlled: false,
  },
  amoxicillin: {
    name: 'Amoxicillin',
    brand: 'Amoxil, Trimox, Moxatag',
    chemical: 'C₁₆H₁₉N₃O₅S — (2S,5R,6R)-6-[(2R)-2-amino-2-(4-hydroxyphenyl)acetamido]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid',
    category: 'Antibiotic — Penicillin class',
    uses: ['Bacterial infections', 'Ear infections', 'Throat infections (strep)', 'Urinary tract infections', 'Skin infections', 'H. pylori (with other meds)'],
    dosage: { adult: '250–500 mg every 8 hours or 500–875 mg every 12 hours', child: '25–45 mg/kg/day in divided doses', max: '3 g/day standard; higher in specific cases' },
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash', 'Vomiting', 'Allergic reactions (in penicillin-allergic patients — serious)'],
    prevention: ['Complete full course even if feeling better', 'Inform doctor of penicillin allergy', 'May reduce effectiveness of oral contraceptives', 'Take at even intervals'],
    prices: [
      { store: 'Apollo Pharmacy', price: '₹95', generic: true, available: true },
      { store: '1mg', price: '₹110', generic: false, available: true },
      { store: 'Netmeds', price: '₹88', generic: true, available: true },
      { store: 'PharmEasy', price: '₹102', generic: false, available: true },
    ],
    interactions: ['Methotrexate', 'Warfarin', 'Other antibiotics', 'Probenecid'],
    pregnancy: 'Generally safe during pregnancy when benefits outweigh risks',
    controlled: false,
  },
}

interface MedicineData {
  name: string; brand: string; chemical: string; category: string;
  uses: string[]; dosage: { adult: string; child: string; max: string };
  sideEffects: string[]; prevention: string[];
  prices: { store: string; price: string; generic: boolean; available: boolean }[];
  interactions: string[]; pregnancy: string; controlled: boolean;
}

const sectionColors: Record<string, string> = {
  uses: '#527d56', dosage: '#4a9e8e', sideEffects: '#e07b5a', prevention: '#8b7fb8', prices: '#cab87e'
}

export default function DashboardPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MedicineData | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [listening, setListening] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    uses: true, dosage: true, sideEffects: false, prevention: false, prices: true
  })
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionLoading, setPrescriptionLoading] = useState(false)
  const [prescriptionResult, setPrescriptionResult] = useState<string | null>(null)
  const [pricesLoading, setPricesLoading] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(searchBarRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleSearch = useCallback(async (searchQuery = query) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setResult(null)
    setNotFound(false)

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200))

    const key = searchQuery.toLowerCase().trim()
    const found = Object.keys(MOCK_DB).find(k => key.includes(k) || k.includes(key))

    if (found) {
      setResult(MOCK_DB[found])
      setPricesLoading(true)
      setTimeout(() => setPricesLoading(false), 800)
    } else {
      setNotFound(true)
    }
    setLoading(false)

    // Animate results in
    setTimeout(() => {
      if (resultsRef.current) {
        gsap.fromTo(resultsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
      }
    }, 50)
  }, [query])

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.')
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false

    setListening(true)
    recognition.start()

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      setListening(false)
      handleSearch(transcript)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPrescriptionFile(file)
    setPrescriptionLoading(true)
    setPrescriptionResult(null)

    await new Promise(r => setTimeout(r, 2000))
    setPrescriptionResult(
      'Extracted medicines from prescription:\n1. Paracetamol 500mg — Take 1 tablet twice daily after meals\n2. Amoxicillin 250mg — Take 1 capsule 3 times daily for 5 days\n3. Vitamin D3 1000IU — Take 1 tablet daily'
    )
    setPrescriptionLoading(false)
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const quickSearches = ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Atorvastatin']

  return (
    <div ref={pageRef} className="min-h-screen bg-cream-50 noise-overlay">
      <Navbar />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== PAGE HEADER ===== */}
        <div className="text-center mb-10">
          <div className="pill bg-sage-100 text-sage-600 mx-auto mb-3">Medicine Database</div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-sage-900 mb-2">
            Search any medicine
          </h1>
          <p className="text-sage-400 max-w-md mx-auto">
            Get instant drug info, real-time pricing from top pharmacies, and AI-powered insights.
          </p>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div ref={searchBarRef} className="glass rounded-2xl p-4 shadow-lg mb-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
              <Search size={18} className="text-sage-500" />
            </div>
            <input
              className="flex-1 bg-transparent text-sage-900 placeholder-sage-300 outline-none text-base"
              placeholder="Search by medicine name (e.g. Paracetamol, Ibuprofen…)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {query && (
              <button onClick={() => { setQuery(''); setResult(null); setNotFound(false) }} className="text-sage-300 hover:text-sage-500 transition-colors">
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleVoice}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                listening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-sage-100 text-sage-500 hover:bg-sage-200'
              }`}
              title="Voice search"
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={() => handleSearch()}
              className="btn-primary py-2.5 px-5 text-sm"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Voice Waveform */}
          {listening && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="waveform flex items-end gap-1.5">
                {[...Array(7)].map((_, i) => <span key={i} />)}
              </div>
              <span className="text-xs text-red-500 font-medium ml-2">Listening…</span>
            </div>
          )}
        </div>

        {/* Quick Search Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {quickSearches.map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); handleSearch(q) }}
              className="pill bg-sage-100 text-sage-600 hover:bg-sage-200 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COL — Results */}
          <div className="lg:col-span-2 space-y-4" ref={resultsRef}>

            {/* Loading State */}
            {loading && (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="loading-dot w-3 h-3 rounded-full bg-sage-400" />
                  ))}
                </div>
                <p className="text-sage-400 text-sm">Searching medicine database…</p>
              </div>
            )}

            {/* Not Found */}
            {notFound && !loading && (
              <div className="glass rounded-2xl p-10 text-center">
                <Pill size={36} className="text-sage-300 mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-sage-700 mb-2">Medicine not found</h3>
                <p className="text-sage-400 text-sm">Try searching for Paracetamol, Ibuprofen, or Amoxicillin to see a demo.</p>
              </div>
            )}

            {/* Medicine Card */}
            {result && !loading && (
              <div className="space-y-4">

                {/* Header Card */}
                <div className="glass rounded-2xl p-6 border border-cream-200/60">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="tag bg-sage-100 text-sage-700">{result.category}</span>
                        {result.controlled && <span className="tag bg-orange-100 text-orange-700">Controlled</span>}
                      </div>
                      <h2 className="font-display text-2xl font-bold text-sage-900 mt-2">{result.name}</h2>
                      <p className="text-sage-400 text-sm mt-1">Brands: <span className="text-sage-600 font-medium">{result.brand}</span></p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center shrink-0">
                      <Pill size={26} className="text-sage-500" />
                    </div>
                  </div>

                  {/* Chemical Formula */}
                  <div className="mt-4 p-3 bg-cream-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FlaskConical size={14} className="text-sage-500" />
                      <span className="text-xs text-sage-500 font-semibold uppercase tracking-wide">Chemical Formula</span>
                    </div>
                    <p className="font-mono text-sm text-sage-700 mt-1">{result.chemical}</p>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                      <p className="text-xs text-sage-400 mb-0.5">Adult Dose</p>
                      <p className="text-xs font-semibold text-sage-700">{result.dosage.adult}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                      <p className="text-xs text-sage-400 mb-0.5">Max Daily</p>
                      <p className="text-xs font-semibold text-sage-700">{result.dosage.max}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                      <p className="text-xs text-sage-400 mb-0.5">Pregnancy</p>
                      <p className="text-xs font-semibold text-sage-700 line-clamp-2">{result.pregnancy}</p>
                    </div>
                  </div>
                </div>

                {/* ACCORDION SECTIONS */}
                {[
                  { key: 'uses', icon: Stethoscope, label: 'Uses & Indications', content: result.uses },
                  { key: 'sideEffects', icon: AlertTriangle, label: 'Side Effects', content: result.sideEffects },
                  { key: 'prevention', icon: ShieldCheck, label: 'Precautions & Prevention', content: result.prevention },
                ].map(({ key, icon: Icon, label, content }) => (
                  <div key={key} className="glass rounded-2xl overflow-hidden border border-cream-200/60">
                    <button
                      className="w-full flex items-center justify-between p-5 hover:bg-cream-50/50 transition-colors"
                      onClick={() => toggleSection(key)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${sectionColors[key]}18` }}>
                          <Icon size={15} style={{ color: sectionColors[key] }} />
                        </div>
                        <span className="font-semibold text-sage-800 text-sm">{label}</span>
                      </div>
                      {openSections[key] ? <ChevronUp size={16} className="text-sage-400" /> : <ChevronDown size={16} className="text-sage-400" />}
                    </button>
                    {openSections[key] && (
                      <div className="px-5 pb-5">
                        <div className="grid sm:grid-cols-2 gap-2">
                          {content.map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-cream-50 border border-cream-100">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: sectionColors[key] }} />
                              <span className="text-sm text-sage-600 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* PRICE COMPARISON */}
                <div className="glass rounded-2xl overflow-hidden border border-cream-200/60">
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <DollarSign size={15} className="text-amber-600" />
                      </div>
                      <span className="font-semibold text-sage-800 text-sm">Price Comparison</span>
                    </div>
                    <span className="text-xs text-sage-400 flex items-center gap-1">
                      <Activity size={11} />
                      Live prices
                    </span>
                  </div>
                  <div className="px-5 pb-5">
                    {pricesLoading ? (
                      <div className="flex items-center gap-2 text-sage-400 py-4">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-sm">Fetching current prices from pharmacies…</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {result.prices.map((p, i) => (
                          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${p.available ? 'bg-white border-cream-200' : 'bg-cream-50 border-cream-100 opacity-60'}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-600">
                                {p.store[0]}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-sage-700">{p.store}</p>
                                <p className="text-xs text-sage-400">{p.generic ? 'Generic' : 'Branded'} · {p.available ? 'In Stock' : 'Out of Stock'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-display text-lg font-bold text-sage-800">{p.price}</span>
                              {p.available && (
                                <button className="text-sage-400 hover:text-sage-600 transition-colors">
                                  <ExternalLink size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-sage-300 mt-2 text-center">Prices updated dynamically via pharmacy APIs</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drug Interactions */}
                <div className="glass rounded-2xl p-5 border border-orange-200/40 bg-orange-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={15} className="text-orange-500" />
                    <span className="font-semibold text-sage-800 text-sm">Drug Interactions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.interactions.map((drug, i) => (
                      <span key={i} className="tag bg-orange-100 text-orange-700">{drug}</span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Empty State */}
            {!result && !loading && !notFound && (
              <div className="glass rounded-2xl p-14 text-center">
                <div className="blob bg-sage-100 w-24 h-24 mx-auto flex items-center justify-center mb-5">
                  <Search size={30} className="text-sage-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-sage-700 mb-2">Search for a medicine</h3>
                <p className="text-sage-400 text-sm">Type or speak a medicine name to get started.</p>
              </div>
            )}
          </div>

          {/* RIGHT COL — Prescription + Dosage Guide */}
          <div className="space-y-5">

            {/* Prescription Upload */}
            <div className="glass rounded-2xl p-5 border border-cream-200/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                  <Upload size={15} className="text-sage-500" />
                </div>
                <h3 className="font-semibold text-sage-800 text-sm">Prescription Scanner</h3>
              </div>

              <label className="block border-2 border-dashed border-cream-300 rounded-xl p-6 text-center cursor-pointer hover:border-sage-300 hover:bg-sage-50/30 transition-all">
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                {prescriptionFile ? (
                  <div>
                    <FileText size={24} className="text-sage-400 mx-auto mb-2" />
                    <p className="text-sm text-sage-600 font-medium">{prescriptionFile.name}</p>
                    <p className="text-xs text-sage-400 mt-1">File uploaded</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="text-sage-300 mx-auto mb-2" />
                    <p className="text-sm text-sage-500">Upload prescription image or PDF</p>
                    <p className="text-xs text-sage-300 mt-1">PNG, JPG, or PDF</p>
                  </div>
                )}
              </label>

              {prescriptionLoading && (
                <div className="mt-4 flex items-center gap-2 text-sage-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Extracting text with AI…</span>
                </div>
              )}

              {prescriptionResult && (
                <div className="mt-4 p-4 bg-sage-50 rounded-xl border border-sage-200">
                  <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide mb-2">Extracted Medicines</p>
                  <pre className="text-xs text-sage-600 whitespace-pre-wrap font-mono leading-relaxed">{prescriptionResult}</pre>
                </div>
              )}
            </div>

            {/* Dosage Guide */}
            <div className="glass rounded-2xl p-5 border border-cream-200/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock size={15} className="text-blue-500" />
                </div>
                <h3 className="font-semibold text-sage-800 text-sm">Dosage Guide</h3>
              </div>

              {result ? (
                <div className="space-y-3">
                  {[
                    { label: 'Adult', value: result.dosage.adult },
                    { label: 'Children', value: result.dosage.child },
                    { label: 'Maximum', value: result.dosage.max },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-cream-50 rounded-xl">
                      <p className="text-xs text-sage-400 mb-0.5 uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-sm text-sage-700 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-sage-300 text-center py-4">Search a medicine to see dosage details</p>
              )}
            </div>

            {/* Quick Info */}
            <div className="glass rounded-2xl p-5 border border-cream-200/60">
              <h3 className="font-semibold text-sage-800 text-sm mb-4">How to use</h3>
              {[
                { icon: 'fi-sr-search', text: 'Type or paste a medicine name in the search bar' },
                { icon: 'fi-sr-microphone', text: 'Or click the mic button to search by voice' },
                { icon: 'fi-sr-camera', text: 'Upload a prescription image for automatic extraction' },
                { icon: 'fi-sr-pills', text: 'View full drug information, prices, and interactions' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <FlaticonIcon icon={tip.icon} className="text-sm shrink-0 text-sage-500 mt-0.5" />
                  <p className="text-xs text-sage-500 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
