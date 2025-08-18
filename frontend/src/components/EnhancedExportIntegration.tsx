import React, { useState } from 'react'
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CodeBracketIcon,
  CloudArrowUpIcon,
  CogIcon,
  CheckIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  supported: boolean
  features: string[]
}

interface IntegrationTool {
  id: string
  name: string
  description: string
  type: 'project_management' | 'issue_tracking' | 'testing' | 'design' | 'documentation'
  status: 'connected' | 'disconnected' | 'configuring'
  lastSync?: string
  syncStatus: 'success' | 'error' | 'pending'
}

interface ImportExportTemplate {
  id: string
  name: string
  description: string
  format: 'csv' | 'json' | 'xml' | 'excel' | 'custom'
  lastUsed?: string
  usageCount: number
}

interface EnhancedExportIntegrationProps {
  // Add any props if needed
}

const EnhancedExportIntegration: React.FC<EnhancedExportIntegrationProps> = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'integration' | 'templates'>('export')
  const [selectedFormat, setSelectedFormat] = useState<string>('')
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeDiagrams: true,
    includeComments: true,
    includeHistory: false,
    format: 'professional'
  })

  // Export formats
  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF with proper formatting and styling',
      icon: DocumentTextIcon,
      supported: true,
      features: ['Professional formatting', 'Table of contents', 'Page numbers', 'Headers/footers']
    },
    {
      id: 'word',
      name: 'Microsoft Word',
      description: 'Editable Word document (.docx) format',
      icon: DocumentTextIcon,
      supported: true,
      features: ['Editable content', 'Track changes', 'Comments', 'Styles and formatting']
    },
    {
      id: 'html',
      name: 'HTML Web Page',
      description: 'Interactive web page with navigation',
      icon: CodeBracketIcon,
      supported: true,
      features: ['Interactive navigation', 'Searchable content', 'Responsive design', 'Web deployment']
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      description: 'Structured data in Excel format',
      icon: TableCellsIcon,
      supported: true,
      features: ['Tabular data', 'Charts and graphs', 'Data analysis', 'Multiple sheets']
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Machine-readable JSON format for integration',
      icon: CodeBracketIcon,
      supported: true,
      features: ['API integration', 'Data exchange', 'Programmatic access', 'Structured format']
    },
    {
      id: 'xml',
      name: 'XML Document',
      description: 'Structured XML format for enterprise systems',
      icon: CodeBracketIcon,
      supported: true,
      features: ['Enterprise integration', 'Schema validation', 'Industry standards', 'Data transformation']
    }
  ]

  // Integration tools
  const integrationTools: IntegrationTool[] = [
    {
      id: 'jira',
      name: 'Jira',
      description: 'Project and issue tracking',
      type: 'project_management',
      status: 'connected',
      lastSync: '2024-01-15T10:00:00Z',
      syncStatus: 'success'
    },
    {
      id: 'confluence',
      name: 'Confluence',
      description: 'Documentation and knowledge management',
      type: 'documentation',
      status: 'connected',
      lastSync: '2024-01-15T09:30:00Z',
      syncStatus: 'success'
    },
    {
      id: 'testrail',
      name: 'TestRail',
      description: 'Test case management',
      type: 'testing',
      status: 'disconnected',
      syncStatus: 'pending'
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'Design and prototyping',
      type: 'design',
      status: 'configuring',
      syncStatus: 'pending'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Version control and issue tracking',
      type: 'project_management',
      status: 'disconnected',
      syncStatus: 'pending'
    }
  ]

  // Import/Export templates
  const importExportTemplates: ImportExportTemplate[] = [
    {
      id: '1',
      name: 'Standard Requirements Import',
      description: 'CSV template for importing requirements from external sources',
      format: 'csv',
      lastUsed: '2024-01-10T14:00:00Z',
      usageCount: 15
    },
    {
      id: '2',
      name: 'Jira Requirements Export',
      description: 'JSON template for exporting requirements to Jira',
      format: 'json',
      lastUsed: '2024-01-12T11:00:00Z',
      usageCount: 8
    },
    {
      id: '3',
      name: 'Excel Requirements Template',
      description: 'Excel template for requirements analysis and review',
      format: 'excel',
      lastUsed: '2024-01-08T16:00:00Z',
      usageCount: 23
    }
  ]

  const renderExportTab = () => (
    <div className="space-y-6">
      {/* Export Formats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportFormats.map(format => (
            <div
              key={format.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <format.icon className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{format.name}</h4>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {format.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
              
              {!format.supported && (
                <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-xs text-yellow-700">Coming soon</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      {selectedFormat && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeMetadata: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Include Metadata</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Project info, version, dates, etc.</p>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeDiagrams}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeDiagrams: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Include Diagrams</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Use cases, sequence diagrams, etc.</p>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeComments}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeComments: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Include Comments</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Review comments and feedback</p>
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeHistory}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeHistory: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Include History</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Change history and versions</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Style</label>
            <select
              value={exportOptions.format}
              onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="minimal">Minimal</option>
              <option value="detailed">Detailed</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => console.log('Export to', selectedFormat, exportOptions)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export to {exportFormats.find(f => f.id === selectedFormat)?.name}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderImportTab = () => (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Requirements</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Browse Files
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: CSV, JSON, XML, Excel (.xlsx, .xls)
          </p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Import Options</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-gray-700">Overwrite existing requirements</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-gray-700">Create new requirements for unmatched items</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700">Validate data before import</span>
            </label>
          </div>
        </div>
      </div>

      {/* Import Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {importExportTemplates
            .filter(template => template.format === 'csv' || template.format === 'excel')
            .map(template => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    template.format === 'csv' ? 'bg-green-100 text-green-700' :
                    template.format === 'excel' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {template.format.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Used {template.usageCount} times</span>
                  {template.lastUsed && (
                    <span>{new Date(template.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>
                
                <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium">
                  Download Template
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderIntegrationTab = () => (
    <div className="space-y-6">
      {/* Integration Tools */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationTools.map(tool => (
            <div key={tool.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tool.status === 'connected' ? 'bg-green-100 text-green-700' :
                  tool.status === 'configuring' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tool.status}
                </span>
              </div>
              
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  tool.type === 'project_management' ? 'bg-blue-100 text-blue-700' :
                  tool.type === 'testing' ? 'bg-green-100 text-green-700' :
                  tool.type === 'design' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tool.type.replace('_', ' ')}
                </span>
              </div>
              
              {tool.status === 'connected' && (
                <div className="mb-3 text-sm text-gray-600">
                  <div>Last sync: {tool.lastSync ? new Date(tool.lastSync).toLocaleDateString() : 'Never'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span>Sync status:</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      tool.syncStatus === 'success' ? 'bg-green-100 text-green-700' :
                      tool.syncStatus === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tool.syncStatus}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                {tool.status === 'connected' ? (
                  <button
                    onClick={() => console.log('Disconnect from', tool.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-medium"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => console.log('Connect to', tool.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                  >
                    Connect
                  </button>
                )}
                
                <button className="px-3 py-2 text-gray-600 hover:text-gray-800">
                  <CogIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Synchronization Status</h3>
        <div className="space-y-3">
          {integrationTools
            .filter(tool => tool.status === 'connected')
            .map(tool => (
              <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{tool.name}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tool.syncStatus === 'success' ? 'bg-green-100 text-green-700' :
                    tool.syncStatus === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tool.syncStatus}
                  </span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Sync Now
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Export Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {importExportTemplates
            .filter(template => template.format === 'json' || template.format === 'xml')
            .map(template => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    template.format === 'json' ? 'bg-green-100 text-green-700' :
                    template.format === 'xml' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {template.format.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>Used {template.usageCount} times</span>
                  {template.lastUsed && (
                    <span>{new Date(template.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium">
                    Use Template
                  </button>
                  <button className="px-3 py-2 text-gray-600 hover:text-gray-800">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Create New Template */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Describe the template purpose and usage"
            />
          </div>
        </div>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
          Create Template
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enhanced Export & Integration</h2>
        <p className="text-gray-600">Export requirements in multiple formats and integrate with external tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'export', name: 'Export', count: exportFormats.length },
            { id: 'import', name: 'Import', count: importExportTemplates.filter(t => t.format === 'csv' || t.format === 'excel').length },
            { id: 'integration', name: 'Integration', count: integrationTools.filter(t => t.status === 'connected').length },
            { id: 'templates', name: 'Templates', count: importExportTemplates.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'export' && renderExportTab()}
      {activeTab === 'import' && renderImportTab()}
      {activeTab === 'integration' && renderIntegrationTab()}
      {activeTab === 'templates' && renderTemplatesTab()}
    </div>
  )
}

export default EnhancedExportIntegration
