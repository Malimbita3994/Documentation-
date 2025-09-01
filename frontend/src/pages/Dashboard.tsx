import React from 'react'
import { Link } from 'react-router-dom'
import {
  DocumentTextIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  SparklesIcon,
  BeakerIcon,
  ClipboardDocumentIcon,
  UserIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import AITestComponent from '../components/AITestComponent'
import TemplateTestComponent from '../components/TemplateTestComponent'

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Documents',
      value: '24',
      change: '+5',
      changeType: 'increase',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      name: 'AI Generated',
      value: '18',
      change: '+12',
      changeType: 'increase',
      icon: SparklesIcon,
      color: 'purple'
    },
    {
      name: 'Active Projects',
      value: '8',
      change: 'All projects',
      changeType: 'neutral',
      icon: FolderIcon,
      color: 'green'
    },
    {
      name: 'Requirements',
      value: '156',
      change: '+23',
      changeType: 'increase',
      icon: ClipboardDocumentListIcon,
      color: 'orange'
    }
  ]

  const documentTypeStats = [
    {
      name: 'SRS Documents',
      count: 8,
      icon: DocumentTextIcon,
      color: 'blue',
      trend: '+3'
    },
    {
      name: 'SDD Documents',
      count: 6,
      icon: DocumentCheckIcon,
      color: 'green',
      trend: '+2'
    },
    {
      name: 'Test Cases',
      count: 4,
      icon: ClipboardDocumentIcon,
      color: 'purple',
      trend: '+1'
    },
    {
      name: 'User Manuals',
      count: 3,
      icon: UserIcon,
      color: 'pink',
      trend: '+1'
    },
    {
      name: 'Progress Reports',
      count: 2,
      icon: ChartPieIcon,
      color: 'indigo',
      trend: '+1'
    },
    {
      name: 'Feasibility Studies',
      count: 1,
      icon: BeakerIcon,
      color: 'teal',
      trend: '+1'
    }
  ]

  const quickActions = [
    {
      name: 'Generate SRS',
      description: 'AI-powered Software Requirements Specification',
      icon: DocumentTextIcon,
      href: '/documents?type=srs',
      color: 'blue',
      badge: 'AI'
    },
    {
      name: 'Create SDD',
      description: 'Software Design Document with deep algorithms',
      icon: DocumentCheckIcon,
      href: '/documents?type=sdd',
      color: 'green',
      badge: 'AI'
    },
    {
      name: 'New Project',
      description: 'Create a new project',
      icon: FolderIcon,
      href: '/projects/new',
      color: 'orange'
    },
    {
      name: 'Test Cases',
      description: 'Generate comprehensive test cases',
      icon: ClipboardDocumentIcon,
      href: '/documents?type=test-cases',
      color: 'purple',
      badge: 'AI'
    }
  ]

  const recentDocuments = [
    {
      id: 1,
      title: 'E-commerce Platform SRS',
      type: 'SRS',
      version: 'v1.2',
      status: 'In Review',
      lastModified: '2 hours ago',
      statusColor: 'yellow',
      isAIGenerated: true,
      project: 'E-commerce Platform'
    },
    {
      id: 2,
      title: 'Mobile App Design Document',
      type: 'SDD',
      version: 'v2.1',
      status: 'Draft',
      lastModified: '1 day ago',
      statusColor: 'gray',
      isAIGenerated: true,
      project: 'Mobile App'
    },
    {
      id: 3,
      title: 'API Integration Test Cases',
      type: 'Test Cases',
      version: 'v1.0',
      status: 'Published',
      lastModified: '3 days ago',
      statusColor: 'green',
      isAIGenerated: true,
      project: 'API Integration'
    },
    {
      id: 4,
      title: 'User Manual - CRM System',
      type: 'User Manual',
      version: 'v1.1',
      status: 'Published',
      lastModified: '5 days ago',
      statusColor: 'green',
      isAIGenerated: true,
      project: 'CRM System'
    }
  ]

  const recentProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Modern online shopping platform with mobile app',
      status: 'Active',
      progress: 75,
      statusColor: 'green',
      documentsCount: 8,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'CRM System',
      description: 'Customer relationship management solution',
      status: 'Planning',
      progress: 25,
      statusColor: 'blue',
      documentsCount: 4,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      description: 'Real-time business intelligence platform',
      status: 'Development',
      progress: 60,
      statusColor: 'orange',
      documentsCount: 6,
      lastActivity: '3 days ago'
    }
  ]

  const aiGenerationStats = [
    {
      name: 'Generation Success Rate',
      value: '94%',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'Average Generation Time',
      value: '2.3s',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      name: 'Quality Score',
      value: '8.7/10',
      icon: ChartBarIcon,
      color: 'purple'
    },
    {
      name: 'Standards Compliance',
      value: '96%',
      icon: DocumentCheckIcon,
      color: 'teal'
    }
  ]

  const getStatusColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50',
      pink: 'text-pink-600 bg-pink-50',
      indigo: 'text-indigo-600 bg-indigo-50',
      teal: 'text-teal-600 bg-teal-50'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'SRS': 'bg-blue-100 text-blue-800 border-blue-200',
      'SDD': 'bg-green-100 text-green-800 border-green-200',
      'Test Cases': 'bg-purple-100 text-purple-800 border-purple-200',
      'User Manual': 'bg-pink-100 text-pink-800 border-pink-200',
      'Progress Report': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Feasibility Study': 'bg-teal-100 text-teal-800 border-teal-200',
      'Concept Note': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return typeColors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-l from-blue-600/90 to-blue-500/80 backdrop-blur-sm rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-blue-100 text-lg">
            Your Intelligent Documentation Automation Platform is ready with AI-powered document generation and deep algorithms.
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm font-medium">AI Generation Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${getIconColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.changeType === 'increase' && (
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
              {stat.changeType === 'neutral' && (
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Generation Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Generation Performance</h2>
            <p className="text-sm text-gray-600">Real-time metrics for document generation quality and efficiency</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiGenerationStats.map((stat) => (
            <div key={stat.name} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${getIconColor(stat.color)}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Types Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Types Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTypeStats.map((docType) => (
            <div key={docType.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getIconColor(docType.color)}`}>
                  <docType.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{docType.name}</p>
                  <p className="text-sm text-gray-600">{docType.count} documents</p>
                </div>
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                {docType.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getIconColor(action.color)} group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.name}
                    </h3>
                    {action.badge && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
            <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      {doc.isAIGenerated && (
                        <SparklesIcon className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                      <span>•</span>
                      <span>{doc.version}</span>
                      <span>•</span>
                      <span>{doc.project}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(doc.statusColor)}`}>
                    {doc.status}
                  </span>
                  <span className="text-xs text-gray-500">{doc.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.statusColor)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{project.documentsCount} documents</span>
                  <span>Last activity: {project.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Integration Test */}
      <div className="mt-6">
        <AITestComponent />
        <TemplateTestComponent />
      </div>
    </div>
  )
}

export default Dashboard
