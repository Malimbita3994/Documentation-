// Core Document Types
export interface Document {
  id: string
  title: string
  type: DocumentType
  projectId: string
  status: DocumentStatus
  version: string
  content: DocumentContent
  metadata: DocumentMetadata
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
  tags: string[]
  requirements: string[] // Requirement IDs
}

export type DocumentType = 
  | 'SRS' 
  | 'SDD' 
  | 'Concept Note' 
  | 'Test Cases' 
  | 'User Manual' 
  | 'Feasibility Study' 
  | 'Project Charter'
  | 'Custom'

export type DocumentStatus = 
  | 'Draft' 
  | 'In Review' 
  | 'Approved' 
  | 'Published' 
  | 'Archived'

export interface DocumentContent {
  sections: DocumentSection[]
  diagrams: Diagram[]
  tables: Table[]
  attachments: Attachment[]
}

export interface DocumentSection {
  id: string
  title: string
  content: string
  level: number
  order: number
  parentId?: string
  children?: DocumentSection[]
}

export interface DocumentMetadata {
  systemName: string
  purpose: string
  scope: string
  stakeholders: string[]
  assumptions: string[]
  constraints: string[]
  references: string[]
  glossary: GlossaryTerm[]
  acronyms: Acronym[]
}

// Template Types
export interface Template {
  id: string
  name: string
  type: DocumentType
  description: string
  structure: TemplateStructure
  isDefault: boolean
  isCustom: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface TemplateStructure {
  sections: TemplateSection[]
  requiredFields: string[]
  optionalFields: string[]
  validationRules: ValidationRule[]
}

export interface TemplateSection {
  id: string
  title: string
  description: string
  isRequired: boolean
  order: number
  parentId?: string
  children?: TemplateSection[]
  contentTemplate?: string
  aiPrompts?: string[]
}

// Requirement Types
export interface Requirement {
  id: string
  title: string
  description: string
  type: RequirementType
  priority: RequirementPriority
  status: RequirementStatus
  projectId: string
  documentId?: string
  parentId?: string
  children?: Requirement[]
  tags: string[]
  acceptanceCriteria: string[]
  dependencies: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  assignedTo?: string
}

export type RequirementType = 
  | 'Functional' 
  | 'Non-Functional' 
  | 'Business' 
  | 'User' 
  | 'System'

export type RequirementPriority = 
  | 'Critical' 
  | 'High' 
  | 'Medium' 
  | 'Low'

export type RequirementStatus = 
  | 'Proposed' 
  | 'Approved' 
  | 'In Development' 
  | 'Implemented' 
  | 'Tested' 
  | 'Deployed'

// Project Types
export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  start_date?: string
  end_date?: string
  manager_id?: number
  manager?: {
    id: number
    name: string
    email: string
  }
  team?: ProjectMember[]
  documents?: string[] // Document IDs
  requirements?: string[] // Requirement IDs
  created_at?: string
  updated_at?: string
  
  // Frontend-specific fields (for backward compatibility)
  purpose?: string
  scope?: string
  objectives?: string[]
  stakeholders?: string[]
  projectSponsor?: string
  budget?: string
  timeline?: ProjectTimeline
  technologyStack?: string[]
  deliverables?: string[]
  successCriteria?: string[]
  constraints?: string[]
  dependencies?: string[]
  risks?: ProjectRisk[]
  qualityStandards?: string[]
  securityRequirements?: string[]
  changeManagement?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProjectTimeline {
  startDate: string
  endDate: string
  milestones: ProjectMilestone[]
}

export interface ProjectMilestone {
  id: string
  name: string
  date: string
  description: string
  deliverables: string[]
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed'
}

export interface ProjectRisk {
  id: string
  description: string
  probability: 'Low' | 'Medium' | 'High'
  impact: 'Low' | 'Medium' | 'High'
  mitigation: string
  owner: string
  status: 'Open' | 'Mitigated' | 'Closed'
}

export type ProjectStatus = 
  | 'Planning' 
  | 'Active' 
  | 'On Hold' 
  | 'Completed' 
  | 'Cancelled'

export interface ProjectMember {
  userId: string
  role: ProjectRole
  joinedAt: string
}

export type ProjectRole = 
  | 'Project Manager' 
  | 'Business Analyst' 
  | 'Developer' 
  | 'Tester' 
  | 'Stakeholder' 
  | 'Reviewer'

// Diagram Types
export interface Diagram {
  id: string
  name: string
  type: DiagramType
  content: string // Mermaid/PlantUML syntax
  description?: string
  documentId: string
  createdAt: string
  updatedAt: string
}

export type DiagramType = 
  | 'DFD' 
  | 'UML Class' 
  | 'UML Sequence' 
  | 'UML Activity' 
  | 'ERD' 
  | 'Flowchart' 
  | 'Mind Map'

// Table Types
export interface Table {
  id: string
  title: string
  headers: string[]
  rows: string[][]
  documentId: string
  order: number
}

// Attachment Types
export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  documentId: string
  uploadedAt: string
  uploadedBy: string
}

// Glossary Types
export interface GlossaryTerm {
  term: string
  definition: string
  context?: string
}

export interface Acronym {
  acronym: string
  fullForm: string
  description?: string
}

// Validation Types
export interface ValidationRule {
  field: string
  rule: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

// User Types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
  lastLoginAt?: string
}

export type UserRole = 
  | 'Admin' 
  | 'Manager' 
  | 'Analyst' 
  | 'Developer' 
  | 'Reviewer' 
  | 'Stakeholder'

// AI Types
export interface AISuggestion {
  id: string
  type: 'content' | 'structure' | 'requirement' | 'diagram'
  content: string
  confidence: number
  source: string
  createdAt: string
}

// Workflow Types
export interface Workflow {
  id: string
  name: string
  type: DocumentType
  steps: WorkflowStep[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkflowStep {
  id: string
  name: string
  role: UserRole
  order: number
  isRequired: boolean
  estimatedDays: number
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown'
  includeDiagrams: boolean
  includeAttachments: boolean
  branding: boolean
  watermark?: string
}
