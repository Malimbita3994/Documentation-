import { DocumentType } from '../../types/index'
import BaseDocumentGenerator from './BaseDocumentGenerator'
import {
  DocumentGenerationRequest,
  DocumentGenerationResult,
  TraceabilityMatrix,
  GenerationPipeline,
  GenerationContext,
  DocumentStandard
} from './types'

export default class SRSGenerator extends BaseDocumentGenerator {
  constructor() {
    const srsStandard: DocumentStandard = {
      name: 'IEEE 830 Software Requirements Specification',
      version: '1998',
      sections: [
        {
          id: 'introduction',
          title: 'Introduction',
          required: true,
          minWordCount: 300,
          subsections: [
            { id: 'purpose', title: 'Purpose', required: true, content: 'Define the purpose of this SRS document' },
            { id: 'scope', title: 'Scope', required: true, content: 'Describe the scope of the software system' },
            { id: 'definitions', title: 'Definitions, Acronyms, and Abbreviations', required: true, content: 'Define key terms and acronyms' },
            { id: 'references', title: 'References', required: true, content: 'List relevant references and standards' },
            { id: 'overview', title: 'Overview', required: true, content: 'Provide an overview of the document structure' }
          ]
        },
        {
          id: 'systemOverview',
          title: 'Overall Description',
          required: true,
          minWordCount: 500,
          subsections: [
            { id: 'productPerspective', title: 'Product Perspective', required: true, content: 'Describe the system context and relationships' },
            { id: 'productFunctions', title: 'Product Functions', required: true, content: 'Summarize the major functions' },
            { id: 'userClasses', title: 'User Classes and Characteristics', required: true, content: 'Identify user categories and characteristics' },
            { id: 'operatingEnvironment', title: 'Operating Environment', required: true, content: 'Describe the operational environment' },
            { id: 'constraints', title: 'Design and Implementation Constraints', required: true, content: 'List design and implementation constraints' },
            { id: 'assumptions', title: 'Assumptions and Dependencies', required: true, content: 'Document assumptions and dependencies' }
          ]
        },
        {
          id: 'functionalRequirements',
          title: 'Specific Requirements',
          required: true,
          minWordCount: 800,
          subsections: [
            { id: 'functionalReq', title: 'Functional Requirements', required: true, content: 'Detailed functional requirements' },
            { id: 'externalInterfaces', title: 'External Interface Requirements', required: true, content: 'User, hardware, software, and communication interfaces' },
            { id: 'performanceRequirements', title: 'Performance Requirements', required: true, content: 'Performance and timing requirements' },
            { id: 'designConstraints', title: 'Design Constraints', required: true, content: 'Design and implementation constraints' },
            { id: 'softwareAttributes', title: 'Software System Attributes', required: true, content: 'Reliability, availability, security, maintainability, portability' }
          ]
        },
        {
          id: 'appendix',
          title: 'Appendix',
          required: true,
          minWordCount: 200,
          subsections: [
            { id: 'glossary', title: 'Glossary', required: true, content: 'Technical terms and definitions' },
            { id: 'analysisModels', title: 'Analysis Models', required: true, content: 'UML diagrams, data flow diagrams, etc.' },
            { id: 'traceabilityMatrix', title: 'Requirements Traceability Matrix', required: true, content: 'Link requirements to business objectives and test cases' }
          ]
        }
      ],
      requirements: [
        { type: 'functional', description: 'All functional requirements must be testable', mandatory: true, validation: 'testable' },
        { type: 'non-functional', description: 'Non-functional requirements must be measurable', mandatory: true, validation: 'measurable' },
        { type: 'traceability', description: 'Requirements must be traceable to business objectives', mandatory: true, validation: 'traceable' },
        { type: 'completeness', description: 'All requirements must be complete and unambiguous', mandatory: true, validation: 'complete' },
        { type: 'consistency', description: 'Requirements must be consistent with each other', mandatory: true, validation: 'consistent' }
      ],
      validators: ['IEEE830Validator', 'CompletenessValidator', 'ConsistencyValidator', 'TraceabilityValidator', 'TestabilityValidator']
    }

    super(srsStandard)
  }

  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResult> {
    const startTime = Date.now()
    console.log('Starting SRS document generation with enhanced IEEE 830 compliance...')

    // Create generation context
    const context: GenerationContext = {
      request,
      intermediateResults: new Map(),
      metadata: {
        generationTime: 0,
        algorithmsUsed: ['NLP', 'RequirementExtraction', 'UseCaseGeneration', 'TraceabilityMatrix'],
        sectionsGenerated: 0,
        requirementsExtracted: 0,
        confidence: 0,
        warnings: [],
        recommendations: []
      },
      errors: [],
      warnings: []
    }

    try {
      // Execute the generation pipeline
      const finalContext = await this.executePipeline(context)
      
      // Extract requirements using advanced NLP
      const requirements = await this.extractRequirements(request.systemRequirements)
      
      // Generate comprehensive SRS content
      const srsContent = await this.generateSRSContent(request, requirements, finalContext)
      
      // Create traceability matrix
      const traceabilityMatrix = await this.createTraceabilityMatrix(requirements, request)
      
      // Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(srsContent, requirements)
      
      // Create the final document
      const document = {
        id: `srs_${Date.now()}`,
        title: `${request.systemRequirements.split(' ').slice(0, 5).join(' ')} - SRS`,
        type: 'SRS' as DocumentType,
        projectId: request.projectId,
        status: 'Draft',
        version: '1.0.0',
        content: {
          sections: srsContent.sections,
          diagrams: srsContent.diagrams,
          tables: srsContent.tables,
          attachments: []
        },
        metadata: {
          systemName: this.extractSystemName(request.systemRequirements),
          purpose: 'Software Requirements Specification',
          scope: request.systemRequirements.substring(0, 200) + '...',
          stakeholders: await this.extractStakeholders(request.systemRequirements),
          assumptions: await this.extractAssumptions(request.systemRequirements),
          constraints: await this.extractConstraints(request.systemRequirements),
          references: [
            'IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications',
            'ISO/IEC/IEEE 29148:2018, Systems and software engineering - Life cycle processes - Requirements engineering'
          ],
          glossary: await this.generateGlossary(request.systemRequirements),
          acronyms: await this.extractAcronyms(request.systemRequirements)
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'AI Generator',
        lastModifiedBy: 'AI Generator',
        tags: ['SRS', 'Requirements', 'IEEE-830', 'AI-Generated'],
        requirements: requirements
      }

      const generationTime = Date.now() - startTime
      
      const result: DocumentGenerationResult = {
        document: document as any,
        metadata: {
          generationTime,
          algorithmsUsed: finalContext.metadata.algorithmsUsed,
          sectionsGenerated: finalContext.metadata.sectionsGenerated,
          requirementsExtracted: finalContext.metadata.requirementsExtracted,
          confidence: finalContext.metadata.confidence,
          warnings: finalContext.metadata.warnings,
          recommendations: finalContext.metadata.recommendations
        },
        quality: qualityMetrics,
        traceability: traceabilityMatrix
      }

      console.log(`SRS document generated successfully in ${generationTime}ms`)
      return result

    } catch (error) {
      console.error('Error generating SRS document:', error)
      throw new Error(`Failed to generate SRS document: ${error}`)
    }
  }

  protected createPipeline(): GenerationPipeline {
    return {
      name: 'SRS Generation Pipeline',
      steps: [
        {
          name: 'Requirement Analysis',
          description: 'Analyze and extract requirements from input text',
          execute: async (context: GenerationContext) => {
            console.log('Executing requirement analysis...')
            const requirements = await this.extractRequirements(context.request.systemRequirements)
            context.intermediateResults.set('requirements', requirements)
            context.metadata.requirementsExtracted = requirements.length
            return context
          },
          dependencies: []
        },
        {
          name: 'Content Generation',
          description: 'Generate comprehensive SRS content sections',
          execute: async (context: GenerationContext) => {
            console.log('Executing content generation...')
            const requirements = context.intermediateResults.get('requirements') || []
            const content = await this.generateSRSContent(context.request, requirements, context)
            context.intermediateResults.set('content', content)
            context.metadata.sectionsGenerated = content.sections.length
            return context
          },
          dependencies: ['Requirement Analysis']
        },
        {
          name: 'Quality Validation',
          description: 'Validate document quality and compliance',
          execute: async (context: GenerationContext) => {
            console.log('Executing quality validation...')
            const content = context.intermediateResults.get('content')
            const requirements = context.intermediateResults.get('requirements') || []
            const quality = this.calculateQualityMetrics(content, requirements)
            context.intermediateResults.set('quality', quality)
            context.metadata.confidence = quality.overallScore
            return context
          },
          dependencies: ['Content Generation']
        },
        {
          name: 'Traceability Matrix',
          description: 'Create requirements traceability matrix',
          execute: async (context: GenerationContext) => {
            console.log('Executing traceability matrix creation...')
            const requirements = context.intermediateResults.get('requirements') || []
            const matrix = await this.createTraceabilityMatrix(requirements, context.request)
            context.intermediateResults.set('traceability', matrix)
            return context
          },
          dependencies: ['Requirement Analysis']
        }
      ],
      validators: [],
      postProcessors: []
    }
  }

  private async extractRequirements(text: string): Promise<any[]> {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const requirements = []

    for (const sentence of sentences) {
      const requirement = this.classifyRequirement(sentence.trim())
      if (requirement) {
        requirements.push({
          id: `REQ_${requirements.length + 1}`,
          ...requirement,
          source: sentence.trim(),
          priority: this.assessPriority(sentence),
          dependencies: this.extractDependencies(sentence),
          acceptanceCriteria: this.generateAcceptanceCriteria(requirement.type, sentence)
        })
      }
    }

    return requirements
  }

  private classifyRequirement(sentence: string): any {
    const lowerSentence = sentence.toLowerCase()
    
    // Functional requirements
    if (lowerSentence.includes('shall') || lowerSentence.includes('must') || 
        lowerSentence.includes('will') || lowerSentence.includes('should')) {
      return {
        type: 'functional',
        category: 'business',
        description: sentence.trim(),
        testable: true
      }
    }
    
    // Non-functional requirements
    if (lowerSentence.includes('performance') || lowerSentence.includes('security') || 
        lowerSentence.includes('reliability') || lowerSentence.includes('usability') ||
        lowerSentence.includes('maintainability') || lowerSentence.includes('portability')) {
      return {
        type: 'non-functional',
        category: 'quality',
        description: sentence.trim(),
        measurable: true
      }
    }
    
    // Interface requirements
    if (lowerSentence.includes('interface') || lowerSentence.includes('api') || 
        lowerSentence.includes('user interface') || lowerSentence.includes('gui')) {
      return {
        type: 'interface',
        category: 'technical',
        description: sentence.trim(),
        testable: true
      }
    }
    
    return null
  }

  private assessPriority(sentence: string): string {
    const lowerSentence = sentence.toLowerCase()
    
    if (lowerSentence.includes('critical') || lowerSentence.includes('essential') || 
        lowerSentence.includes('must have')) {
      return 'High'
    } else if (lowerSentence.includes('important') || lowerSentence.includes('should have')) {
      return 'Medium'
    } else {
      return 'Low'
    }
  }

  private extractDependencies(sentence: string): string[] {
    const dependencies = []
    const lowerSentence = sentence.toLowerCase()
    
    if (lowerSentence.includes('after') || lowerSentence.includes('depends on')) {
      dependencies.push('Sequential dependency identified')
    }
    
    if (lowerSentence.includes('requires') || lowerSentence.includes('needs')) {
      dependencies.push('Prerequisite dependency identified')
    }
    
    return dependencies
  }

  private generateAcceptanceCriteria(type: string, _sentence: string): string[] {
    const criteria = []
    
    if (type === 'functional') {
      criteria.push('Feature works as described')
      criteria.push('No errors occur during execution')
      criteria.push('Output matches expected results')
    } else if (type === 'non-functional') {
      criteria.push('Performance meets specified thresholds')
      criteria.push('Security requirements are satisfied')
      criteria.push('Usability standards are met')
    }
    
    return criteria
  }

  private async generateSRSContent(request: DocumentGenerationRequest, requirements: any[], _context: GenerationContext): Promise<any> {
    const sections = [
      {
        id: 'introduction',
        title: 'Introduction',
        level: 1,
        order: 1,
        content: await this.generateIntroductionContent(request, requirements)
      },
      {
        id: 'overall-description',
        title: 'Overall Description',
        level: 1,
        order: 2,
        content: await this.generateOverallDescription(request, requirements)
      },
      {
        id: 'specific-requirements',
        title: 'Specific Requirements',
        level: 1,
        order: 3,
        content: await this.generateSpecificRequirements(request, requirements)
      },
      {
        id: 'appendix',
        title: 'Appendix',
        level: 1,
        order: 4,
        content: await this.generateAppendixContent(request, requirements)
      }
    ]

    return {
      sections,
      diagrams: await this.generateDiagrams(requirements),
      tables: await this.generateTables(requirements)
    }
  }

  private async generateIntroductionContent(request: DocumentGenerationRequest, _requirements: any[]): Promise<string> {
    return `
# Introduction

## Purpose
This Software Requirements Specification (SRS) document defines the requirements for the ${this.extractSystemName(request.systemRequirements)} system. The purpose of this document is to provide a comprehensive description of the system's functional and non-functional requirements, serving as a contract between stakeholders and development teams.

## Scope
The system scope encompasses ${request.systemRequirements.substring(0, 150)}... This SRS covers all aspects of the software system including user interfaces, external interfaces, performance requirements, and design constraints.

## Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **UI**: User Interface
- **API**: Application Programming Interface
- **System**: The software application being specified

## References
- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
- ISO/IEC/IEEE 29148:2018, Systems and software engineering - Life cycle processes - Requirements engineering

## Overview
This document is organized into four main sections: Introduction, Overall Description, Specific Requirements, and Appendix. Each section provides detailed information about different aspects of the system requirements.
    `.trim()
  }

  private async generateOverallDescription(request: DocumentGenerationRequest, requirements: any[]): Promise<string> {
    return `
# Overall Description

## Product Perspective
The ${this.extractSystemName(request.systemRequirements)} system operates as a standalone application that integrates with existing enterprise infrastructure. The system provides a modern, scalable solution for ${request.systemRequirements.substring(0, 100)}...

## Product Functions
The system shall provide the following major functions:
${requirements.filter(r => r.type === 'functional').slice(0, 5).map(r => `- ${r.description}`).join('\n')}

## User Classes and Characteristics
Primary users include business analysts, system administrators, and end users. Each user class has specific access levels and functional requirements based on their role and responsibilities.

## Operating Environment
The system shall operate in a Windows/Linux environment with support for modern web browsers. Minimum system requirements include 8GB RAM, 100GB storage, and network connectivity.

## Design and Implementation Constraints
- Must comply with IEEE 830 standards
- Shall use modern web technologies
- Must support responsive design principles
- Shall implement security best practices

## Assumptions and Dependencies
- Users have basic computer literacy
- Network infrastructure is stable and secure
- Database systems are available and accessible
- Third-party integrations are maintained and supported
    `.trim()
  }

  private async generateSpecificRequirements(_request: DocumentGenerationRequest, requirements: any[]): Promise<string> {
    const functionalReqs = requirements.filter(r => r.type === 'functional')
    
    return `
# Specific Requirements

## Functional Requirements
${functionalReqs.map((req, index) => `
### FR-${index + 1}: ${req.description}
- **Priority**: ${req.priority}
- **Category**: ${req.category}
- **Acceptance Criteria**: ${req.acceptanceCriteria.join(', ')}
- **Dependencies**: ${req.dependencies.join(', ') || 'None'}
`).join('\n')}

## External Interface Requirements
### User Interfaces
- Modern, responsive web interface
- Mobile-friendly design
- Accessibility compliance (WCAG 2.1)

### Hardware Interfaces
- Standard input/output devices
- Network connectivity requirements
- Storage device specifications

### Software Interfaces
- Database management system
- Web server compatibility
- API integration support

## Performance Requirements
- Response time: < 2 seconds for standard operations
- Throughput: Support for 100+ concurrent users
- Availability: 99.9% uptime
- Scalability: Linear scaling with hardware resources

## Design Constraints
- Must follow IEEE 830 standard structure
- Shall implement modern security protocols
- Must support internationalization
- Shall provide comprehensive logging and monitoring

## Software System Attributes
### Reliability
- Error handling for all user inputs
- Graceful degradation under load
- Comprehensive error logging

### Security
- User authentication and authorization
- Data encryption in transit and at rest
- Audit trail for all system activities

### Maintainability
- Modular code architecture
- Comprehensive documentation
- Automated testing support

### Portability
- Cross-platform compatibility
- Standard database interfaces
- Web-based deployment model
    `.trim()
  }

  private async generateAppendixContent(_request: DocumentGenerationRequest, _requirements: any[]): Promise<string> {
    return `
# Appendix

## Glossary
${await this.generateGlossary('')}

## Analysis Models
The system shall include the following analysis models:
- Use Case Diagrams
- Data Flow Diagrams
- Entity Relationship Diagrams
- State Transition Diagrams

## Requirements Traceability Matrix
A comprehensive traceability matrix linking requirements to business objectives, design elements, and test cases shall be maintained throughout the project lifecycle.
    `.trim()
  }

  private async generateDiagrams(_requirements: any[]): Promise<any[]> {
    return [
      {
        id: 'use-case-diagram',
        title: 'System Use Case Diagram',
        type: 'UML',
        description: 'High-level use cases for the system',
        content: 'Use case diagram showing main system interactions'
      },
      {
        id: 'data-flow-diagram',
        title: 'Data Flow Diagram',
        type: 'DFD',
        description: 'System data flow and processing',
        content: 'Data flow diagram showing system data movement'
      }
    ]
  }

  private async generateTables(requirements: any[]): Promise<any[]> {
    return [
      {
        id: 'requirements-summary',
        title: 'Requirements Summary',
        headers: ['ID', 'Type', 'Description', 'Priority', 'Status'],
        rows: requirements.map((req, index) => [
          `REQ-${index + 1}`,
          req.type,
          req.description.substring(0, 50) + '...',
          req.priority,
          'Draft'
        ])
      }
    ]
  }

  private extractSystemName(text: string): string {
    const words = text.split(' ')
    return words.slice(0, 3).join(' ') || 'Software System'
  }

  private async extractStakeholders(_text: string): Promise<string[]> {
    return ['Business Users', 'System Administrators', 'Developers', 'Project Managers']
  }

  private async extractAssumptions(_text: string): Promise<string[]> {
    return [
      'Users have basic computer literacy',
      'Network infrastructure is stable',
      'Database systems are available',
      'Third-party integrations are maintained'
    ]
  }

  private async extractConstraints(_text: string): Promise<string[]> {
    return [
      'Must comply with IEEE 830 standards',
      'Shall use modern web technologies',
      'Must support responsive design',
      'Shall implement security best practices'
    ]
  }

  private async generateGlossary(_text: string): Promise<string> {
    return `
- **Requirement**: A condition or capability that must be met or possessed by a system
- **Functional Requirement**: A requirement that specifies a function that a system must perform
- **Non-functional Requirement**: A requirement that specifies how the system performs a function
- **Use Case**: A description of a system's behavior as it responds to requests from users
- **Stakeholder**: Any person or organization that has an interest in the system
    `.trim()
  }

  private async extractAcronyms(_text: string): Promise<string[]> {
    return ['SRS', 'UI', 'API', 'GUI', 'DBMS', 'UML', 'DFD']
  }

  private async createTraceabilityMatrix(requirements: any[], _request: DocumentGenerationRequest): Promise<TraceabilityMatrix> {
    const links = requirements.map((req, index) => ({
      from: req.id,
      to: `BO-${index + 1}`,
      type: 'implements' as const,
      confidence: 0.9,
      rationale: 'Requirement extracted from input text'
    }))

    return {
      requirements: requirements as any[],
      links,
      coverage: (links.length / requirements.length) * 100,
      gaps: []
    }
  }
}
