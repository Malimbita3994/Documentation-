import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  GlobeAltIcon, 
  AcademicCapIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { knowledgeBaseService, KNOWLEDGE_SOURCES } from '../services/knowledgeBaseService'
import { enhancedAIGenerator } from '../services/enhancedAIGenerator'
import { toast } from 'react-toastify'

interface KnowledgeBaseManagerProps {
  onKnowledgeResults?: (results: any) => void
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({ onKnowledgeResults }) => {
  const [query, setQuery] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'sources' | 'analytics'>('search')
  const [documentType, setDocumentType] = useState('')
  const [industry, setIndustry] = useState('')
  const [compliance] = useState<string[]>([])

  useEffect(() => {
    // Initialize with all sources selected
    setSelectedSources(KNOWLEDGE_SOURCES.map(source => source.id))
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setLoading(true)
    try {
      const response = await knowledgeBaseService.queryKnowledge({
        query: query,
        sources: selectedSources,
        maxResults: 20
      })

      setResults(response.results)
      onKnowledgeResults?.(response)
      
      toast.success(`Found ${response.results.length} results from ${response.sources.length} sources`)
    } catch (error) {
      console.error('Knowledge base search failed:', error)
      toast.error('Failed to search knowledge base')
    } finally {
      setLoading(false)
    }
  }

  const handleEnhancedGeneration = async () => {
    if (!query.trim() || !documentType) {
      toast.error('Please enter requirements and select document type')
      return
    }

    setLoading(true)
    try {
      const response = await enhancedAIGenerator.generateEnhancedDocument({
        documentType: documentType as any,
        projectId: 'enhanced-project',
        systemRequirements: query,
        additionalSpecs: '',
        knowledgeSources: selectedSources,
        context: '',
        industry: industry,
        compliance: compliance
      })

      setResults(response.knowledgeResults)
      onKnowledgeResults?.(response)
      
      toast.success(`Generated enhanced document with ${response.knowledgeResults.length} knowledge sources`)
    } catch (error) {
      console.error('Enhanced generation failed:', error)
      toast.error('Failed to generate enhanced document')
    } finally {
      setLoading(false)
    }
  }

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      // Academic & Research
      case 'wikipedia': return <GlobeAltIcon className="h-5 w-5" />
      case 'arxiv': return <DocumentTextIcon className="h-5 w-5" />
      case 'pubmed': return <AcademicCapIcon className="h-5 w-5" />
      case 'scholar': return <AcademicCapIcon className="h-5 w-5" />
      
      // Technical Standards
      case 'ieee': return <AcademicCapIcon className="h-5 w-5" />
      case 'iso': return <ShieldCheckIcon className="h-5 w-5" />
      case 'nist': return <ShieldCheckIcon className="h-5 w-5" />
      case 'owasp': return <ShieldCheckIcon className="h-5 w-5" />
      
      // Development
      case 'stackoverflow': return <CodeBracketIcon className="h-5 w-5" />
      case 'github': return <CodeBracketIcon className="h-5 w-5" />
      case 'npm': return <CodeBracketIcon className="h-5 w-5" />
      case 'mdn': return <CodeBracketIcon className="h-5 w-5" />
      
      // Business & Industry
      case 'bloomberg': return <ChartBarIcon className="h-5 w-5" />
      case 'reuters': return <ChartBarIcon className="h-5 w-5" />
      case 'forbes': return <ChartBarIcon className="h-5 w-5" />
      
      // Technology
      case 'techcrunch': return <GlobeAltIcon className="h-5 w-5" />
      case 'wired': return <GlobeAltIcon className="h-5 w-5" />
      case 'ars-technica': return <GlobeAltIcon className="h-5 w-5" />
      
      // Science
      case 'nature': return <AcademicCapIcon className="h-5 w-5" />
      case 'science': return <AcademicCapIcon className="h-5 w-5" />
      case 'nasa': return <GlobeAltIcon className="h-5 w-5" />
      
      // Legal & Healthcare
      case 'legal': return <ShieldCheckIcon className="h-5 w-5" />
      case 'gdpr': return <ShieldCheckIcon className="h-5 w-5" />
      case 'who': return <AcademicCapIcon className="h-5 w-5" />
      case 'fda': return <ShieldCheckIcon className="h-5 w-5" />
      
      // Education
      case 'coursera': return <AcademicCapIcon className="h-5 w-5" />
      case 'edx': return <AcademicCapIcon className="h-5 w-5" />
      case 'khan': return <AcademicCapIcon className="h-5 w-5" />
      
      // Government & Data
      case 'data-gov': return <ChartBarIcon className="h-5 w-5" />
      case 'world-bank': return <ChartBarIcon className="h-5 w-5" />
      
      // Industry Specific
      case 'automotive': return <CogIcon className="h-5 w-5" />
      case 'aerospace': return <CogIcon className="h-5 w-5" />
      case 'pharmaceutical': return <AcademicCapIcon className="h-5 w-5" />
      
      // Environmental
      case 'epa': return <GlobeAltIcon className="h-5 w-5" />
      case 'climate': return <GlobeAltIcon className="h-5 w-5" />
      
      default: return <GlobeAltIcon className="h-5 w-5" />
    }
  }

  const getSourceColor = (sourceId: string) => {
    switch (sourceId) {
      // Academic & Research
      case 'wikipedia': return 'bg-blue-100 text-blue-800'
      case 'arxiv': return 'bg-red-100 text-red-800'
      case 'pubmed': return 'bg-green-100 text-green-800'
      case 'scholar': return 'bg-blue-100 text-blue-800'
      
      // Technical Standards
      case 'ieee': return 'bg-purple-100 text-purple-800'
      case 'iso': return 'bg-green-100 text-green-800'
      case 'nist': return 'bg-indigo-100 text-indigo-800'
      case 'owasp': return 'bg-yellow-100 text-yellow-800'
      
      // Development
      case 'stackoverflow': return 'bg-orange-100 text-orange-800'
      case 'github': return 'bg-gray-100 text-gray-800'
      case 'npm': return 'bg-red-100 text-red-800'
      case 'mdn': return 'bg-blue-100 text-blue-800'
      
      // Business & Industry
      case 'bloomberg': return 'bg-green-100 text-green-800'
      case 'reuters': return 'bg-blue-100 text-blue-800'
      case 'forbes': return 'bg-purple-100 text-purple-800'
      
      // Technology
      case 'techcrunch': return 'bg-orange-100 text-orange-800'
      case 'wired': return 'bg-black-100 text-black-800'
      case 'ars-technica': return 'bg-gray-100 text-gray-800'
      
      // Science
      case 'nature': return 'bg-green-100 text-green-800'
      case 'science': return 'bg-red-100 text-red-800'
      case 'nasa': return 'bg-blue-100 text-blue-800'
      
      // Legal & Healthcare
      case 'legal': return 'bg-indigo-100 text-indigo-800'
      case 'gdpr': return 'bg-blue-100 text-blue-800'
      case 'who': return 'bg-green-100 text-green-800'
      case 'fda': return 'bg-red-100 text-red-800'
      
      // Education
      case 'coursera': return 'bg-blue-100 text-blue-800'
      case 'edx': return 'bg-green-100 text-green-800'
      case 'khan': return 'bg-blue-100 text-blue-800'
      
      // Government & Data
      case 'data-gov': return 'bg-indigo-100 text-indigo-800'
      case 'world-bank': return 'bg-blue-100 text-blue-800'
      
      // Industry Specific
      case 'automotive': return 'bg-gray-100 text-gray-800'
      case 'aerospace': return 'bg-blue-100 text-blue-800'
      case 'pharmaceutical': return 'bg-green-100 text-green-800'
      
      // Environmental
      case 'epa': return 'bg-green-100 text-green-800'
      case 'climate': return 'bg-blue-100 text-blue-800'
      
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base Manager</h2>
          <p className="text-gray-600">Connect to world knowledge sources for enhanced AI capabilities</p>
        </div>
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6 text-blue-600" />
          <span className="text-sm text-gray-500">
            {results.length} results available
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'search', name: 'Knowledge Search', icon: MagnifyingGlassIcon },
            { id: 'sources', name: 'Configure Sources', icon: CogIcon },
            { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Enhanced Generation Form */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Enhanced Document Generation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select document type</option>
                  <option value="SRS">Software Requirements Specification</option>
                  <option value="SDD">Software Design Document</option>
                  <option value="TestCases">Test Cases</option>
                  <option value="UserManual">User Manual</option>
                  <option value="ConceptNote">Concept Note</option>
                  <option value="FeasibilityStudy">Feasibility Study</option>
                  <option value="ProgressReport">Progress Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select industry</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="government">Government</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Requirements
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your system requirements here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleEnhancedGeneration}
              disabled={loading || !query.trim() || !documentType}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Enhanced Document'}
            </button>
          </div>

          {/* Simple Search */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Knowledge Search</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search knowledge base..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Knowledge Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KNOWLEDGE_SOURCES.map(source => (
              <div
                key={source.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => toggleSource(source.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getSourceColor(source.id)}`}>
                    {getSourceIcon(source.id)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600">{source.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">
                        Reliability: {Math.round(source.reliability * 100)}%
                      </span>
                      <span className="text-xs text-gray-500">
                        Categories: {source.categories.join(', ')}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id)}
                    onChange={() => toggleSource(source.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Analytics</h3>
          
          {/* Cache Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Cache Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {knowledgeBaseService.getCacheStats().size}
                </div>
                <div className="text-sm text-gray-600">Cached Queries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {knowledgeBaseService.getCacheStats().hits}
                </div>
                <div className="text-sm text-gray-600">Cache Hits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {knowledgeBaseService.getCacheStats().misses}
                </div>
                <div className="text-sm text-gray-600">Cache Misses</div>
              </div>
            </div>
          </div>

          {/* Source Reliability */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Source Reliability</h4>
            <div className="space-y-2">
              {KNOWLEDGE_SOURCES.map(source => (
                <div key={source.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{source.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.reliability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {Math.round(source.reliability * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Results</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{result.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(result.source.toLowerCase())}`}>
                    {result.source}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{result.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Relevance: {Math.round(result.relevance * 100)}%</span>
                    <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                    {result.metadata?.date && (
                      <span>{new Date(result.metadata.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Source →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default KnowledgeBaseManager
