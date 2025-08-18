import React, { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  KeyIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import UsersTab from '../components/userManagement/UsersTab'
import RolesTab from '../components/userManagement/RolesTab'
import PermissionsTab from '../components/userManagement/PermissionsTab'
import { useAuth } from '../contexts/AuthContext'

const UserManagement: React.FC = () => {
  const { token, isAuthenticated } = useAuth()
  const [selectedTab, setSelectedTab] = useState(0)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeRoles: 0,
    totalPermissions: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tabs = [
    {
      name: 'Users',
      icon: UsersIcon,
      description: 'Manage system users',
      component: <UsersTab />
    },
    {
      name: 'Roles',
      icon: ShieldCheckIcon,
      description: 'Manage user roles',
      component: <RolesTab />
    },
    {
      name: 'Permissions',
      icon: KeyIcon,
      description: 'Manage system permissions',
      component: <PermissionsTab />
    }
  ]

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        fetch('/api/users/stats', { headers }),
        fetch('/api/roles/stats', { headers }),
        fetch('/api/permissions/stats', { headers })
      ])

      if (!usersResponse.ok || !rolesResponse.ok || !permissionsResponse.ok) {
        throw new Error('Failed to fetch statistics')
      }

      const usersData = await usersResponse.json()
      const rolesData = await rolesResponse.json()
      const permissionsData = await permissionsResponse.json()

      setStats({
        totalUsers: usersData.total_users || 0,
        activeRoles: rolesData.active_roles || 0,
        totalPermissions: permissionsData.total_permissions || 0
      })
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load user management data. Please check your connection and try again.')
      // Set default values on error
      setStats({
        totalUsers: 0,
        activeRoles: 0,
        totalPermissions: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Authentication Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>You need to be logged in to access User Management. Please log in to continue.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage users, roles, and permissions for your system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Admin Access Required
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm w-full max-w-full overflow-hidden">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 p-4 border-b border-gray-200 w-full max-w-full overflow-hidden">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selected
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`
                }
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6 w-full max-w-full overflow-hidden">
            {tabs.map((tab, index) => (
              <Tab.Panel key={index} className="space-y-4 w-full max-w-full overflow-hidden">
                {tab.component}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : stats.activeRoles}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <KeyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : stats.totalPermissions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement


