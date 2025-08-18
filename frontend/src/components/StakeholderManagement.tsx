import React, { useState, useMemo } from 'react'
import { 
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface Stakeholder {
  id: string
  name: string
  role: string
  organization: string
  email: string
  phone: string
  influence: 'high' | 'medium' | 'low'
  interest: 'high' | 'medium' | 'low'
  requirements: string[]
  approvalLevel: 'none' | 'review' | 'approve' | 'final'
  status: 'active' | 'inactive' | 'pending'
  notes: string
  lastContact: string
  nextContact: string
}



interface StakeholderManagementProps {
  // Add any props if needed
}

const StakeholderManagement: React.FC<StakeholderManagementProps> = () => {
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'analysis'>('list')
  const [showStakeholderModal, setShowStakeholderModal] = useState(false)

  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null)
  const [filters, setFilters] = useState({
    influence: '',
    interest: '',
    approvalLevel: '',
    status: '',
    organization: ''
  })

  // Sample stakeholders data
  const [stakeholders] = useState<Stakeholder[]>([
    {
      id: 'STK-001',
      name: 'John Doe',
      role: 'Project Manager',
      organization: 'TechCorp',
      email: 'john.doe@techcorp.com',
      phone: '+1-555-0123',
      influence: 'high',
      interest: 'high',
      requirements: ['REQ-001', 'REQ-002'],
      approvalLevel: 'approve',
      status: 'active',
      notes: 'Primary stakeholder for the project',
      lastContact: '2024-01-15',
      nextContact: '2024-01-22'
    }
  ])

  // Filter stakeholders based on current filters
  const filteredStakeholders = useMemo(() => {
    return stakeholders.filter(stakeholder => {
      if (filters.influence && stakeholder.influence !== filters.influence) return false
      if (filters.interest && stakeholder.interest !== filters.interest) return false
      if (filters.approvalLevel && stakeholder.approvalLevel !== filters.approvalLevel) return false
      if (filters.status && stakeholder.status !== filters.status) return false
      if (filters.organization && stakeholder.organization !== filters.organization) return false
      return true
    })
  }, [stakeholders, filters])

  // Generate stakeholder analysis data
  const analysisData = useMemo(() => {
    const totalStakeholders = stakeholders.length
    const activeStakeholders = stakeholders.filter(s => s.status === 'active').length
    const highInfluence = stakeholders.filter(s => s.influence === 'high').length
    const highInterest = stakeholders.filter(s => s.interest === 'high').length
    const approvalRequired = stakeholders.filter(s => s.approvalLevel === 'approve' || s.approvalLevel === 'final').length

    // Influence-Interest Matrix
    const matrix = {
      highInfluenceHighInterest: stakeholders.filter(s => s.influence === 'high' && s.interest === 'high').length,
      highInfluenceLowInterest: stakeholders.filter(s => s.influence === 'high' && s.interest === 'low').length,
      lowInfluenceHighInterest: stakeholders.filter(s => s.influence === 'low' && s.interest === 'high').length,
      lowInfluenceLowInterest: stakeholders.filter(s => s.influence === 'low' && s.interest === 'low').length
    }

    return {
      total: totalStakeholders,
      active: activeStakeholders,
      highInfluence,
      highInterest,
      approvalRequired,
      matrix
    }
  }, [stakeholders])

  // Get unique organizations
  const organizations = useMemo(() => {
    return [...new Set(stakeholders.map(s => s.organization))].filter(Boolean)
  }, [stakeholders])

  const renderStakeholderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
                </h2>
                <p className="text-blue-100">Manage stakeholder information and requirements</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowStakeholderModal(false)
                setEditingStakeholder(null)
              }}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const stakeholder: Stakeholder = {
              id: editingStakeholder?.id || `stakeholder-${Date.now()}`,
              name: formData.get('name') as string,
              role: formData.get('role') as string,
              organization: formData.get('organization') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              influence: formData.get('influence') as 'high' | 'medium' | 'low',
              interest: formData.get('interest') as 'high' | 'medium' | 'low',
              requirements: editingStakeholder?.requirements || [],
              approvalLevel: formData.get('approvalLevel') as 'none' | 'review' | 'approve' | 'final',
              status: formData.get('status') as 'active' | 'inactive' | 'pending',
              notes: formData.get('notes') as string,
              lastContact: formData.get('lastContact') as string,
              nextContact: formData.get('nextContact') as string
            }

            if (editingStakeholder) {
              console.log('Update stakeholder:', stakeholder)
            } else {
                              console.log('Create stakeholder:', stakeholder)
            }
            setShowStakeholderModal(false)
            setEditingStakeholder(null)
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingStakeholder?.name}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <input
                  type="text"
                  name="role"
                  defaultValue={editingStakeholder?.role}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  type="text"
                  name="organization"
                  defaultValue={editingStakeholder?.organization}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingStakeholder?.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingStakeholder?.phone}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Influence Level *</label>
                <select
                  name="influence"
                  defaultValue={editingStakeholder?.influence || 'medium'}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Level *</label>
                <select
                  name="interest"
                  defaultValue={editingStakeholder?.interest || 'medium'}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Level *</label>
                <select
                  name="approvalLevel"
                  defaultValue={editingStakeholder?.approvalLevel || 'none'}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="none">No Approval Required</option>
                  <option value="review">Review Only</option>
                  <option value="approve">Approval Required</option>
                  <option value="final">Final Approval</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  name="status"
                  defaultValue={editingStakeholder?.status || 'active'}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={editingStakeholder?.notes}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Contact</label>
                <input
                  type="date"
                  name="lastContact"
                  defaultValue={editingStakeholder?.lastContact}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Contact</label>
                <input
                  type="date"
                  name="nextContact"
                  defaultValue={editingStakeholder?.nextContact}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowStakeholderModal(false)
                  setEditingStakeholder(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                {editingStakeholder ? 'Update Stakeholder' : 'Add Stakeholder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredStakeholders.map(stakeholder => (
        <div key={stakeholder.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{stakeholder.name}</h4>
                <span className="text-sm text-gray-600">{stakeholder.role}</span>
                {stakeholder.organization && (
                  <span className="text-sm text-gray-500">({stakeholder.organization})</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {stakeholder.email && <span>{stakeholder.email}</span>}
                {stakeholder.phone && <span>{stakeholder.phone}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stakeholder.influence === 'high' ? 'bg-red-100 text-red-700' :
                stakeholder.influence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {stakeholder.influence} Influence
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stakeholder.interest === 'high' ? 'bg-blue-100 text-blue-700' :
                stakeholder.interest === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {stakeholder.interest} Interest
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stakeholder.approvalLevel === 'final' ? 'bg-purple-100 text-purple-700' :
                stakeholder.approvalLevel === 'approve' ? 'bg-blue-100 text-blue-700' :
                stakeholder.approvalLevel === 'review' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {stakeholder.approvalLevel}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Requirements: {stakeholder.requirements.length}</span>
              <span>Last Contact: {stakeholder.lastContact || 'Never'}</span>
              <span>Next Contact: {stakeholder.nextContact || 'Not scheduled'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingStakeholder(stakeholder)}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => console.log('Delete stakeholder:', stakeholder.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMatrixView = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Influence-Interest Matrix</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">High Interest</div>
          <div className="space-y-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="text-sm font-medium text-red-700">High Influence</div>
              <div className="text-xs text-red-600">{analysisData.matrix.highInfluenceHighInterest} stakeholders</div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm font-medium text-yellow-700">Low Influence</div>
              <div className="text-xs text-yellow-600">{analysisData.matrix.lowInfluenceHighInterest} stakeholders</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Medium Interest</div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm font-medium text-blue-700">Monitor</div>
            <div className="text-xs text-blue-600">Keep informed</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">Low Interest</div>
          <div className="space-y-2">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="text-sm font-medium text-orange-700">High Influence</div>
              <div className="text-xs text-orange-600">{analysisData.matrix.highInfluenceLowInterest} stakeholders</div>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="text-sm font-medium text-gray-700">Low Influence</div>
              <div className="text-xs text-gray-600">{analysisData.matrix.lowInfluenceLowInterest} stakeholders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalysisView = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{analysisData.total}</div>
          <div className="text-sm text-gray-600">Total Stakeholders</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{analysisData.active}</div>
          <div className="text-sm text-gray-600">Active Stakeholders</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{analysisData.highInfluence}</div>
          <div className="text-sm text-gray-600">High Influence</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{analysisData.approvalRequired}</div>
          <div className="text-sm text-gray-600">Approval Required</div>
        </div>
      </div>

      {/* Organization Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stakeholders by Organization</h3>
        <div className="space-y-3">
          {organizations.map(org => {
            const count = stakeholders.filter(s => s.organization === org).length
            return (
              <div key={org} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{org}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / stakeholders.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Approval Workflow */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflow</h3>
        <div className="space-y-4">
          {stakeholders.filter(s => s.approvalLevel === 'final').map(stakeholder => (
            <div key={stakeholder.id} className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded">
              <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              <div>
                <span className="font-medium text-purple-900">{stakeholder.name}</span>
                <span className="text-sm text-purple-700 ml-2">({stakeholder.role})</span>
              </div>
              <span className="ml-auto text-sm text-purple-600">Final Approval</span>
            </div>
          ))}
          {stakeholders.filter(s => s.approvalLevel === 'approve').map(stakeholder => (
            <div key={stakeholder.id} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium text-blue-900">{stakeholder.name}</span>
                <span className="text-sm text-blue-700 ml-2">({stakeholder.role})</span>
              </div>
              <span className="ml-auto text-sm text-blue-600">Approval Required</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stakeholder Management</h2>
          <p className="text-gray-600">Identify, analyze, and manage project stakeholders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStakeholderModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Stakeholder
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Influence</label>
            <select
              value={filters.influence}
              onChange={(e) => setFilters({ ...filters, influence: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Interest</label>
            <select
              value={filters.interest}
              onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Approval Level</label>
            <select
              value={filters.approvalLevel}
              onChange={(e) => setFilters({ ...filters, approvalLevel: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Levels</option>
              <option value="none">No Approval</option>
              <option value="review">Review</option>
              <option value="approve">Approval</option>
              <option value="final">Final Approval</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Organization</label>
            <select
              value={filters.organization}
              onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value="">All Organizations</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'list' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('matrix')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'matrix' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Matrix View
        </button>
        <button
          onClick={() => setViewMode('analysis')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'analysis' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Analysis
        </button>
      </div>

      {/* Content */}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'matrix' && renderMatrixView()}
      {viewMode === 'analysis' && renderAnalysisView()}

      {/* Stakeholder Modal */}
      {showStakeholderModal && renderStakeholderModal()}
    </div>
  )
}

export default StakeholderManagement

