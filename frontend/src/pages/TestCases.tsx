import React, { useState } from 'react'
import { 
  PlusIcon,
  MagnifyingGlassIcon, 
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { Document } from '../types/index'
import DocumentEditor from '../components/DocumentEditor'

const TestCasesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDocumentEditor, setShowDocumentEditor] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)

  // Sample Test Cases documents
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'E-commerce Platform Test Suite',
      type: 'Test Cases',
      projectId: '1',
      status: 'In Review',
      version: '1.0',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'E-commerce Platform',
        purpose: 'Comprehensive testing strategy',
        scope: 'Functional and non-functional testing',
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
      tags: ['testing', 'e-commerce', 'automation'],
      requirements: [],
    },
    {
      id: '2',
      title: 'Payment Gateway Test Plan',
      type: 'Test Cases',
      projectId: '2',
      status: 'Draft',
      version: '0.5',
      content: { sections: [], diagrams: [], tables: [], attachments: [] },
      metadata: {
        systemName: 'Payment Gateway',
        purpose: 'Payment processing validation',
        scope: 'Security and integration testing',
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
      tags: ['payment', 'security', 'integration'],
      requirements: [],
    }
  ])

  const documentStatuses = ['Draft', 'In Progress', 'In Review', 'Approved', 'Published', 'Archived']

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.metadata.systemName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || doc.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Page Header - Test Cases Specific */}
      <div className="bg-gradient-to-l from-purple-600/90 to-purple-500/80 backdrop-blur-sm rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardDocumentIcon className="h-8 w-8 text-purple-200" />
              <h1 className="text-3xl font-bold">Test Cases & Test Plan</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Testing
              </span>
            </div>
            <p className="text-purple-100 text-lg">
              AI-powered test case generation with comprehensive testing strategies and automation support.
            </p>
            <div className="mt-3 text-purple-100 text-sm opacity-75">
              Create detailed test plans, test cases, and testing strategies with intelligent test scenario generation.
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Test Plan</span>
          </button>
        </div>
      </div>

      {/* Test Cases Specific Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Generation</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Generate comprehensive test cases using AI algorithms with scenario analysis and coverage optimization.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Test Coverage</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Ensure comprehensive test coverage with requirement traceability and risk-based testing.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Automation Ready</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Design test cases that are ready for automation with clear steps and expected results.
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
                placeholder="Search test plans by title, system name, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
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
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-purple-600 shadow-sm' 
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
          Showing {filteredDocuments.length} of {documents.length} test plans
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClipboardDocumentIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Test Cases
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
                'bg-purple-100 text-purple-700'
              }`}>
                {doc.status}
              </span>
              <span className="text-xs text-gray-500">v{doc.version}</span>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setCurrentDocument(doc)
                  setShowDocumentEditor(true)
                }}
                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <EyeIcon className="h-4 w-4" />
                View
              </button>
              <button
                onClick={() => {
                  setCurrentDocument(doc)
                  setShowDocumentEditor(true)
                }}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Test Plan</h2>
            <p className="text-gray-600 mb-6">
              Create a new test plan or test cases document. You can either create it manually or use AI-powered generation.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Handle manual creation
                  setShowCreateModal(false)
                }}
                className="flex-1 bg-purple-600/90 hover:bg-purple-700/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                Manual Creation
              </button>
              <button
                onClick={() => {
                  // Handle AI generation
                  setShowCreateModal(false)
                }}
                className="flex-1 bg-purple-600/90 hover:bg-purple-700/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
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
    </div>
  )
}

export default TestCasesPage
