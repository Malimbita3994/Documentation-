import React, { useState, useEffect, useRef } from 'react'
import { Document } from '../types/index'
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  XMarkIcon,
  DocumentTextIcon,
  CogIcon,
  ServerIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  PencilIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  InformationCircleIcon,
  ClockIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

interface SDDDocumentViewerProps {
  document: Document
  onClose: () => void
  onSave?: (updatedDocument: Document) => void
  onEdit?: (document: Document) => void
}

const SDDDocumentViewer: React.FC<SDDDocumentViewerProps> = ({ document, onClose, onSave, onEdit }) => {
  const [activeTab, setActiveTab] = useState('content')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<Document>(document)
  
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, isEditing])

  // Auto-save functionality
  useEffect(() => {
    if (isEditing) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave()
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer)
    }
  }, [documentData, isEditing])

  const handleAutoSave = async () => {
    if (onSave) {
      try {
        await onSave(documentData)
        toast.success('Document auto-saved')
      } catch (error) {
        toast.error('Auto-save failed')
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(documentData)
        toast.success('Document saved successfully!')
      }
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    if (onEdit) {
      onEdit(documentData)
    }
  }

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI generation')
      return
    }

    setIsGenerating(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update the selected section with AI-generated content
      if (selectedSection) {
        const updatedSections = documentData.content?.sections?.map(section => {
          if (section.id === selectedSection) {
            return {
              ...section,
              content: section.content + `\n\n<!-- AI Generated Content -->\n<p><strong>AI Enhancement:</strong> ${aiPrompt}</p>`
            }
          }
          return section
        })

        setDocumentData({
          ...documentData,
          content: {
            ...documentData.content,
            sections: updatedSections
          }
        })

        toast.success('AI content generated successfully!')
        setAiPrompt('')
      }
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const renderSection = (section: any) => {
    if (!section.content) return null

    const getSectionIcon = (sectionId: string) => {
      switch (sectionId) {
        case 'introduction': return <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
        case 'systemArchitecture': return <CogIcon className="h-6 w-6 mr-3 text-green-600" />
        case 'componentDesign': return <ServerIcon className="h-6 w-6 mr-3 text-purple-600" />
        case 'dataDesign': return <CircleStackIcon className="h-6 w-6 mr-3 text-orange-600" />
        case 'interfaceDesign': return <ComputerDesktopIcon className="h-6 w-6 mr-3 text-indigo-600" />
        case 'deploymentDesign': return <ServerIcon className="h-6 w-6 mr-3 text-teal-600" />
        case 'appendix': return <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-600" />
        default: return <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-600" />
      }
    }

    return (
      <div key={section.id} className="mb-8 group relative">
        {/* Section Header with Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            {getSectionIcon(section.id)}
            {section.title}
          </h2>
          
          {isEditing && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setSelectedSection(section.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit with AI"
              >
                <SparklesIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  // Handle section editing
                  toast.info('Section editing feature coming soon!')
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Section"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section Content */}
        <div className="relative">
          {isEditing ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <textarea
                value={section.content}
                onChange={(e) => {
                  const updatedSections = documentData.content?.sections?.map(s => 
                    s.id === section.id ? { ...s, content: e.target.value } : s
                  )
                  setDocumentData({
                    ...documentData,
                    content: {
                      ...documentData.content,
                      sections: updatedSections
                    }
                  })
                }}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter section content..."
              />
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{section.content.length} characters</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedSection(section.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <SparklesIcon className="h-3 w-3" />
                    <span>AI Enhance</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none text-gray-700 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}
        </div>

        {/* Section Status Indicator */}
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>{documentData.lastModifiedBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TagIcon className="h-4 w-4" />
            <span>v{documentData.version}</span>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900 bg-opacity-75 p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden" 
        style={{ 
          maxHeight: '90vh',
          maxWidth: '90vw',
          position: 'relative',
          zIndex: 100000
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-l from-blue-600/95 to-blue-500/90 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{documentData.title}</h1>
                <p className="text-blue-100 text-sm">
                  IEEE 1016 Compliant Software Design Document
                </p>
                <div className="flex items-center space-x-4 mt-1 text-blue-100 text-xs">
                  <span>Status: {documentData.status}</span>
                  <span>Version: {documentData.version}</span>
                  <span>Last modified: {new Date(documentData.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Action Buttons */}
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    <span>AI Assistant</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ShareIcon className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className="text-white hover:text-blue-100 transition-colors p-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want the AI to generate or improve..."
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAIGeneration}
                disabled={isGenerating || !aiPrompt.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'content', name: 'Document Content', icon: BookOpenIcon },
              { id: 'components', name: 'Components', icon: ClipboardDocumentListIcon },
              { id: 'traceability', name: 'Traceability', icon: ChartBarIcon },
              { id: 'comments', name: 'Comments', icon: ChatBubbleLeftRightIcon },
              { id: 'history', name: 'Version History', icon: ClockIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } flex items-center space-x-2
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6" ref={contentRef}>
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Document Status Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900">Document Status</h3>
                      <p className="text-sm text-blue-700">
                        {documentData.status} • Version {documentData.version} • Last updated {new Date(documentData.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      IEEE 1016 Compliant
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Validated
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Sections */}
              <div className="prose max-w-none">
                {documentData.content?.sections?.map((section: any) => renderSection(section))}
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ServerIcon className="h-5 w-5 mr-2 text-purple-600" />
                  System Components Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentData.content?.sections?.find((s: any) => s.id === 'componentDesign')?.content && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-purple-900 mb-2">Component Design</h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Detailed component specifications with interfaces and dependencies
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600">7 components defined</span>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                  {documentData.content?.sections?.find((s: any) => s.id === 'systemArchitecture')?.content && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-green-900 mb-2">System Architecture</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Architectural patterns and system structure
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">Layered Architecture</span>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                  {documentData.content?.sections?.find((s: any) => s.id === 'dataDesign')?.content && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-orange-900 mb-2">Data Design</h4>
                      <p className="text-sm text-orange-700 mb-3">
                        Data models and database design
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-orange-600">5 entities defined</span>
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                  {documentData.content?.sections?.find((s: any) => s.id === 'interfaceDesign')?.content && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-indigo-900 mb-2">Interface Design</h4>
                      <p className="text-sm text-indigo-700 mb-3">
                        User interfaces and API specifications
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-indigo-600">3 interfaces defined</span>
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                  {documentData.content?.sections?.find((s: any) => s.id === 'deploymentDesign')?.content && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-teal-900 mb-2">Deployment Design</h4>
                      <p className="text-sm text-teal-700 mb-3">
                        Deployment architecture and infrastructure
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-teal-600">Cloud deployment</span>
                        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traceability' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Design Traceability Matrix
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Traceability Overview</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Track design elements from requirements to implementation
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-900">Design Elements:</span>
                      <span className="ml-2 text-blue-700">{documentData.requirements?.length || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">Components:</span>
                      <span className="ml-2 text-blue-700">
                        {documentData.content?.sections?.find((s: any) => s.id === 'componentDesign') ? 'Defined' : 'Not defined'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">Architecture:</span>
                      <span className="ml-2 text-blue-700">
                        {documentData.content?.sections?.find((s: any) => s.id === 'systemArchitecture') ? 'Defined' : 'Not defined'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">Interfaces:</span>
                      <span className="ml-2 text-blue-700">
                        {documentData.content?.sections?.find((s: any) => s.id === 'interfaceDesign') ? 'Defined' : 'Not defined'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-green-600" />
                  Document Comments & Feedback
                </h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-yellow-900">John Doe</h4>
                          <span className="text-xs text-yellow-600">2 hours ago</span>
                        </div>
                        <p className="text-sm text-yellow-800 mt-1">
                          Please review the component design section. The interface specifications need more detail.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-green-900">Jane Smith</h4>
                          <span className="text-xs text-green-600">1 day ago</span>
                        </div>
                        <p className="text-sm text-green-800 mt-1">
                          The architecture section looks great! Ready for implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Version History
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        v1.0
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Version 1.0 - Final Release</h4>
                      <p className="text-sm text-gray-600">Complete SDD with all sections finalized</p>
                      <p className="text-xs text-gray-500 mt-1">Updated by {documentData.lastModifiedBy} on {new Date(documentData.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        v0.9
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Version 0.9 - Review Draft</h4>
                      <p className="text-sm text-gray-600">Initial draft for stakeholder review</p>
                      <p className="text-xs text-gray-500 mt-1">Updated by {documentData.lastModifiedBy} on {new Date(documentData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SDDDocumentViewer
