import { useState, useEffect } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, CalendarIcon, UserIcon, TagIcon, BuildingOfficeIcon, UserGroupIcon, EyeIcon, DocumentTextIcon, ServerIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import ProjectRegistrationModal from '../components/ProjectRegistrationModal'
import { Project, ProjectStatus } from '../types'
import projectService from '../services/projectService'
import toast from 'react-hot-toast'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'All'>('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])

  // Load projects on component mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Filter projects when search or status changes
  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, selectedStatus])

  const loadProjects = async () => {
    try {
      setLoading(true)
      console.log('Loading projects...')
      
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No authentication token found')
        toast.error('Please log in to view projects')
        setProjects([])
        return
      }
      
      console.log('Token found, making API call...')
      const response = await projectService.getAllProjects()
      console.log('API response:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response))
      
      // Handle different response formats
      if (response.data) {
        console.log('Setting projects from response.data:', response.data)
        console.log('Number of projects:', response.data.length)
        setProjects(response.data)
      } else if (Array.isArray(response)) {
        console.log('Setting projects from array response:', response)
        console.log('Number of projects:', response.length)
        setProjects(response)
      } else {
        console.log('No projects found in response:', response)
        setProjects([])
      }
    } catch (error: any) {
      console.error('Error loading projects:', error)
      if (error.message?.includes('401')) {
        toast.error('Please log in to view projects')
      } else {
        toast.error('Failed to load projects')
      }
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = async () => {
    try {
      const response = await projectService.searchProjects(searchQuery, selectedStatus)
      
      // Handle different response formats
      if (response.data) {
        setFilteredProjects(response.data)
      } else if (Array.isArray(response)) {
        setFilteredProjects(response)
      } else {
        setFilteredProjects([])
      }
    } catch (error: any) {
      console.error('Error filtering projects:', error)
      setFilteredProjects([])
    }
  }

  const handleCreateProject = async (projectData: any) => {
    try {
      console.log('Creating project with data:', projectData)
      const newProject = await projectService.createProject(projectData)
      console.log('Project created:', newProject)
      
      // Refresh the entire project list instead of just adding to state
      await loadProjects()
      
      setShowCreateModal(false)
      toast.success('Project created successfully!')
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    }
  }

  const handleEditProject = async (projectData: any) => {
    if (!selectedProject) return
    
    try {
      const updatedProject = await projectService.updateProject(selectedProject.id, projectData)
      if (updatedProject) {
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p))
        setShowEditModal(false)
        setSelectedProject(null)
        toast.success('Project updated successfully!')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const handleDeleteProject = async (projectId: string) => {
    console.log('Delete clicked for project:', projectId)
    setProjectToDelete(projectId)
    setShowDeleteModal(true)
    console.log('Modal state set to true, projectToDelete:', projectId)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return

    try {
      const success = await projectService.deleteProject(projectToDelete)
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete))
        toast.success('Project deleted successfully!')
        setShowDeleteModal(false)
        setProjectToDelete(null)
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setShowEditModal(true)
  }

  const openViewModal = (project: Project) => {
    setSelectedProject(project)
    setShowViewModal(true)
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Planning': return 'bg-blue-100 text-blue-800'
      case 'On Hold': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">Loading projects...</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  // Debug logging
  console.log('Component render - showDeleteModal:', showDeleteModal, 'projectToDelete:', projectToDelete)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your documentation projects and track their progress.
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Cross-Page Navigation */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button 
          onClick={() => window.location.href = '/srs'}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
        >
          <DocumentTextIcon className="h-4 w-4" />
          <span>Go to SRS</span>
        </button>
        <button 
          onClick={() => window.location.href = '/sdd'}
          className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
        >
          <ServerIcon className="h-4 w-4" />
          <span>Go to SDD</span>
        </button>
        <button 
          onClick={() => window.location.href = '/documents'}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>All Documents</span>
        </button>
        <button 
          onClick={() => window.location.href = '/templates'}
          className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>Document Templates</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {(searchQuery || selectedStatus !== 'All' ? filteredProjects : projects).length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new project.</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery || selectedStatus !== 'All' ? filteredProjects : projects).map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description ? project.description.substring(0, 100) + '...' : 'No description'}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{project.manager?.name || 'No manager'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span>{project.description ? 'Project Sponsor: ' + (project.description.match(/Project Sponsor:\s*([^\n]+)/)?.[1] || 'Not specified') : 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>{project.description ? (project.description.match(/Budget:\s*([^\n]+)/)?.[1] || 'Not specified') : 'Not specified'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    <span>{project.description ? (project.description.match(/Stakeholders:\s*([^\n]+)/)?.[1] || 'Not specified') : 'Not specified'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openViewModal(project)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Project Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => openEditModal(project)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(searchQuery || selectedStatus !== 'All' ? filteredProjects : projects).map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 break-words">{project.name}</div>
                        <div className="text-sm text-gray-500 break-words line-clamp-2">{project.description ? project.description.substring(0, 80) + '...' : 'No description'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-words">
                      {project.manager?.name || 'No manager'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-words">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-words">
                      {project.description ? (project.description.match(/Budget:\s*([^\n]+)/)?.[1] || 'Not specified') : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                        <button 
                          onClick={() => openViewModal(project)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => openEditModal(project)}
                          className="text-green-600 hover:text-green-900 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Registration Modal - Create */}
      <ProjectRegistrationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateProject}
        mode="create"
      />

      {/* Project Registration Modal - Edit */}
      <ProjectRegistrationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedProject(null)
        }}
        onSave={handleEditProject}
        project={selectedProject}
        mode="edit"
      />

      {/* Project View Modal */}
      <ProjectRegistrationModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedProject(null)
        }}
        onSave={() => {}} // No save function for view mode
        project={selectedProject}
        mode="view"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setProjectToDelete(null)
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
