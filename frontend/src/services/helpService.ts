import { env } from '@/config/environment'

const API_BASE_URL = env.API_URL

export interface HelpSection {
  id: number
  title: string
  description: string
  icon: string
  items: string[]
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export interface SupportInfo {
  email: string
  phone: string
  live_chat: boolean
  business_hours: string
  response_time: string
  emergency_contact: string
}

export interface SupportTicket {
  name: string
  email: string
  subject: string
  message: string
  category: 'technical' | 'billing' | 'general' | 'feature-request'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface SystemStatus {
  status: string
  uptime: string
  last_incident: string | null
  services: {
    api: string
    database: string
    ai_services: string
    file_storage: string
  }
  last_updated: string
}

export interface SearchResult {
  id: number
  title: string
  excerpt: string
  url: string
  category: string
}

class HelpService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit, requireAuth: boolean = false): Promise<T> {
    const token = localStorage.getItem('token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    }
    
    // Only add authorization header if auth is required and token exists
    if (requireAuth && token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/help${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data || data
  }

  /**
   * Get help sections and categories
   */
  async getHelpSections(): Promise<HelpSection[]> {
    return this.makeRequest<HelpSection[]>('/sections')
  }

  /**
   * Get frequently asked questions
   */
  async getFaqs(): Promise<FAQ[]> {
    return this.makeRequest<FAQ[]>('/faqs')
  }

  /**
   * Get support contact information
   */
  async getSupportInfo(): Promise<SupportInfo> {
    return this.makeRequest<SupportInfo>('/support-info')
  }

  /**
   * Submit a support ticket
   */
  async submitTicket(ticket: SupportTicket): Promise<{ ticket_id: string; estimated_response_time: string }> {
    return this.makeRequest<{ ticket_id: string; estimated_response_time: string }>('/ticket', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }, true) // Require authentication for ticket submission
  }

  /**
   * Search help articles
   */
  async searchHelp(query: string): Promise<{
    query: string
    results: SearchResult[]
    total_results: number
  }> {
    return this.makeRequest<{
      query: string
      results: SearchResult[]
      total_results: number
    }>(`/search?q=${encodeURIComponent(query)}`)
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    return this.makeRequest<SystemStatus>('/system-status')
  }
}

export const helpService = new HelpService()
