'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Navbar from '@/components/Navbar'
import FlaticonIcon from '@/components/FlaticonIcon'
import {
  Calendar, Clock, Bell, User, MapPin, Star, Phone, ChevronRight,
  Plus, Check, X, Pill, Stethoscope, Activity, ChevronLeft, AlarmClock
} from 'lucide-react'

// ---- Mock Data ----
const DOCTORS = [
  { id: 1, name: 'Dr. Priya Nair', specialty: 'General Physician', location: 'Apollo Clinic, Srinagar', rating: 4.9, reviews: 218, available: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'], fee: '₹500', avatar: 'P', color: '#527d56' },
  { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', location: 'SMHS Hospital, Srinagar', rating: 4.8, reviews: 142, available: ['11:00 AM', '3:00 PM', '5:00 PM'], fee: '₹800', avatar: 'A', color: '#4a9e8e' },
  { id: 3, name: 'Dr. Zainab Hassan', specialty: 'Dermatologist', location: 'Skin Care Centre, Sopore', rating: 4.7, reviews: 95, available: ['9:30 AM', '1:00 PM', '4:00 PM'], fee: '₹600', avatar: 'Z', color: '#e07b5a' },
  { id: 4, name: 'Dr. Rajan Kapoor', specialty: 'Orthopedist', location: 'Bone & Joint Clinic, Jammu', rating: 4.9, reviews: 167, available: ['10:00 AM', '12:00 PM', '3:30 PM'], fee: '₹700', avatar: 'R', color: '#8b7fb8' },
]

const INITIAL_REMINDERS = [
  { id: 1, medicine: 'Paracetamol 500mg', time: '08:00 AM', frequency: 'Twice daily', daysLeft: 5, taken: true, color: '#527d56' },
  { id: 2, medicine: 'Amoxicillin 250mg', time: '02:00 PM', frequency: 'Three times daily', daysLeft: 3, taken: false, color: '#4a9e8e' },
  { id: 3, medicine: 'Vitamin D3 1000IU', time: '09:00 AM', frequency: 'Once daily', daysLeft: 30, taken: false, color: '#8b7fb8' },
]

const UPCOMING_APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Priya Nair', specialty: 'General Physician', date: 'Today', time: '10:30 AM', status: 'confirmed', avatar: 'P', color: '#527d56' },
  { id: 2, doctor: 'Dr. Arjun Mehta', specialty: 'Cardiologist', date: 'Mar 31', time: '3:00 PM', status: 'pending', avatar: 'A', color: '#4a9e8e' },
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function AppointmentsPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<'appointments' | 'reminders'>('appointments')
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [appointments, setAppointments] = useState(UPCOMING_APPOINTMENTS)
  const [reminders, setReminders] = useState(INITIAL_REMINDERS)
  const [booked, setBooked] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // New reminder form
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [newReminder, setNewReminder] = useState({ medicine: '', time: '08:00', frequency: 'Once daily' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
      )

      const cards = pageRef.current?.querySelectorAll('.anim-card') || []
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.4 }
      )
    })
    return () => ctx.revert()
  }, [])

  // Calendar helpers
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()
  const today = new Date()

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return
    setBooked(true)
    const newAppt = {
      id: appointments.length + 1,
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: `${MONTHS[currentMonth].slice(0, 3)} ${selectedDate}`,
      time: selectedTime,
      status: 'confirmed' as const,
      avatar: selectedDoctor.avatar,
      color: selectedDoctor.color,
    }
    setAppointments(prev => [newAppt, ...prev])

    setTimeout(() => {
      setBooked(false)
      setSelectedDoctor(null)
      setSelectedDate(null)
      setSelectedTime(null)
    }, 2500)
  }

  const toggleTaken = (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: !r.taken } : r))
  }

  const addReminder = () => {
    if (!newReminder.medicine) return
    const colors = ['#527d56', '#4a9e8e', '#e07b5a', '#8b7fb8']
    setReminders(prev => [...prev, {
      id: Date.now(),
      medicine: newReminder.medicine,
      time: newReminder.time,
      frequency: newReminder.frequency,
      daysLeft: 30,
      taken: false,
      color: colors[prev.length % colors.length]
    }])
    setNewReminder({ medicine: '', time: '08:00', frequency: 'Once daily' })
    setShowReminderForm(false)
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  return (
    <div ref={pageRef} className="min-h-screen bg-cream-50 noise-overlay">
      <Navbar />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER + TABS ===== */}
        <div ref={headerRef} className="mb-8">
          <div className="text-center mb-6">
            <div className="pill bg-sage-100 text-sage-600 mx-auto mb-3">Health Scheduling</div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-sage-900 mb-2">
              Appointments & Reminders
            </h1>
            <p className="text-sage-400 max-w-md mx-auto text-sm">
              Book doctors nearby and keep track of your medications effortlessly.
            </p>
          </div>

          {/* Tab Switch */}
          <div className="flex justify-center">
            <div className="bg-cream-100 rounded-2xl p-1 inline-flex">
              {([['appointments', Calendar, 'Appointments'], ['reminders', Bell, 'Reminders']] as const).map(([tab, Icon, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-500 hover:text-sage-700'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============ APPOINTMENTS TAB ============ */}
        {activeTab === 'appointments' && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT: Upcoming + Doctor List */}
            <div className="lg:col-span-1 space-y-5">

              {/* Upcoming Appointments */}
              <div className="glass rounded-2xl p-5 anim-card border border-cream-200/60">
                <h3 className="font-semibold text-sage-800 text-sm mb-4 flex items-center gap-2">
                  <Calendar size={15} className="text-sage-500" />
                  Upcoming Appointments
                </h3>
                <div className="space-y-3">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-100">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: appt.color }}
                      >
                        {appt.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-sage-800 truncate">{appt.doctor}</p>
                        <p className="text-xs text-sage-400">{appt.date} · {appt.time}</p>
                      </div>
                      <span className={`tag text-xs ${appt.status === 'confirmed' ? 'bg-sage-100 text-sage-700' : 'bg-amber-100 text-amber-700'}`}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <p className="text-xs text-sage-300 text-center py-3">No upcoming appointments</p>
                  )}
                </div>
              </div>

              {/* Doctor List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sage-800 text-sm px-1">Available Doctors</h3>
                {DOCTORS.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`glass rounded-2xl p-4 cursor-pointer transition-all anim-card border-2 ${
                      selectedDoctor?.id === doc.id ? 'border-sage-400 shadow-md' : 'border-cream-200/60 hover:border-sage-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: doc.color }}
                      >
                        {doc.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sage-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-sage-400 mb-1">{doc.specialty}</p>
                        <div className="flex items-center gap-1 text-xs text-sage-400">
                          <MapPin size={10} />
                          <span className="truncate">{doc.location}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold">
                            <Star size={10} className="fill-amber-500" /> {doc.rating}
                          </div>
                          <span className="text-xs text-sage-300">·</span>
                          <span className="text-xs text-sage-400">{doc.reviews} reviews</span>
                          <span className="text-xs text-sage-300">·</span>
                          <span className="text-xs font-semibold text-sage-600">{doc.fee}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-sage-300 shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Calendar + Time Slot + Booking */}
            <div className="lg:col-span-2 space-y-5">

              {/* Calendar */}
              <div ref={calendarRef} className="glass rounded-2xl p-6 anim-card border border-cream-200/60">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-lg font-bold text-sage-800">
                    {MONTHS[currentMonth]} {currentYear}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
                        else setCurrentMonth(m => m - 1)
                      }}
                      className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-sage-600 hover:bg-cream-200 transition-colors"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
                        else setCurrentMonth(m => m + 1)
                      }}
                      className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-sage-600 hover:bg-cream-200 transition-colors"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="text-center text-xs text-sage-400 font-semibold py-1">{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                    const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    const isSelected = day === selectedDate
                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center ${
                          isSelected ? 'bg-sage-600 text-white shadow-sm' :
                          isToday ? 'bg-sage-100 text-sage-700 ring-2 ring-sage-300' :
                          isPast ? 'text-sage-200 cursor-not-allowed' :
                          'text-sage-600 hover:bg-cream-100'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDoctor && selectedDate && (
                <div className="glass rounded-2xl p-5 anim-card border border-cream-200/60">
                  <h4 className="font-semibold text-sage-800 text-sm mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-sage-400" />
                    Available slots for {selectedDoctor.name} on {MONTHS[currentMonth].slice(0, 3)} {selectedDate}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.available.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          selectedTime === time
                            ? 'bg-sage-600 text-white border-sage-600'
                            : 'bg-white text-sage-600 border-cream-200 hover:border-sage-300 hover:bg-sage-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              {selectedDoctor && selectedDate && selectedTime && (
                <div className="glass rounded-2xl p-5 anim-card border-2 border-sage-200">
                  <h4 className="font-semibold text-sage-800 text-sm mb-4">Booking Summary</h4>
                  <div className="space-y-2 mb-5">
                    {[
                      { label: 'Doctor', value: selectedDoctor.name },
                      { label: 'Specialty', value: selectedDoctor.specialty },
                      { label: 'Date', value: `${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}` },
                      { label: 'Time', value: selectedTime },
                      { label: 'Location', value: selectedDoctor.location },
                      { label: 'Consultation Fee', value: selectedDoctor.fee },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-sage-400">{label}</span>
                        <span className="text-sage-700 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  {booked ? (
                    <div className="flex items-center justify-center gap-2 py-3 bg-sage-100 rounded-xl text-sage-700">
                      <Check size={16} className="text-sage-500" />
                      <span className="font-semibold text-sm">Appointment Confirmed!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleBook}
                      className="btn-primary w-full justify-center"
                    >
                      Confirm Appointment <Check size={15} />
                    </button>
                  )}
                </div>
              )}

              {/* Placeholder if no doctor selected */}
              {!selectedDoctor && (
                <div className="glass rounded-2xl p-10 text-center anim-card border border-cream-200/60">
                  <Stethoscope size={32} className="text-sage-200 mx-auto mb-3" />
                  <p className="text-sage-400 text-sm">Select a doctor from the list to book an appointment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ REMINDERS TAB ============ */}
        {activeTab === 'reminders' && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Reminders List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sage-800 text-sm">Today's Medications</h3>
                <button
                  onClick={() => setShowReminderForm(true)}
                  className="btn-primary text-xs py-2 px-3 gap-1"
                >
                  <Plus size={13} /> Add Reminder
                </button>
              </div>

              {reminders.map((r) => (
                <div
                  key={r.id}
                  className={`glass rounded-2xl p-5 anim-card border-2 transition-all ${
                    r.taken ? 'border-sage-200 opacity-70' : 'border-cream-200/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${r.color}20` }}
                    >
                      <Pill size={22} style={{ color: r.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sage-800 text-sm ${r.taken ? 'line-through text-sage-400' : ''}`}>
                        {r.medicine}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-sage-400">
                          <Clock size={11} /> {r.time}
                        </span>
                        <span className="text-sage-200 text-xs">·</span>
                        <span className="text-xs text-sage-400">{r.frequency}</span>
                        <span className="text-sage-200 text-xs">·</span>
                        <span className="text-xs text-sage-400">{r.daysLeft} days left</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2.5 h-1.5 bg-cream-200 rounded-full overflow-hidden w-48 max-w-full">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (30 - r.daysLeft) / 30 * 100 + 10)}%`, background: r.color }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTaken(r.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                        r.taken
                          ? 'bg-sage-100 text-sage-500'
                          : 'bg-white border-2 border-cream-200 text-sage-300 hover:border-sage-300'
                      }`}
                    >
                      {r.taken ? <Check size={16} /> : <Check size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Reminder Form */}
              {showReminderForm && (
                <div className="glass rounded-2xl p-5 anim-card border-2 border-sage-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sage-800 text-sm">New Reminder</h4>
                    <button onClick={() => setShowReminderForm(false)} className="text-sage-300 hover:text-sage-500">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-sage-500 uppercase tracking-wide mb-1.5">Medicine Name</label>
                      <input
                        className="input-elegant"
                        placeholder="e.g. Metformin 500mg"
                        value={newReminder.medicine}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, medicine: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-sage-500 uppercase tracking-wide mb-1.5">Time</label>
                        <input
                          className="input-elegant"
                          type="time"
                          value={newReminder.time}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-sage-500 uppercase tracking-wide mb-1.5">Frequency</label>
                        <select
                          className="input-elegant"
                          value={newReminder.frequency}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: e.target.value }))}
                        >
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Three times daily</option>
                          <option>Every 6 hours</option>
                          <option>Weekly</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={addReminder} className="btn-primary w-full justify-center text-sm mt-1">
                      <Plus size={15} /> Add Reminder
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Stats + Schedule Overview */}
            <div className="space-y-5">

              {/* Daily Progress */}
              <div className="glass rounded-2xl p-5 anim-card border border-cream-200/60">
                <h3 className="font-semibold text-sage-800 text-sm mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-sage-400" />
                  Today's Progress
                </h3>
                <div className="text-center mb-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e9dfc3" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="#527d56" strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - reminders.filter(r => r.taken).length / Math.max(reminders.length, 1))}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-xl font-bold text-sage-800">
                        {reminders.filter(r => r.taken).length}/{reminders.length}
                      </span>
                      <span className="text-xs text-sage-400">taken</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-sage-400">
                  {reminders.filter(r => !r.taken).length > 0
                    ? `${reminders.filter(r => !r.taken).length} medication(s) remaining today`
                    : 'All medications taken for today.'
                  }
                </p>
              </div>

              {/* Upcoming Reminders Timeline */}
              <div className="glass rounded-2xl p-5 anim-card border border-cream-200/60">
                <h3 className="font-semibold text-sage-800 text-sm mb-4 flex items-center gap-2">
                  <AlarmClock size={14} className="text-sage-400" />
                  Today's Schedule
                </h3>
                <div className="space-y-3">
                  {[...reminders].sort((a, b) => a.time.localeCompare(b.time)).map((r, i) => (
                    <div key={r.id} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full" style={{ background: r.taken ? '#a0bda2' : r.color }} />
                        {i < reminders.length - 1 && <div className="w-0.5 h-6 bg-cream-200 my-1" />}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <p className={`text-xs font-semibold ${r.taken ? 'text-sage-300 line-through' : 'text-sage-700'}`}>
                            {r.medicine}
                          </p>
                          <p className="text-xs text-sage-400">{r.time}</p>
                        </div>
                        {r.taken && <Check size={12} className="text-sage-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="glass rounded-2xl p-5 anim-card border border-cream-200/60 bg-sage-50/30">
                <h3 className="font-semibold text-sage-800 text-sm mb-3 flex items-center gap-2">
                  <FlaticonIcon icon="fi-sr-lightbulb-on" className="text-sm text-sage-500" />
                  Medication Tips
                </h3>
                {[
                  'Take medications at the same time daily for best results.',
                  'Never skip doses — complete the full course.',
                  'Store medicines away from heat and moisture.',
                  'Check expiry dates before taking any medication.',
                ].map((tip, i) => (
                  <p key={i} className="text-xs text-sage-500 leading-relaxed mb-2 last:mb-0 pl-2 border-l-2 border-sage-200">{tip}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
