import { env } from '../config/environment'

export interface Template {
  id: number
  name: string
  description?: string
  category: string
  file_path: string
  file_name: string
  file_size: number
  file_type: string
  content_type: string
  industry: string
  standards?: string[]
  tags?: string[]
  is_active: boolean
  uploaded_by: number
  download_count: number
  version: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface TemplateUploadData {
  name: string
  description?: string
  category: string
  content_type: string
  industry: string
  standards?: string[]
  tags?: string[]
  file: File
}

export interface TemplateFilters {
  category?: string
  content_type?: string
  industry?: string
  search?: string
  page?: number
}

export interface TemplateStatistics {
  total_templates: number
  active_templates: number
  total_downloads: number
  by_content_type: Record<string, number>
  by_industry: Record<string, number>
  recent_uploads: Template[]
  most_downloaded: Template[]
}

// Sample templates for fallback when API is not available
const sampleTemplates: Template[] = [
  {
    id: 1,
    name: 'Standard SRS Template',
    description: 'Comprehensive Software Requirements Specification template following IEEE 830-1998 standards',
    category: 'General',
    file_path: '/templates/srs-standard.docx',
    file_name: 'srs-standard.docx',
    file_size: 245760,
    file_type: 'docx',
    content_type: 'SRS',
    industry: 'general',
    standards: ['IEEE 830-1998'],
    tags: ['software', 'requirements', 'ieee'],
    is_active: true,
    uploaded_by: 1,
    download_count: 45,
    version: '1.0.0',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user: { id: 1, name: 'System Admin', email: 'admin@example.com' }
  },
  {
    id: 2,
    name: 'Healthcare SDD Template',
    description: 'Software Design Document template optimized for healthcare applications with HIPAA compliance',
    category: 'Industry-specific',
    file_path: '/templates/healthcare-sdd.docx',
    file_name: 'healthcare-sdd.docx',
    file_size: 189440,
    file_type: 'docx',
    content_type: 'SDD',
    industry: 'healthcare',
    standards: ['IEEE 1016-2009', 'HIPAA'],
    tags: ['healthcare', 'design', 'hipaa'],
    is_active: true,
    uploaded_by: 1,
    download_count: 32,
    version: '1.0.0',
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z',
    user: { id: 1, name: 'System Admin', email: 'admin@example.com' }
  },
  {
    id: 3,
    name: 'Test Cases Template',
    description: 'Comprehensive test case template following IEEE 829-2008 standards',
    category: 'General',
    file_path: '/templates/test-cases.docx',
    file_name: 'test-cases.docx',
    file_size: 156672,
    file_type: 'docx',
    content_type: 'Test Cases',
    industry: 'general',
    standards: ['IEEE 829-2008'],
    tags: ['testing', 'quality', 'ieee'],
    is_active: true,
    uploaded_by: 1,
    download_count: 28,
    version: '1.0.0',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z',
    user: { id: 1, name: 'System Admin', email: 'admin@example.com' }
  }
]

const sampleStatistics: TemplateStatistics = {
  total_templates: 3,
  active_templates: 3,
  total_downloads: 105,
  by_content_type: {
    'SRS': 1,
    'SDD': 1,
    'Test Cases': 1
  },
  by_industry: {
    'general': 2,
    'healthcare': 1
  },
  recent_uploads: sampleTemplates.slice(0, 2),
  most_downloaded: [sampleTemplates[0], sampleTemplates[1], sampleTemplates[2]]
}

class TemplateService {
  private baseUrl: string
  private isOfflineMode: boolean = false

  constructor() {
    this.baseUrl = env.API_URL
    this.checkConnectivity()
  }

  private async checkConnectivity(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // 3 second timeout
      })
      this.isOfflineMode = !response.ok
    } catch (error) {
      console.warn('API not available, using offline mode for templates')
      this.isOfflineMode = true
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }



  async getTemplates(filters: TemplateFilters = {}): Promise<{ data: Template[], pagination: any, filters: any }> {
    try {
      if (this.isOfflineMode) {
        // Return sample data in offline mode
        let filteredTemplates = [...sampleTemplates]
        
        if (filters.category) {
          filteredTemplates = filteredTemplates.filter(t => t.category === filters.category)
        }
        if (filters.content_type) {
          filteredTemplates = filteredTemplates.filter(t => t.content_type === filters.content_type)
        }
        if (filters.industry) {
          filteredTemplates = filteredTemplates.filter(t => t.industry === filters.industry)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredTemplates = filteredTemplates.filter(t => 
            t.name.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower) ||
            t.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          )
        }

        return {
          data: filteredTemplates,
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: filteredTemplates.length
          },
          filters: {
            categories: ['General', 'Industry-specific', 'Custom'],
            content_types: ['SRS', 'SDD', 'Test Cases', 'User Manual', 'Progress Report'],
            industries: ['general', 'healthcare', 'finance', 'education', 'ecommerce', 'manufacturing', 'government']
          }
        }
      }

      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.content_type) params.append('content_type', filters.content_type)
      if (filters.industry) params.append('industry', filters.industry)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())

      const response = await fetch(`${this.baseUrl}/templates?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching templates:', error)
      // Fallback to sample data
      return {
        data: sampleTemplates,
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: sampleTemplates.length
        },
        filters: {
          categories: ['General', 'Industry-specific', 'Custom'],
          content_types: ['SRS', 'SDD', 'Test Cases', 'User Manual', 'Progress Report'],
          industries: ['general', 'healthcare', 'finance', 'education', 'ecommerce', 'manufacturing', 'government']
        }
      }
    }
  }

  async uploadTemplate(templateData: TemplateUploadData): Promise<Template> {
    try {
      if (this.isOfflineMode) {
        // Simulate upload in offline mode
        const newTemplate: Template = {
          id: Date.now(),
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          file_path: `/templates/${templateData.file.name}`,
          file_name: templateData.file.name,
          file_size: templateData.file.size,
          file_type: templateData.file.name.split('.').pop() || 'docx',
          content_type: templateData.content_type,
          industry: templateData.industry,
          standards: templateData.standards,
          tags: templateData.tags,
          is_active: true,
          uploaded_by: 1,
          download_count: 0,
          version: '1.0.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: { id: 1, name: 'Current User', email: 'user@example.com' }
        }
        
        // Add to sample templates
        sampleTemplates.unshift(newTemplate)
        return newTemplate
      }

      const formData = new FormData()
      formData.append('name', templateData.name)
      formData.append('category', templateData.category)
      formData.append('content_type', templateData.content_type)
      formData.append('industry', templateData.industry)
      formData.append('file', templateData.file)

      if (templateData.description) {
        formData.append('description', templateData.description)
      }
      if (templateData.standards) {
        formData.append('standards', JSON.stringify(templateData.standards))
      }
      if (templateData.tags) {
        formData.append('tags', JSON.stringify(templateData.tags))
      }

      const authToken = localStorage.getItem('authToken') || localStorage.getItem('token')
      console.log('Using auth token:', authToken ? 'Token exists' : 'No token found')
      
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload failed with status:', response.status)
        console.error('Error response:', errorData)
        throw new Error(errorData.message || 'Failed to upload template')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error uploading template:', error)
      throw error
    }
  }

  async getTemplate(id: number): Promise<Template> {
    try {
      if (this.isOfflineMode) {
        const template = sampleTemplates.find(t => t.id === id)
        if (!template) {
          throw new Error('Template not found')
        }
        return template
      }

      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching template:', error)
      throw error
    }
  }

  async updateTemplate(id: number, updateData: Partial<TemplateUploadData>): Promise<Template> {
    try {
      if (this.isOfflineMode) {
        const templateIndex = sampleTemplates.findIndex(t => t.id === id)
        if (templateIndex === -1) {
          throw new Error('Template not found')
        }
        
        const updatedTemplate = { ...sampleTemplates[templateIndex], ...updateData }
        sampleTemplates[templateIndex] = updatedTemplate
        return updatedTemplate
      }

      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update template')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    try {
      if (this.isOfflineMode) {
        const templateIndex = sampleTemplates.findIndex(t => t.id === id)
        if (templateIndex === -1) {
          throw new Error('Template not found')
        }
        sampleTemplates.splice(templateIndex, 1)
        return
      }

      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  async downloadTemplate(id: number): Promise<{ download_url: string, file_name: string, file_size: string }> {
    try {
      if (this.isOfflineMode) {
        const template = sampleTemplates.find(t => t.id === id)
        if (!template) {
          throw new Error('Template not found')
        }
        
        // Simulate download preparation
        return {
          download_url: template.file_path,
          file_name: template.file_name,
          file_size: this.formatFileSize(template.file_size)
        }
      }

      const response = await fetch(`${this.baseUrl}/templates/${id}/download`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to prepare download')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error preparing download:', error)
      throw error
    }
  }

  async downloadTemplateFile(id: number): Promise<Blob> {
    try {
      if (this.isOfflineMode) {
        const template = sampleTemplates.find(t => t.id === id)
        if (!template) {
          throw new Error('Template not found')
        }
        
        // Create a mock blob for offline mode
        const content = `This is a sample ${template.content_type} template file.\n\nTemplate: ${template.name}\nCategory: ${template.category}\nIndustry: ${template.industry}\n\nThis is a placeholder file for demonstration purposes.`
        return new Blob([content], { type: 'text/plain' })
      }

      const response = await fetch(`${this.baseUrl}/templates/${id}/download-file`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to download template file')
      }

      return await response.blob()
    } catch (error) {
      console.error('Error downloading template file:', error)
      throw error
    }
  }

  async getStatistics(): Promise<TemplateStatistics> {
    try {
      if (this.isOfflineMode) {
        return sampleStatistics
      }

      const response = await fetch(`${this.baseUrl}/templates/statistics`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching template statistics:', error)
      return sampleStatistics
    }
  }

  async getTemplatesForGeneration(contentType: string, industry?: string): Promise<Template[]> {
    try {
      if (this.isOfflineMode) {
        let templates = sampleTemplates.filter(t => t.content_type === contentType)
        if (industry) {
          templates = templates.filter(t => t.industry === industry || t.industry === 'general')
        }
        return templates.sort((a, b) => b.download_count - a.download_count)
      }

      const params = new URLSearchParams()
      params.append('content_type', contentType)
      if (industry) {
        params.append('industry', industry)
      }

      const response = await fetch(`${this.baseUrl}/templates/for-generation?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Error fetching templates for generation:', error)
      // Return sample templates as fallback
      let templates = sampleTemplates.filter(t => t.content_type === contentType)
      if (industry) {
        templates = templates.filter(t => t.industry === industry || t.industry === 'general')
      }
      return templates.sort((a, b) => b.download_count - a.download_count)
    }
  }

  // Utility methods
  getFileTypeIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'docx':
      case 'doc':
        return '📄'
      case 'pdf':
        return '📕'
      case 'txt':
      case 'md':
        return '📝'
      default:
        return '📁'
    }
  }

  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  getContentTypeColor(contentType: string): string {
    switch (contentType) {
      case 'SRS':
        return 'bg-blue-100 text-blue-800'
      case 'SDD':
        return 'bg-green-100 text-green-800'
      case 'Test Cases':
        return 'bg-yellow-100 text-yellow-800'
      case 'User Manual':
        return 'bg-purple-100 text-purple-800'
      case 'Progress Report':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'General':
        return 'bg-gray-100 text-gray-800'
      case 'Industry-specific':
        return 'bg-indigo-100 text-indigo-800'
      case 'Custom':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Check if system is in offline mode
  isOffline(): boolean {
    return this.isOfflineMode
  }

  // Force refresh connectivity check
  async refreshConnectivity(): Promise<void> {
    await this.checkConnectivity()
  }
}

export const templateService = new TemplateService()
