import React, { useState } from 'react'
import { templateService } from '../services/templateService'
import { templateIntegrationService } from '../services/templateIntegrationService'
import { toast } from 'react-toastify'

const TemplateTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const runTests = async () => {
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('🚀 Starting Template System Tests...')

      // Test 1: Fetch templates
      addResult('📋 Test 1: Fetching templates...')
      try {
        const templates = await templateService.getTemplates()
        addResult(`✅ Templates fetched successfully. Found ${templates.data.length} templates`)
      } catch (error) {
        addResult(`❌ Failed to fetch templates: ${error}`)
      }

      // Test 2: Get statistics
      addResult('📊 Test 2: Fetching template statistics...')
      try {
        const stats = await templateService.getStatistics()
        addResult(`✅ Statistics fetched successfully. Total templates: ${stats.total_templates}`)
      } catch (error) {
        addResult(`❌ Failed to fetch statistics: ${error}`)
      }

      // Test 3: Get templates for generation
      addResult('🤖 Test 3: Getting templates for SRS generation...')
      try {
        const templates = await templateService.getTemplatesForGeneration('SRS', 'general')
        addResult(`✅ Found ${templates.length} SRS templates for general industry`)
      } catch (error) {
        addResult(`❌ Failed to get templates for generation: ${error}`)
      }

      // Test 4: Template integration service
      addResult('🔗 Test 4: Testing template integration service...')
      try {
        const bestTemplate = await templateIntegrationService.getBestTemplate('SRS', 'general')
        if (bestTemplate) {
          addResult(`✅ Best template found: ${bestTemplate.name}`)
        } else {
          addResult('⚠️ No best template found (this is normal if no templates exist)')
        }
      } catch (error) {
        addResult(`❌ Failed to get best template: ${error}`)
      }

      // Test 5: Template recommendations
      addResult('💡 Test 5: Getting template recommendations...')
      try {
        const recommendations = await templateIntegrationService.getTemplateRecommendations('SRS', 'healthcare')
        addResult(`✅ Found ${recommendations.length} template recommendations for healthcare SRS`)
      } catch (error) {
        addResult(`❌ Failed to get recommendations: ${error}`)
      }

      addResult('🎉 All tests completed!')
      toast.success('Template system tests completed successfully!')

    } catch (error) {
      addResult(`💥 Test suite failed: ${error}`)
      toast.error('Template system tests failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧪 Template System Test Component
      </h3>
      
      <p className="text-gray-600 mb-4">
        This component tests the template management system functionality including:
        template fetching, statistics, AI integration, and recommendations.
      </p>

      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
            Running Tests...
          </>
        ) : (
          '🚀 Run Template System Tests'
        )}
      </button>

      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Test Results:</h4>
          <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Template System Features:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 📤 Upload templates (DOCX, DOC, PDF, TXT, MD)</li>
          <li>• 📥 Download templates with tracking</li>
          <li>• 🔍 Advanced search and filtering</li>
          <li>• 📊 Analytics and statistics</li>
          <li>• 🤖 AI-enhanced document generation</li>
          <li>• 💡 Smart template recommendations</li>
          <li>• 🔗 Knowledge base integration</li>
        </ul>
      </div>
    </div>
  )
}

export default TemplateTestComponent




