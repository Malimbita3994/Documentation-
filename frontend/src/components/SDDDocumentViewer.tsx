import React, { useState } from 'react'
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
  CircleStackIcon
} from '@heroicons/react/24/outline'

interface SDDDocumentViewerProps {
  document: Document
  onClose: () => void
}

const SDDDocumentViewer: React.FC<SDDDocumentViewerProps> = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState('content')

  const renderSection = (section: any) => {
    if (!section.content) return null

    return (
      <div key={section.id} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          {section.id === 'introduction' && <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />}
          {section.id === 'systemArchitecture' && <CogIcon className="h-6 w-6 mr-3 text-green-600" />}
          {section.id === 'componentDesign' && <ServerIcon className="h-6 w-6 mr-3 text-purple-600" />}
          {section.id === 'dataDesign' && <CircleStackIcon className="h-6 w-6 mr-3 text-orange-600" />}
          {section.id === 'interfaceDesign' && <ComputerDesktopIcon className="h-6 w-6 mr-3 text-indigo-600" />}
          {section.id === 'deploymentDesign' && <ServerIcon className="h-6 w-6 mr-3 text-teal-600" />}
          {section.id === 'appendix' && <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-600" />}
          {section.title}
        </h2>
        <div 
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    )
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-l from-blue-600/95 to-blue-500/90 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{document.title}</h1>
                <p className="text-blue-100 text-sm">
                  IEEE 1016 Compliant Software Design Document
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'content', name: 'Document Content', icon: BookOpenIcon },
              { id: 'components', name: 'Components', icon: ClipboardDocumentListIcon },
              { id: 'traceability', name: 'Traceability', icon: ChartBarIcon }
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
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="prose max-w-none">
              {document.content?.sections?.map((section: any) => renderSection(section))}
            </div>
          )}

          {activeTab === 'components' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ServerIcon className="h-5 w-5 mr-2 text-purple-600" />
                System Components Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {document.content?.sections?.find((s: any) => s.id === 'componentDesign')?.content && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">Component Design</h4>
                    <p className="text-sm text-purple-700">
                      Detailed component specifications with interfaces and dependencies
                    </p>
                  </div>
                )}
                {document.content?.sections?.find((s: any) => s.id === 'systemArchitecture')?.content && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">System Architecture</h4>
                    <p className="text-sm text-green-700">
                      Architectural patterns and system structure
                    </p>
                  </div>
                )}
                {document.content?.sections?.find((s: any) => s.id === 'dataDesign')?.content && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">Data Design</h4>
                    <p className="text-sm text-orange-700">
                      Data models and database design
                    </p>
                  </div>
                )}
                {document.content?.sections?.find((s: any) => s.id === 'interfaceDesign')?.content && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-900 mb-2">Interface Design</h4>
                    <p className="text-sm text-indigo-700">
                      User interfaces and API specifications
                    </p>
                  </div>
                )}
                {document.content?.sections?.find((s: any) => s.id === 'deploymentDesign')?.content && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h4 className="font-medium text-teal-900 mb-2">Deployment Design</h4>
                    <p className="text-sm text-teal-700">
                      Deployment architecture and infrastructure
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'traceability' && (
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
                    <span className="ml-2 text-blue-700">{document.requirements?.length || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Components:</span>
                    <span className="ml-2 text-blue-700">
                      {document.content?.sections?.find((s: any) => s.id === 'componentDesign') ? 'Defined' : 'Not defined'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Architecture:</span>
                    <span className="ml-2 text-blue-700">
                      {document.content?.sections?.find((s: any) => s.id === 'systemArchitecture') ? 'Defined' : 'Not defined'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-900">Interfaces:</span>
                    <span className="ml-2 text-blue-700">
                      {document.content?.sections?.find((s: any) => s.id === 'interfaceDesign') ? 'Defined' : 'Not defined'}
                    </span>
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
