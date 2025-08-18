import { Project } from '../types'

// Mock data storage
let projects: Project[] = [
  {
    id: '1',
    name: 'Intelligent Documentation Automation Platform (IDAP)',
    purpose: 'To automate SRS, SDD, and other documentation processes',
    scope: 'Include: SRS, SDD automation, diagram generation; Exclude: Third-party hosting',
    objectives: ['Generate standard-compliant documents in < 10 minutes', 'Reduce documentation time by 80%'],
    stakeholders: ['MoEST ICT Unit', 'System Analysts', 'Developers', 'End Users'],
    projectSponsor: 'Ministry of Education, Science and Technology (MoEST)',
    budget: 'TZS 150,000,000',
    timeline: {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      milestones: []
    },
    technologyStack: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Keycloak'],
    deliverables: ['SRS module', 'SDD generator', 'AI-assisted drafting engine'],
    successCriteria: ['95% of documents generated meet IEEE/ISO standards'],
    constraints: ['Must be deployed on NIDC servers', 'No public cloud use'],
    dependencies: ['API availability', 'Stakeholder approvals', 'ICT Unit resources'],
    risks: [],
    qualityStandards: ['IEEE 830 for SRS', 'ISO/IEC/IEEE 42010 for SDD'],
    securityRequirements: ['Role-based access control', 'TLS encryption', 'Audit trails'],
    changeManagement: 'Formal change request through MoEST ICT governance',
    status: 'Active',
    manager: 'John Doe',
    team: [],
    documents: [],
    requirements: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Student Management System',
    purpose: 'Comprehensive student information and academic management system',
    scope: 'Include: Student registration, grades, attendance; Exclude: Financial management',
    objectives: ['Streamline student registration process', 'Improve academic tracking'],
    stakeholders: ['Academic Staff', 'Students', 'Administration'],
    projectSponsor: 'University IT Department',
    budget: 'TZS 75,000,000',
    timeline: {
      startDate: '2025-03-01',
      endDate: '2025-08-31',
      milestones: []
    },
    technologyStack: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
    deliverables: ['Student portal', 'Admin dashboard', 'Reporting system'],
    successCriteria: ['100% student adoption rate', '50% reduction in administrative tasks'],
    constraints: ['Must integrate with existing university systems'],
    dependencies: ['University database access', 'Staff training'],
    risks: [],
    qualityStandards: ['ISO 25010', 'WCAG 2.1 accessibility'],
    securityRequirements: ['Student data protection', 'FERPA compliance'],
    changeManagement: 'Change control board approval required',
    status: 'Planning',
    manager: 'Jane Smith',
    team: [],
    documents: [],
    requirements: [],
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  }
]

class ProjectService {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...projects]
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const project = projects.find(p => p.id === id)
    return project || null
  }

  // Create new project
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'requirements'>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      documents: [],
      requirements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    projects.push(newProject)
    return newProject
  }

  // Update project
  async updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'requirements'>>): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const projectIndex = projects.findIndex(p => p.id === id)
    if (projectIndex === -1) return null
    
    const updatedProject: Project = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    }
    
    projects[projectIndex] = updatedProject
    return updatedProject
  }

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const projectIndex = projects.findIndex(p => p.id === id)
    if (projectIndex === -1) return false
    
    projects.splice(projectIndex, 1)
    return true
  }

  // Search projects
  async searchProjects(query: string, status?: string): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filteredProjects = projects
    
    if (query) {
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.purpose.toLowerCase().includes(query.toLowerCase()) ||
        project.manager.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    if (status && status !== 'All') {
      filteredProjects = filteredProjects.filter(project => project.status === status)
    }
    
    return filteredProjects
  }
}

export const projectService = new ProjectService()
export default projectService







