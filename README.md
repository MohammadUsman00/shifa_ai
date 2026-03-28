# MedWise — AI-Powered Health Companion

A **3-page Next.js 14** web application with GSAP animations, built with a refined sage/cream color palette and editorial design aesthetic.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing / Auth | `/` | Hero + Sign-up/Sign-in card |
| Medicine Search | `/dashboard` | Search, voice input, prices, prescription scan |
| Appointments | `/appointments` | Book doctors, set medication reminders |

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom CSS variables
- **Animations**: GSAP + ScrollTrigger
- **Icons**: Lucide React
- **Fonts**: Playfair Display (display) + DM Sans (body) + DM Mono

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Features

### Landing Page
- GSAP entrance animations (hero, blobs, CTA)
- Scroll-triggered feature card reveals
- Sign-up / Sign-in auth card with form
- Stats strip, testimonials, feature grid

### Medicine Search Dashboard
- Text search with quick-search pills
- Web Speech API voice input + waveform animation
- Mock medicine database (Paracetamol, Ibuprofen, Amoxicillin)
- Accordion sections: uses, dosage, side effects, prevention
- Live price comparison UI (ready for real API integration)
- Prescription file upload with simulated AI text extraction

### Appointments & Reminders
- Interactive calendar with month navigation
- Doctor listing with ratings, location, fees
- Time slot selection and booking confirmation
- Medication reminders with daily progress ring
- Add/toggle reminders, timeline schedule view

## Connecting Real APIs

### Price Data (replace mock in `/app/dashboard/page.tsx`)
```js
// Exa search
const res = await fetch('https://api.exa.ai/search', {
  headers: { 'x-api-key': process.env.EXA_API_KEY },
  body: JSON.stringify({ query: `${medicineName} price India pharmacy` })
})

// Apify pharmacy scraper
const run = await apifyClient.actor('your-actor-id').call({ medicine: medicineName })
```

### Prescription OCR
Replace the simulated delay with a real OCR API call:
```js
const formData = new FormData()
formData.append('file', file)
const text = await fetch('/api/ocr', { method: 'POST', body: formData })
```

## Design System

```css
--sage-*     /* Primary greens */
--cream-*    /* Warm neutrals */
--accent-teal, --accent-coral, --accent-lavender
```

All colors available as Tailwind classes: `bg-sage-500`, `text-cream-200`, etc.
