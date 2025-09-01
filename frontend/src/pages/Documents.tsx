import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { 
  PlusIcon,
  MagnifyingGlassIcon, 
  FunnelIcon, 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  UserIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  ServerIcon,
  FolderIcon
} from '@heroicons/react/24/outline'
import { Document, DocumentType, DocumentStatus, Project } from '../types/index'
import { DocumentGeneratorFactory } from '../services/documentGenerators'
import { DocumentGenerationRequest } from '../services/documentGenerators/types'
import DocumentEditor from '../components/DocumentEditor'
import FileUpload, { UploadedFile } from '../components/FileUpload'
import projectService from '../services/projectService'
import SDDDocumentViewer from '../components/SDDDocumentViewer'

const Documents: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creationMode, setCreationMode] = useState<'manual' | 'automatic'>('automatic')
  const [showDocumentEditor, setShowDocumentEditor] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSDDViewer, setShowSDDViewer] = useState(false)

  
  // Add projects state for dropdown
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  
  // Load projects for dropdown
  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const projectsData = await projectService.getAllProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setProjectsLoading(false)
    }
  }

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Listen for URL parameter changes and update selectedType
  useEffect(() => {
    const typeFromUrl = searchParams.get('type')
    console.log('URL parameter changed:', typeFromUrl, 'Current selectedType:', selectedType)
    
    if (typeFromUrl && typeFromUrl !== selectedType) {
      console.log('Setting selectedType to:', typeFromUrl)
      setSelectedType(typeFromUrl)
    } else if (!typeFromUrl && selectedType) {
      console.log('Clearing selectedType')
      setSelectedType('')
    }
  }, [searchParams])

  // Force update when component mounts or URL changes
  useEffect(() => {
    const typeFromUrl = searchParams.get('type')
    console.log('Component mounted, URL type:', typeFromUrl)
    if (typeFromUrl) {
      console.log('Setting selectedType to:', typeFromUrl)
      setSelectedType(typeFromUrl)
    }
  }, []) // Empty dependency array - only run on mount

  // Additional effect to handle URL changes more robustly
  useEffect(() => {
    const handleUrlChange = () => {
      const typeFromUrl = searchParams.get('type')
      console.log('URL change detected, new type:', typeFromUrl)
      if (typeFromUrl && typeFromUrl !== selectedType) {
        console.log('Updating selectedType from URL change:', typeFromUrl)
        setSelectedType(typeFromUrl)
      }
    }

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleUrlChange)
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [searchParams, selectedType])

  // Update URL when selectedType changes (but avoid infinite loop)
  useEffect(() => {
    const typeFromUrl = searchParams.get('type')
    if (selectedType && selectedType !== typeFromUrl) {
      console.log('Updating URL with selectedType:', selectedType)
      setSearchParams({ type: selectedType }, { replace: true })
    } else if (!selectedType && typeFromUrl) {
      console.log('Clearing URL parameters')
      setSearchParams({}, { replace: true })
    }
  }, [selectedType, setSearchParams])

  // Reset modal states when navigating
  useEffect(() => {
    setShowCreateModal(false)
    setShowDocumentEditor(false)
    setShowSDDViewer(false)
    setCurrentDocument(null)
  }, [location.pathname, searchParams])

  // Get document type display name
  const getDocumentTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'srs': 'Software Requirements Specification (SRS)',
      'sdd': 'Software Design Document (SDD)',
      'test-cases': 'Test Cases & Test Plan',
      'concept-note': 'Concept Note & Business Case',
      'progress-report': 'Project Progress Report',
      'user-manual': 'User Manual & Documentation',
      'feasibility-study': 'Feasibility Study'
    }
    return typeMap[type] || type
  }

  // Get document type from display name
  const getDocumentTypeFromDisplay = (displayName: string) => {
    const typeMap: { [key: string]: string } = {
      'Software Requirements Specification (SRS)': 'SRS',
      'Software Design Document (SDD)': 'SDD',
      'Test Cases & Test Plan': 'Test Cases',
      'Concept Note & Business Case': 'Concept Note',
      'Project Progress Report': 'Project Progress Report',
      'User Manual & Documentation': 'User Manual',
      'Feasibility Study': 'Feasibility Study'
    }
    return typeMap[displayName] || displayName
  }



  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'E-commerce Platform SRS',
      type: 'SRS',
      projectId: '1',
      status: 'In Review',
      version: '1.2',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'E-commerce Platform',
        purpose: 'Online shopping system',
        scope: 'Web and mobile applications',
        stakeholders: [],
        assumptions: [],
        constraints: [],
        references: [],
        glossary: [],
        acronyms: [],
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      createdBy: 'John Doe',
      lastModifiedBy: 'Jane Smith',
      tags: ['e-commerce', 'web', 'mobile'],
      requirements: [],
    },
    {
      id: '2',
      title: 'Payment Gateway SDD',
      type: 'SDD',
      projectId: '1',
      status: 'Draft',
      version: '0.1',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'Payment Gateway',
        purpose: 'Payment processing system',
        scope: 'API integration',
        stakeholders: [],
        assumptions: [],
        constraints: [],
        references: [],
        glossary: [],
        acronyms: [],
      },
      createdAt: '2024-01-18T09:00:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
      createdBy: 'Jane Smith',
      lastModifiedBy: 'Jane Smith',
      tags: ['payment', 'api', 'security'],
      requirements: [],
    },
    {
      id: '3',
      title: 'Mobile App User Manual',
      type: 'User Manual',
      projectId: '2',
      status: 'Published',
      version: '2.0',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'Mobile Shopping App',
        purpose: 'User guidance and instructions',
        scope: 'Mobile application',
        stakeholders: [],
        assumptions: [],
        constraints: [],
        references: [],
        glossary: [],
        acronyms: [],
      },
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-25T11:20:00Z',
      createdBy: 'John Doe',
      lastModifiedBy: 'John Doe',
      tags: ['mobile', 'user-guide', 'app'],
      requirements: [],
    },
  ])

  const documentTypes: DocumentType[] = ['SRS', 'SDD', 'Concept Note', 'Test Cases', 'User Manual', 'Feasibility Study', 'Project Charter', 'Custom']
  const documentStatuses: DocumentStatus[] = ['Draft', 'In Review', 'Approved', 'Published', 'Archived']

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Published': 'bg-blue-100 text-blue-800 border-blue-200',
      'Archived': 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[status as keyof typeof colors] || colors['Draft']
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'SRS': 'bg-blue-100 text-blue-800 border-blue-200',
      'SDD': 'bg-green-100 text-green-800 border-green-200',
      'Concept Note': 'bg-purple-100 text-purple-800 border-purple-200',
      'Test Cases': 'bg-orange-100 text-orange-800 border-orange-200',
      'User Manual': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Feasibility Study': 'bg-pink-100 text-pink-800 border-pink-200',
      'Project Charter': 'bg-teal-100 text-teal-800 border-teal-200',
      'Custom': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type as keyof typeof colors] || colors['Custom']
  }

  // Convert URL parameter to document type format
  const getDocumentTypeFromUrl = (urlType: string) => {
    const typeMap: { [key: string]: string } = {
      'srs': 'SRS',
      'sdd': 'SDD',
      'test-cases': 'Test Cases',
      'concept-note': 'Concept Note',
      'progress-report': 'Project Progress Report',
      'user-manual': 'User Manual',
      'feasibility-study': 'Feasibility Study'
    }
    return typeMap[urlType] || urlType
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.metadata.systemName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Only apply type filtering if selectedType is set
    const matchesType = !selectedType || doc.type === getDocumentTypeFromUrl(selectedType)
    const matchesStatus = !selectedStatus || doc.status === selectedStatus
    
    // Enhanced debugging
    if (selectedType) {
      console.log(`Document ${doc.title}: type=${doc.type}, selectedType=${selectedType}, getDocumentTypeFromUrl=${getDocumentTypeFromUrl(selectedType)}, matchesType=${matchesType}`)
    }
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Create a completely isolated form component to prevent cursor jumping
  const IsolatedManualForm = React.memo(() => {
    // Local state for the form - completely isolated from parent
    const [localFormData, setLocalFormData] = useState({
      title: '',
      type: '',
      systemName: '',
      projectId: '',
      purpose: '',
      scope: '',
      version: '1.0',
      priority: 'Medium',
      confidentiality: 'Internal',
      department: '',
      stakeholders: '',
      assumptions: '',
      constraints: '',
      references: '',
      tags: '',
      estimatedPages: '',
      reviewDeadline: '',
      compliance: '',
      keywords: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [localUploadedFiles, setLocalUploadedFiles] = useState<UploadedFile[]>([])
    const totalSteps = 6

    // Use uncontrolled inputs with refs to prevent cursor jumping
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null }>({})

    // Initialize form data from refs on mount
    useEffect(() => {
      // Set initial values to refs
      Object.keys(localFormData).forEach(field => {
        const element = inputRefs.current[field]
        if (element && 'value' in element) {
          element.value = localFormData[field as keyof typeof localFormData] || ''
        }
      })
    }, [])

    // Handle input changes by updating state from refs
    const handleInputChange = useCallback((field: string) => {
      const element = inputRefs.current[field]
      if (element && 'value' in element) {
        const value = element.value
        setLocalFormData(prev => ({ ...prev, [field]: value }))
      }
    }, [])

    // Navigation handlers
    const nextStep = useCallback(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }, [currentStep, totalSteps])

    const prevStep = useCallback(() => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }, [currentStep])

    const goToStep = useCallback((step: number) => {
      setCurrentStep(step)
    }, [])

    // Stable submit handler
    const handleSubmit = useCallback(async () => {
      // Get all current values from refs
      const currentData = { ...localFormData }
      Object.keys(inputRefs.current).forEach(field => {
        const element = inputRefs.current[field]
        if (element && 'value' in element) {
          currentData[field as keyof typeof localFormData] = element.value
        }
      })

      if (!currentData.title || !currentData.type || !currentData.systemName) {
        alert('Please fill in all required fields (Title, Type, System Name)')
        return
      }

      setIsSubmitting(true)
      
      // Simulate API call
      setTimeout(() => {
        const newDocument: Document = {
          id: Date.now().toString(),
          title: currentData.title,
          type: currentData.type as DocumentType,
          projectId: currentData.projectId || '1',
          status: 'Draft',
          version: currentData.version,
          content: { 
            sections: [], 
            diagrams: [], 
            tables: [], 
            attachments: localUploadedFiles.map(f => ({
              id: f.id,
              name: f.name,
              type: f.type,
              size: f.size,
              url: URL.createObjectURL(f.file),
              documentId: Date.now().toString(),
              uploadedAt: new Date().toISOString(),
              uploadedBy: 'Current User'
            }))
          },
          metadata: {
            systemName: currentData.systemName,
            purpose: currentData.purpose,
            scope: currentData.scope,
            stakeholders: currentData.stakeholders.split(',').filter((s: string) => s.trim()),
            assumptions: currentData.assumptions ? currentData.assumptions.split(',').filter((s: string) => s.trim()) : [],
            constraints: currentData.constraints ? currentData.constraints.split(',').filter((s: string) => s.trim()) : [],
            references: currentData.references ? currentData.references.split(',').filter((s: string) => s.trim()) : [],
            glossary: [],
            acronyms: [],
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Current User',
          lastModifiedBy: 'Current User',
          tags: currentData.tags.split(',').filter((t: string) => t.trim()),
          requirements: [],
        }

        // Add to documents list (in real app, this would be an API call)
        console.log('Document created:', newDocument)
        
        setShowCreateModal(false)
        setCurrentDocument(newDocument)
        
        // Show appropriate viewer based on document type
        if (newDocument.type === 'SDD') {
          setShowSDDViewer(true)
        } else {
          setShowDocumentEditor(true)
        }
        setLocalUploadedFiles([]) // Reset local uploaded files after successful creation
        setIsSubmitting(false)
      }, 1000)
    }, [localFormData, localUploadedFiles, setShowCreateModal, setShowSDDViewer, setShowDocumentEditor, setCurrentDocument])

    // Step validation
    const isStepValid = useCallback((step: number) => {
      // Get current values from refs for validation
      const currentData = { ...localFormData }
      Object.keys(inputRefs.current).forEach(field => {
        const element = inputRefs.current[field]
        if (element && 'value' in element) {
          currentData[field as keyof typeof localFormData] = element.value
        }
      })

      switch (step) {
        case 1: // Basic Information
          return currentData.title && currentData.type && currentData.systemName
        case 2: // Document Details
          return true // Optional fields
        case 3: // Stakeholders & Compliance
          return true // Optional fields
        case 4: // Assumptions & Constraints
          return true // Optional fields
        case 5: // References & Tags
          return true // Optional fields
        case 6: // File Upload
          return true // Optional
        default:
          return false
      }
    }, [localFormData])

    // Create uncontrolled input components
    const createUncontrolledInput = useCallback((field: string, type: string = "text", additionalProps: any = {}) => {
      return (
        <input
          key={field}
          ref={(el) => { inputRefs.current[field] = el }}
          type={type}
          defaultValue={localFormData[field as keyof typeof localFormData] || ''}
          onBlur={() => handleInputChange(field)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          autoComplete="off"
          {...additionalProps}
        />
      )
    }, [localFormData, handleInputChange])

    const createUncontrolledTextarea = useCallback((field: string, rows: number = 3, additionalProps: any = {}) => {
      return (
        <textarea
          key={field}
          ref={(el) => { inputRefs.current[field] = el }}
          rows={rows}
          defaultValue={localFormData[field as keyof typeof localFormData] || ''}
          onBlur={() => handleInputChange(field)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          autoComplete="off"
          {...additionalProps}
        />
      )
    }, [localFormData, handleInputChange])

    const createUncontrolledSelect = useCallback((field: string, options: { value: string, label: string }[], additionalProps: any = {}) => {
      return (
        <select
          key={field}
          ref={(el) => { inputRefs.current[field] = el }}
          defaultValue={localFormData[field as keyof typeof localFormData] || ''}
          onChange={() => handleInputChange(field)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          {...additionalProps}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      )
    }, [localFormData, handleInputChange])

    // Step content components
    const Step1BasicInfo = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title <span className="text-red-500">*</span>
            </label>
            {createUncontrolledInput('title', 'text', { placeholder: 'Enter document title...' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
                         {createUncontrolledSelect('type', [
               { value: '', label: 'Select document type' },
               ...documentTypes.map(type => ({ value: type, label: type }))
             ])}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Name <span className="text-red-500">*</span>
            </label>
            {createUncontrolledInput('systemName', 'text', { placeholder: 'Enter system name...' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                         {createUncontrolledSelect('projectId', [
               { value: '', label: projectsLoading ? 'Loading projects...' : 'Select project' },
               ...projects.map(project => ({ value: project.id, label: project.name }))
             ], { disabled: projectsLoading })}
            {projects.length === 0 && !projectsLoading && (
              <p className="text-sm text-gray-500 mt-1">
                No projects available. Please create a project first.
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            {createUncontrolledInput('version', 'text', { placeholder: 'e.g., 1.0, 2.1' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            {createUncontrolledSelect('priority', [
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Critical', label: 'Critical' }
            ])}
          </div>
        </div>
      </div>
    )

    const Step2DocumentDetails = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <DocumentTextIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            {createUncontrolledTextarea('purpose', 3, { placeholder: 'Describe the purpose and objectives of this document...' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
            {createUncontrolledTextarea('scope', 3, { placeholder: 'Define the scope and boundaries of this document...' })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              {createUncontrolledInput('keywords', 'text', { placeholder: 'Enter keywords separated by commas...' })}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Pages</label>
              {createUncontrolledInput('estimatedPages', 'number', { placeholder: 'e.g., 25' })}
            </div>
          </div>
        </div>
      </div>
    )

    const Step3Stakeholders = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <UserIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Stakeholders & Compliance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
            {createUncontrolledTextarea('stakeholders', 3, { placeholder: 'List key stakeholders (separated by commas)...' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            {createUncontrolledInput('department', 'text', { placeholder: 'e.g., IT, Engineering, Business' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confidentiality Level</label>
            {createUncontrolledSelect('confidentiality', [
              { value: 'Public', label: 'Public' },
              { value: 'Internal', label: 'Internal' },
              { value: 'Confidential', label: 'Confidential' },
              { value: 'Restricted', label: 'Restricted' }
            ])}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Requirements</label>
            {createUncontrolledInput('compliance', 'text', { placeholder: 'e.g., ISO 27001, GDPR, SOX' })}
          </div>
        </div>
      </div>
    )

    const Step4Assumptions = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <DocumentTextIcon className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Assumptions & Constraints</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assumptions</label>
            {createUncontrolledTextarea('assumptions', 3, { placeholder: 'List key assumptions (separated by commas)...' })}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Constraints</label>
            {createUncontrolledTextarea('constraints', 3, { placeholder: 'List key constraints (separated by commas)...' })}
          </div>
        </div>
      </div>
    )

    const Step5References = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CalendarIcon className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">References & Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
              {createUncontrolledTextarea('references', 3, { placeholder: 'List reference documents (separated by commas)...' })}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Deadline</label>
              {createUncontrolledInput('reviewDeadline', 'date')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="h-6 w-6 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tags & Classification</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            {createUncontrolledInput('tags', 'text', { placeholder: 'Enter tags separated by commas (e.g., technical, business, urgent)...' })}
            <p className="text-sm text-gray-500 mt-2">
              Tags help organize and categorize your documents for easy retrieval
            </p>
          </div>
        </div>
      </div>
    )

    const Step6FileUpload = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="h-6 w-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Document Attachments</h3>
          </div>
          
          <FileUpload
            onFilesChange={setLocalUploadedFiles}
            maxFiles={10}
            maxFileSize={25}
            acceptedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']}
          />
        </div>

        {localUploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents Preview</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {localUploadedFiles.length} file{localUploadedFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-3">
              {localUploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      {file.type.includes('pdf') ? (
                        <DocumentTextIcon className="h-6 w-6 text-red-500" />
                      ) : file.type.includes('word') || file.type.includes('doc') ? (
                        <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                      ) : file.type.includes('excel') || file.type.includes('sheet') ? (
                        <DocumentTextIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'success' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">Ready</span>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = localUploadedFiles.filter(f => f.id !== file.id)
                        setLocalUploadedFiles(updatedFiles)
                      }}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Remove file"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Documents Ready for Attachment</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All uploaded documents will be attached to your new document. You can review and remove files before creating the document.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )

    return (
      <div className="space-y-8">
        {/* Step Progress Indicator */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Step {currentStep} of {totalSteps}</h3>
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <button
                  key={step}
                  onClick={() => goToStep(step)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  disabled={step > currentStep}
                >
                  {step < currentStep ? '✓' : step}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep}:</span>
              <span>
                {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Document Details'}
                {currentStep === 3 && 'Stakeholders & Compliance'}
                {currentStep === 4 && 'Assumptions & Constraints'}
                {currentStep === 5 && 'References & Tags'}
                {currentStep === 6 && 'File Upload'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && <Step1BasicInfo />}
        {currentStep === 2 && <Step2DocumentDetails />}
        {currentStep === 3 && <Step3Stakeholders />}
        {currentStep === 4 && <Step4Assumptions />}
        {currentStep === 5 && <Step5References />}
        {currentStep === 6 && <Step6FileUpload />}

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-3 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>
                      Create Document
                      {localUploadedFiles.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          +{localUploadedFiles.length} attachment{localUploadedFiles.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  })

  const CreateDocumentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Document</h2>
            <p className="text-gray-600 mt-1">Choose between manual creation or AI-powered generation</p>
          </div>
          <button
                          onClick={() => {
                setShowCreateModal(false)
              }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Creation Mode Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
            <button
                              onClick={() => {
                  setCreationMode('manual')
                }}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                creationMode === 'manual' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Manual Creation
            </button>
            <button
                              onClick={() => {
                  setCreationMode('automatic')
                }}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                creationMode === 'automatic' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SparklesIcon className="h-5 w-5 inline mr-2" />
              AI Generation
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {creationMode === 'manual' ? (
            <IsolatedManualForm />
          ) : (
            <AutomaticDocumentForm />
          )}
        </div>
      </div>
    </div>
  )

  // Memoize the AutomaticDocumentForm component
  const AutomaticDocumentForm = React.memo(() => {
    const [formData, setFormData] = useState({
      documentType: selectedType ? getDocumentTypeDisplayName(selectedType) : '',
      projectId: '',
      systemRequirements: '',
      additionalSpecs: ''
    })

    // Update formData.documentType when selectedType changes
    React.useEffect(() => {
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          documentType: getDocumentTypeDisplayName(selectedType)
        }))
      }
    }, [selectedType])

    // Memoize the handleGenerate function to prevent re-creation
    const handleGenerate = React.useCallback(async () => {
      if (!formData.documentType || !formData.projectId || !formData.systemRequirements) {
        alert('Please fill in all required fields')
        return
      }

      setIsGenerating(true)
      try {
        // Get the selected project
        const selectedProject = projects.find(p => p.id === formData.projectId)
        
                  const request: DocumentGenerationRequest = {
          documentType: getDocumentTypeFromDisplay(formData.documentType),
          projectId: formData.projectId,
          systemRequirements: formData.systemRequirements,
          additionalSpecs: formData.additionalSpecs + (selectedProject?.name ? `\nProject: ${selectedProject.name}` : '')
        }

        const generated = await DocumentGeneratorFactory.generateDocument(request)
        setShowCreateModal(false)
        setCurrentDocument(generated.document)
        
        // Show appropriate viewer based on document type
        if (generated.document.type === 'SDD') {
          setShowSDDViewer(true)
        } else {
          setShowDocumentEditor(true)
        }
      } catch (error) {
        console.error('Error generating document:', error)
        alert('Error generating document. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }, [formData, projects, setShowCreateModal, setShowSDDViewer, setShowDocumentEditor, setCurrentDocument])

    // Memoize the input change handler
    const handleInputChange = React.useCallback((field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    }, [])

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              {selectedType ? `AI-Powered ${getDocumentTypeDisplayName(selectedType)} Generation` : 'AI-Powered Document Generation'}
            </h3>
          </div>
          <p className="text-blue-800 text-sm">
            {selectedType 
              ? `Provide requirements and context, and our AI will generate a comprehensive ${getDocumentTypeDisplayName(selectedType).toLowerCase()} automatically.`
              : 'Provide requirements and context, and our AI will generate comprehensive, professional documents automatically.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!selectedType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type to Generate</label>
              <select 
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select document type</option>
                <option value="SRS">Software Requirements Specification (SRS)</option>
                <option value="SDD">Software Design Document (SDD)</option>
                <option value="Test Cases">Test Cases & Test Plan</option>
                <option value="Concept Note">Concept Note & Business Case</option>
                <option value="Project Progress Report">Project Progress Report</option>
                <option value="User Manual">User Manual & Documentation</option>
                <option value="Feasibility Study">Feasibility Study</option>
              </select>
            </div>
          )}
          <div className={selectedType ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select 
              value={formData.projectId}
              onChange={(e) => handleInputChange('projectId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              disabled={projectsLoading}
            >
              <option value="">
                {projectsLoading ? 'Loading projects...' : 'Select project'}
              </option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {projects.length === 0 && !projectsLoading && (
              <p className="text-sm text-gray-500 mt-1">
                No projects available. Please create a project first.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedType === 'srs' ? 'Software Requirements & Context' : 'System Requirements & Context'}
          </label>
          <textarea
            rows={6}
            value={formData.systemRequirements}
            onChange={(e) => handleInputChange('systemRequirements', e.target.value)}
            placeholder={selectedType === 'srs' 
              ? "Describe the software requirements, functional requirements, non-functional requirements, user stories, business rules, stakeholders, constraints, and any specific details that should be included in the SRS document..."
              : "Describe the system requirements, business needs, stakeholders, constraints, and any specific details that should be included in the generated document..."
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            autoComplete="off"
          />
          <p className="text-sm text-gray-500 mt-2">
            {selectedType === 'srs' 
              ? 'Be as detailed as possible. Include functional requirements, non-functional requirements, user stories, business rules, system interfaces, performance requirements, etc.'
              : 'Be as detailed as possible. Include functional requirements, non-functional requirements, user stories, business rules, etc.'
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Specifications</label>
          <textarea
            rows={4}
            value={formData.additionalSpecs}
            onChange={(e) => handleInputChange('additionalSpecs', e.target.value)}
            placeholder="Any additional specifications, industry standards, compliance requirements, or special considerations..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            autoComplete="off"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">AI Generation Process</h4>
              <p className="text-sm text-yellow-700 mt-1">
                The AI will analyze your requirements and generate a comprehensive document with proper structure, 
                sections, and professional formatting. You can then review and edit the generated content as needed.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5" />
                <span>
                  {selectedType === 'srs' 
                    ? 'Generate SRS with AI'
                    : selectedType 
                      ? `Generate ${getDocumentTypeDisplayName(selectedType)} with AI`
                      : 'Generate Document with AI'
                  }
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-l from-blue-600/90 to-blue-500/80 backdrop-blur-sm rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {selectedType ? getDocumentTypeDisplayName(selectedType) : 'Document Management'}
            </h1>
            <p className="text-blue-100 text-lg">
              {selectedType 
                ? `AI-powered ${getDocumentTypeDisplayName(selectedType).toLowerCase()} generation with deep algorithms.`
                : 'Create, organize, and manage your project documentation with professional templates.'
              }
            </p>

            {/* Cross-Page Navigation */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => window.location.href = '/srs'}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>Go to SRS</span>
              </button>
              <button 
                onClick={() => window.location.href = '/sdd'}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <ServerIcon className="h-4 w-4" />
                <span>Go to SDD</span>
              </button>
              <button 
                onClick={() => window.location.href = '/projects'}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <FolderIcon className="h-4 w-4" />
                <span>View Projects</span>
              </button>
              <button 
                onClick={() => window.location.href = '/templates'}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>Document Templates</span>
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span>
              {selectedType === 'srs' 
                ? 'New SRS'
                : selectedType 
                  ? `New ${getDocumentTypeDisplayName(selectedType)}`
                  : 'New Document'
              }
            </span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by title, system name, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="srs">Software Requirements Specification (SRS)</option>
              <option value="sdd">Software Design Document (SDD)</option>
              <option value="test-cases">Test Cases & Test Plan</option>
              <option value="concept-note">Concept Note & Business Case</option>
              <option value="progress-report">Project Progress Report</option>
              <option value="user-manual">User Manual & Documentation</option>
              <option value="feasibility-study">Feasibility Study</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Status</option>
              {documentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredDocuments.length}</span> of <span className="font-semibold">{documents.length}</span> documents
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FunnelIcon className="h-4 w-4" />
          <span>Filters applied</span>
        </div>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(doc.type)}`}>
                    {doc.type}
                  </span>
                </div>
              </div>

              {/* Document Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{doc.metadata.systemName}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {doc.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Version */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
                <span className="text-sm text-gray-500 font-medium">v{doc.version}</span>
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Last modified by {doc.lastModifiedBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setCurrentDocument(doc)
                    setShowDocumentEditor(true)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.metadata.systemName}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      v{doc.version}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setCurrentDocument(doc)
                            if (doc.type === 'SDD') {
                              setShowSDDViewer(true)
                            } else {
                              setShowDocumentEditor(true)
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && <CreateDocumentModal />}

      {/* Document Editor */}
      {showDocumentEditor && currentDocument && (
        <DocumentEditor
          document={currentDocument}
          onSave={(doc) => {
            console.log('Document saved:', doc)
            setShowDocumentEditor(false)
          }}
          onClose={() => setShowDocumentEditor(false)}
        />
      )}

      {/* SDD Document Viewer */}
      {showSDDViewer && currentDocument && currentDocument.type === 'SDD' && (
        <SDDDocumentViewer
          document={currentDocument}
          onClose={() => setShowSDDViewer(false)}
        />
      )}
    </div>
  )
}

export default Documents
