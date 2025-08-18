import React, { useState } from 'react'
import { 
  DocumentTextIcon,
  SparklesIcon,

  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,

  PaperClipIcon,
  DocumentIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline'

interface DocumentSection {
  id: string
  title: string
  content: string
  type: 'text' | 'table' | 'diagram' | 'list'
  order: number
}

interface DocumentEditorProps {
  document: any
  onSave: (document: any) => void
  onClose: () => void
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, onClose }) => {
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: '1',
      title: 'Executive Summary',
      content: 'This document provides a comprehensive overview of the system requirements and design specifications...',
      type: 'text',
      order: 1
    },
    {
      id: '2',
      title: 'System Overview',
      content: 'The system is designed to provide a robust and scalable solution for...',
      type: 'text',
      order: 2
    },
    {
      id: '3',
      title: 'Functional Requirements',
      content: 'The system shall support the following functional requirements:',
      type: 'list',
      order: 3
    }
  ])
  const [activeSection, setActiveSection] = useState<string>('1')
  const [isEditing, setIsEditing] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)

  const addSection = () => {
    const newSection: DocumentSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: 'Enter section content here...',
      type: 'text',
      order: sections.length + 1
    }
    setSections([...sections, newSection])
    setActiveSection(newSection.id)
    setIsEditing(true)
  }

  const updateSection = (id: string, updates: Partial<DocumentSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ))
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id))
    if (activeSection === id && sections.length > 1) {
      setActiveSection(sections[0].id)
    }
  }

  const generateContentWithAI = async () => {
    if (!aiPrompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedContent = `AI-generated content based on: "${aiPrompt}"\n\nThis section has been automatically generated to provide comprehensive coverage of the specified requirements. The content follows industry best practices and includes:\n\n• Detailed analysis of requirements\n• Professional formatting and structure\n• Compliance with documentation standards\n• Best practice recommendations`
      
      if (activeSection) {
        updateSection(activeSection, { content: generatedContent })
      }
      
      setIsGenerating(false)
      setShowAIAssistant(false)
      setAiPrompt('')
    }, 2000)
  }

  const currentSection = sections.find(s => s.id === activeSection)

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <DocumentTextIcon className="h-6 w-6 text-red-500" />
      case 'doc':
      case 'docx':
        return <DocumentIcon className="h-6 w-6 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <TableCellsIcon className="h-6 w-6 text-green-500" />
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
              <p className="text-gray-600">{document.type} • v{document.version}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAttachments(!showAttachments)} 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                showAttachments 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PaperClipIcon className="h-5 w-5" />
              <span>Attachments ({document.content?.attachments?.length || 0})</span>
            </button>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="px-4 py-2 bg-blue-600/90 text-white rounded-lg font-medium hover:bg-blue-700/90 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
            >
              <SparklesIcon className="h-5 w-5" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                isEditing 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {isEditing ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 p-4">
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
                onClick={generateContentWithAI}
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

        {/* Attachments Panel */}
        {showAttachments && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-b border-teal-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Attachments</h3>
              <span className="text-sm text-gray-600">
                {document.content?.attachments?.length || 0} files attached
              </span>
            </div>
            
            {document.content?.attachments && document.content.attachments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {document.content.attachments.map((attachment: any) => (
                  <div
                    key={attachment.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      {getFileIcon(attachment.name)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {attachment.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(attachment.size)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded by {attachment.uploadedBy}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = attachment.url
                          link.download = attachment.name
                          link.click()
                        }}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PaperClipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No attachments uploaded yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload files during document creation to see them here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Section Navigation */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Sections</h3>
              <button
                onClick={addSection}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-100 border border-blue-200'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{section.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {section.content.substring(0, 50)}...
                      </p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSection(section.id)
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentSection && (
              <>
                {/* Section Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentSection.title}
                          onChange={(e) => updateSection(currentSection.id, { title: e.target.value })}
                          className="text-2xl font-bold text-gray-900 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none w-full"
                        />
                      ) : (
                        <h3 className="text-2xl font-bold text-gray-900">{currentSection.title}</h3>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={currentSection.type}
                        onChange={(e) => updateSection(currentSection.id, { type: e.target.value as any })}
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="table">Table</option>
                        <option value="diagram">Diagram</option>
                        <option value="list">List</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {isEditing ? (
                    <textarea
                      value={currentSection.content}
                      onChange={(e) => updateSection(currentSection.id, { content: e.target.value })}
                      className="w-full h-full border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                      placeholder="Enter section content..."
                    />
                  ) : (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                        {currentSection.content}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Last saved: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>{sections.length} sections</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>Duplicate</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
