import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ServerIcon,
  ClipboardDocumentIcon,
  SparklesIcon,
  ChartPieIcon,
  UserIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

const Sidebar: React.FC = () => {
  const location = useLocation()
  
  // Use a more reliable state management approach
  const [documentsExpanded, setDocumentsExpanded] = useState(false)
  
  // Auto-expand documents section when on documents page
  useEffect(() => {
    if (location.pathname === '/documents') {
      setDocumentsExpanded(true)
    }
  }, [location.pathname])

  const toggleDocuments = () => {
    console.log('Toggling documents dropdown. Current state:', documentsExpanded)
    setDocumentsExpanded(!documentsExpanded)
  }

  const documentTypes = [
    { 
      name: 'SRS IEEE 830', 
      href: '/srs', 
      icon: DocumentTextIcon, 
      description: 'Comprehensive SRS Development',
      color: 'blue',
      longDescription: 'Professional SRS with IEEE 830-1998 compliance, traceability, validation, and modeling'
    },
    { 
      name: 'SDD', 
      href: '/sdd', 
      icon: ServerIcon, 
      description: 'Software Design Document',
      color: 'green',
      longDescription: 'System architecture and component design'
    },
    { 
      name: 'Test Cases', 
      href: '/test-cases', 
      icon: ClipboardDocumentIcon, 
      description: 'Test Cases & Test Plan',
      color: 'purple',
      longDescription: 'Comprehensive testing strategy and cases'
    },
    { 
      name: 'Concept Note', 
      href: '/concept-note', 
      icon: SparklesIcon, 
      description: 'Business Case & Feasibility',
      color: 'orange',
      longDescription: 'Project concept and business justification'
    },
    { 
      name: 'Progress Report', 
      href: '/progress-report', 
      icon: ChartPieIcon, 
      description: 'Project Progress Reports',
      color: 'indigo',
      longDescription: 'Track project milestones and progress'
    },
    { 
      name: 'User Manual', 
      href: '/user-manual', 
      icon: UserIcon, 
      description: 'User Manual & Documentation',
      color: 'pink',
      longDescription: 'End-user guides and documentation'
    },
    { 
      name: 'Feasibility Study', 
      href: '/feasibility-study', 
      icon: BeakerIcon, 
      description: 'Technical & Economic Analysis',
      color: 'teal',
      longDescription: 'Technical and economic feasibility analysis'
    }
  ]

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: HomeIcon, 
      description: 'Overview & analytics',
      badge: null
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: FolderIcon, 
      description: 'Project management',
      badge: null
    },
    { 
      name: 'Templates', 
      href: '/templates', 
      icon: DocumentDuplicateIcon, 
      description: 'Document templates',
      badge: null
    },
    { 
      name: 'QR Code Generator', 
      href: '/qr-generator', 
      icon: DocumentTextIcon, 
      description: 'Generate QR codes',
      badge: 'NEW'
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: ChartBarIcon, 
      description: 'Reports & insights',
      badge: null
    },
    { 
      name: 'Team', 
      href: '/team', 
      icon: UserGroupIcon, 
      description: 'Team collaboration',
      badge: null
    },
    { 
      name: 'User Management', 
      href: '/user-management', 
      icon: UserIcon, 
      description: 'Users, roles & permissions',
      badge: null
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Cog6ToothIcon, 
      description: 'System configuration',
      badge: null
    },
  ]

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap: { [key: string]: { bg: string, text: string, hover: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-50' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-50' }
    }
    
    const colors = colorMap[color] || colorMap.blue
    return isActive ? `${colors.bg} ${colors.text}` : `text-gray-400 group-hover:${colors.text} group-hover:${colors.bg}`
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 shadow-lg relative overflow-hidden">
      {/* 3D Grid Animation Background */}
      <div className="absolute inset-0 bg-[#6084d7] z-0">
        <div className="w-full h-full relative perspective-[360px] perspective-origin-center">
          {/* Top Plane */}
          <div 
            className="absolute w-[200%] h-[130%] bottom-[-30%] left-[-50%]"
            style={{
              backgroundImage: `
                linear-gradient(#a2cef4 2px, transparent 2px),
                linear-gradient(90deg, #a2cef4 2px, transparent 2px)
              `,
              backgroundSize: '100px 100px, 100px 100px',
              backgroundPosition: '-1px -1px, -1px -1px',
              transform: 'rotateX(85deg)',
              animation: 'planeMoveTop 2s infinite linear'
            }}
          />
          
          {/* Bottom Plane */}
          <div 
            className="absolute w-[200%] h-[130%] top-[-30%] left-[-50%]"
            style={{
              backgroundImage: `
                linear-gradient(#a2cef4 2px, transparent 2px),
                linear-gradient(90deg, #a2cef4 2px, transparent 2px)
              `,
              backgroundSize: '100px 100px, 100px 100px',
              backgroundPosition: '-1px -1px, -1px -1px',
              transform: 'rotateX(-85deg)',
              animation: 'planeMoveBot 2s infinite linear'
            }}
          />
        </div>
      </div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/20 backdrop-blur-[1px]" />

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/20 bg-white/90 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">ID</span>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">IDAP</span>
            <p className="text-xs text-gray-600 -mt-0.5">Intelligent Documentation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden relative z-10">
        <div className="h-full flex flex-col px-4 py-4 bg-white/80 backdrop-blur-md rounded-lg m-2 border border-white/50 shadow-sm">
          <div className="mb-4 shrink-0">
            <h3 className="px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Navigation
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            <ul role="list" className="space-y-2">
              {/* Dashboard - First */}
              <li>
                <Link
                  to="/"
                  className={`
                    group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200
                    ${location.pathname === '/'
                      ? 'bg-blue-100/90 text-blue-800 border-2 border-blue-300/50 shadow-md backdrop-blur-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 hover:border hover:border-blue-200/50 backdrop-blur-sm'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-md transition-all duration-200 flex-shrink-0
                    ${location.pathname === '/'
                      ? 'bg-blue-200/80 text-blue-700 shadow-sm' 
                      : 'text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100/80'
                    }
                  `}>
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="block truncate text-sm font-medium">Dashboard</span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Projects - Second */}
              <li>
                <Link
                  to="/projects"
                  className={`
                    group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200
                    ${location.pathname === '/projects'
                      ? 'bg-blue-100/90 text-blue-800 border-2 border-blue-300/50 shadow-md backdrop-blur-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 hover:border hover:border-blue-200/50 backdrop-blur-sm'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-md transition-all duration-200 flex-shrink-0
                    ${location.pathname === '/projects'
                      ? 'bg-blue-200/80 text-blue-700 shadow-sm' 
                      : 'text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100/80'
                    }
                  `}>
                    <FolderIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="block truncate text-sm font-medium">Projects</span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Documents with Dropdown - Third */}
              <li>
                <div>
                  <div className="flex">
                    <Link
                      to="/documents"
                      className={`
                        group flex-1 flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200
                        ${location.pathname === '/documents'
                          ? 'bg-blue-100/90 text-blue-800 border-2 border-blue-300/50 shadow-md backdrop-blur-sm'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 hover:border hover:border-blue-200/50 backdrop-blur-sm'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-md transition-all duration-200 flex-shrink-0
                        ${location.pathname === '/documents'
                          ? 'bg-blue-200/80 text-blue-700 shadow-sm' 
                          : 'text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100/80'
                        }
                      `}>
                        <DocumentTextIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 text-left overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="block truncate text-sm font-medium">Documents</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            AI
                          </span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={toggleDocuments}
                      className={`
                        p-2 text-gray-400 hover:text-gray-600 transition-colors relative
                        ${documentsExpanded ? 'text-blue-600 bg-blue-50/80 rounded-md backdrop-blur-sm' : ''}
                      `}
                      title={`Toggle Documents dropdown (Current: ${documentsExpanded ? 'Expanded' : 'Collapsed'})`}
                    >
                      {documentsExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Documents Dropdown */}
                  {documentsExpanded && (
                    <div className="ml-4 mt-2 space-y-1 bg-green-50/90 backdrop-blur-md border border-green-200/50 rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-green-700 mb-2 font-medium">📄 Document Types</div>
                      {documentTypes.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`
                              group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 min-w-0
                              ${isSubActive
                                ? 'bg-white/95 backdrop-blur-sm text-gray-900 border border-green-300/50 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/90 hover:backdrop-blur-sm hover:border hover:border-green-200/50'
                              }
                            `}
                          >
                            <div className={`
                              p-1.5 rounded-md transition-all duration-200 flex-shrink-0
                              ${getColorClasses(subItem.color, isSubActive)}
                            `}>
                              <subItem.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="block truncate text-sm font-medium">{subItem.name}</span>
                                {subItem.name === 'SRS' && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                    IEEE 830
                                  </span>
                                )}
                                {subItem.name === 'SDD' && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                    IEEE 1016
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </li>

              {/* Remaining Navigation Items */}
              {navigation.filter(item => item.name !== 'Dashboard' && item.name !== 'Projects').map((item) => {
                const isActive = location.pathname === item.href
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-blue-100/90 text-blue-800 border-2 border-blue-300/50 shadow-md backdrop-blur-sm'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 hover:border hover:border-blue-200/50 backdrop-blur-sm'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-md transition-all duration-200 flex-shrink-0
                        ${isActive 
                          ? 'bg-blue-200/80 text-blue-700 shadow-sm' 
                          : 'text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100/80'
                        }
                      `}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="block truncate text-sm font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* CSS Animations */}
      <style>{`
        @keyframes planeMoveTop {
          from {
            background-position: 0px -100px, 0px 0px;
          }
          to {
            background-position: 0px 0px, 100px 0px;
          }
        }

        @keyframes planeMoveBot {
          from {
            background-position: 0px 0px, 0px 0px;
          }
          to {
            background-position: 0px -100px, 100px 0px;
          }
        }

        .perspective-origin-center {
          perspective-origin: 50% 50%;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
