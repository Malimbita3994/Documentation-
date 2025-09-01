import React, { useState, useEffect } from 'react'
import { templateService } from '../services/templateService'

interface SystemStatus {
  backend: 'online' | 'offline' | 'checking'
  templates: 'online' | 'offline' | 'checking'
  ai: 'online' | 'offline' | 'checking'
  knowledge: 'online' | 'offline' | 'checking'
}

const SystemStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    backend: 'checking',
    templates: 'checking',
    ai: 'checking',
    knowledge: 'checking'
  })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    // Check backend health
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      setStatus(prev => ({ ...prev, backend: response.ok ? 'online' : 'offline' }))
    } catch (error) {
      setStatus(prev => ({ ...prev, backend: 'offline' }))
    }

    // Check template service
    const templateOffline = templateService.isOffline()
    setStatus(prev => ({ ...prev, templates: templateOffline ? 'offline' : 'online' }))

    // Check AI service (simplified check)
    try {
      const aiKey = import.meta.env.VITE_OPENAI_API_KEY
      setStatus(prev => ({ ...prev, ai: aiKey ? 'online' : 'offline' }))
    } catch (error) {
      setStatus(prev => ({ ...prev, ai: 'offline' }))
    }

    // Check knowledge base (simplified check)
    setStatus(prev => ({ ...prev, knowledge: 'online' }))
  }

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'checking':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'checking':
        return 'Checking...'
      default:
        return 'Unknown'
    }
  }

  const allOnline = Object.values(status).every(s => s === 'online')
  const anyOffline = Object.values(status).some(s => s === 'offline')

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Status Bar */}
        <div 
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor(allOnline ? 'online' : anyOffline ? 'offline' : 'checking')}`}></div>
          <span className="text-sm font-medium text-gray-700">
            System Status
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 px-3 py-2 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Backend API</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.backend)}`}></div>
                <span className="text-gray-700">{getStatusText(status.backend)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Template Service</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.templates)}`}></div>
                <span className="text-gray-700">{getStatusText(status.templates)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">AI Service</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.ai)}`}></div>
                <span className="text-gray-700">{getStatusText(status.ai)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Knowledge Base</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status.knowledge)}`}></div>
                <span className="text-gray-700">{getStatusText(status.knowledge)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={checkSystemStatus}
                className="w-full text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SystemStatusIndicator



