import React, { useState } from 'react'
import { enhancedAIGenerator } from '../services/enhancedAIGenerator'
import { toast } from 'react-toastify'

const AIEffectivenessAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const runTest = async () => {
    setIsAnalyzing(true)
    try {
      const response = await enhancedAIGenerator.generateEnhancedDocument({
        documentType: 'SRS',
        projectId: 'test-project',
        systemRequirements: 'Test system requirements for effectiveness analysis',
        additionalSpecs: 'This is a test for AI effectiveness',
        knowledgeSources: ['wikipedia', 'stackoverflow'],
        context: 'Testing context',
        industry: 'healthcare',
        compliance: []
      })

      setResults(prev => [response, ...prev])
      toast.success('Effectiveness test completed!')
    } catch (error) {
      console.error('Test failed:', error)
      toast.error('Test failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Effectiveness Analyzer</h2>
      <button
        onClick={runTest}
        disabled={isAnalyzing}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isAnalyzing ? 'Testing...' : 'Run Effectiveness Test'}
      </button>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Test Results</h3>
          {results.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
              <p>Confidence: {Math.round(result.confidence * 100)}%</p>
              <p>Processing Time: {result.processingTime}ms</p>
              <p>Knowledge Sources: {result.sources.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIEffectivenessAnalyzer
