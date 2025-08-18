import React, { useState, useMemo } from 'react'
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { SRSRequirement } from '../templates/SRSTemplate'

interface ValidationRule {
  id: string
  name: string
  description: string
  category: 'quality' | 'completeness' | 'testability' | 'traceability' | 'consistency'
  severity: 'critical' | 'high' | 'medium' | 'low'
  weight: number
}

interface ValidationResult {
  ruleId: string
  requirementId: string
  status: 'passed' | 'failed' | 'warning'
  score: number
  message: string
  suggestions: string[]
}

interface RequirementsValidationEngineProps {
  requirements: SRSRequirement[]
}

const RequirementsValidationEngine: React.FC<RequirementsValidationEngineProps> = ({
  requirements
}) => {
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: ''
  })

  // Define validation rules
  const validationRules: ValidationRule[] = [
    {
      id: 'clarity',
      name: 'Requirement Clarity',
      description: 'Requirement should be clear and unambiguous',
      category: 'quality',
      severity: 'high',
      weight: 10
    },
    {
      id: 'completeness',
      name: 'Requirement Completeness',
      description: 'Requirement should have all necessary information',
      category: 'completeness',
      severity: 'high',
      weight: 10
    },
    {
      id: 'testability',
      name: 'Requirement Testability',
      description: 'Requirement should be testable and measurable',
      category: 'testability',
      severity: 'critical',
      weight: 15
    },
    {
      id: 'traceability',
      name: 'Requirement Traceability',
      description: 'Requirement should be traceable to objectives',
      category: 'traceability',
      severity: 'medium',
      weight: 8
    },
    {
      id: 'consistency',
      name: 'Requirement Consistency',
      description: 'Requirement should not conflict with others',
      category: 'consistency',
      severity: 'high',
      weight: 12
    }
  ]

  // Run validation on all requirements
  const validationResults = useMemo(() => {
    const results: ValidationResult[] = []
    
    requirements.forEach(requirement => {
      validationRules.forEach(rule => {
        let status: 'passed' | 'failed' | 'warning' = 'passed'
        let score = 0
        let message = ''
        let suggestions: string[] = []

        switch (rule.id) {
          case 'clarity':
            const wordCount = requirement.description.split(' ').length
            if (wordCount < 5) {
              status = 'failed'
              score = 0
              message = 'Description is too short'
              suggestions = ['Add more detail to the requirement description']
            } else if (wordCount < 10) {
              status = 'warning'
              score = 5
              message = 'Description could be more detailed'
              suggestions = ['Expand the description with more context']
            } else {
              score = 10
              message = 'Description is clear and detailed'
            }
            break

          case 'completeness':
            const hasTitle = !!requirement.title.trim()
            const hasDescription = !!requirement.description.trim()
            const hasAcceptanceCriteria = requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0
            
            if (!hasTitle || !hasDescription) {
              status = 'failed'
              score = 0
              message = 'Missing essential information'
              suggestions = ['Add a clear title', 'Provide a detailed description']
            } else if (!hasAcceptanceCriteria) {
              status = 'warning'
              score = 5
              message = 'Missing acceptance criteria'
              suggestions = ['Define clear acceptance criteria']
            } else {
              score = 10
              message = 'All required information is present'
            }
            break

          case 'testability':
            const hasTestCases2 = requirement.testCases && requirement.testCases.length > 0
            const hasAcceptanceCriteria2 = requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0
            
            if (!hasAcceptanceCriteria2) {
              status = 'failed'
              score = 0
              message = 'No acceptance criteria defined'
              suggestions = ['Define measurable acceptance criteria']
            } else if (!hasTestCases2) {
              status = 'warning'
              score = 5
              message = 'No test cases linked'
              suggestions = ['Create test cases for this requirement']
            } else {
              score = 10
              message = 'Requirement is testable and measurable'
            }
            break

          case 'traceability':
            const hasTraceability = requirement.traceability && requirement.traceability.length > 0
            const hasTestCases3 = requirement.testCases && requirement.testCases.length > 0
            
            if (!hasTraceability && !hasTestCases3) {
              status = 'failed'
              score = 0
              message = 'No traceability links or test cases'
              suggestions = ['Link to business objectives', 'Create test cases']
            } else if (!hasTraceability) {
              status = 'warning'
              score = 5
              message = 'Missing traceability links'
              suggestions = ['Link to business objectives']
            } else {
              score = 10
              message = 'Good traceability established'
            }
            break

          case 'consistency':
            const conflicts = requirements.filter(r => 
              r.id !== requirement.id && 
              r.type === requirement.type &&
              (r.title.toLowerCase().includes(requirement.title.toLowerCase()) ||
               requirement.title.toLowerCase().includes(r.title.toLowerCase()))
            )
            
            if (conflicts.length > 0) {
              status = 'failed'
              score = 0
              message = `Potential conflict with ${conflicts.length} other requirement(s)`
              suggestions = ['Review conflicting requirements', 'Clarify differences']
            } else {
              score = 10
              message = 'No conflicts detected'
            }
            break
        }

        results.push({
          ruleId: rule.id,
          requirementId: requirement.id,
          status,
          score: score * (rule.weight / 10),
          message,
          suggestions
        })
      })
    })
    
    return results
  }, [requirements, validationRules])

  // Calculate quality metrics
  const qualityMetrics = useMemo(() => {
    const totalRequirements = requirements.length
    if (totalRequirements === 0) return null

    const totalScore = validationResults.reduce((sum, result) => sum + result.score, 0)
    const maxScore = validationResults.length * 10
    const overallScore = Math.round((totalScore / maxScore) * 100)

    const failedValidations = validationResults.filter(r => r.status === 'failed')
    const warningValidations = validationResults.filter(r => r.status === 'warning')

    return {
      overallScore,
      totalRequirements,
      passedRequirements: totalRequirements - failedValidations.length,
      failedValidations: failedValidations.length,
      warningValidations: warningValidations.length
    }
  }, [requirements, validationResults])

  // Filter results based on current filters
  const filteredResults = useMemo(() => {
    let results = validationResults
    
    if (filters.category) {
      results = results.filter(r => r.ruleId === filters.category)
    }
    
    if (filters.status) {
      results = results.filter(r => r.status === filters.status)
    }
    
    return results
  }, [validationResults, filters])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Requirements Validation Engine</h2>
        <p className="text-gray-600">Automated quality assessment and improvement suggestions</p>
      </div>

      {/* Quality Metrics */}
      {qualityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{qualityMetrics.overallScore}%</div>
            <div className="text-sm text-gray-600">Overall Quality Score</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{qualityMetrics.passedRequirements}</div>
            <div className="text-sm text-gray-600">Requirements Passed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{qualityMetrics.failedValidations}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{qualityMetrics.warningValidations}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Validation Rule</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Rules</option>
              {validationRules.map(rule => (
                <option key={rule.id} value={rule.id}>{rule.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Validation Results ({filteredResults.length})
          </h3>
        </div>
        <div className="p-4">
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result, index) => {
                const requirement = requirements.find(r => r.id === result.requirementId)
                const rule = validationRules.find(r => r.id === result.ruleId)
                
                if (!requirement || !rule) return null
                
                return (
                  <div key={index} className={`border rounded-lg p-4 ${
                    result.status === 'failed' ? 'border-red-200 bg-red-50' :
                    result.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {result.status === 'passed' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : result.status === 'warning' ? (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          result.status === 'passed' ? 'text-green-700' :
                          result.status === 'warning' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>
                          {result.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">Score: {Math.round(result.score)}/10</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Requirement: {requirement.title}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                    
                    {result.suggestions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Suggestions:</div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <LightBulbIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircleIcon className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No validation results match the current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequirementsValidationEngine
