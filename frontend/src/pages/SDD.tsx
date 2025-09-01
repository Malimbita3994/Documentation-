import React, { useState } from 'react'
import { 
  PlusIcon,
  MagnifyingGlassIcon, 
  ServerIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  FolderIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { Document } from '../types/index'
import { toast } from 'react-toastify'
import SDDGenerator from '../services/documentGenerators/SDDGenerator'
import SDDDocumentViewer from '../components/SDDDocumentViewer'
import DocumentEditor from '../components/DocumentEditor'



const SDDPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showManualModal, setShowManualModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showDocumentEditor, setShowDocumentEditor] = useState(false)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Form states for manual creation
  const [manualForm, setManualForm] = useState({
    title: '',
    systemName: '',
    purpose: '',
    scope: '',
    industry: 'general'
  })
  
  // Form states for AI generation
  const [aiForm, setAiForm] = useState({
    systemRequirements: '',
    industry: 'general',
    architectureType: 'layered',
    includeDiagrams: true,
    includeTraceability: true
  })

  


  // Sample SDD documents
  const [documents] = useState<Document[]>([
    {
      id: '1',
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
      id: '2',
      title: 'E-commerce Platform Architecture SDD',
      type: 'SDD',
      projectId: '2',
      status: 'In Review',
      version: '1.0',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'E-commerce Platform',
        purpose: 'Online shopping system architecture',
        scope: 'System design and architecture',
        stakeholders: [],
        assumptions: [],
        constraints: [],
        references: [],
        glossary: [],
        acronyms: [],
      },
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-22T14:30:00Z',
      createdBy: 'John Doe',
      lastModifiedBy: 'John Doe',
      tags: ['e-commerce', 'architecture', 'design'],
      requirements: [],
    }
  ])

  const documentStatuses = ['Draft', 'In Review', 'Approved', 'Published', 'Archived']

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.metadata.systemName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || doc.status === selectedStatus
    return matchesSearch && matchesStatus
  })



  // Handle document creation
  const handleManualCreation = async () => {
    try {
      if (!manualForm.title.trim() || !manualForm.systemName.trim()) {
        toast.error('Please fill in all required fields')
        return
      }

      const sddGenerator = new SDDGenerator()
      const request = {
        projectId: '1',
        systemRequirements: `System Name: ${manualForm.systemName}\nPurpose: ${manualForm.purpose}\nScope: ${manualForm.scope}\nIndustry: ${manualForm.industry}`,
        documentType: 'SDD',
        additionalSpecs: `Title: ${manualForm.title}\nSystem Name: ${manualForm.systemName}\nPurpose: ${manualForm.purpose}\nScope: ${manualForm.scope}\nIndustry: ${manualForm.industry}`,
        projectContext: {
          title: manualForm.title,
          systemName: manualForm.systemName,
          purpose: manualForm.purpose,
          scope: manualForm.scope,
          industry: manualForm.industry
        }
      }

      setIsGenerating(true)
      const result = await sddGenerator.generateDocument(request)
      
      // Add the new document to the list
      const newDocument = {
        ...result.document,
        title: manualForm.title,
        metadata: {
          ...result.document.metadata,
          systemName: manualForm.systemName,
          purpose: manualForm.purpose,
          scope: manualForm.scope
        }
      }
      
      documents.push(newDocument)
      setShowManualModal(false)
      setManualForm({ title: '', systemName: '', purpose: '', scope: '', industry: 'general' })
      toast.success('SDD created successfully!')
      
    } catch (error) {
      console.error('Error creating SDD:', error)
      toast.error('Failed to create SDD')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAIGeneration = async () => {
    try {
      if (!aiForm.systemRequirements.trim()) {
        toast.error('Please provide system requirements')
        return
      }

      const sddGenerator = new SDDGenerator()
      const request = {
        projectId: '1',
        systemRequirements: aiForm.systemRequirements,
        documentType: 'SDD',
        additionalSpecs: `Industry: ${aiForm.industry}\nArchitecture Type: ${aiForm.architectureType}\nInclude Diagrams: ${aiForm.includeDiagrams}\nInclude Traceability: ${aiForm.includeTraceability}`,
        projectContext: {
          industry: aiForm.industry,
          architectureType: aiForm.architectureType,
          includeDiagrams: aiForm.includeDiagrams,
          includeTraceability: aiForm.includeTraceability
        }
      }

      setIsGenerating(true)
      const result = await sddGenerator.generateDocument(request)
      
      // Add the new document to the list
      documents.push(result.document)
      setShowAIModal(false)
      setAiForm({
        systemRequirements: '',
        industry: 'general',
        architectureType: 'layered',
        includeDiagrams: true,
        includeTraceability: true
      })
      toast.success('AI-generated SDD created successfully!')
      
    } catch (error) {
      console.error('Error generating SDD with AI:', error)
      toast.error('Failed to generate SDD with AI')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewDocument = (doc: Document) => {
    setCurrentDocument(doc)
    setShowDocumentViewer(true)
  }

  const handleEditDocument = (doc: Document) => {
    setCurrentDocument(doc)
    setShowDocumentEditor(true)
  }

  const goToSRS = () => {
    window.location.href = '/srs'
  }

  const goToProjects = () => {
    window.location.href = '/projects'
  }

  const goToDocuments = () => {
    window.location.href = '/documents'
  }


  return (
    <div className="space-y-8">
      {/* Page Header - SDD Specific */}
      <div className="bg-gradient-to-l from-green-600/90 to-green-500/80 backdrop-blur-sm rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ServerIcon className="h-8 w-8 text-green-200" />
              <h1 className="text-3xl font-bold">Software Design Document (SDD)</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                IEEE 1016
              </span>
            </div>
            <p className="text-green-100 text-lg">
              AI-powered SDD generation with deep algorithms and IEEE 1016-2009 compliance.
            </p>
            <div className="mt-3 text-green-100 text-sm opacity-75">
              Create comprehensive software design documents with intelligent architecture design, component specification, and deployment planning.
            </div>
            {/* Cross-Page Navigation */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={goToSRS}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>Go to SRS</span>
              </button>
              <button 
                onClick={goToProjects}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <FolderIcon className="h-4 w-4" />
                <span>View Projects</span>
              </button>
              <button 
                onClick={goToDocuments}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>All Documents</span>
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
            <span>New SDD</span>
          </button>
        </div>
      </div>

      {/* SDD Specific Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Generation</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Generate SDD documents using advanced AI algorithms with architecture design and component specification.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">IEEE 1016 Compliance</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Ensure your SDD meets IEEE 1016-2009 standards with built-in compliance checking.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TagIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Architecture Design</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Design system architecture, components, interfaces, and deployment with visual diagrams.
          </p>
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
                placeholder="Search SDD documents by title, system name, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
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
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Document Count and Actions */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} SDD documents
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <FunnelIcon className="h-4 w-4" />
          Filters applied
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ServerIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                SDD
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{doc.metadata.systemName}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {new Date(doc.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {doc.lastModifiedBy}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                doc.status === 'Published' ? 'bg-green-100 text-green-700' :
                doc.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                doc.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {doc.status}
              </span>
              <span className="text-xs text-gray-500">v{doc.version}</span>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleViewDocument(doc)}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <EyeIcon className="h-4 w-4" />
                View
              </button>
              <button
                onClick={() => handleEditDocument(doc)}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New SDD</h2>
            <p className="text-gray-600 mb-6">
              Create a new Software Design Document. You can either create it manually or use AI-powered generation.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowManualModal(true)
                }}
                className="flex-1 bg-green-600/90 hover:bg-green-700/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                Manual Creation
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowAIModal(true)
                }}
                className="flex-1 bg-green-600/90 hover:bg-green-700/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                AI Generation
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Manual Creation Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create SDD Manually</h2>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={manualForm.title}
                  onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter SDD title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name *
                </label>
                <input
                  type="text"
                  value={manualForm.systemName}
                  onChange={(e) => setManualForm({...manualForm, systemName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter system name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <textarea
                  value={manualForm.purpose}
                  onChange={(e) => setManualForm({...manualForm, purpose: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  rows={3}
                  placeholder="Describe the purpose of the system"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope
                </label>
                <textarea
                  value={manualForm.scope}
                  onChange={(e) => setManualForm({...manualForm, scope: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  rows={3}
                  placeholder="Describe the scope of the system"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={manualForm.industry}
                  onChange={(e) => setManualForm({...manualForm, industry: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                >
                  <option value="general">General</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="government">Government</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowManualModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleManualCreation}
                disabled={isGenerating || !manualForm.title.trim() || !manualForm.systemName.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                    Creating...
                  </>
                ) : (
                  'Create SDD'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generate SDD with AI</h2>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Requirements *
                </label>
                <textarea
                  value={aiForm.systemRequirements}
                  onChange={(e) => setAiForm({...aiForm, systemRequirements: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  rows={6}
                  placeholder="Describe the system requirements, functionality, and key features..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={aiForm.industry}
                    onChange={(e) => setAiForm({...aiForm, industry: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="general">General</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="government">Government</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Architecture Type
                  </label>
                  <select
                    value={aiForm.architectureType}
                    onChange={(e) => setAiForm({...aiForm, architectureType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="layered">Layered Architecture</option>
                    <option value="microservices">Microservices</option>
                    <option value="event-driven">Event-Driven</option>
                    <option value="service-oriented">Service-Oriented</option>
                    <option value="monolithic">Monolithic</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeDiagrams"
                    checked={aiForm.includeDiagrams}
                    onChange={(e) => setAiForm({...aiForm, includeDiagrams: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeDiagrams" className="ml-2 text-sm text-gray-700">
                    Include architecture diagrams
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeTraceability"
                    checked={aiForm.includeTraceability}
                    onChange={(e) => setAiForm({...aiForm, includeTraceability: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeTraceability" className="ml-2 text-sm text-gray-700">
                    Include traceability matrix
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGeneration}
                disabled={isGenerating || !aiForm.systemRequirements.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5 mr-2 inline" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Editor */}
      {showDocumentEditor && currentDocument && (
        <DocumentEditor
          document={currentDocument}
          onClose={() => {
            setShowDocumentEditor(false)
            setCurrentDocument(null)
          }}
          onSave={(updatedDoc) => {
            console.log('Document saved:', updatedDoc)
            setShowDocumentEditor(false)
            setCurrentDocument(null)
          }}
        />
      )}

      {/* Document Viewer */}
      {showDocumentViewer && currentDocument && (
        <SDDDocumentViewer
          document={currentDocument}
          onClose={() => {
            setShowDocumentViewer(false)
            setCurrentDocument(null)
          }}
          onSave={async (updatedDocument) => {
            // In a real app, you would save to backend here
            console.log('Document saved:', updatedDocument)
            toast.success('Document saved successfully!')
          }}
          onEdit={(document) => {
            console.log('Editing document:', document)
            // Handle edit mode
          }}
        />
      )}


    </div>
  )
}

export default SDDPage
