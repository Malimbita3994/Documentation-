import React, { useState } from 'react'
import { 
  LinkIcon, 
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Requirement {
  id: string
  title: string
  type: string
  status: string
}

interface TestCase {
  id: string
  title: string
  status: string
}

interface DesignElement {
  id: string
  title: string
  type: string
  requirements: string[]
}

interface TraceabilityLink {
  id: string
  sourceId: string
  sourceType: 'requirement' | 'testCase' | 'design'
  targetId: string
  targetType: 'requirement' | 'testCase' | 'design'
  relationship: 'implements' | 'tests' | 'depends_on' | 'related_to'
  description: string
}

interface RequirementsTraceabilityMatrixProps {
  requirements: Requirement[]
  testCases: TestCase[]
  designElements: DesignElement[]
}

const RequirementsTraceabilityMatrix: React.FC<RequirementsTraceabilityMatrixProps> = ({
  requirements,
  testCases,
  designElements
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'graph' | 'list'>('matrix')

  // Sample traceability links
  const [traceabilityLinks] = useState<TraceabilityLink[]>([
    {
      id: 'LINK-001',
      sourceId: 'REQ-001',
      sourceType: 'requirement',
      targetId: 'TC-001',
      targetType: 'testCase',
      relationship: 'tests',
      description: 'Test case validates user authentication requirement'
    },
    {
      id: 'LINK-002',
      sourceId: 'REQ-001',
      sourceType: 'requirement',
      targetId: 'DESIGN-001',
      targetType: 'design',
      relationship: 'implements',
      description: 'Authentication module implements the requirement'
    }
  ])

  const getItemById = (id: string, type: string) => {
    switch (type) {
      case 'requirement':
        return requirements.find(r => r.id === id)
      case 'testCase':
        return testCases.find(tc => tc.id === id)
      case 'design':
        return designElements.find(d => d.id === id)
      default:
        return null
    }
  }

  const getItemTitle = (id: string, type: string) => {
    const item = getItemById(id, type)
    return item ? item.title : 'Unknown'
  }

  const renderMatrixView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements Traceability Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Requirements
                </th>
                {testCases.map(tc => (
                  <th key={tc.id} className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {tc.title}
                  </th>
                ))}
                {designElements.map(de => (
                  <th key={de.id} className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {de.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requirements.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {req.title}
                  </td>
                  {testCases.map(tc => {
                    const hasLink = traceabilityLinks.some(
                      link => link.sourceId === req.id && link.targetId === tc.id && link.sourceType === 'requirement' && link.targetType === 'testCase'
                    )
                    return (
                      <td key={tc.id} className="border border-gray-200 px-4 py-3 text-center">
                        {hasLink ? (
                          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto" title="Linked"></div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" title="Not linked"></div>
                        )}
                      </td>
                    )
                  })}
                  {designElements.map(de => {
                    const hasLink = traceabilityLinks.some(
                      link => link.sourceId === req.id && link.targetId === de.id && link.sourceType === 'requirement' && link.targetType === 'design'
                    )
                    return (
                      <td key={de.id} className="border border-gray-200 px-4 py-3 text-center">
                        {hasLink ? (
                          <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto" title="Linked"></div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto" title="Not linked"></div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderGraphView = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Traceability Graph View</h3>
      <div className="text-center py-12 text-gray-500">
        <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>Graph visualization coming soon...</p>
        <p className="text-sm">This will show a visual representation of requirements and their relationships</p>
      </div>
    </div>
  )

  const renderListView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traceability Links</h3>
        
        <div className="space-y-4">
          {traceabilityLinks.map(link => (
            <div key={link.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {getItemTitle(link.sourceId, link.sourceType)}
                  </span>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {getItemTitle(link.targetId, link.targetType)}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  link.relationship === 'implements' ? 'bg-blue-100 text-blue-800' :
                  link.relationship === 'tests' ? 'bg-green-100 text-green-800' :
                  link.relationship === 'depends_on' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {link.relationship.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Requirements Traceability Matrix</h2>
          <p className="text-gray-600">Track relationships between requirements, test cases, and design elements</p>
        </div>
        <button 
          onClick={() => console.log('Add link functionality coming soon')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add Link
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode('matrix')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'matrix' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Matrix View
        </button>
        <button
          onClick={() => setViewMode('graph')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'graph' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Graph View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          List View
        </button>
      </div>

      {/* Content */}
      {viewMode === 'matrix' && renderMatrixView()}
      {viewMode === 'graph' && renderGraphView()}
      {viewMode === 'list' && renderListView()}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{requirements.length}</div>
          <div className="text-gray-600 text-sm">Requirements</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{testCases.length}</div>
          <div className="text-gray-600 text-sm">Test Cases</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">{designElements.length}</div>
          <div className="text-gray-600 text-sm">Design Elements</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-2">{traceabilityLinks.length}</div>
          <div className="text-gray-600 text-sm">Traceability Links</div>
        </div>
      </div>
    </div>
  )
}

export default RequirementsTraceabilityMatrix
