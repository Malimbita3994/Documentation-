// Environment Configuration for Vite
// This file provides type-safe access to environment variables

interface Environment {
  IEEE_API_KEY: string
  GITHUB_TOKEN: string
  STACKOVERFLOW_KEY: string
  ISO_API_KEY: string
  OPENAI_API_KEY: string
  API_URL: string
  FRONTEND_URL: string
  ENV: string
}

// Type-safe environment variable access
export const env: Environment = {
  IEEE_API_KEY: (import.meta as any).env?.VITE_IEEE_API_KEY || '',
  GITHUB_TOKEN: (import.meta as any).env?.VITE_GITHUB_TOKEN || '',
  STACKOVERFLOW_KEY: (import.meta as any).env?.VITE_STACKOVERFLOW_KEY || '',
  ISO_API_KEY: (import.meta as any).env?.VITE_ISO_API_KEY || '',
  OPENAI_API_KEY: (import.meta as any).env?.VITE_OPENAI_API_KEY || '',
  API_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api',
  FRONTEND_URL: (import.meta as any).env?.VITE_FRONTEND_URL || 'http://localhost:3000',
  ENV: (import.meta as any).env?.VITE_ENV || 'development'
}

// Helper function to check if we're in development
export const isDevelopment = env.ENV === 'development'

// Helper function to check if we have API keys configured
export const hasApiKeys = {
  ieee: !!env.IEEE_API_KEY,
  github: !!env.GITHUB_TOKEN,
  stackoverflow: !!env.STACKOVERFLOW_KEY,
  iso: !!env.ISO_API_KEY,
  openai: !!env.OPENAI_API_KEY
}
