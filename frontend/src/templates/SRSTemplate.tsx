// IEEE 29148-2018 Compliant SRS Template with 12 Pillars Framework
// Professional, Enterprise-Grade Software Requirements Specification Generator

export interface SRSMetadata {
  projectName: string
  projectCode: string
  systemName: string
  documentId: string
  version: string
  systemPurpose: string
  systemScope: string
  author: string
  createdAt: string
  lastModified: string
  status: 'draft' | 'review' | 'approved' | 'baseline'
  domain: string
  compliance: string[]
  stakeholders: string[]
  approvalChain: string[]
}

export interface SRSSection {
  id: string
  title: string
  ieee29148Section: string
  type: 'introduction' | 'overall' | 'functional' | 'non-functional' | 'interface' | 'data' | 'usecase' | 'model' | 'traceability' | 'appendix'
  required: boolean
  content: string
  subsections: SRSSection[]
  patterns: RequirementPattern[]
  qualityScore: number
  blockers: string[]
}

export interface RequirementPattern {
  id: string
  category: string
  name: string
  template: string
  parameters: PatternParameter[]
  examples: string[]
  domain: string[]
  quality: 'gold' | 'silver' | 'bronze'
}

export interface PatternParameter {
  name: string
  type: 'string' | 'number' | 'select' | 'boolean' | 'entity' | 'role' | 'time' | 'size'
  required: boolean
  options?: string[]
  validation?: string
  description: string
}

export interface SRSRequirement {
  id: string
  type: 'functional' | 'non-functional' | 'interface' | 'data' | 'business-rule'
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  acceptanceCriteria: string[]
  testCases: TestCase[]
  traceability: TraceabilityLink[]
  verification: VerificationMethod
  risk: RiskAssessment
  pattern?: string
  parameters?: { [key: string]: any }
  qualityScore: number
  blockers: string[]
  status: 'draft' | 'reviewed' | 'approved' | 'implemented' | 'tested'
  lastModified: string
  author: string
}

export interface TestCase {
  id: string
  title: string
  preconditions: string[]
  steps: string[]
  expectedResults: string[]
  evidence: string
  status: 'draft' | 'ready' | 'passed' | 'failed'
}

export interface TraceabilityLink {
  source: string
  target: string
  type: 'objective' | 'usecase' | 'test' | 'risk' | 'data'
  strength: 'strong' | 'medium' | 'weak'
}

export interface VerificationMethod {
  type: 'inspect' | 'test' | 'demonstrate' | 'analyze'
  description: string
  criteria: string[]
  evidence: string
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical'
  description: string
  mitigation: string[]
  probability: number
  impact: number
}

// Pillar 1: Authoritative Structure (IEEE 29148-2018)
export const ieee29148Structure: SRSSection[] = [
  {
    id: 'intro',
    title: 'Introduction',
    ieee29148Section: '1',
    type: 'introduction',
    required: true,
    content: '',
    subsections: [
      {
        id: '1.1',
        title: '1.1 Purpose',
        ieee29148Section: '1.1',
        type: 'introduction',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '1.2',
        title: '1.2 Scope',
        ieee29148Section: '1.2',
        type: 'introduction',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '1.3',
        title: '1.3 Definitions, Acronyms, and Abbreviations',
        ieee29148Section: '1.3',
        type: 'introduction',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '1.4',
        title: '1.4 References',
        ieee29148Section: '1.4',
        type: 'introduction',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '1.5',
        title: '1.5 Overview',
        ieee29148Section: '1.5',
        type: 'introduction',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      }
    ],
    patterns: [],
    qualityScore: 0,
    blockers: []
  },
  {
    id: 'overall',
    title: 'Overall Description',
    ieee29148Section: '2',
    type: 'overall',
    required: true,
    content: '',
    subsections: [
      {
        id: '2.1',
        title: '2.1 Product Perspective',
        ieee29148Section: '2.1',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.2',
        title: '2.2 Product Functions',
        ieee29148Section: '2.2',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.3',
        title: '2.3 User Classes and Characteristics',
        ieee29148Section: '2.3',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.4',
        title: '2.4 Operating Environment',
        ieee29148Section: '2.4',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.5',
        title: '2.5 Design and Implementation Constraints',
        ieee29148Section: '2.5',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.6',
        title: '2.6 User Documentation',
        ieee29148Section: '2.6',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '2.7',
        title: '2.7 Assumptions and Dependencies',
        ieee29148Section: '2.7',
        type: 'overall',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      }
    ],
    patterns: [],
    qualityScore: 0,
    blockers: []
  },
  {
    id: 'specific',
    title: 'Specific Requirements',
    ieee29148Section: '3',
    type: 'functional',
    required: true,
    content: '',
    subsections: [
      {
        id: '3.1',
        title: '3.1 External Interface Requirements',
        ieee29148Section: '3.1',
        type: 'interface',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.2',
        title: '3.2 Functional Requirements',
        ieee29148Section: '3.2',
        type: 'functional',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.3',
        title: '3.3 Performance Requirements',
        ieee29148Section: '3.3',
        type: 'non-functional',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.4',
        title: '3.4 Design Constraints',
        ieee29148Section: '3.4',
        type: 'non-functional',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.5',
        title: '3.5 Software System Attributes',
        ieee29148Section: '3.5',
        type: 'non-functional',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.6',
        title: '3.6 Data Model and Business Rules',
        ieee29148Section: '3.6',
        type: 'data',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '3.7',
        title: '3.7 Use Cases and User Stories',
        ieee29148Section: '3.7',
        type: 'usecase',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      }
    ],
    patterns: [],
    qualityScore: 0,
    blockers: []
  },
  {
    id: 'models',
    title: 'System Models and Diagrams',
    ieee29148Section: '4',
    type: 'model',
    required: true,
    content: '',
    subsections: [
      {
        id: '4.1',
        title: '4.1 Data Flow Diagrams',
        ieee29148Section: '4.1',
        type: 'model',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '4.2',
        title: '4.2 Sequence Diagrams',
        ieee29148Section: '4.2',
        type: 'model',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '4.3',
        title: '4.3 Entity Relationship Diagrams',
        ieee29148Section: '4.3',
        type: 'model',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '4.4',
        title: '4.4 Deployment Architecture',
        ieee29148Section: '4.4',
        type: 'model',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      }
    ],
    patterns: [],
    qualityScore: 0,
    blockers: []
  },
  {
    id: 'traceability',
    title: 'Traceability Matrix',
    ieee29148Section: '5',
    type: 'traceability',
    required: true,
    content: '',
    subsections: [],
    patterns: [],
    qualityScore: 0,
    blockers: []
  },
  {
    id: 'appendices',
    title: 'Appendices',
    ieee29148Section: '6',
    type: 'appendix',
    required: true,
    content: '',
    subsections: [
      {
        id: '6.1',
        title: '6.1 Glossary',
        ieee29148Section: '6.1',
        type: 'appendix',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '6.2',
        title: '6.2 Revision History',
        ieee29148Section: '6.2',
        type: 'appendix',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      },
      {
        id: '6.3',
        title: '6.3 Approval Signatures',
        ieee29148Section: '6.3',
        type: 'appendix',
        required: true,
        content: '',
        subsections: [],
        patterns: [],
        qualityScore: 0,
        blockers: []
      }
    ],
    patterns: [],
    qualityScore: 0,
    blockers: []
  }
]

// Pillar 2: Requirements Pattern Library (Gold Patterns)
export const requirementPatterns: RequirementPattern[] = [
  // RBAC Patterns
  {
    id: 'RBAC-001',
    category: 'Authorization',
    name: 'Role-Based Access Control',
    template: 'The system shall restrict access to {resource} to users with role {role}.',
    parameters: [
      { name: 'resource', type: 'entity', required: true, description: 'The resource being protected' },
      { name: 'role', type: 'role', required: true, description: 'The role required for access' }
    ],
    examples: [
      'The system shall restrict access to student records to users with role Teacher.',
      'The system shall restrict access to financial data to users with role Finance Officer.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },
  {
    id: 'RBAC-002',
    category: 'Authorization',
    name: 'Permission-Based Access',
    template: 'The system shall allow {action} on {resource} only to users with {permission} permission.',
    parameters: [
      { name: 'action', type: 'select', required: true, options: ['create', 'read', 'update', 'delete', 'approve'], description: 'The action being performed' },
      { name: 'resource', type: 'entity', required: true, description: 'The resource being acted upon' },
      { name: 'permission', type: 'string', required: true, description: 'The specific permission required' }
    ],
    examples: [
      'The system shall allow approve on transfer requests only to users with APPROVE_TRANSFER permission.',
      'The system shall allow delete on student records only to users with DELETE_STUDENT permission.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Validation Patterns
  {
    id: 'VAL-001',
    category: 'Validation',
    name: 'Input Validation',
    template: 'The system shall reject {entity} when {rule} and display message {code}.',
    parameters: [
      { name: 'entity', type: 'entity', required: true, description: 'The entity being validated' },
      { name: 'rule', type: 'string', required: true, description: 'The validation rule' },
      { name: 'code', type: 'string', required: true, description: 'The error message code' }
    ],
    examples: [
      'The system shall reject student registration when age < 5 and display message INVALID_AGE.',
      'The system shall reject email when format is invalid and display message INVALID_EMAIL.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },
  {
    id: 'VAL-002',
    category: 'Validation',
    name: 'Business Rule Validation',
    template: 'The system shall enforce {business_rule} for {entity} and prevent {violation_action}.',
    parameters: [
      { name: 'business_rule', type: 'string', required: true, description: 'The business rule to enforce' },
      { name: 'entity', type: 'entity', required: true, description: 'The entity the rule applies to' },
      { name: 'violation_action', type: 'string', required: true, description: 'The action to prevent' }
    ],
    examples: [
      'The system shall enforce maximum class size of 40 students for class enrollment and prevent over-enrollment.',
      'The system shall enforce minimum GPA of 2.0 for graduation and prevent graduation with insufficient GPA.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Upload Patterns
  {
    id: 'UPL-001',
    category: 'File Management',
    name: 'File Upload',
    template: 'The system shall accept {file_type} files up to {size}{unit} for {purpose}.',
    parameters: [
      { name: 'file_type', type: 'select', required: true, options: ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'JPG', 'PNG'], description: 'The file type accepted' },
      { name: 'size', type: 'number', required: true, description: 'Maximum file size' },
      { name: 'unit', type: 'select', required: true, options: ['KB', 'MB', 'GB'], description: 'Size unit' },
      { name: 'purpose', type: 'string', required: true, description: 'The purpose of the upload' }
    ],
    examples: [
      'The system shall accept PDF files up to 5MB for document submission.',
      'The system shall accept JPG files up to 2MB for profile photo upload.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Status Tracking Patterns
  {
    id: 'STS-001',
    category: 'Status Management',
    name: 'Status Tracking',
    template: 'The system shall display {object} status as one of {allowed_values}.',
    parameters: [
      { name: 'object', type: 'entity', required: true, description: 'The object being tracked' },
      { name: 'allowed_values', type: 'string', required: true, description: 'Comma-separated list of allowed status values' }
    ],
    examples: [
      'The system shall display application status as one of Pending, Approved, Rejected, Under Review.',
      'The system shall display student status as one of Active, Inactive, Graduated, Suspended.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Notification Patterns
  {
    id: 'NOT-001',
    category: 'Notifications',
    name: 'Event Notification',
    template: 'The system shall send a {channel} notification to {audience} on {event} within {time}.',
    parameters: [
      { name: 'channel', type: 'select', required: true, options: ['email', 'SMS', 'push', 'in-app'], description: 'Notification channel' },
      { name: 'audience', type: 'string', required: true, description: 'Target audience' },
      { name: 'event', type: 'string', required: true, description: 'The triggering event' },
      { name: 'time', type: 'time', required: true, description: 'Time limit for notification' }
    ],
    examples: [
      'The system shall send an email notification to parents on grade update within 24 hours.',
      'The system shall send an SMS notification to students on exam schedule change within 1 hour.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Performance Patterns
  {
    id: 'PER-001',
    category: 'Performance',
    name: 'Response Time SLA',
    template: 'The system shall respond to {endpoint} within ≤ {ms} ms at {pctl} percentile under {load}.',
    parameters: [
      { name: 'endpoint', type: 'string', required: true, description: 'The API endpoint or operation' },
      { name: 'ms', type: 'number', required: true, description: 'Maximum response time in milliseconds' },
      { name: 'pctl', type: 'select', required: true, options: ['95th', '99th', '99.9th'], description: 'Percentile requirement' },
      { name: 'load', type: 'string', required: true, description: 'Load condition' }
    ],
    examples: [
      'The system shall respond to student search within ≤ 500 ms at 95th percentile under normal load.',
      'The system shall respond to report generation within ≤ 2000 ms at 99th percentile under peak load.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Audit Patterns
  {
    id: 'AUD-001',
    category: 'Audit',
    name: 'Audit Logging',
    template: 'The system shall record {action} with {fields} at {time} and retain for {duration}.',
    parameters: [
      { name: 'action', type: 'string', required: true, description: 'The action being audited' },
      { name: 'fields', type: 'string', required: true, description: 'Fields to record' },
      { name: 'time', type: 'select', required: true, options: ['real-time', 'batch', 'end-of-day'], description: 'When to record' },
      { name: 'duration', type: 'time', required: true, description: 'Retention period' }
    ],
    examples: [
      'The system shall record user login with username, timestamp, IP address at real-time and retain for 7 years.',
      'The system shall record grade changes with old value, new value, timestamp, user at real-time and retain for 10 years.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Security Patterns
  {
    id: 'SEC-001',
    category: 'Security',
    name: 'Security Control',
    template: 'The system shall enforce {control} with parameter {value}.',
    parameters: [
      { name: 'control', type: 'select', required: true, options: ['password complexity', 'session timeout', 'encryption', 'rate limiting'], description: 'Security control type' },
      { name: 'value', type: 'string', required: true, description: 'Control parameter value' }
    ],
    examples: [
      'The system shall enforce password complexity with parameter minimum 8 characters, 1 uppercase, 1 lowercase, 1 number.',
      'The system shall enforce session timeout with parameter 30 minutes of inactivity.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Integration Patterns
  {
    id: 'INT-001',
    category: 'Integration',
    name: 'API Integration',
    template: 'The system shall invoke {API} using {auth} and retry {n} times with backoff {strategy}.',
    parameters: [
      { name: 'API', type: 'string', required: true, description: 'The external API endpoint' },
      { name: 'auth', type: 'select', required: true, options: ['OAuth2', 'API Key', 'Basic Auth', 'JWT'], description: 'Authentication method' },
      { name: 'n', type: 'number', required: true, description: 'Number of retry attempts' },
      { name: 'strategy', type: 'select', required: true, options: ['exponential', 'linear', 'fixed'], description: 'Retry strategy' }
    ],
    examples: [
      'The system shall invoke NECTA API using API Key and retry 3 times with backoff exponential.',
      'The system shall invoke TAMISEMI API using OAuth2 and retry 5 times with backoff linear.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  },

  // Data Retention Patterns
  {
    id: 'RET-001',
    category: 'Data Management',
    name: 'Data Retention',
    template: 'The system shall purge {data_class} after {duration} unless {exception}.',
    parameters: [
      { name: 'data_class', type: 'string', required: true, description: 'Classification of data' },
      { name: 'duration', type: 'time', required: true, description: 'Retention period' },
      { name: 'exception', type: 'string', required: true, description: 'Exception condition' }
    ],
    examples: [
      'The system shall purge temporary files after 30 days unless under legal hold.',
      'The system shall purge audit logs after 7 years unless required for compliance.'
    ],
    domain: ['education', 'finance', 'healthcare', 'government'],
    quality: 'gold'
  }
]

// Pillar 3: Precision Engine - Quality Gates
export const qualityGates = {
  atomicity: (requirement: SRSRequirement): { passed: boolean; issues: string[] } => {
    const issues: string[] = []
    const text = requirement.description.toLowerCase()
    
    if (text.includes(' and ') || text.includes(' or ')) {
      issues.push('Requirement contains multiple actions (and/or) - must be atomic')
    }
    
    return { passed: issues.length === 0, issues }
  },

  ambiguity: (requirement: SRSRequirement): { passed: boolean; issues: string[]; suggestions: string[] } => {
    const issues: string[] = []
    const suggestions: string[] = []
    const bannedTerms = ['fast', 'quick', 'user-friendly', 'intuitive', 'robust', 'seamless', 'adequate', 'optimize', 'efficient']
    const text = requirement.description.toLowerCase()
    
    bannedTerms.forEach(term => {
      if (text.includes(term)) {
        issues.push(`Ambiguous term "${term}" detected`)
        suggestions.push(`Replace "${term}" with measurable criteria`)
      }
    })
    
    return { passed: issues.length === 0, issues, suggestions }
  },

  testability: (requirement: SRSRequirement): { passed: boolean; issues: string[] } => {
    const issues: string[] = []
    
    if (!requirement.verification || !requirement.verification.type) {
      issues.push('No verification method specified')
    }
    
    if (!requirement.acceptanceCriteria || requirement.acceptanceCriteria.length === 0) {
      issues.push('No acceptance criteria defined')
    }
    
    return { passed: issues.length === 0, issues }
  },

  measurability: (requirement: SRSRequirement): { passed: boolean; issues: string[] } => {
    const issues: string[] = []
    const text = requirement.description.toLowerCase()
    const measurableTerms = ['ms', 'seconds', 'minutes', 'hours', 'days', '%', 'percent', 'mb', 'gb', 'users', 'transactions']
    
    const hasMeasurableTerms = measurableTerms.some(term => text.includes(term))
    
    if (!hasMeasurableTerms && requirement.type === 'non-functional') {
      issues.push('Non-functional requirement lacks measurable criteria')
    }
    
    return { passed: issues.length === 0, issues }
  },

  voice: (requirement: SRSRequirement): { passed: boolean; issues: string[] } => {
    const issues: string[] = []
    const text = requirement.description.toLowerCase()
    
    if (!text.startsWith('the system shall')) {
      issues.push('Requirement must start with "The system shall"')
    }
    
    if (text.includes('will be') || text.includes('should be')) {
      issues.push('Use "shall" for requirements, not "will" or "should"')
    }
    
    return { passed: issues.length === 0, issues }
  }
}

// Pillar 4: Controlled Language & Style Guardrails
export const styleGuardrails = {
  bannedTerms: [
    'quickly', 'adequate', 'optimize', 'robust', 'seamless', 'user-friendly', 'intuitive',
    'efficient', 'fast', 'easy', 'simple', 'better', 'improved', 'enhanced'
  ],
  
  maxSentenceLength: 25,
  maxWordsPerRequirement: 50,
  
  checkStyle: (text: string): { passed: boolean; issues: string[]; suggestions: string[] } => {
    const issues: string[] = []
    const suggestions: string[] = []
    
    // Check sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    sentences.forEach((sentence, index) => {
      const wordCount = sentence.trim().split(/\s+/).length
      if (wordCount > styleGuardrails.maxSentenceLength) {
        issues.push(`Sentence ${index + 1} is too long (${wordCount} words)`)
        suggestions.push(`Break sentence ${index + 1} into shorter sentences`)
      }
    })
    
    // Check for banned terms
    styleGuardrails.bannedTerms.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        issues.push(`Banned term "${term}" detected`)
        suggestions.push(`Replace "${term}" with specific, measurable criteria`)
      }
    })
    
    return { passed: issues.length === 0, issues, suggestions }
  }
}

// Pillar 5: Domain Packs & Compliance Presets
export const domainPacks = {
  education: {
    name: 'Education Management System',
    actors: ['Student', 'Teacher', 'Parent', 'School Head', 'QA Officer', 'Admin'],
    entities: ['Student', 'Class', 'Subject', 'Grade', 'Attendance', 'Transfer', 'Re-Admission'],
    workflows: ['Student Registration', 'Grade Management', 'Transfer Processing', 'Report Generation'],
    compliance: ['NECTA', 'TAMISEMI', 'MoEST', 'Data Protection Act'],
    patterns: requirementPatterns.filter(p => p.domain.includes('education'))
  },
  
  government: {
    name: 'Government Service Management',
    actors: ['Citizen', 'Service Officer', 'Manager', 'System Admin'],
    entities: ['Service Request', 'Document', 'Payment', 'Approval'],
    workflows: ['Service Application', 'Document Processing', 'Payment Collection', 'Approval Workflow'],
    compliance: ['e-GA', 'NIDC', 'Data Protection Act', 'Accessibility Standards'],
    patterns: requirementPatterns.filter(p => p.domain.includes('government'))
  },
  
  finance: {
    name: 'Financial Management System',
    actors: ['Accountant', 'Manager', 'Auditor', 'Admin'],
    entities: ['Transaction', 'Account', 'Budget', 'Report'],
    workflows: ['Transaction Processing', 'Budget Management', 'Financial Reporting', 'Audit Trail'],
    compliance: ['IFRS', 'Tax Regulations', 'Audit Standards'],
    patterns: requirementPatterns.filter(p => p.domain.includes('finance'))
  },
  
  healthcare: {
    name: 'Healthcare Management System',
    actors: ['Patient', 'Doctor', 'Nurse', 'Admin'],
    entities: ['Patient Record', 'Appointment', 'Prescription', 'Medical History'],
    workflows: ['Patient Registration', 'Appointment Scheduling', 'Medical Records', 'Billing'],
    compliance: ['HIPAA', 'Medical Standards', 'Data Protection'],
    patterns: requirementPatterns.filter(p => p.domain.includes('healthcare'))
  }
}

// Pillar 6: Quality Score Calculation
export const calculateQualityScore = (srs: any): number => {
  const weights = {
    atomicity: 20,
    ambiguity: 20,
    testability: 20,
    coverage: 15,
    consistency: 15,
    compliance: 10
  }
  
  let totalScore = 0
  let totalWeight = 0
  
  // Calculate scores for each requirement
  const requirements = srs.requirements || []
  requirements.forEach((req: SRSRequirement) => {
    const atomicityScore = qualityGates.atomicity(req).passed ? 100 : 0
    const ambiguityScore = qualityGates.ambiguity(req).passed ? 100 : 0
    const testabilityScore = qualityGates.testability(req).passed ? 100 : 0
    const measurabilityScore = qualityGates.measurability(req).passed ? 100 : 0
    const voiceScore = qualityGates.voice(req).passed ? 100 : 0
    
    const reqScore = (
      atomicityScore * weights.atomicity +
      ambiguityScore * weights.ambiguity +
      testabilityScore * weights.testability +
      measurabilityScore * weights.coverage +
      voiceScore * weights.consistency
    ) / 100
    
    totalScore += reqScore
    totalWeight += Object.values(weights).reduce((a, b) => a + b, 0)
  })
  
  return requirements.length > 0 ? Math.round(totalScore / totalWeight) : 0
}

// Default metadata
export const defaultSRSMetadata: SRSMetadata = {
  projectName: '',
  projectCode: '',
  systemName: '',
  documentId: '',
  version: '1.0',
  systemPurpose: '',
  systemScope: '',
  author: '',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  status: 'draft',
  domain: 'education',
  compliance: ['IEEE 29148-2018'],
  stakeholders: [],
  approvalChain: []
}

// Default sections
export const defaultSRSSections: SRSSection[] = ieee29148Structure

// Default requirements
export const defaultRequirements: SRSRequirement[] = []

// International standards
export const internationalStandards = [
  {
    name: 'IEEE 29148-2018',
    title: 'Systems and software engineering - Life cycle processes - Requirements engineering',
    description: 'Latest IEEE standard for requirements engineering',
    compliance: 'full'
  },
  {
    name: 'ISO/IEC 25010:2011',
    title: 'Systems and software Quality Requirements and Evaluation (SQuaRE) - System and software quality models',
    description: 'Quality model for software products',
    compliance: 'full'
  },
  {
    name: 'ISO/IEC 27001:2013',
    title: 'Information technology - Security techniques - Information security management systems',
    description: 'Information security management',
    compliance: 'partial'
  },
  {
    name: 'MoEST Standards',
    title: 'Ministry of Education, Science and Technology Standards',
    description: 'Tanzania education sector standards',
    compliance: 'full'
  },
  {
    name: 'e-GA Framework',
    title: 'e-Government Architecture Framework',
    description: 'Tanzania government digital services framework',
    compliance: 'full'
  }
]

// Requirement categories
export const requirementCategories = [
  'Authentication & Authorization',
  'Data Management',
  'User Interface',
  'Reporting & Analytics',
  'Integration & APIs',
  'Security & Compliance',
  'Performance & Scalability',
  'Business Rules',
  'Audit & Logging',
  'Notifications',
  'File Management',
  'Workflow Management'
]

// Requirement types
export const requirementTypes = [
  { value: 'functional', label: 'Functional Requirement' },
  { value: 'non-functional', label: 'Non-Functional Requirement' },
  { value: 'interface', label: 'Interface Requirement' },
  { value: 'data', label: 'Data Requirement' },
  { value: 'business-rule', label: 'Business Rule' }
]

// Requirement priorities
export const requirementPriorities = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

// Export types (already exported as interfaces above)
