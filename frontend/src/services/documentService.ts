import { env } from '@/config/environment'

const API_BASE = env.API_URL

export const documentService = {
  list: async (params: Record<string, string | number | boolean> = {}) => {
    const token = localStorage.getItem('token')
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      )
    ).toString()
    const response = await fetch(`${API_BASE}/documents${query ? `?${query}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  create: async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  update: async (id: number | string, data: any) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  destroy: async (id: number | string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  restore: async (id: number | string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/documents/${id}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  forceDelete: async (id: number | string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/documents/${id}/force`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  }
}

export default documentService


