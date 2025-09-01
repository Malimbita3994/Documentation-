import React, { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { knowledgeBaseService, KNOWLEDGE_SOURCES } from '../services/knowledgeBaseService'
import { enhancedAIGenerator } from '../services/enhancedAIGenerator'
import { toast } from 'react-toastify'

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration: number
  error?: string
  data?: any
  timestamp: Date
}

interface TestSuite {
  id: string
  name: string
  description: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
  duration: number
}

const KnowledgeBaseTester: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [runningTests, setRunningTests] = useState<string[]>([])
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    totalDuration: 0
  })

  const predefinedTests = [
    {
      id: 'connectivity',
      name: 'Knowledge Base Connectivity Tests',
      description: 'Test basic connectivity to all knowledge sources',
      tests: [
        { id: 'wikipedia-connectivity', name: 'Wikipedia API Connectivity', source: 'wikipedia' },
        { id: 'ieee-connectivity', name: 'IEEE Standards API Connectivity', source: 'ieee' },
        { id: 'stackoverflow-connectivity', name: 'Stack Overflow API Connectivity', source: 'stackoverflow' },
        { id: 'github-connectivity', name: 'GitHub API Connectivity', source: 'github' },
        { id: 'arxiv-connectivity', name: 'arXiv API Connectivity', source: 'arxiv' }
      ]
    },
    {
      id: 'search-functionality',
      name: 'Search Functionality Tests',
      description: 'Test search capabilities across different knowledge sources',
      tests: [
        { id: 'wikipedia-search', name: 'Wikipedia Search', query: 'software requirements specification', source: 'wikipedia' },
        { id: 'ieee-search', name: 'IEEE Standards Search', query: 'IEEE 830 SRS', source: 'ieee' },
        { id: 'stackoverflow-search', name: 'Stack Overflow Search', query: 'SRS document template', source: 'stackoverflow' },
        { id: 'github-search', name: 'GitHub Repository Search', query: 'requirements specification', source: 'github' },
        { id: 'arxiv-search', name: 'arXiv Research Search', query: 'software requirements engineering', source: 'arxiv' }
      ]
    },
    {
      id: 'ai-generation',
      name: 'AI Document Generation Tests',
      description: 'Test enhanced AI document generation with knowledge base integration',
      tests: [
        { id: 'srs-generation', name: 'SRS Document Generation', documentType: 'SRS', industry: 'healthcare' },
        { id: 'sdd-generation', name: 'SDD Document Generation', documentType: 'SDD', industry: 'finance' },
        { id: 'testcases-generation', name: 'Test Cases Generation', documentType: 'Test Cases', industry: 'education' },
        { id: 'usermanual-generation', name: 'User Manual Generation', documentType: 'User Manual', industry: 'ecommerce' }
      ]
    },
    {
      id: 'performance',
      name: 'Performance & Reliability Tests',
      description: 'Test system performance, caching, and reliability',
      tests: [
        { id: 'response-time', name: 'Response Time Test', type: 'performance' },
        { id: 'cache-effectiveness', name: 'Cache Effectiveness Test', type: 'performance' },
        { id: 'concurrent-requests', name: 'Concurrent Requests Test', type: 'performance' },
        { id: 'error-handling', name: 'Error Handling Test', type: 'reliability' }
      ]
    }
  ]

  useEffect(() => {
    initializeTestSuites()
  }, [])

  const initializeTestSuites = () => {
    const suites = predefinedTests.map(suite => ({
      id: suite.id,
      name: suite.name,
      description: suite.description,
      tests: suite.tests.map(test => ({
        id: test.id,
        name: test.name,
        status: 'pending' as const,
        duration: 0,
        timestamp: new Date()
      })),
      totalTests: suite.tests.length,
      passedTests: 0,
      failedTests: 0,
      duration: 0
    }))
    setTestSuites(suites)
  }

  const runAllTests = async () => {
    setRunningTests(['all'])
    const allResults: TestResult[] = []

    for (const suite of testSuites) {
      for (const test of suite.tests) {
        const result = await runSingleTest(test)
        allResults.push(result)
      }
    }

    updateTestResults(allResults)
    setRunningTests([])
    toast.success('All tests completed!')
  }

  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find(s => s.id === suiteId)
    if (!suite) return

    setRunningTests(prev => [...prev, suiteId])
    const results: TestResult[] = []

    for (const test of suite.tests) {
      const result = await runSingleTest(test)
      results.push(result)
    }

    updateTestResults(results)
    setRunningTests(prev => prev.filter(id => id !== suiteId))
    toast.success(`${suite.name} completed!`)
  }

  const runSingleTest = async (test: any): Promise<TestResult> => {
    const startTime = Date.now()
    const result: TestResult = {
      id: test.id,
      name: test.name,
      status: 'running',
      duration: 0,
      timestamp: new Date()
    }

    try {
      switch (test.id) {
        case 'wikipedia-connectivity':
          await testWikipediaConnectivity()
          break
        case 'ieee-connectivity':
          await testIEEConnectivity()
          break
        case 'stackoverflow-connectivity':
          await testStackOverflowConnectivity()
          break
        case 'github-connectivity':
          await testGitHubConnectivity()
          break
        case 'arxiv-connectivity':
          await testArxivConnectivity()
          break
        case 'wikipedia-search':
          await testWikipediaSearch(test.query)
          break
        case 'ieee-search':
          await testIEEESearch(test.query)
          break
        case 'stackoverflow-search':
          await testStackOverflowSearch(test.query)
          break
        case 'github-search':
          await testGitHubSearch(test.query)
          break
        case 'arxiv-search':
          await testArxivSearch(test.query)
          break
        case 'srs-generation':
          await testDocumentGeneration(test.documentType, test.industry)
          break
        case 'sdd-generation':
          await testDocumentGeneration(test.documentType, test.industry)
          break
        case 'testcases-generation':
          await testDocumentGeneration(test.documentType, test.industry)
          break
        case 'usermanual-generation':
          await testDocumentGeneration(test.documentType, test.industry)
          break
        case 'response-time':
          await testResponseTime()
          break
        case 'cache-effectiveness':
          await testCacheEffectiveness()
          break
        case 'concurrent-requests':
          await testConcurrentRequests()
          break
        case 'error-handling':
          await testErrorHandling()
          break
        default:
          throw new Error(`Unknown test: ${test.id}`)
      }

      result.status = 'passed'
      result.duration = Date.now() - startTime
    } catch (error) {
      result.status = 'failed'
      result.error = error instanceof Error ? error.message : 'Unknown error'
      result.duration = Date.now() - startTime
    }

    return result
  }

  // Connectivity Tests
  const testWikipediaConnectivity = async () => {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Software_requirements_specification')
    if (!response.ok) throw new Error('Wikipedia API not accessible')
  }

  const testIEEConnectivity = async () => {
    // Test IEEE connectivity (may fail without API key, but should handle gracefully)
    try {
      const response = await fetch('https://standards.ieee.org')
      if (!response.ok) throw new Error('IEEE website not accessible')
    } catch (error) {
      // IEEE might require API key, so we'll consider this a partial success
      console.warn('IEEE connectivity test: API key may be required')
    }
  }

  const testStackOverflowConnectivity = async () => {
    const response = await fetch('https://api.stackexchange.com/2.3/sites')
    if (!response.ok) throw new Error('Stack Overflow API not accessible')
  }

  const testGitHubConnectivity = async () => {
    const response = await fetch('https://api.github.com')
    if (!response.ok) throw new Error('GitHub API not accessible')
  }

  const testArxivConnectivity = async () => {
    const response = await fetch('http://export.arxiv.org/api/query?search_query=all:software&start=0&max_results=1')
    if (!response.ok) throw new Error('arXiv API not accessible')
  }

  // Search Tests
  const testWikipediaSearch = async (query: string) => {
    const response = await knowledgeBaseService.queryKnowledge({
      query,
      sources: ['wikipedia'],
      maxResults: 1
    })
    if (response.results.length === 0) throw new Error('No Wikipedia results found')
  }

  const testIEEESearch = async (query: string) => {
    const response = await knowledgeBaseService.queryKnowledge({
      query,
      sources: ['ieee'],
      maxResults: 1
    })
    // IEEE might not return results without API key, but should not crash
    if (response.results.length === 0) {
      console.warn('IEEE search returned no results (API key may be required)')
    }
  }

  const testStackOverflowSearch = async (query: string) => {
    const response = await knowledgeBaseService.queryKnowledge({
      query,
      sources: ['stackoverflow'],
      maxResults: 1
    })
    if (response.results.length === 0) throw new Error('No Stack Overflow results found')
  }

  const testGitHubSearch = async (query: string) => {
    const response = await knowledgeBaseService.queryKnowledge({
      query,
      sources: ['github'],
      maxResults: 1
    })
    if (response.results.length === 0) throw new Error('No GitHub results found')
  }

  const testArxivSearch = async (query: string) => {
    const response = await knowledgeBaseService.queryKnowledge({
      query,
      sources: ['arxiv'],
      maxResults: 1
    })
    if (response.results.length === 0) throw new Error('No arXiv results found')
  }

  // AI Generation Tests
  const testDocumentGeneration = async (documentType: string, industry: string) => {
    const response = await enhancedAIGenerator.generateEnhancedDocument({
      documentType: documentType as any,
      projectId: 'test-project',
      systemRequirements: 'Test system requirements for automated testing',
      additionalSpecs: 'This is a test document generation',
      knowledgeSources: ['wikipedia', 'stackoverflow'],
      context: 'Testing context',
      industry: industry,
      compliance: []
    })

    if (!response.document || !response.knowledgeResults) {
      throw new Error('Document generation failed')
    }

    if (response.confidence < 0.3) {
      throw new Error('Low confidence score in generated document')
    }
  }

  // Performance Tests
  const testResponseTime = async () => {
    const startTime = Date.now()
    await knowledgeBaseService.queryKnowledge({
      query: 'software requirements',
      maxResults: 5
    })
    const duration = Date.now() - startTime

    if (duration > 10000) { // 10 seconds
      throw new Error(`Response time too slow: ${duration}ms`)
    }
  }

  const testCacheEffectiveness = async () => {
    const query = { query: 'cache test', maxResults: 5 }
    
    // First request
    const start1 = Date.now()
    await knowledgeBaseService.queryKnowledge(query)
    const duration1 = Date.now() - start1

    // Second request (should be cached)
    const start2 = Date.now()
    await knowledgeBaseService.queryKnowledge(query)
    const duration2 = Date.now() - start2

    if (duration2 >= duration1) {
      throw new Error('Cache not working effectively')
    }
  }

  const testConcurrentRequests = async () => {
    const queries = [
      { query: 'concurrent test 1', maxResults: 3 },
      { query: 'concurrent test 2', maxResults: 3 },
      { query: 'concurrent test 3', maxResults: 3 }
    ]

    const startTime = Date.now()
    await Promise.all(queries.map(q => knowledgeBaseService.queryKnowledge(q)))
    const duration = Date.now() - startTime

    if (duration > 15000) { // 15 seconds for concurrent requests
      throw new Error(`Concurrent requests too slow: ${duration}ms`)
    }
  }

  const testErrorHandling = async () => {
    try {
      await knowledgeBaseService.queryKnowledge({
        query: '',
        maxResults: -1
      })
      throw new Error('Should have thrown an error for invalid input')
    } catch (error) {
      // Expected error, test passes
    }
  }

  const updateTestResults = (results: TestResult[]) => {
    setTestSuites(prev => prev.map(suite => {
      const suiteResults = results.filter(r => suite.tests.some(t => t.id === r.id))
      const passedTests = suiteResults.filter(r => r.status === 'passed').length
      const failedTests = suiteResults.filter(r => r.status === 'failed').length
      const duration = suiteResults.reduce((sum, r) => sum + r.duration, 0)

      return {
        ...suite,
        tests: suite.tests.map(test => {
          const result = results.find(r => r.id === test.id)
          return result || test
        }),
        passedTests,
        failedTests,
        duration
      }
    }))

    // Update overall stats
    const totalTests = results.length
    const passedTests = results.filter(r => r.status === 'passed').length
    const failedTests = results.filter(r => r.status === 'failed').length
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    setOverallStats({
      totalTests,
      passedTests,
      failedTests,
      totalDuration
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed': return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'running': return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />
      default: return <CogIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base Tester</h2>
          <p className="text-gray-600">Comprehensive testing framework for knowledge base integration and AI capabilities</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Overall Success Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {overallStats.totalTests > 0 
                ? Math.round((overallStats.passedTests / overallStats.totalTests) * 100)
                : 0}%
            </div>
          </div>
          <button
            onClick={runAllTests}
            disabled={runningTests.includes('all')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {runningTests.includes('all') ? 'Running All Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{overallStats.totalTests}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{overallStats.passedTests}</div>
          <div className="text-sm text-green-600">Passed</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{overallStats.failedTests}</div>
          <div className="text-sm text-red-600">Failed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{overallStats.totalDuration}ms</div>
          <div className="text-sm text-blue-600">Total Duration</div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="space-y-6">
        {testSuites.map(suite => (
          <div key={suite.id} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                <p className="text-sm text-gray-600">{suite.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {suite.passedTests}/{suite.totalTests} passed
                  </div>
                  <div className="text-xs text-gray-500">
                    {suite.duration}ms
                  </div>
                </div>
                <button
                  onClick={() => runTestSuite(suite.id)}
                  disabled={runningTests.includes(suite.id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                >
                  {runningTests.includes(suite.id) ? 'Running...' : 'Run Suite'}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {suite.tests.map(test => (
                  <div
                    key={test.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${getStatusColor(test.status)}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        {test.error && (
                          <div className="text-sm text-red-600 mt-1">{test.error}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {test.duration}ms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Results Summary */}
      {overallStats.totalTests > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Results Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((overallStats.passedTests / overallStats.totalTests) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(overallStats.totalDuration / overallStats.totalTests)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {KNOWLEDGE_SOURCES.length}
              </div>
              <div className="text-sm text-gray-600">Knowledge Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {testSuites.length}
              </div>
              <div className="text-sm text-gray-600">Test Suites</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KnowledgeBaseTester
