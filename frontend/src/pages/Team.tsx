import React from 'react'
import { UserGroupIcon } from '@heroicons/react/24/outline'

const Team: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-2">Team collaboration and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Management</h2>
        <p className="text-gray-600">
          Manage your team members, assign roles, and track collaboration on documentation projects.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Team Members</h3>
            <p className="text-blue-700 text-sm">View and manage team members</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Roles & Permissions</h3>
            <p className="text-green-700 text-sm">Assign roles and set permissions</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Collaboration</h3>
            <p className="text-purple-700 text-sm">Track team collaboration activities</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team
