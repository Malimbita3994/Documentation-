import React, { useState, useMemo, useEffect } from 'react'
import Swal from 'sweetalert2'
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  BeakerIcon, 
  DocumentArrowUpIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ServerIcon,
  FolderIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import SRSDocumentCreator from '@components/SRSDocumentCreator'
import RequirementsTraceabilityMatrix from '@components/RequirementsTraceabilityMatrix'
import StakeholderManagement from '@components/StakeholderManagement'
import RequirementsValidationEngine from '@components/RequirementsValidationEngine'
import CollaborationReviewSystem from '@components/CollaborationReviewSystem'
import AdvancedModelingTools from '@components/AdvancedModelingTools'
import EnhancedExportIntegration from '@components/EnhancedExportIntegration'

// Types for better structure
interface SRSDocument {
  id: number
  title: string
  version: string
  status: 'draft' | 'reviewed' | 'approved'
  lastModified: string
  author: string
  standard: string
}

interface SRSRequirement {
  id: string
  type: 'functional' | 'non-functional' | 'interface' | 'data' | 'business-rule'
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  acceptanceCriteria: string[]
  testCases: any[]
  traceability: any[]
  verification: any
  risk: any
  pattern?: string
  parameters?: any
  qualityScore: number
  blockers: string[]
  status: 'draft' | 'reviewed' | 'approved' | 'implemented' | 'tested'
  lastModified: string
  author: string
}

interface TabConfig {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  color: string
}

// Sample data moved to separate section
const SAMPLE_DATA = {
  documents: [
    {
      id: 1,
      title: 'E-Commerce Platform SRS',
      version: '1.0.0',
      status: 'draft' as const,
      lastModified: '2025-08-17',
      author: 'Malimbita',
      standard: 'IEEE 830-1998'
    },
    {
      id: 2,
      title: 'Healthcare Management System SRS',
      version: '2.1.0',
      status: 'reviewed' as const,
      lastModified: '2025-08-16',
      author: 'Development Team',
      standard: 'IEEE 830-1998'
    }
  ],
  requirements: [
    {
      id: 'REQ-001',
      type: 'functional' as const,
      category: 'authentication',
      priority: 'high' as const,
      title: 'User Authentication System',
      description: 'The system shall provide secure user authentication with multi-factor support',
      acceptanceCriteria: ['User can login with username/password and 2FA'],
      testCases: [],
      traceability: [],
      verification: { type: 'test' as const, description: 'Unit and integration testing', criteria: ['Login success/failure'], evidence: 'Test results' },
      risk: { level: 'medium' as const, description: 'Security vulnerability', mitigation: ['Input validation', 'Rate limiting'], probability: 0.3, impact: 0.8 },
      pattern: 'authentication',
      parameters: {},
      qualityScore: 85,
      blockers: [],
      status: 'approved' as const,
      lastModified: '2025-08-17',
      author: 'Malimbita'
    },
    {
      id: 'REQ-002',
      type: 'non-functional' as const,
      category: 'security',
      priority: 'critical' as const,
      title: 'Data Encryption',
      description: 'All sensitive data shall be encrypted at rest and in transit',
      acceptanceCriteria: ['Data is encrypted using AES-256'],
      testCases: [],
      traceability: [],
      verification: { type: 'analyze' as const, description: 'Security analysis', criteria: ['Encryption strength', 'Key management'], evidence: 'Security audit report' },
      risk: { level: 'high' as const, description: 'Data breach', mitigation: ['Strong encryption', 'Regular key rotation'], probability: 0.2, impact: 0.9 },
      pattern: 'security',
      parameters: {},
      qualityScore: 90,
      blockers: [],
      status: 'approved' as const,
      lastModified: '2025-08-17',
      author: 'Malimbita'
    }
  ],
  stakeholders: [
    {
      id: 1,
      name: 'Product Manager',
      role: 'Product Owner',
      influence: 'high',
      interest: 'high',
      requirements: ['REQ-001', 'REQ-002'],
      approvalLevel: 'final'
    },
    {
      id: 2,
      name: 'Development Team Lead',
      role: 'Technical Lead',
      influence: 'medium',
      interest: 'high',
      requirements: ['REQ-002'],
      approvalLevel: 'technical'
    }
  ],
  testCases: [
    {
      id: 'TC-001',
      title: 'Valid User Login',
      preconditions: ['User account exists', 'System is accessible'],
      steps: ['Navigate to login page', 'Enter valid credentials', 'Click login button'],
      expectedResults: ['User is authenticated', 'Redirected to dashboard'],
      evidence: 'Login successful, session created',
      status: 'passed' as const
    },
    {
      id: 'TC-002',
      title: 'Invalid User Login',
      preconditions: ['User account exists', 'System is accessible'],
      steps: ['Navigate to login page', 'Enter invalid credentials', 'Click login button'],
      expectedResults: ['Login fails', 'Error message displayed'],
      evidence: 'Login failed, error message shown',
      status: 'passed' as const
    }
  ],
  designElements: [
    {
      id: 'DESIGN-001',
      title: 'Authentication Module',
      type: 'component',
      requirements: ['REQ-001']
    },
    {
      id: 'DESIGN-002',
      title: 'Encryption Service',
      type: 'service',
      requirements: ['REQ-002']
    }
  ]
}

const ComprehensiveSRSPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview')
  const [documents, setDocuments] = useState<SRSDocument[]>(SAMPLE_DATA.documents)
  const [requirements, setRequirements] = useState<SRSRequirement[]>(SAMPLE_DATA.requirements)
  const [stakeholders] = useState(SAMPLE_DATA.stakeholders)
  const [testCases] = useState(SAMPLE_DATA.testCases)
  const [designElements] = useState(SAMPLE_DATA.designElements)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<SRSDocument | null>(null)
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null)
  
  // SRS Section Data State
  const [introductionData, setIntroductionData] = useState({
    purpose: {
      documentPurpose: '',
      intendedAudience: ''
    },
    scope: {
      systemScope: '',
      boundaries: ''
    },
    definitions: {
      keyTerms: ''
    },
    references: {
      documentReferences: ''
    }
  })
  
  const [overviewData, setOverviewData] = useState({
    productPerspective: {
      systemContext: '',
      interfaces: ''
    },
    productFunctions: {
      majorFunctions: ''
    },
    userClasses: {
      userCategories: ''
    },
    operatingEnvironment: {
      environmentDetails: ''
    },
    designConstraints: {
      constraints: ''
    },
    assumptions: {
      assumptions: ''
    }
  })
  
  // Load saved data on component mount
  useEffect(() => {
    const savedIntroduction = localStorage.getItem('srs-introduction-data')
    const savedOverview = localStorage.getItem('srs-overview-data')
    
    if (savedIntroduction) {
      try {
        setIntroductionData(JSON.parse(savedIntroduction))
      } catch (error) {
        console.error('Error loading introduction data:', error)
      }
    }
    
    if (savedOverview) {
      try {
        setOverviewData(JSON.parse(savedOverview))
      } catch (error) {
        console.error('Error loading overview data:', error)
      }
    }
  }, [])

  // Tab configuration with better organization
  const tabs: TabConfig[] = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: DocumentTextIcon,
      description: 'SRS overview and statistics',
      color: 'blue'
    },
    { 
      id: 'documents', 
      name: 'SRS Documents', 
      icon: DocumentTextIcon,
      description: 'Build and manage SRS documents with all sections',
      color: 'green'
    },
    { 
      id: 'requirements', 
      name: 'Requirements', 
      icon: BeakerIcon,
      description: 'Requirements management',
      color: 'purple'
    },
    { 
      id: 'traceability', 
      name: 'Traceability', 
      icon: ChartBarIcon,
      description: 'Requirements traceability matrix',
      color: 'indigo'
    },
    { 
      id: 'stakeholders', 
      name: 'Stakeholders', 
      icon: UserGroupIcon,
      description: 'Stakeholder management',
      color: 'pink'
    },
    { 
      id: 'validation', 
      name: 'Validation', 
      icon: BeakerIcon,
      description: 'Requirements validation engine',
      color: 'yellow'
    },
    { 
      id: 'collaboration', 
      name: 'Collaboration', 
      icon: UserGroupIcon,
      description: 'Team collaboration and review',
      color: 'teal'
    },
    { 
      id: 'modeling', 
      name: 'Modeling', 
      icon: ChartBarIcon,
      description: 'UML modeling tools',
      color: 'orange'
    },
    { 
      id: 'export', 
      name: 'Export & Integration', 
      icon: DocumentArrowUpIcon,
      description: 'Export and external integrations',
      color: 'red'
    }
  ]

  // Computed values
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.author.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [documents, searchTerm, filterStatus])

  const stats = useMemo(() => ({
    documents: documents.length,
    requirements: requirements.length,
    stakeholders: stakeholders.length,
    testCases: testCases.length,
    functionalRequirements: requirements.filter(r => r.type === 'functional').length,
    nonFunctionalRequirements: requirements.filter(r => r.type === 'non-functional').length,
    approvedRequirements: requirements.filter(r => r.status === 'approved').length
  }), [documents, requirements, stakeholders, testCases])

  // Event handlers
  const handleCreateSRS = () => setShowCreateModal(true)
  
  const handleEditDocument = (documentId: number) => {
    const document = documents.find(doc => doc.id === documentId)
    if (document) {
      setSelectedDocument(document)
      setShowEditModal(true)
    }
  }
  
  const handleDeleteDocument = (documentId: number) => {
    const documentToDelete = documents.find(doc => doc.id === documentId)
    
    Swal.fire({
      title: 'Delete SRS Document?',
      text: `Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setDocuments(documents.filter(doc => doc.id !== documentId))
        // Also remove associated requirements
        setRequirements(requirements.filter(req => !req.title.includes(documentToDelete?.title || '')))
        
        Swal.fire(
          'Deleted!',
          'SRS Document has been deleted successfully.',
          'success'
        )
        
        setNotification({
          type: 'success',
          message: '✅ SRS Document deleted successfully!'
        })
        
        setTimeout(() => setNotification(null), 3000)
      }
    })
  }
  
  const handleViewDocument = (documentId: number) => {
    const document = documents.find(doc => doc.id === documentId)
    if (document) {
      setSelectedDocument(document)
      setShowViewModal(true)
    }
  }
  
  const handleDocumentUpdate = (updatedDoc: SRSDocument) => {
    setDocuments(documents.map(doc => 
      doc.id === updatedDoc.id ? { ...updatedDoc, lastModified: new Date().toISOString().split('T')[0] } : doc
    ))
    
    setShowEditModal(false)
    setSelectedDocument(null)
    
    // Show success feedback with SweetAlert2
    Swal.fire({
      title: 'Updated!',
      text: `SRS Document "${updatedDoc.title}" has been updated successfully.`,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true
    })
    
    // Also show notification
    setNotification({
      type: 'success',
      message: `✅ SRS Document "${updatedDoc.title}" updated successfully!`
    })
    
    setTimeout(() => setNotification(null), 3000)
  }
  
  // SRS Section Data Handlers
  const handleIntroductionUpdate = (section: string, field: string, value: string) => {
    setIntroductionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }
  
  const handleOverviewUpdate = (section: string, field: string, value: string) => {
    setOverviewData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }
  
  const handleSaveIntroduction = () => {
    // Save introduction data (in a real app, this would go to backend)
    localStorage.setItem('srs-introduction-data', JSON.stringify(introductionData))
    
    // Show success message
    Swal.fire({
      title: 'Saved!',
      text: 'Introduction sections have been saved successfully.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true
    })
    
    // Update notification
    setNotification({
      type: 'success',
      message: '✅ Introduction sections saved successfully!'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }
  
  const handleSaveOverview = () => {
    // Save overview data (in a real app, this would go to backend)
    localStorage.setItem('srs-overview-data', JSON.stringify(overviewData))
    
    // Show success message
    Swal.fire({
      title: 'Saved!',
      text: 'Overview sections have been saved successfully.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true
    })
    
    // Update notification
    setNotification({
      type: 'success',
      message: '✅ Overview sections saved successfully!'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }
  
  const handleDocumentCreate = (newDoc: any) => {
    const newDocument = {
      ...newDoc,
      id: Date.now(),
      version: newDoc.version || '1.0.0',
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Malimbita',
      standard: 'IEEE 830-1998'
    }
    
    setDocuments([...documents, newDocument])
    
    // Auto-generate sample requirements for the new document
    const documentRequirements = [
      {
        id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
        type: 'functional' as const,
        category: 'document-management',
        priority: 'high' as const,
        title: `${newDocument.title} - Core Functionality`,
        description: `The system shall provide core functionality for ${newDocument.title}`,
        acceptanceCriteria: ['Core features are implemented', 'Basic functionality works as expected'],
        testCases: [],
        traceability: [],
        verification: { type: 'test' as const, description: 'Unit and integration testing', criteria: ['Feature functionality'], evidence: 'Test results' },
        risk: { level: 'medium' as const, description: 'Development complexity', mitigation: ['Proper planning', 'Iterative development'], probability: 0.4, impact: 0.7 },
        pattern: 'core-functionality',
        parameters: {},
        qualityScore: 80,
        blockers: [],
        status: 'draft' as const,
        lastModified: new Date().toISOString().split('T')[0],
        author: 'Malimbita'
      },
      {
        id: `REQ-${String(requirements.length + 2).padStart(3, '0')}`,
        type: 'non-functional' as const,
        category: 'performance',
        priority: 'medium' as const,
        title: `${newDocument.title} - Performance Requirements`,
        description: `The system shall meet performance standards for ${newDocument.title}`,
        acceptanceCriteria: ['Response time under 2 seconds', 'System handles expected load'],
        testCases: [],
        traceability: [],
        verification: { type: 'test' as const, description: 'Performance testing', criteria: ['Response time', 'Load handling'], evidence: 'Performance test results' },
        risk: { level: 'low' as const, description: 'Performance bottlenecks', mitigation: ['Optimization', 'Monitoring'], probability: 0.3, impact: 0.6 },
        pattern: 'performance',
        parameters: {},
        qualityScore: 75,
        blockers: [],
        status: 'draft' as const,
        lastModified: new Date().toISOString().split('T')[0],
        author: 'Malimbita'
      }
    ]
    
    setRequirements([...requirements, ...documentRequirements])
    setShowCreateModal(false)
    
    // Show success feedback with SweetAlert2
    Swal.fire({
      title: 'Success!',
      text: `New SRS Document "${newDocument.title}" created successfully with ${documentRequirements.length} auto-generated requirements!`,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true
    })
    
    // Also show notification
    setNotification({
      type: 'success',
      message: `✅ New SRS Document "${newDocument.title}" created successfully with ${documentRequirements.length} auto-generated requirements!`
    })
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddRequirement = (newRequirement: any) => {
    const requirementWithId = {
      ...newRequirement,
      id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Malimbita',
      testCases: [],
      traceability: [],
      verification: { type: 'test' as const, description: '', criteria: [], evidence: '' },
      risk: { level: 'medium' as const, description: '', mitigation: [], probability: 0.5, impact: 0.5 },
      pattern: '',
      parameters: {},
      qualityScore: 70,
      blockers: []
    }
    
    setRequirements([...requirements, requirementWithId])
    setShowAddRequirementModal(false)
    
    // Show success feedback with SweetAlert2
    Swal.fire({
      title: 'Requirement Added!',
      text: `New requirement "${requirementWithId.title}" has been added successfully.`,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true
    })
    
    // Also show notification
    setNotification({
      type: 'success',
      message: `✅ New Requirement "${requirementWithId.title}" added successfully!`
    })
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => setNotification(null), 5000)
    
    // If we have active documents, suggest linking the requirement
    if (documents.length > 0) {
      setTimeout(() => {
        setNotification({
          type: 'info',
          message: `💡 Tip: Consider linking this requirement to an SRS document for better traceability!`
        })
        setTimeout(() => setNotification(null), 4000)
      }, 1000)
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Reset search and filters when changing tabs
    if (tabId !== 'documents') {
      setSearchTerm('')
      setFilterStatus('all')
    }
  }

  // Tab content renderer with better organization
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} />
      case 'documents':
        return (
          <DocumentsTab 
            documents={filteredDocuments}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            onCreateDocument={handleCreateSRS}
            onEditDocument={handleEditDocument}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            introductionData={introductionData}
            overviewData={overviewData}
            onIntroductionUpdate={handleIntroductionUpdate}
            onOverviewUpdate={handleOverviewUpdate}
            onSaveIntroduction={handleSaveIntroduction}
            onSaveOverview={handleSaveOverview}
          />
        )
      case 'requirements':
        return <RequirementsTab requirements={requirements} stats={stats} onAddRequirement={() => setShowAddRequirementModal(true)} />
      case 'traceability':
        return (
          <RequirementsTraceabilityMatrix 
            requirements={requirements}
            testCases={testCases}
            designElements={designElements}
          />
        )
      case 'stakeholders':
        return <StakeholderManagement />
      case 'validation':
        return <RequirementsValidationEngine requirements={requirements} />
      case 'collaboration':
        return <CollaborationReviewSystem requirements={requirements} />
      case 'modeling':
        return <AdvancedModelingTools />
      case 'export':
        return <EnhancedExportIntegration />
      default:
        return <div className="text-center text-gray-500">Select a tab to view content</div>
    }
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : 'bg-blue-100 border border-blue-300 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full overflow-hidden">
        {/* Enhanced Tab Navigation */}
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="px-4 pb-8 w-full overflow-hidden max-w-full">
          <div className="w-full max-w-full overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Create SRS Modal */}
      {showCreateModal && (
        <CreateSRSModal 
          onClose={() => setShowCreateModal(false)}
          onSave={handleDocumentCreate}
          externalRequirements={requirements}
          onRequirementsUpdate={(updatedRequirements) => {
            setRequirements(updatedRequirements)
            console.log('🔄 Requirements synced from SRS Document Creator:', updatedRequirements.length)
          }}
        />
      )}

      {/* Add Requirement Modal */}
      {showAddRequirementModal && (
        <AddRequirementModal 
          onClose={() => setShowAddRequirementModal(false)}
          onSave={handleAddRequirement}
        />
      )}

      {/* Edit SRS Modal */}
      {showEditModal && selectedDocument && (
        <EditSRSModal
          document={selectedDocument}
          onClose={() => {
            setShowEditModal(false)
            setSelectedDocument(null)
          }}
          onSave={handleDocumentUpdate}
        />
      )}

      {/* View SRS Modal */}
      {showViewModal && selectedDocument && (
        <ViewSRSModal
          document={selectedDocument}
          onClose={() => {
            setShowViewModal(false)
            setSelectedDocument(null)
          }}
        />
      )}

      {/* Cross-Page Navigation */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button 
          onClick={() => window.location.href = '/sdd'}
          className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-green-200"
        >
          <ServerIcon className="h-4 w-4" />
          <span>Go to SDD</span>
        </button>
        <button 
          onClick={() => window.location.href = '/projects'}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-purple-200"
        >
          <FolderIcon className="h-4 w-4" />
          <span>View Projects</span>
        </button>
        <button 
          onClick={() => window.location.href = '/documents'}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-indigo-200"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>All Documents</span>
        </button>
        <button 
          onClick={() => window.location.href = '/templates'}
          className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-teal-200"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>Document Templates</span>
        </button>
        <button 
          onClick={() => window.location.href = '/qr-generator'}
          className="bg-pink-50 hover:bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 border border-pink-200"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>QR Code Generator</span>
        </button>
      </div>
    </div>
  )
}

// Separate components for better organization
const TabNavigation: React.FC<{
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tabId: string) => void
}> = ({ tabs, activeTab, onTabChange }) => (
  <div className="bg-white border-b border-gray-200 mb-6">
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            activeTab === tab.id
              ? `bg-${tab.color}-100 text-${tab.color}-700 border-${tab.color}-200 border-2`
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-2 border-transparent'
          }`}
          title={tab.description}
        >
          <tab.icon className="w-5 h-5" />
          <span className="hidden sm:inline">{tab.name}</span>
          <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  </div>
)

const OverviewTab: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="space-y-8">
    {/* Header Section with Ocean Waves */}
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8 mb-8">
      <div className="absolute inset-0">
        <div className="ocean-header-waves">
          <div className="wave-header wave-header-1"></div>
          <div className="wave-header wave-header-2"></div>
          <div className="wave-header wave-header-3"></div>
        </div>
      </div>
      
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Software Requirements Specification (SRS)
        </h1>
        <div className="inline-flex items-center px-4 py-2 rounded-full text-lg font-medium bg-blue-100 text-blue-800 mb-6">
          IEEE 830-1998 Standard
        </div>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          Comprehensive SRS development with AI-powered generation, IEEE compliance, and enterprise-grade tools for professional software requirements management.
        </p>
      </div>
      
      {/* Ocean Wave Styles for Header */}
      <style>{`
        .ocean-header-waves {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .wave-header {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.08));
          border-radius: 50%;
          transform: translateX(-50%);
          animation: wave-header-move 10s ease-in-out infinite;
        }
        
        .wave-header-1 {
          bottom: -30%;
          animation-delay: 0s;
          opacity: 0.4;
        }
        
        .wave-header-2 {
          bottom: -50%;
          animation-delay: 3s;
          opacity: 0.3;
        }
        
        .wave-header-3 {
          bottom: -70%;
          animation-delay: 6s;
          opacity: 0.2;
        }
        
        @keyframes wave-header-move {
          0%, 100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-15px);
          }
        }
      `}</style>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
        <div className="text-blue-600 mb-4">
          <DocumentTextIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-blue-900 mb-3">AI-Powered Generation</h3>
        <p className="text-blue-700 text-sm">Generate comprehensive SRS documents using advanced AI algorithms with IEEE 830-1998 compliance</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
        <div className="text-green-600 mb-4">
          <BeakerIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-green-900 mb-3">Requirements Management</h3>
        <p className="text-green-700 text-sm">Advanced requirements traceability, validation, and stakeholder management</p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
        <div className="text-purple-600 mb-4">
          <ChartBarIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-purple-900 mb-3">Professional Tools</h3>
        <p className="text-purple-700 text-sm">UML modeling, collaboration workflows, and enterprise export capabilities</p>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div className="text-xl font-bold text-blue-600 mb-2">{stats.documents}</div>
        <div className="text-gray-600 text-sm">SRS Documents</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div className="text-xl font-bold text-green-600 mb-2">{stats.requirements}</div>
        <div className="text-gray-600 text-sm">Requirements</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div className="text-xl font-bold text-purple-600 mb-2">{stats.stakeholders}</div>
        <div className="text-gray-600 text-sm">Stakeholders</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
        <div className="text-xl font-bold text-orange-600 mb-2">{stats.testCases}</div>
        <div className="text-gray-600 text-sm">Test Cases</div>
      </div>
    </div>

                {/* Integration Info */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">🔄 Integrated Workflow</h4>
                <p className="text-sm text-blue-700">
                  <strong>New Document</strong> → <strong>Auto-generates Requirements</strong> → <strong>Add Custom Requirements</strong> → <strong>Full Traceability</strong>
                </p>
              </div>
            </div>
  </div>
)

const DocumentsTab: React.FC<{
  documents: SRSDocument[]
  searchTerm: string
  filterStatus: string
  onSearchChange: (term: string) => void
  onFilterChange: (status: string) => void
  onCreateDocument: () => void
  onEditDocument: (documentId: number) => void
  onViewDocument: (documentId: number) => void
  onDeleteDocument: (documentId: number) => void
  introductionData: any
  overviewData: any
  onIntroductionUpdate: (section: string, field: string, value: string) => void
  onOverviewUpdate: (section: string, field: string, value: string) => void
  onSaveIntroduction: () => void
  onSaveOverview: () => void
}> = ({ documents, searchTerm, filterStatus, onSearchChange, onFilterChange, onCreateDocument, onEditDocument, onViewDocument, onDeleteDocument, introductionData, overviewData, onIntroductionUpdate, onOverviewUpdate, onSaveIntroduction, onSaveOverview }) => {
  const [activeSection, setActiveSection] = useState('documents-list')
  
  const srsSections = [
    { id: 'documents-list', name: 'Documents', icon: DocumentTextIcon },
    { id: 'introduction', name: '1. Intro', icon: DocumentTextIcon },
    { id: 'overall-description', name: '2. Overview', icon: ChartBarIcon },
    { id: 'functional-requirements', name: '3.1 Functional', icon: BeakerIcon },
    { id: 'non-functional-requirements', name: '3.2 Non-Functional', icon: BeakerIcon },
    { id: 'external-interfaces', name: '3.3 Interfaces', icon: ChartBarIcon },
    { id: 'performance-requirements', name: '3.4 Performance', icon: ChartBarIcon },
    { id: 'design-constraints', name: '3.5 Constraints', icon: ChartBarIcon },
    { id: 'software-attributes', name: '3.6 Attributes', icon: BeakerIcon },
    { id: 'appendices', name: '4. Appendices', icon: DocumentTextIcon }
  ]

                  const renderSectionContent = () => {
                  switch (activeSection) {
                    case 'documents-list':
        return (
                                  <div className="space-y-6 w-full overflow-hidden">
                          {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
              <div className="flex-1 relative min-w-0">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => onFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-shrink-0"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Document</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Version</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Last Modified</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents && documents.length > 0 ? (
                      documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div className="truncate">
                              <div className="font-medium text-gray-900 truncate">{doc.title}</div>
                              <div className="text-gray-500 truncate">{doc.standard}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 truncate">{doc.version}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                              doc.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 truncate">{doc.author}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 truncate">{doc.lastModified}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => onEditDocument(doc.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3 hover:underline"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => onViewDocument(doc.id)}
                              className="text-green-600 hover:text-green-900 mr-3 hover:underline"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => onDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-900 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          <div className="space-y-2">
                            <p>No documents found</p>
                            <p className="text-sm">Documents count: {documents ? documents.length : 'undefined'}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      
      case 'introduction':
        return (
          <IntroductionSection 
            data={introductionData}
            onUpdate={onIntroductionUpdate}
            onSave={onSaveIntroduction}
            overviewData={overviewData}
          />
        )
      
      case 'overall-description':
        return (
          <OverallDescriptionSection 
            data={overviewData}
            onUpdate={onOverviewUpdate}
            onSave={onSaveOverview}
            introductionData={introductionData}
          />
        )
      
      case 'functional-requirements':
        return <FunctionalRequirementsSection />
      
      case 'non-functional-requirements':
        return <NonFunctionalRequirementsSection />
      
      case 'external-interfaces':
        return <ExternalInterfacesSection />
      
      case 'performance-requirements':
        return <PerformanceRequirementsSection />
      
      case 'design-constraints':
        return <DesignConstraintsSection />
      
      case 'software-attributes':
        return <SoftwareAttributesSection />
      
      case 'appendices':
        return <AppendicesSection />
      
      default:
        return <div className="text-center text-gray-500">Select a section to view content</div>
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Enhanced Ocean Waves Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 w-full">
        <div className="absolute inset-0">
          <div className="ocean-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>
        
        <div className="relative z-10 p-6 w-full">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-bold text-gray-900 truncate">SRS Documents</h2>
            <button 
              onClick={onCreateDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              New Document
            </button>
          </div>
        </div>
        
        {/* Ocean Wave Styles */}
        <style>{`
          .ocean-waves {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
            border-radius: 50%;
            transform: translateX(-50%);
            animation: wave-move 8s ease-in-out infinite;
          }
          
          .wave-1 {
            bottom: -20%;
            animation-delay: 0s;
            opacity: 0.3;
          }
          
          .wave-2 {
            bottom: -40%;
            animation-delay: 2s;
            opacity: 0.2;
          }
          
          .wave-3 {
            bottom: -60%;
            animation-delay: 4s;
            opacity: 0.1;
          }
          
          @keyframes wave-move {
            0%, 100% {
              transform: translateX(-50%) translateY(0px);
            }
            50% {
              transform: translateX(-50%) translateY(-20px);
            }
          }
        `}</style>
      </div>

      {/* SRS Sections as Horizontal Sub-Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg w-full max-w-full">
        {/* Custom CSS for grid layout */}
        <style>{`
          .grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        `}</style>
        {/* Sub-Tabs Navigation - Two Rows */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 w-full">
          <div className="grid grid-cols-5 gap-1 p-2">
            {srsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center justify-center space-x-1 px-2 py-2 text-xs font-medium whitespace-nowrap border-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50 shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <section.icon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="p-6 w-full overflow-hidden">
          {/* Section Header */}
          <div className="mb-6 w-full">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {srsSections.find(s => s.id === activeSection)?.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {activeSection === 'documents-list' 
                ? 'Manage and view all SRS documents'
                : `Build the ${srsSections.find(s => s.id === activeSection)?.name} section of your SRS document`
              }
            </p>
          </div>

          {/* Section Content */}
          <div className="w-full overflow-hidden">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  )
}


const RequirementsTab: React.FC<{ 
  requirements: SRSRequirement[]; 
  stats: any;
  onAddRequirement: () => void;
}> = ({ requirements, stats, onAddRequirement }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">Requirements Management</h2>
      <button 
        onClick={onAddRequirement}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        <PlusIcon className="w-5 h-5 inline mr-2" />
        Add Requirement
      </button>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements List</h3>
        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-900">{req.id}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  req.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  req.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {req.priority}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{req.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{req.description}</p>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  req.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {req.status}
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {req.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements Statistics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Functional Requirements</span>
              <span className="font-medium">{stats.functionalRequirements}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Non-Functional Requirements</span>
              <span className="font-medium">{stats.nonFunctionalRequirements}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Approved Requirements</span>
              <span className="font-medium">{stats.approvedRequirements}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const IntroductionSection: React.FC<{
  data: any
  onUpdate: (section: string, field: string, value: string) => void
  onSave: () => void
  overviewData?: any
}> = ({ data, onUpdate, onSave, overviewData }) => {
  // Update functional requirements summary when component mounts
  useEffect(() => {
    const updateFRSummary = () => {
      const savedRequirements = localStorage.getItem('srs-functional-requirements')
      if (savedRequirements) {
        try {
          const requirements = JSON.parse(savedRequirements)
          const countElement = document.getElementById('fr-count')
          const priorityElement = document.getElementById('fr-priority')
          const statusElement = document.getElementById('fr-status')
          
          if (countElement) countElement.textContent = `${requirements.length} requirements`
          
          if (priorityElement) {
            const priorityCounts = requirements.reduce((acc: any, req: any) => {
              acc[req.priority] = (acc[req.priority] || 0) + 1
              return acc
            }, {})
            priorityElement.textContent = Object.entries(priorityCounts)
              .map(([priority, count]) => `${priority}: ${count}`)
              .join(', ')
          }
          
          if (statusElement) {
            const statusCounts = requirements.reduce((acc: any, req: any) => {
              acc[req.status] = (acc[req.status] || 0) + 1
              return acc
            }, {})
            statusElement.textContent = Object.entries(statusCounts)
              .map(([status, count]) => `${status}: ${count}`)
              .join(', ')
          }
        } catch (error) {
          console.error('Error updating FR summary:', error)
        }
      }
    }
    
    updateFRSummary()
    // Update every 2 seconds to catch changes from other tabs
    const interval = setInterval(updateFRSummary, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
      <p className="text-gray-600">IEEE 830-1998 Standard Introduction Sections</p>
    </div>
    
    {/* Overview Summary - Shows data from Overview tab */}
    {overviewData && (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Overview Summary (Data from Tab 2)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-green-800">System Context:</span>
            <p className="text-green-700 mt-1">{overviewData.productPerspective.systemContext || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-green-800">Major Functions:</span>
            <p className="text-green-700 mt-1">{overviewData.productFunctions.majorFunctions || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-green-800">User Categories:</span>
            <p className="text-green-700 mt-1">{overviewData.userClasses.userCategories || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-green-800">Environment:</span>
            <p className="text-green-700 mt-1">{overviewData.operatingEnvironment.environmentDetails || 'Not specified'}</p>
          </div>
        </div>
      </div>
    )}

    {/* Functional Requirements Summary */}
    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Functional Requirements Summary (Data from Tab 3.1)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium text-purple-800">Total Requirements:</span>
          <p className="text-purple-700 mt-1" id="fr-count">Loading...</p>
        </div>
        <div>
          <span className="font-medium text-purple-800">Priority Distribution:</span>
          <p className="text-purple-700 mt-1" id="fr-priority">Loading...</p>
        </div>
        <div>
          <span className="font-medium text-purple-800">Status Overview:</span>
          <p className="text-purple-700 mt-1" id="fr-status">Loading...</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1.1 Purpose */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.1 Purpose</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Purpose</label>
            <textarea
              rows={4}
              value={data.purpose.documentPurpose}
              onChange={(e) => onUpdate('purpose', 'documentPurpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Specify the purpose of this SRS document..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intended Audience</label>
            <input
              type="text"
              value={data.purpose.intendedAudience}
              onChange={(e) => onUpdate('purpose', 'intendedAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Developers, Testers, Project Managers, Stakeholders"
            />
          </div>
        </div>
      </div>

      {/* 1.2 Scope */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.2 Scope</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Scope</label>
            <textarea
              rows={4}
              value={data.scope.systemScope}
              onChange={(e) => onUpdate('scope', 'systemScope', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Define what the system will and will not do..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Boundaries</label>
            <input
              type="text"
              value={data.scope.boundaries}
              onChange={(e) => onUpdate('scope', 'boundaries', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., User interfaces, External systems, Data sources"
            />
          </div>
        </div>
      </div>

      {/* 1.3 Definitions, Acronyms, and Abbreviations */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.3 Definitions, Acronyms, and Abbreviations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Terms</label>
            <textarea
              rows={4}
              value={data.definitions.keyTerms}
              onChange={(e) => onUpdate('definitions', 'keyTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Define important terms, acronyms, and abbreviations..."
            />
          </div>
        </div>
      </div>

      {/* 1.4 References */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.4 References</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document References</label>
            <textarea
              rows={4}
              value={data.references.documentReferences}
              onChange={(e) => onUpdate('references', 'documentReferences', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List relevant documents, standards, and references..."
            />
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="text-center pt-6">
      <button 
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
      >
        Save Introduction Sections
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1.1 Purpose */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.1 Purpose</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Purpose</label>
            <textarea
              rows={4}
              value={data.purpose.documentPurpose}
              onChange={(e) => onUpdate('purpose', 'documentPurpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Specify the purpose of this SRS document..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Intended Audience</label>
            <input
              type="text"
              value={data.purpose.intendedAudience}
              onChange={(e) => onUpdate('purpose', 'intendedAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Developers, Testers, Project Managers, Stakeholders"
            />
          </div>
        </div>
      </div>

      {/* 1.2 Scope */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.2 Scope</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Scope</label>
            <textarea
              rows={4}
              value={data.scope.systemScope}
              onChange={(e) => onUpdate('scope', 'systemScope', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Define what the system will and will not do..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Boundaries</label>
            <input
              type="text"
              value={data.scope.boundaries}
              onChange={(e) => onUpdate('scope', 'boundaries', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., User interfaces, External systems, Data sources"
            />
          </div>
        </div>
      </div>

      {/* 1.3 Definitions, Acronyms, and Abbreviations */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.3 Definitions, Acronyms, and Abbreviations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Terms</label>
            <textarea
              rows={4}
              value={data.definitions.keyTerms}
              onChange={(e) => onUpdate('definitions', 'keyTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Define important terms, acronyms, and abbreviations..."
            />
          </div>
        </div>
      </div>

      {/* 1.4 References */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1.4 References</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document References</label>
            <textarea
              rows={4}
              value={data.references.documentReferences}
              onChange={(e) => onUpdate('references', 'documentReferences', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List relevant documents, standards, and references..."
            />
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="text-center pt-6">
      <button 
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
      >
        Save Introduction Sections
      </button>
    </div>
  </div>
)
}

const OverallDescriptionSection: React.FC<{
  data: any
  onUpdate: (section: string, field: string, value: string) => void
  onSave: () => void
  introductionData?: any
}> = ({ data, onUpdate, onSave, introductionData }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">Overall Description</h2>
      <p className="text-gray-600">IEEE 830-1998 Standard Overall Description Sections</p>
    </div>
    
    {/* Introduction Summary - Shows data from Introduction tab */}
    {introductionData && (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Introduction Summary (Data from Tab 1)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Purpose:</span>
            <p className="text-blue-700 mt-1">{introductionData.purpose.documentPurpose || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Audience:</span>
            <p className="text-blue-700 mt-1">{introductionData.purpose.intendedAudience || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Scope:</span>
            <p className="text-blue-700 mt-1">{introductionData.scope.systemScope || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Boundaries:</span>
            <p className="text-blue-700 mt-1">{introductionData.scope.boundaries || 'Not specified'}</p>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 2.1 Product Perspective */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.1 Product Perspective</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Context</label>
            <textarea
              rows={4}
              value={data.productPerspective.systemContext}
              onChange={(e) => onUpdate('productPerspective', 'systemContext', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the system in relation to other systems..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interfaces</label>
            <input
              type="text"
              value={data.productPerspective.interfaces}
              onChange={(e) => onUpdate('productPerspective', 'interfaces', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., User interfaces, Hardware interfaces, Software interfaces"
            />
          </div>
        </div>
      </div>

      {/* 2.2 Product Functions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.2 Product Functions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major Functions</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Summarize the major functions the product will perform..."
            />
          </div>
        </div>
      </div>

      {/* 2.3 User Classes and Characteristics */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.3 User Classes and Characteristics</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Categories</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Identify the different classes of users and their characteristics..."
            />
          </div>
        </div>
      </div>

      {/* 2.4 Operating Environment */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.4 Operating Environment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Environment Details</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the environment in which the software will operate..."
            />
          </div>
        </div>
      </div>

      {/* 2.5 Design and Implementation Constraints */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.5 Design and Implementation Constraints</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Constraints</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List any constraints that limit the options for the developer..."
            />
          </div>
        </div>
      </div>

      {/* 2.6 Assumptions and Dependencies */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2.6 Assumptions and Dependencies</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assumptions</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List any assumptions and dependencies..."
            />
          </div>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="text-center pt-6">
      <button 
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
      >
        Save Overall Description
      </button>
    </div>
  </div>
)

const FunctionalRequirementsSection: React.FC<{
  data?: any
  onUpdate?: (section: string, field: string, value: string) => void
  onSave?: () => void
}> = ({ onSave }) => {
  const [functionalRequirements, setFunctionalRequirements] = useState([
    {
      id: 'FR-01',
      title: 'Register ICT Assets',
      description: 'The system shall allow users to register ICT assets by capturing fields such as device name, brand, model, serial number, barcode, and custodian.',
      priority: 'high',
      category: 'asset-management',
      status: 'draft',
      useCase: {
        id: 'FR-01',
        name: 'Register ICT Assets',
        primaryActor: 'ICT Asset Officer',
        description: 'Allows users to register ICT assets by inputting detailed asset information for tracking, auditing, and reporting purposes.',
        stakeholders: ['ICT Officers', 'Asset Management Team', 'MoEST ICT Department'],
        preconditions: [
          'User must be logged in with permission to register assets.',
          'System is accessible and operational.'
        ],
        postconditions: 'Asset is recorded and stored in the institution\'s inventory database.',
        inputs: [
          'Device Name',
          'Brand',
          'Model',
          'Serial Number',
          'Barcode',
          'Custodian'
        ],
        processing: [
          'User logs into ISRS.',
          'Navigates to "Asset Registration".',
          'Inputs asset data.',
          'System checks for duplicates.',
          'Saves and logs the asset record.'
        ],
        outputs: ['Success message: "Asset registered successfully."'],
        alternativeFlows: [
          'If barcode or serial number is duplicated: System shows: "Duplicate asset detected."',
          'If required fields are missing: System prompts user to fill mandatory fields.'
        ]
      }
    }
  ])

  // Load saved functional requirements on component mount
  useEffect(() => {
    const savedRequirements = localStorage.getItem('srs-functional-requirements')
    if (savedRequirements) {
      try {
        setFunctionalRequirements(JSON.parse(savedRequirements))
      } catch (error) {
        console.error('Error loading functional requirements:', error)
      }
    }
  }, [])

  const addRequirement = () => {
    const newId = `FR-${String(functionalRequirements.length + 1).padStart(2, '0')}`
    setFunctionalRequirements([
      ...functionalRequirements,
      {
        id: newId,
        title: '',
        description: '',
        priority: 'high',
        category: 'asset-management',
        status: 'draft',
        useCase: {
          id: newId,
          name: '',
          primaryActor: '',
          description: '',
          stakeholders: [''],
          preconditions: [''],
          postconditions: '',
          inputs: [''],
          processing: [''],
          outputs: [''],
          alternativeFlows: ['']
        }
      }
    ])
  }

  const removeRequirement = (index: number) => {
    if (functionalRequirements.length > 1) {
      setFunctionalRequirements(functionalRequirements.filter((_, i) => i !== index))
    }
  }

  const updateRequirement = (index: number, field: string, value: any) => {
    const updated = [...functionalRequirements]
    updated[index] = { ...updated[index], [field]: value }
    setFunctionalRequirements(updated)
  }

  const updateUseCaseField = (reqIndex: number, field: string, value: any) => {
    const updated = [...functionalRequirements]
    updated[reqIndex].useCase = { ...updated[reqIndex].useCase, [field]: value }
    setFunctionalRequirements(updated)
  }

  const updateUseCaseArray = (reqIndex: number, field: string, index: number, value: string) => {
    const updated = [...functionalRequirements]
    const useCase = updated[reqIndex].useCase as any
    if (Array.isArray(useCase[field])) {
      useCase[field][index] = value
      setFunctionalRequirements(updated)
    }
  }

  const addUseCaseArrayItem = (reqIndex: number, field: string) => {
    const updated = [...functionalRequirements]
    const useCase = updated[reqIndex].useCase as any
    if (Array.isArray(useCase[field])) {
      useCase[field].push('')
      setFunctionalRequirements(updated)
    }
  }

  const removeUseCaseArrayItem = (reqIndex: number, field: string, index: number) => {
    const updated = [...functionalRequirements]
    const useCase = updated[reqIndex].useCase as any
    if (Array.isArray(useCase[field]) && useCase[field].length > 1) {
      useCase[field].splice(index, 1)
      setFunctionalRequirements(updated)
    }
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('srs-functional-requirements', JSON.stringify(functionalRequirements))
    
    // Show success message
    Swal.fire({
      title: 'Saved!',
      text: `${functionalRequirements.length} functional requirements have been saved successfully.`,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true
    })
    
    if (onSave) onSave()
  }

  return (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.1 Functional Requirements</h2>
        <p className="text-gray-600">Define what the system must do - Add multiple requirements with detailed specifications</p>
    </div>

      {/* Requirements List */}
      <div className="space-y-6">
        {functionalRequirements.map((req, index) => (
          <div key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Requirement Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">{req.id}</h3>
                <div className="flex items-center space-x-3">
                  <select
                    value={req.priority}
                    onChange={(e) => updateRequirement(index, 'priority', e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={req.category}
                    onChange={(e) => updateRequirement(index, 'category', e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user-management">User Management</option>
                    <option value="data-processing">Data Processing</option>
                    <option value="reporting">Reporting</option>
                    <option value="integration">Integration</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={req.status}
                    onChange={(e) => updateRequirement(index, 'status', e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="implemented">Implemented</option>
                  </select>
                  {functionalRequirements.length > 1 && (
                    <button
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove requirement"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Requirement Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Title</label>
                  <input
                    type="text"
                    value={req.title}
                    onChange={(e) => updateRequirement(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter a clear, concise title for this requirement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={req.category}
                    onChange={(e) => updateRequirement(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asset-management">Asset Management</option>
                    <option value="user-management">User Management</option>
                    <option value="data-processing">Data Processing</option>
                    <option value="reporting">Reporting</option>
                    <option value="integration">Integration</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
          <textarea
                  rows={3}
                  value={req.description}
                  onChange={(e) => updateRequirement(index, 'description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the requirement in detail, including inputs, outputs, and behavior..."
          />
        </div>

              {/* Use Case Details */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Case Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Use Case Name</label>
                    <input
                      type="text"
                      value={req.useCase.name}
                      onChange={(e) => updateUseCaseField(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Register ICT Assets"
                    />
      </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Actor</label>
                    <input
                      type="text"
                      value={req.useCase.primaryActor}
                      onChange={(e) => updateUseCaseField(index, 'primaryActor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., ICT Asset Officer"
                    />
    </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Use Case Description</label>
                  <textarea
                    rows={3}
                    value={req.useCase.description}
                    onChange={(e) => updateUseCaseField(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this use case accomplishes..."
                  />
                </div>

                {/* Stakeholders */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
                  <div className="space-y-2">
                    {req.useCase.stakeholders.map((stakeholder, stakeholderIndex) => (
                      <div key={stakeholderIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={stakeholder}
                          onChange={(e) => updateUseCaseArray(index, 'stakeholders', stakeholderIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Stakeholder ${stakeholderIndex + 1}`}
                        />
                        {req.useCase.stakeholders.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'stakeholders', stakeholderIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'stakeholders')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Stakeholder
                    </button>
                  </div>
                </div>

                {/* Preconditions */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preconditions</label>
                  <div className="space-y-2">
                    {req.useCase.preconditions.map((precondition, preconditionIndex) => (
                      <div key={preconditionIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={precondition}
                          onChange={(e) => updateUseCaseArray(index, 'preconditions', preconditionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Precondition ${preconditionIndex + 1}`}
                        />
                        {req.useCase.preconditions.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'preconditions', preconditionIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'preconditions')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Precondition
                    </button>
                  </div>
                </div>

                {/* Postconditions */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postconditions</label>
                  <textarea
                    rows={2}
                    value={req.useCase.postconditions}
                    onChange={(e) => updateUseCaseField(index, 'postconditions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what happens after the use case is completed..."
                  />
                </div>

                {/* Inputs */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inputs</label>
                  <div className="space-y-2">
                    {req.useCase.inputs.map((input, inputIndex) => (
                      <div key={inputIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => updateUseCaseArray(index, 'inputs', inputIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Input field ${inputIndex + 1}`}
                        />
                        {req.useCase.inputs.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'inputs', inputIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'inputs')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Input Field
                    </button>
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processing Steps</label>
                  <div className="space-y-2">
                    {req.useCase.processing.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-2">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {stepIndex + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateUseCaseArray(index, 'processing', stepIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Step ${stepIndex + 1}`}
                        />
                        {req.useCase.processing.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'processing', stepIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'processing')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Processing Step
                    </button>
                  </div>
                </div>

                {/* Outputs */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outputs</label>
                  <div className="space-y-2">
                    {req.useCase.outputs.map((output, outputIndex) => (
                      <div key={outputIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={output}
                          onChange={(e) => updateUseCaseArray(index, 'outputs', outputIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Output ${outputIndex + 1}`}
                        />
                        {req.useCase.outputs.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'outputs', outputIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'outputs')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Output
                    </button>
                  </div>
                </div>

                {/* Alternative Flows */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Flows</label>
                  <div className="space-y-2">
                    {req.useCase.alternativeFlows.map((flow, flowIndex) => (
                      <div key={flowIndex} className="flex gap-2">
                        <textarea
                          rows={2}
                          value={flow}
                          onChange={(e) => updateUseCaseArray(index, 'alternativeFlows', flowIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Alternative flow ${flowIndex + 1}`}
                        />
                        {req.useCase.alternativeFlows.length > 1 && (
                          <button
                            onClick={() => removeUseCaseArrayItem(index, 'alternativeFlows', flowIndex)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addUseCaseArrayItem(index, 'alternativeFlows')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Alternative Flow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Requirement Button */}
    <div className="text-center">
        <button
          onClick={addRequirement}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center mx-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Functional Requirement
        </button>
      </div>

      {/* Save Button */}
      <div className="text-center pt-6">
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          Save All Functional Requirements
      </button>
    </div>
  </div>
)
}

const NonFunctionalRequirementsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.2 Non-Functional Requirements</h2>
      <p className="text-gray-600">Define quality attributes and constraints</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Non-Functional Requirements</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe performance, security, usability, and other non-functional requirements..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save Non-Functional Requirements
      </button>
    </div>
  </div>
)

const ExternalInterfacesSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.3 External Interfaces</h2>
      <p className="text-gray-600">Define system interfaces and interactions</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">External Interfaces</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe user interfaces, hardware interfaces, software interfaces, and communication interfaces..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save External Interfaces
      </button>
    </div>
  </div>
)

const PerformanceRequirementsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.4 Performance Requirements</h2>
      <p className="text-gray-600">Define system performance criteria</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Performance Requirements</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe response time, throughput, capacity, and other performance metrics..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save Performance Requirements
      </button>
    </div>
  </div>
)

const DesignConstraintsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.5 Design Constraints</h2>
      <p className="text-gray-600">Define limitations and constraints</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Design Constraints</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe any constraints that limit design options..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save Design Constraints
      </button>
    </div>
  </div>
)

const SoftwareAttributesSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">3.6 Software Attributes</h2>
      <p className="text-gray-600">Define software quality attributes</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Software Attributes</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe reliability, maintainability, portability, and other software attributes..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save Software Attributes
      </button>
    </div>
  </div>
)

const AppendicesSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">4. Appendices</h2>
      <p className="text-gray-600">Additional information and supporting documents</p>
    </div>
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Appendices</label>
          <textarea
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Include any additional information, diagrams, or supporting documents..."
          />
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
        Save Appendices
      </button>
    </div>
  </div>
)

const CreateSRSModal: React.FC<{ 
  onClose: () => void; 
  onSave: (doc: any) => void;
  externalRequirements?: SRSRequirement[];
  onRequirementsUpdate?: (updatedRequirements: SRSRequirement[]) => void;
}> = ({ onClose, onSave, externalRequirements, onRequirementsUpdate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New SRS Document</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
                  <SRSDocumentCreator 
              onClose={onClose} 
              onSave={onSave}
              externalRequirements={externalRequirements}
              onRequirementsUpdate={onRequirementsUpdate}
            />
    </div>
  </div>
)

const AddRequirementModal: React.FC<{ onClose: () => void; onSave: (requirement: any) => void }> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'functional',
    category: '',
    priority: 'medium',
    acceptanceCriteria: [''],
    status: 'draft'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addAcceptanceCriteria = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, '']
    }))
  }

  const updateAcceptanceCriteria = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((criteria, i) => 
        i === index ? value : criteria
      )
    }))
  }

  const removeAcceptanceCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Requirement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter requirement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="functional">Functional</option>
                <option value="non-functional">Non-Functional</option>
                <option value="interface">Interface</option>
                <option value="data">Data</option>
                <option value="business-rule">Business Rule</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., authentication, security, performance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the requirement in detail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="implemented">Implemented</option>
              <option value="tested">Tested</option>
            </select>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acceptance Criteria</label>
            <div className="space-y-2">
              {formData.acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={criteria}
                    onChange={(e) => updateAcceptanceCriteria(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Acceptance criteria ${index + 1}`}
                  />
                  {formData.acceptanceCriteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAcceptanceCriteria(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAcceptanceCriteria}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Acceptance Criteria
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Create Requirement
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit SRS Modal Component
const EditSRSModal: React.FC<{
  document: SRSDocument
  onClose: () => void
  onSave: (document: SRSDocument) => void
}> = ({ document, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: document.title,
    version: document.version,
    status: document.status,
    standard: document.standard
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...document,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit SRS Document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'reviewed' | 'approved' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
            <input
              type="text"
              value={formData.standard}
              onChange={(e) => setFormData(prev => ({ ...prev, standard: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Update Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// View SRS Modal Component
const ViewSRSModal: React.FC<{
  document: SRSDocument
  onClose: () => void
}> = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">View SRS Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900">{document.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <p className="text-gray-900">{document.version}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                document.status === 'approved' ? 'bg-green-100 text-green-800' :
                document.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {document.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard</label>
              <p className="text-gray-900">{document.standard}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <p className="text-gray-900">{document.author}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
              <p className="text-gray-900">{document.lastModified}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComprehensiveSRSPage;

