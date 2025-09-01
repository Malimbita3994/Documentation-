import React, { useState } from 'react'
import { aiService } from '../services/aiService'

const AITestComponent: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const testAIIntegration = async () => {
    setIsLoading(true)
    setError('')
    setTestResult('')

    try {
      const result = await aiService.generateContent({
        prompt: 'Generate a simple test response to verify AI integration is working.',
        temperature: 0.3,
        maxTokens: 100
      })

      setTestResult(result.content)
    } catch (err: any) {
      setError(err.message || 'AI test failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">🤖 AI Integration Test</h2>
      
      <button
        onClick={testAIIntegration}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Testing AI...
          </>
        ) : (
          'Test AI Integration'
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {testResult && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>AI Response:</strong> {testResult}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>This test verifies that:</p>
        <ul className="list-disc list-inside mt-2">
          <li>AI service is properly imported</li>
          <li>OpenAI API key is configured</li>
          <li>API calls are working</li>
          <li>Response parsing is functional</li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <strong>Note:</strong> If you see a mock response, you need to configure your OpenAI API key. 
          See <code>OPENAI_API_SETUP.md</code> for detailed instructions.
        </div>
      </div>
    </div>
  )
}

export default AITestComponent
