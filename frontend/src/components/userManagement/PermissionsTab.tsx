import React, { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon,
  TrashIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import PermissionModal from './PermissionModal'
import { useAuth } from '../../contexts/AuthContext'

interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
  module: string
  is_active: boolean
  roles_count?: number
  created_at: string
}

const PermissionsTab: React.FC = () => {
  const { token } = useAuth()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [modules, setModules] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPermissions()
  }, [currentPage, searchTerm, moduleFilter, activeFilter])

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '10'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (moduleFilter) params.append('module', moduleFilter)
      if (activeFilter) params.append('active', activeFilter)

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

              const response = await fetch(`http://localhost:8000/api/permissions?${params}`, { headers })
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions')
      }
      
      const data = await response.json()
      setPermissions(data.permissions.data)
      setTotalPages(data.permissions.last_page)
      setModules(data.modules || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePermission = async (permissionId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg',
        cancelButton: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
      }
    })

    if (result.isConfirmed) {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
          method: 'DELETE',
          headers
        })

        if (response.ok) {
          toast.success('Permission deleted successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
          fetchPermissions()
        } else {
          const error = await response.json()
          toast.error(error.message || 'Error deleting permission', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
      } catch (error) {
        console.error('Error deleting permission:', error)
        toast.error('Error deleting permission', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    }
  }

  const getModuleColor = (module: string) => {
    const colors = {
      users: 'bg-blue-100 text-blue-800',
      roles: 'bg-green-100 text-green-800',
      permissions: 'bg-purple-100 text-purple-800',
      projects: 'bg-orange-100 text-orange-800',
      documents: 'bg-indigo-100 text-indigo-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[module as keyof typeof colors] || colors.general
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full max-w-full overflow-hidden">
        <div className="flex-1 max-w-md min-w-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Modules</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            onClick={() => setShowPermissionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Permission</span>
          </button>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-full">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading permissions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <KeyIcon className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {permission.display_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {permission.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {permission.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(permission.module)}`}>
                        {permission.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {permission.is_active ? '🟢 Active' : '⚪ Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.roles_count || 0} roles
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPermission(permission)
                            setShowPermissionModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Permission"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePermission(permission.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Permission"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionModal
          permission={selectedPermission}
          onClose={() => {
            setShowPermissionModal(false)
            setSelectedPermission(null)
          }}
          onSave={() => {
            setShowPermissionModal(false)
            setSelectedPermission(null)
            fetchPermissions()
          }}
        />
      )}
    </div>
  )
}

export default PermissionsTab




