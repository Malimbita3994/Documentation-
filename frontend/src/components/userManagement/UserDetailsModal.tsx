import React, { useState, useEffect } from 'react'
import { XMarkIcon, UserCircleIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

interface User {
  id: number
  name: string
  username?: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  bio?: string
  last_login_at?: string
  last_login_ip?: string
  roles: Array<{
    id: number
    name: string
    display_name: string
    permissions?: Array<{
      id: number
      name: string
      display_name: string
      module: string
    }>
  }>
  created_at: string
}

interface UserDetailsModalProps {
  user: User
  onClose: () => void
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetails()
  }, [user.id])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
              const response = await fetch(`http://localhost:8000/api/users/${user.id}`)
      const data = await response.json()
      setUserDetails(data.user)
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢'
      case 'inactive':
        return '⚪'
      case 'suspended':
        return '🔴'
      default:
        return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {userDetails.avatar ? (
                <img
                  className="h-16 w-16 rounded-full"
                  src={userDetails.avatar}
                  alt={userDetails.name}
                />
              ) : (
                <UserCircleIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900">{userDetails.name}</h3>
              <p className="text-sm text-gray-500">{userDetails.email}</p>
              {userDetails.username && (
                <p className="text-sm text-gray-500">@{userDetails.username}</p>
              )}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userDetails.status)}`}>
                  {getStatusIcon(userDetails.status)} {userDetails.status}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{userDetails.email}</p>
                </div>
                {userDetails.phone && (
                  <div>
                    <span className="text-xs text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{userDetails.phone}</p>
                  </div>
                )}
                {userDetails.username && (
                  <div>
                    <span className="text-xs text-gray-500">Username:</span>
                    <p className="text-sm text-gray-900">@{userDetails.username}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Joined: {new Date(userDetails.created_at).toLocaleDateString()}</span>
                </div>
                {userDetails.last_login_at && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Last login: {new Date(userDetails.last_login_at).toLocaleString()}</span>
                  </div>
                )}
                {userDetails.last_login_ip && (
                  <div>
                    <span className="text-xs text-gray-500">Last IP:</span>
                    <p className="text-sm text-gray-900">{userDetails.last_login_ip}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {userDetails.bio && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
              <p className="text-sm text-gray-700">{userDetails.bio}</p>
            </div>
          )}

          {/* Roles and Permissions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Roles & Permissions</h4>
            
            {userDetails.roles.length > 0 ? (
              <div className="space-y-4">
                {userDetails.roles.map((role) => (
                  <div key={role.id} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-blue-900">{role.display_name}</h5>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {role.name}
                      </span>
                    </div>
                    
                    {role.permissions && role.permissions.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-blue-700 mb-2">Permissions:</h6>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <span
                              key={permission.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission.display_name}
                              <span className="ml-1 text-blue-600">({permission.module})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">No roles assigned</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal




