'use client'

import { useEffect, useState } from 'react'
import FlaticonIcon from '@/components/FlaticonIcon'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'medwise-theme'

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const initialTheme = getPreferredTheme()
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(nextTheme)
        applyTheme(nextTheme)
      }}
      className="theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="theme-toggle__icon-wrap" aria-hidden="true">
        <FlaticonIcon
          icon={theme === 'light' ? 'fi-sr-moon-stars' : 'fi-sr-sun'}
          className="theme-toggle__icon"
        />
      </span>
      <span className="theme-toggle__label">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
