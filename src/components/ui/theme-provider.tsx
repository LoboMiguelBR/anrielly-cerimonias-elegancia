
"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Verificação se estamos no cliente antes de usar localStorage
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }
    
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    } catch (error) {
      console.error('ThemeProvider: Erro ao acessar localStorage:', error)
      return defaultTheme
    }
  })

  React.useEffect(() => {
    // Verificação se estamos no cliente
    if (typeof window === "undefined") {
      return
    }

    try {
      const root = window.document.documentElement

      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"

        root.classList.add(systemTheme)
        return
      }

      root.classList.add(theme)
    } catch (error) {
      console.error('ThemeProvider: Erro ao aplicar tema:', error)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window === "undefined") {
        return
      }
      
      try {
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      } catch (error) {
        console.error('ThemeProvider: Erro ao salvar tema:', error)
        setTheme(theme) // Ainda atualiza o state mesmo se localStorage falhar
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
