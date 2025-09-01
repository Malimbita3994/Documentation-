import React, { useState, useEffect } from 'react'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Project, ProjectStatus } from '../types'

interface ProjectRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: any) => void
  project?: Project | null
  mode: 'create' | 'edit' | 'view'
}

const ProjectRegistrationModal: React.FC<ProjectRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    scope: '',
    objectives: [''],
    stakeholders: [''],
    projectSponsor: '',
    budget: '',
    startDate: '',
    endDate: '',
    technologyStack: [''],
    deliverables: [''],
    successCriteria: [''],
    constraints: [''],
    dependencies: [''],
    qualityStandards: [''],
    securityRequirements: [''],
    changeManagement: '',
    status: 'Planning' as ProjectStatus,
    manager: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load project data when editing or viewing
  useEffect(() => {
    if (project && (mode === 'edit' || mode === 'view')) {
      // Parse the description to extract the detailed information
      const description = project.description || ''
      
      // Extract information from description (basic parsing)
      const extractField = (text: string, field: string): string => {
        const regex = new RegExp(`${field}:\\s*([^\\n]+)`, 'i')
        const match = text.match(regex)
        return match ? match[1].trim() : ''
      }
      
      setFormData({
        name: project.name || '',
        purpose: extractField(description, 'Purpose'),
        scope: extractField(description, 'Scope'),
        objectives: extractField(description, 'Objectives').split(',').filter(obj => obj.trim()) || [''],
        stakeholders: extractField(description, 'Stakeholders').split(',').filter(stakeholder => stakeholder.trim()) || [''],
        projectSponsor: extractField(description, 'Project Sponsor'),
        budget: extractField(description, 'Budget'),
        startDate: project.start_date || '',
        endDate: project.end_date || '',
        technologyStack: extractField(description, 'Technology Stack').split(',').filter(tech => tech.trim()) || [''],
        deliverables: extractField(description, 'Deliverables').split(',').filter(del => del.trim()) || [''],
        successCriteria: extractField(description, 'Success Criteria').split(',').filter(criteria => criteria.trim()) || [''],
        constraints: extractField(description, 'Constraints').split(',').filter(constraint => constraint.trim()) || [''],
        dependencies: extractField(description, 'Dependencies').split(',').filter(dep => dep.trim()) || [''],
        qualityStandards: extractField(description, 'Quality Standards').split(',').filter(standard => standard.trim()) || [''],
        securityRequirements: extractField(description, 'Security Requirements').split(',').filter(req => req.trim()) || [''],
        changeManagement: extractField(description, 'Change Management'),
        status: project.status || 'Planning',
        manager: project.manager?.name || ''
      })
    } else if (mode === 'create') {
      // Reset form for new project
      setFormData({
        name: '',
        purpose: '',
        scope: '',
        objectives: [''],
        stakeholders: [''],
        projectSponsor: '',
        budget: '',
        startDate: '',
        endDate: '',
        technologyStack: [''],
        deliverables: [''],
        successCriteria: [''],
        constraints: [''],
        dependencies: [''],
        qualityStandards: [''],
        securityRequirements: [''],
        changeManagement: '',
        status: 'Planning' as ProjectStatus,
        manager: ''
      })
    }
  }, [project, mode])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a comprehensive description that includes all the detailed information
      const description = `
Purpose: ${formData.purpose}

Scope: ${formData.scope}

Objectives: ${formData.objectives.filter(obj => obj.trim()).join(', ')}

Stakeholders: ${formData.stakeholders.filter(stakeholder => stakeholder.trim()).join(', ')}

Project Sponsor: ${formData.projectSponsor}

Budget: ${formData.budget}

Technology Stack: ${formData.technologyStack.filter(tech => tech.trim()).join(', ')}

Deliverables: ${formData.deliverables.filter(del => del.trim()).join(', ')}

Success Criteria: ${formData.successCriteria.filter(criteria => criteria.trim()).join(', ')}

Constraints: ${formData.constraints.filter(constraint => constraint.trim()).join(', ')}

Dependencies: ${formData.dependencies.filter(dep => dep.trim()).join(', ')}

Quality Standards: ${formData.qualityStandards.filter(standard => standard.trim()).join(', ')}

Security Requirements: ${formData.securityRequirements.filter(req => req.trim()).join(', ')}

Change Management: ${formData.changeManagement}
      `.trim()

      // Send only the fields that the backend expects
      const projectData = {
        name: formData.name,
        description: description,
        status: formData.status,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        manager_id: 3 // Using the first available user as manager
      }

      await onSave(projectData)
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Project Registration' : mode === 'edit' ? 'Edit Project' : 'Project Details'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Create a new project with comprehensive details' : mode === 'edit' ? 'Update project information' : 'View comprehensive project information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={mode === 'view' ? (e) => { e.preventDefault(); onClose(); } : handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="e.g., Intelligent Documentation Automation Platform (IDAP)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Manager *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    readOnly={mode === 'view'}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Purpose *
                  </label>
                  <textarea
                    required
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    readOnly={mode === 'view'}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${mode === 'view' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="e.g., To automate SRS, SDD, and other documentation processes"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope *
                  </label>
                  <textarea
                    required
                    value={formData.scope}
                    onChange={(e) => handleInputChange('scope', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Include: SRS, SDD automation, diagram generation; Exclude: Third-party hosting"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Stakeholders & Sponsorship */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Stakeholders & Sponsorship
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Sponsor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectSponsor}
                    onChange={(e) => handleInputChange('projectSponsor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Ministry of Education, Science and Technology (MoEST)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., TZS 150,000,000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stakeholders
                </label>
                {formData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={stakeholder}
                      onChange={(e) => handleArrayFieldChange('stakeholders', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MoEST ICT Unit, System Analysts, Developers"
                    />
                    {formData.stakeholders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('stakeholders', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('stakeholders')}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Stakeholder
                </button>
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Objectives
              </h3>
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Generate standard-compliant documents in < 10 minutes"
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('objectives', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('objectives')}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Objective
              </button>
            </div>

            {/* Technology & Deliverables */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Technology & Deliverables
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology Stack
                </label>
                {formData.technologyStack.map((tech, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayFieldChange('technologyStack', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., React, Node.js, PostgreSQL, Docker"
                    />
                    {formData.technologyStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('technologyStack', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('technologyStack')}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Technology
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deliverables
                </label>
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleArrayFieldChange('deliverables', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., SRS module, SDD generator, AI-assisted drafting engine"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('deliverables', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('deliverables')}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Deliverable
                </button>
              </div>
            </div>

            {/* Project Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Project Status
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (mode === 'create' ? 'Creating Project...' : 'Updating Project...') : (mode === 'create' ? 'Create Project' : 'Update Project')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectRegistrationModal
