import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  DocumentTextIcon, 
  ServerIcon, 
  FolderIcon, 
  DocumentDuplicateIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  path: string
  label: string
  icon: React.ComponentType<any>
  description: string
  color: string
}

const navigationItems: NavigationItem[] = [
  {
    path: '/srs',
    label: 'SRS',
    icon: DocumentTextIcon,
    description: 'Software Requirements Specification',
    color: 'blue'
  },
  {
    path: '/sdd',
    label: 'SDD',
    icon: ServerIcon,
    description: 'Software Design Document',
    color: 'green'
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: FolderIcon,
    description: 'Project Management',
    color: 'purple'
  },
  {
    path: '/documents',
    label: 'Documents',
    icon: DocumentDuplicateIcon,
    description: 'Document Management',
    color: 'indigo'
  },
  {
    path: '/templates',
    label: 'Templates',
    icon: DocumentDuplicateIcon,
    description: 'Document Templates',
    color: 'teal'
  },
  {
    path: '/qr-generator',
    label: 'QR Code',
    icon: DocumentDuplicateIcon,
    description: 'QR Code Generator',
    color: 'pink'
  }
]

const UnifiedNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap: { [key: string]: string } = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
      teal: isActive ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-600 hover:bg-teal-100',
      pink: isActive ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
    }
    return colorMap[color] || 'bg-gray-50 text-gray-600 hover:bg-gray-100'
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">DocumentHub</h1>
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              Unified Document Management System
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.path
              const Icon = item.icon
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${getColorClasses(item.color, isActive)}
                    ${isActive ? 'shadow-md scale-105' : 'hover:scale-105'}
                  `}
                  title={item.description}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:block">{item.label}</span>
                  {isActive && (
                    <ArrowRightIcon className="h-4 w-4 animate-pulse" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/projects')}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FolderIcon className="h-4 w-4" />
              <span>New Project</span>
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              <span>New Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb for current page */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Current:</span>
            {navigationItems.find(item => item.path === currentPath) && (
              <>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900">
                  {navigationItems.find(item => item.path === currentPath)?.label}
                </span>
                <span className="text-gray-400">-</span>
                <span className="text-gray-500">
                  {navigationItems.find(item => item.path === currentPath)?.description}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnifiedNavigation
