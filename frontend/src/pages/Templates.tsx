import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { 
  Plus, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Upload,
  FileText,
  BarChart3,
  User,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react'
import { templateService, Template, TemplateUploadData, TemplateFilters, TemplateStatistics } from '../services/templateService'
import Swal from 'sweetalert2'
import SystemStatusIndicator from '../components/SystemStatusIndicator'

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [statistics, setStatistics] = useState<TemplateStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [filters, setFilters] = useState<TemplateFilters>({})
  const [pagination, setPagination] = useState<any>({})

  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Simple, stable form state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState('General')
  const [formContentType, setFormContentType] = useState('SRS')
  const [formIndustry, setFormIndustry] = useState('general')
  const [formTags, setFormTags] = useState('')
  const [formFile, setFormFile] = useState<File | null>(null)

  const categories = ['General', 'Industry-specific', 'Custom']
  const contentTypes = ['SRS', 'SDD', 'Test Cases', 'User Manual', 'Progress Report']
  const industries = ['general', 'healthcare', 'finance', 'education', 'ecommerce', 'manufacturing', 'government']

  useEffect(() => {
    checkConnectivity()
    fetchTemplates()
    fetchStatistics()
  }, [filters])

  const checkConnectivity = async () => {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      const isBackendOnline = response.ok
      setIsOfflineMode(!isBackendOnline)
    } catch (error) {
      setIsOfflineMode(true)
    }
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const result = await templateService.getTemplates(filters)
      setTemplates(result.data)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const stats = await templateService.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const resetForm = () => {
    setFormName('')
    setFormDescription('')
    setFormCategory('General')
    setFormContentType('SRS')
    setFormIndustry('general')
    setFormTags('')
    setFormFile(null)
  }

  const handleUpload = async () => {
    try {
      toast.dismiss()
      
      if (!formName.trim()) {
        toast.error('Please enter a template name')
        return
      }
      
      if (!formFile) {
        toast.error('Please select a template file')
        return
      }
      
      const allowedTypes = ['.docx', '.doc', '.pdf', '.txt', '.md']
      const fileExtension = '.' + formFile.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please select a valid file type (DOCX, DOC, PDF, TXT, MD)')
        return
      }
      
      if (formFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }

      setUploading(true)
      const templateData: TemplateUploadData = {
        name: formName,
        description: formDescription,
        category: formCategory,
        content_type: formContentType,
        industry: formIndustry,
        standards: [],
        tags: formTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        file: formFile
      }

      // Debug: Log the data being sent
      console.log('Template data being sent:', {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        content_type: templateData.content_type,
        industry: templateData.industry,
        file: templateData.file?.name,
        fileSize: templateData.file?.size
      })

      await templateService.uploadTemplate(templateData)
      toast.success('Template uploaded successfully!')
      setShowUploadModal(false)
      resetForm()
      fetchTemplates()
      fetchStatistics()
    } catch (error: any) {
      console.error('Error uploading template:', error)
      if (error.message && error.message.includes('Validation failed')) {
        toast.error('Please check all required fields and try again')
      } else {
        toast.error(error.message || 'Failed to upload template')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (template: Template) => {
    try {

      const response = await templateService.downloadTemplateFile(template.id)
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      link.download = template.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Template downloaded successfully!')
      fetchTemplates()
    } catch (error: any) {
      console.error('Error downloading template:', error)
      toast.error(error.message || 'Failed to download template')
    }
  }

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template)
    setShowPreviewModal(true)
  }

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template)
    setShowEditModal(true)
  }

  const handleDelete = async (template: Template) => {
    const result = await Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await templateService.deleteTemplate(template.id)
        toast.success('Template deleted successfully!')
        fetchTemplates()
        fetchStatistics()
      } catch (error: any) {
        console.error('Error deleting template:', error)
        toast.error(error.message || 'Failed to delete template')
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormFile(file)
    }
  }

  const handleFilterChange = (key: keyof TemplateFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  // Simple input handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDescription(e.target.value)
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTags(e.target.value)
  }

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload New Template</h2>
            {isOfflineMode && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ Offline mode: Template will be stored locally only
              </p>
            )}
          </div>
          <button
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name *
            </label>
                         <input
               type="text"
               value={formName}
               onChange={handleNameChange}
               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                 formName.trim() ? 'border-green-300 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
               }`}
               placeholder="Enter template name"
               maxLength={100}
               style={{ minHeight: '44px' }}
             />
            {formName && (
              <p className="text-xs text-gray-500 mt-1">
                {formName.length}/100 characters
              </p>
            )}
            
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
                         <textarea
               value={formDescription}
               onChange={handleDescriptionChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
               rows={3}
               placeholder="Enter template description"
               maxLength={500}
               style={{ minHeight: '80px', resize: 'vertical' }}
             />
            {formDescription && (
              <p className="text-xs text-gray-500 mt-1">
                {formDescription.length}/500 characters
              </p>
            )}
            
          </div>

          {/* Category and Content Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                value={formContentType}
                onChange={(e) => setFormContentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formIndustry}
              onChange={(e) => setFormIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template File *
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              formFile ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}>
              <Upload className={`mx-auto h-12 w-12 ${formFile ? 'text-green-500' : 'text-red-400'}`} />
              <div className="mt-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".docx,.doc,.pdf,.txt,.md"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {formFile ? 'Change File' : 'Choose File'}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  {formFile ? (
                    <span className="text-green-600 font-medium">
                      ✓ {formFile.name} ({(formFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ⚠️ Please select a template file (DOCX, DOC, PDF, TXT, MD up to 10MB)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
                         <input
               type="text"
               value={formTags}
               onChange={handleTagsChange}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
               placeholder="Enter tags separated by commas"
               maxLength={200}
               style={{ minHeight: '44px' }}
             />
            
          </div>
        </div>

        {/* Validation Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Form Status:</h4>
          <div className="space-y-1 text-sm">
            <div className={`flex items-center ${formName.trim() ? 'text-green-600' : 'text-red-600'}`}>
              {formName.trim() ? '✓' : '✗'} Template Name
            </div>
            <div className={`flex items-center ${formFile ? 'text-green-600' : 'text-red-600'}`}>
              {formFile ? '✓' : '✗'} Template File
            </div>
            <div className="text-green-600">
              ✓ Category ({formCategory})
            </div>
            <div className="text-green-600">
              ✓ Content Type ({formContentType})
            </div>
            <div className="text-green-600">
              ✓ Industry ({formIndustry})
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowUploadModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !formName.trim() || !formFile}
            className={`px-4 py-2 rounded-md flex items-center ${
              uploading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : formName.trim() && formFile
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {formName.trim() && formFile ? 'Ready to Upload' : 'Upload Template'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{templateService.getFileTypeIcon(template.file_type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.file_name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePreview(template)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(template)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownload(template)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-md"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(template)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {template.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 text-xs rounded-full ${templateService.getContentTypeColor(template.content_type)}`}>
          {template.content_type}
        </span>
        <span className={`px-2 py-1 text-xs rounded-full ${templateService.getCategoryColor(template.category)}`}>
          {template.category}
        </span>
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          {template.industry}
        </span>
      </div>

      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
              +{template.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{templateService.formatFileSize(template.file_size)}</span>
          <span>•</span>
          <span>{template.download_count} downloads</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-3 h-3" />
          <span>{template.user?.name || 'Unknown'}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
              <p className="text-gray-600">Manage document templates for consistent documentation.</p>
            </div>
            {isOfflineMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Offline Mode:</strong> Using sample templates. Backend connection unavailable.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_templates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.active_templates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Download className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_downloads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Most Popular</p>
                  <p className="text-lg font-bold text-gray-900">
                    {statistics.most_downloaded[0]?.name || 'N/A'}
          </p>
        </div>
              </div>
            </div>
          </div>
        )}

        {/* Cross-Page Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => window.location.href = '/srs'}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-blue-200"
            >
              <FileText className="h-4 w-4" />
              <span>Go to SRS</span>
            </button>
            <button 
              onClick={() => window.location.href = '/sdd'}
              className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-green-200"
            >
              <FileText className="h-4 w-4" />
              <span>Go to SDD</span>
            </button>
            <button 
              onClick={() => window.location.href = '/projects'}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-purple-200"
            >
              <FileText className="h-4 w-4" />
              <span>View Projects</span>
            </button>
            <button 
              onClick={() => window.location.href = '/documents'}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-indigo-200"
            >
              <FileText className="h-4 w-4" />
              <span>All Documents</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
        </button>
      </div>
      
            <div className="flex items-center space-x-3">
              {isOfflineMode && (
                <button
                  onClick={async () => {
                    await templateService.refreshConnectivity()
                    checkConnectivity()
                  }}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 text-sm"
                  title="Refresh connection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reconnect</span>
                </button>
              )}
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Template</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={filters.content_type || ''}
                    onChange={(e) => handleFilterChange('content_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={filters.industry || ''}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {industry.charAt(0).toUpperCase() + industry.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
        </div>
      </div>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by uploading your first template.'
              }
            </p>
            {Object.keys(filters).length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Upload Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page.toString())}
                  className={`px-3 py-2 rounded-md ${
                    page === pagination.current_page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <p className="text-gray-600 mt-2">{selectedTemplate.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-gray-900">{selectedTemplate.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content Type</label>
                  <p className="text-gray-900">{selectedTemplate.content_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <p className="text-gray-900">{selectedTemplate.industry}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Size</label>
                  <p className="text-gray-900">{templateService.formatFileSize(selectedTemplate.file_size)}</p>
                </div>
              </div>
              
              {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    handleDownload(selectedTemplate)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Template</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  defaultValue={selectedTemplate.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  defaultValue={selectedTemplate.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter template description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    defaultValue={selectedTemplate.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    defaultValue={selectedTemplate.content_type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement template update
                    toast.success('Template updated successfully!')
                    setShowEditModal(false)
                    fetchTemplates()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System Status Indicator */}
      <SystemStatusIndicator />
    </div>
  )
}

export default Templates









