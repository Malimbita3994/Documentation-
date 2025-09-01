// Basic project service for API calls
import { env } from '@/config/environment'

const API_BASE = env.API_URL

export const projectService = {
  // Get all projects
  getProjects: async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  // Get all projects (alias)
  getAllProjects: async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  // Search projects
  searchProjects: async (query: string, status: string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects?search=${query}&status=${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  // Get single project
  getProject: async (id: number) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.json()
  },

  // Create project
  createProject: async (data: any) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update project
  updateProject: async (id: number | string, data: any) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete project
  deleteProject: async (id: number | string) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
}

export default projectService
