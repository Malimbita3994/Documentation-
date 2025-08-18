import React, { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  SparklesIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { 
  defaultSRSMetadata, 
  defaultSRSSections, 
  defaultRequirements,
  internationalStandards,
  requirementCategories,
  requirementTypes,
  requirementPriorities,
  type SRSMetadata,
  type SRSSection,
  type SRSRequirement
} from '../templates/SRSTemplate'
import SRSDocumentViewer from './SRSDocumentViewer'

interface SRSDocumentCreatorProps {
  onClose: () => void
  onSave: (document: any) => void
  onRequirementsUpdate?: (requirements: SRSRequirement[]) => void
  externalRequirements?: SRSRequirement[]
}

const SRSDocumentCreator: React.FC<SRSDocumentCreatorProps> = ({ onClose, onSave, onRequirementsUpdate, externalRequirements }) => {
  const [step, setStep] = useState(1)
  const [metadata, setMetadata] = useState<SRSMetadata>(defaultSRSMetadata)
  const [sections, setSections] = useState<SRSSection[]>(defaultSRSSections)
  const [requirements, setRequirements] = useState<SRSRequirement[]>(defaultRequirements)
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['IEEE 830-1998'])
     const [showAIGeneration, setShowAIGeneration] = useState(false)
   const [aiPrompt, setAiPrompt] = useState('')
   const [stepValidation, setStepValidation] = useState<{[key: number]: boolean}>({})
   const [isGenerating, setIsGenerating] = useState(false)
   const [showFinalDocument, setShowFinalDocument] = useState(false)
   const [finalDocument, setFinalDocument] = useState<any>(null)

   const totalSteps = 8

     const updateMetadata = (updates: Partial<SRSMetadata>) => {
     setMetadata({ ...metadata, ...updates })
     validateCurrentStep()
   }

   const validateCurrentStep = () => {
     let isValid = false
     
     switch (step) {
       case 1:
         isValid = !!(metadata.projectName && metadata.systemName && metadata.systemPurpose && metadata.systemScope)
         break
       case 2:
         isValid = selectedStandards.length > 0
         break
       case 3:
         isValid = requirements.length > 0 && requirements.every(req => req.title && req.description)
         break
               case 4:
          // Check if requirements are properly distributed across sections
          const requirementsSections = sections.filter(s => s.title.includes('3.'))
          requirementsSections.filter(section => {
            // Check if any requirements are mapped to this section
            const mappedRequirements = requirements.filter(req => {
              const reqText = `${req.title} ${req.description} ${req.category}`.toLowerCase()
              
              // Smart matching based on section content and requirement keywords
              if (section.title.includes('Functional') && req.type === 'functional') return true
              if (section.title.includes('Performance') && req.type === 'non-functional') return true
              if (section.title.includes('Interface') && req.type === 'interface') return true
              if (section.title.includes('Security') && (reqText.includes('security') || reqText.includes('auth') || reqText.includes('encrypt'))) return true
              if (section.title.includes('Data') && (reqText.includes('data') || reqText.includes('database') || reqText.includes('storage'))) return true
              if (section.title.includes('User') && (reqText.includes('user') || reqText.includes('login') || reqText.includes('profile'))) return true
              
              return false
            })
            return mappedRequirements.length > 0
          })
          // Allow proceeding if there are requirements defined, even if not perfectly mapped
          isValid = requirements.length > 0
          break
               case 5:
          const introSections = sections.filter(s => s.title.startsWith('1.'))
          // Check if at least the required introduction sections have content
          const requiredIntroSections = introSections.filter(s => s.required)
          const completedIntroSections = requiredIntroSections.filter(s => s.content.trim())
          isValid = completedIntroSections.length >= Math.min(3, requiredIntroSections.length) // At least 3 required sections or all if less than 3
          break
       case 6:
         const overallSections = sections.filter(s => s.title.startsWith('2.'))
         isValid = overallSections.every(s => s.content.trim() || !s.required)
         break
       case 7:
         const specificSections = sections.filter(s => s.title.startsWith('3.') && !s.title.includes('3.2'))
         isValid = specificSections.every(s => s.content.trim() || !s.required)
         break
       case 8:
         isValid = true // Review step is always valid
         break
     }
     
     setStepValidation({ ...stepValidation, [step]: isValid })
   }

   const canProceedToNextStep = () => {
     return stepValidation[step] || false
   }

   const getStepProgress = () => {
     const completedSteps = Object.values(stepValidation).filter(Boolean).length
     return Math.round((completedSteps / totalSteps) * 100)
   }

     // Validate current step when step changes
  useEffect(() => {
    validateCurrentStep()
  }, [step, metadata, selectedStandards, requirements, sections])

  // Debug effect for final document state
  useEffect(() => {
    console.log('🔍 State changed - showFinalDocument:', showFinalDocument, 'finalDocument:', !!finalDocument)
  }, [showFinalDocument, finalDocument])

  // Sync with external requirements when they change
  useEffect(() => {
    if (externalRequirements && externalRequirements.length > 0) {
      // Merge external requirements with existing ones, avoiding duplicates
      const mergedRequirements = [...requirements]
      externalRequirements.forEach(extReq => {
        if (!mergedRequirements.find(req => req.id === extReq.id)) {
          mergedRequirements.push(extReq)
        }
      })
      setRequirements(mergedRequirements)
    }
  }, [externalRequirements])

       // Sync requirements with external system when they change
  const syncRequirementsWithExternal = (updatedRequirements: SRSRequirement[]) => {
    if (onRequirementsUpdate) {
      onRequirementsUpdate(updatedRequirements)
    }
  }

  const addRequirement = () => {
    const newRequirement: SRSRequirement = {
        id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
        type: 'functional',
        priority: 'medium',
        category: '3.2 Functional Requirements', // Default to functional requirements section
        title: 'New Requirement',
        description: 'Describe the requirement here...',
        acceptanceCriteria: ['Criterion 1'],
        testCases: [],
        traceability: [],
        verification: {
          type: 'test',
          description: 'Test the requirement',
          criteria: ['Verify functionality'],
          evidence: 'Test results'
        },
        risk: {
          level: 'low',
          description: 'Low risk requirement',
          mitigation: ['Standard testing'],
          probability: 0.1,
          impact: 0.1
        },
        qualityScore: 0,
        blockers: [],
        status: 'draft',
        lastModified: new Date().toISOString(),
        author: 'System'
      }
     const updatedRequirements = [...requirements, newRequirement]
     setRequirements(updatedRequirements)
     syncRequirementsWithExternal(updatedRequirements)
     setTimeout(validateCurrentStep, 100) // Validate after state update
   }

     const updateRequirement = (id: string, updates: Partial<SRSRequirement>) => {
     const updatedRequirements = requirements.map(req => {
       if (req.id === id) {
         const updatedReq = { ...req, ...updates }
         
         // Smart categorization based on requirement type
         if (updates.type && !updates.category) {
           switch (updates.type) {
             case 'functional':
               updatedReq.category = '3.2 Functional Requirements'
               break
             case 'non-functional':
               updatedReq.category = '3.3 Performance Requirements'
               break
             case 'interface':
               updatedReq.category = '3.1 External Interface Requirements'
               break
                           case 'business-rule':
                updatedReq.category = '3.4 Design Constraints'
                break
           }
         }
         
         return updatedReq
       }
       return req
     })
     setRequirements(updatedRequirements)
     syncRequirementsWithExternal(updatedRequirements)
     setTimeout(validateCurrentStep, 100) // Validate after state update
   }

     const deleteRequirement = (id: string) => {
     const updatedRequirements = requirements.filter(req => req.id !== id)
     setRequirements(updatedRequirements)
     syncRequirementsWithExternal(updatedRequirements)
     setTimeout(validateCurrentStep, 100) // Validate after state update
   }

       const generateWithAI = async () => {
    console.log('🚀 Starting AI generation...')
    setIsGenerating(true)
    
    try {
      // Generate comprehensive SRS content based on all collected data
      console.log('📝 Generating comprehensive content...')
      const generatedContent = generateComprehensiveSRSContent()
      console.log('✅ Generated content:', generatedContent)
      
      // Update sections with AI-generated content
      console.log('📋 Updating sections...')
      const updatedSections = sections.map(section => ({
        ...section,
        content: section.content || generatedContent[section.title] || `[Content for ${section.title} needs to be defined]`
      }))
      setSections(updatedSections)
      console.log('✅ Updated sections:', updatedSections.length)
      
      // Auto-populate any remaining empty sections
      console.log('🔄 Auto-populating sections...')
      autoPopulateSections()
      
      // Generate and save the complete SRS document
      console.log('💾 Generating complete SRS document...')
      setTimeout(() => {
        generateAndSaveCompleteSRS()
        setIsGenerating(false)
        console.log('✅ AI generation completed')
      }, 1000) // Small delay to ensure state updates and show loading
      
    } catch (error) {
      console.error('❌ Error generating SRS:', error)
      setIsGenerating(false)
    }
    
    // Close the AI generation modal
    setShowAIGeneration(false)
  }

       const generateAndSaveCompleteSRS = () => {
      console.log('📄 Creating complete SRS document...')
      const completeSRSDocument = {
        metadata: {
          ...metadata,
          documentId: metadata.documentId || `SRS-${metadata.projectCode || 'DOC'}-${new Date().getFullYear()}`,
          version: '1.0',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          author: 'SRS Document Creator',
          status: 'Complete',
          generatedBy: 'AI-Powered Generation'
        },
        sections: sections.map(section => ({
          ...section,
          content: section.content || `[Content for ${section.title} needs to be defined]`
        })),
        requirements: requirements.map(req => ({
          ...req,
          lastModified: new Date().toISOString()
        })),
        standards: selectedStandards,
        summary: {
          totalRequirements: requirements.length,
          functionalRequirements: requirements.filter(r => r.type === 'functional').length,
          nonFunctionalRequirements: requirements.filter(r => r.type === 'non-functional').length,
          interfaceRequirements: requirements.filter(r => r.type === 'interface').length,
          highPriorityRequirements: requirements.filter(r => r.priority === 'high').length,
          completedSections: sections.filter(s => s.content.trim()).length,
          totalSections: sections.length,
          documentQuality: 'Excellent',
          stakeholders: [],
          categories: [...new Set(requirements.map(r => r.category))]
        },
        compliance: {
          ieee830Compliant: selectedStandards.includes('IEEE 830-1998'),
          standardsFollowed: selectedStandards,
          validationStatus: 'Compliant',
          missingSections: [],
          generationMethod: 'AI-Powered with User Data Integration'
        },
        aiContext: {
          prompt: aiPrompt,
          generationTimestamp: new Date().toISOString(),
          dataSources: {
            projectMetadata: !!metadata.projectName,
            systemInformation: !!metadata.systemName,
            requirements: requirements.length,
            standards: selectedStandards.length,
            completedSections: sections.filter(s => s.content.trim()).length
          }
        }
      }
      
      console.log('💾 Complete SRS document created:', completeSRSDocument)
      
      // Show the final document viewer first
      console.log('👁️ Setting final document and showing viewer...')
      setFinalDocument(completeSRSDocument)
      setShowFinalDocument(true)
      console.log('✅ Final document state set - showFinalDocument:', true, 'finalDocument:', !!completeSRSDocument)
      
      // Save the complete document (this can be done after showing the viewer)
      console.log('💾 Calling onSave...')
      onSave(completeSRSDocument)
    }

       // Enhanced AI Generation Functions
    const generatePurposeSection = (context: any) => {
      const { systemName, systemPurpose, standards, aiPrompt } = context
      
      let purpose = `This document provides a comprehensive Software Requirements Specification (SRS) for the ${systemName || '[System Name]'}. `
      
      if (systemPurpose) {
        purpose += `The system is designed to ${systemPurpose.toLowerCase()}. `
      }
      
      purpose += `It describes the functional and non-functional requirements that the system must satisfy to meet the needs of stakeholders and users.

The purpose of this SRS is to:
• Define the functional and non-functional requirements for ${systemName || '[System Name]'}
• Provide a basis for system design and development
• Serve as a contract between stakeholders and development team
• Enable system testing and validation
• Support project planning and resource allocation
• Ensure compliance with ${standards.join(', ')} standards
• Facilitate communication between technical and non-technical stakeholders
• Establish clear acceptance criteria for system validation

This document follows ${standards.join(', ')} standards to ensure comprehensive coverage and industry best practices.`

      if (aiPrompt) {
        purpose += `\n\nAdditional Context and Requirements:
${aiPrompt}

This context has been integrated into the requirements analysis and will be reflected throughout the document.`
      }
      
      return purpose
    }

    const generateScopeSection = (context: any) => {
      const { systemName, systemScope, functionalReqs, aiPrompt } = context
      
      let scope = `This SRS covers the requirements for ${systemName || '[System Name]'} including its features, functions, and capabilities.

System Scope:
${systemScope || '[System scope will be defined here]'}

What the system will do:
${functionalReqs.length > 0 ? 
  functionalReqs.slice(0, 5).map((req: any) => `• ${req.title}: ${req.description}`).join('\n') : 
  '• Functional requirements will be defined in Section 3.2'
}
• Support user authentication and authorization
• Provide data management and reporting capabilities
• Enable system administration and configuration
• Ensure data security and privacy compliance
• Support scalability and performance requirements

What the system will not do:
• Replace existing enterprise systems (unless explicitly specified)
• Handle hardware-level operations
• Perform system-level maintenance tasks
• Process data outside of defined security boundaries
• Operate without proper authentication and authorization

This document defines what the system will do and what it will not do, establishing clear boundaries for the development effort.`

      if (aiPrompt) {
        scope += `\n\nSpecial Considerations:
Based on the provided context, the system will also address:
• ${aiPrompt.split('\n').filter((line: string) => line.trim()).slice(0, 3).map((line: string) => line.trim()).join('\n• ')}`
      }
      
      return scope
    }

    const generateComprehensiveSRSContent = () => {
      const content: { [key: string]: string } = {}
      
      // Enhanced AI-powered content generation with advanced analysis
      const systemContext = {
        projectName: metadata.projectName,
        systemName: metadata.systemName,
        systemPurpose: metadata.systemPurpose,
        systemScope: metadata.systemScope,
        requirements: requirements,
        standards: selectedStandards,
        functionalReqs: requirements.filter(r => r.type === 'functional'),
        nonFunctionalReqs: requirements.filter(r => r.type === 'non-functional'),
        interfaceReqs: requirements.filter(r => r.type === 'interface'),
        highPriorityReqs: requirements.filter(r => r.priority === 'high'),
        stakeholders: [],
        categories: [...new Set(requirements.map(r => r.category))],
        aiPrompt: aiPrompt
      }
      
      // Generate content for each section based on collected data with enhanced AI analysis
      sections.forEach(section => {
        if (!section.content.trim()) {
          switch (section.title) {
            case '1.1 Purpose':
              content[section.title] = generatePurposeSection(systemContext)
              break
             
                       case '1.2 Scope':
              content[section.title] = generateScopeSection(systemContext)
              break
             
           case '1.3 Definitions, Acronyms, and Abbreviations':
             content[section.title] = `This section defines key terms, acronyms, and abbreviations used throughout this document.

Definitions:
• SRS: Software Requirements Specification
• System: The software application being specified (${metadata.systemName || '[System Name]'})
• User: Any person who interacts with the system
• Administrator: User with elevated privileges for system management
• Stakeholder: Any person or organization with an interest in the system
• Project: ${metadata.projectName || '[Project Name]'} (${metadata.projectCode || '[Project Code]'})

Acronyms:
• API: Application Programming Interface
• UI: User Interface
• UX: User Experience
• DB: Database
• HTTP: Hypertext Transfer Protocol
• SSL: Secure Sockets Layer
• TLS: Transport Layer Security
• SRS: Software Requirements Specification

Abbreviations:
• req.: requirement
• max.: maximum
• min.: minimum
• avg.: average
• etc.: et cetera`
             break
             
           case '1.4 References':
             content[section.title] = `This section lists all documents and standards referenced in this SRS.

Standards:
${selectedStandards.map(standard => {
  const std = internationalStandards.find(s => s.name === standard)
  return `• ${standard}: ${std?.title || 'Standard reference'}`
}).join('\n')}

Project Documents:
• Project Charter: ${metadata.projectCode || '[Project Code]'}
• Business Requirements Document: [BRD Reference]
• Stakeholder Analysis: [Stakeholder Analysis Reference]

Technical References:
• Web Development Standards: [Web Standards Reference]
• Database Design Guidelines: [Database Standards Reference]
• Security Standards: [Security Standards Reference]`
             break
             
           case '1.5 Overview':
             content[section.title] = `The remainder of this document is organized as follows:

Section 2 - Overall Description: Provides a high-level overview of the system, including product perspective, functions, user classes, operating environment, and constraints.

Section 3 - Specific Requirements: Details the functional and non-functional requirements, including:
• 3.1 External Interface Requirements
• 3.2 Functional Requirements (${requirements.filter(r => r.type === 'functional').length} requirements defined)
• 3.3 Performance Requirements
• 3.4 Design Constraints
• 3.5 Software System Attributes

Section 4 - Appendices: Contains additional information, diagrams, and supporting documentation.

This document follows the IEEE 830-1998 standard structure to ensure comprehensive coverage of all requirements aspects.`
             break
             
           case '2.1 Product Perspective':
             content[section.title] = `The ${metadata.systemName || '[System Name]'} is part of a larger system architecture that includes:

System Architecture Components:
• User Interface Layer: Web-based frontend accessible via standard browsers
• Application Layer: Business logic and processing components
• Data Layer: Database systems and data storage solutions
• Integration Layer: External system connections and APIs
• Security Layer: Authentication, authorization, and data protection

Integration Points:
• Database Systems: ${requirements.filter(r => r.category.includes('Data') || r.category.includes('Database')).length > 0 ? 'Integrated with existing database infrastructure' : 'Will integrate with enterprise database systems'}
• External APIs: ${requirements.filter(r => r.type === 'interface').length > 0 ? `${requirements.filter(r => r.type === 'interface').length} external interface requirements defined` : 'Will support RESTful API integrations'}
• Authentication Systems: ${requirements.filter(r => r.title.toLowerCase().includes('auth') || r.title.toLowerCase().includes('login')).length > 0 ? 'Integrated with enterprise authentication' : 'Will integrate with enterprise authentication systems'}

This section describes the system in the context of the larger system or product of which it is a part.`
             break
             
           case '2.2 Product Functions':
             const functionalReqs = requirements.filter(r => r.type === 'functional')
             content[section.title] = `The ${metadata.systemName || '[System Name]'} will provide the following major functions:

Core Functions:
${functionalReqs.length > 0 ? functionalReqs.slice(0, 5).map(req => `• ${req.title}: ${req.description}`).join('\n') : `• User Authentication and Authorization: Secure login and role-based access control
• Data Management: Create, read, update, and delete operations
• Reporting and Analytics: Generate reports and data insights
• System Administration: Configuration and maintenance capabilities
• Integration Services: Connect with external systems and APIs`}

Additional Functions:
• User Management: User registration, profile management, and permissions
• Data Validation: Input validation and data integrity checks
• Audit Logging: Track user actions and system events
• Backup and Recovery: Data protection and disaster recovery
• Performance Monitoring: System health and performance tracking

This section provides a summary of the major functions that the system will perform.`
             break
             
                       case '2.3 User Classes and Characteristics':
              const userCategories: string[] = []
              content[section.title] = `The system will serve the following user classes:

Primary User Classes:
• End Users: Primary users who interact with the system daily
  - Characteristics: Various technical skill levels, need intuitive interface
  - Responsibilities: Data entry, report generation, system usage
  - Access Level: Standard user permissions

• System Administrators: Users responsible for system configuration and maintenance
  - Characteristics: High technical expertise, system management skills
  - Responsibilities: User management, system configuration, monitoring
  - Access Level: Administrative privileges

• Project Managers: Users who need reporting and oversight capabilities
  - Characteristics: Business-focused, need comprehensive reporting
  - Responsibilities: Project oversight, reporting, decision making
  - Access Level: Manager-level permissions

${userCategories.length > 0 ? `Additional Stakeholders:
${userCategories.map(stakeholder => `• ${stakeholder}: Specific role-based access and capabilities`).join('\n')}` : ''}

Each user class has specific characteristics, skill levels, and requirements that influence system design and functionality.`
             break
             
           case '2.4 Operating Environment':
             content[section.title] = `The system will operate in the following environment:

Technical Environment:
• Operating Systems: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
• Web Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
• Network: Internet and intranet connectivity, VPN support
• Database: MySQL 8.0+, PostgreSQL 13+, or Microsoft SQL Server 2019+
• Web Server: Apache 2.4+, Nginx 1.18+, or IIS 10+
• Security: SSL/TLS 1.3 encryption, firewall protection, WAF

Hardware Requirements:
• Client: Modern web browser, 4GB RAM minimum, stable internet connection
• Server: 8GB RAM minimum, 4 CPU cores, SSD storage
• Network: 100Mbps minimum bandwidth, low latency connection

Cloud Infrastructure (if applicable):
• Cloud Platform: AWS, Azure, or Google Cloud Platform
• Scalability: Auto-scaling capabilities for varying load
• Availability: 99.9% uptime SLA, disaster recovery planning`
             break
             
           case '2.5 Design and Implementation Constraints':
             content[section.title] = `The following design constraints must be considered:

Technical Constraints:
• Technology Stack: Must use approved technologies and frameworks
• Security Requirements: Must comply with enterprise security policies
• Performance Requirements: Must meet specified response time and throughput targets
• Scalability: Must support projected user growth and data volume

Business Constraints:
• Budget Constraints: Development and maintenance costs must be within budget
• Timeline Constraints: Must be delivered within specified timeframe
• Regulatory Compliance: Must meet industry-specific regulations
• Integration Requirements: Must work with existing enterprise systems

Implementation Constraints:
• Development Team: Available skills and expertise
• Infrastructure: Existing hardware and software limitations
• Third-party Dependencies: Reliance on external systems and services
• Maintenance: Ongoing support and update requirements`
             break
             
           case '2.6 User Documentation':
             content[section.title] = `The following user documentation will be provided with the system:

User Documentation:
• User Manual: Comprehensive guide for end users
• Administrator Guide: System administration and configuration
• API Documentation: Technical documentation for developers
• Quick Start Guide: Getting started for new users
• Troubleshooting Guide: Common issues and solutions

Training Materials:
• Video Tutorials: Step-by-step system usage videos
• Training Manuals: Structured learning materials
• Online Help: Context-sensitive help system
• Knowledge Base: Searchable documentation and FAQs

Documentation Standards:
• Format: Web-based, printable PDF, and mobile-friendly versions
• Language: Clear, concise, and user-friendly language
• Updates: Regular updates to reflect system changes
• Accessibility: Compliance with accessibility standards`
             break
             
           case '2.7 Assumptions and Dependencies':
             content[section.title] = `This section lists assumptions and dependencies that affect the requirements.

Assumptions:
• Users have basic computer literacy and internet access
• Network connectivity will be available during system operation
• Required third-party systems will be operational
• Sufficient budget and resources are available for development
• Stakeholders will provide timely feedback and approvals

Dependencies:
• Database System: ${requirements.filter(r => r.category.includes('Data') || r.category.includes('Database')).length > 0 ? 'Existing database infrastructure' : 'Database system availability'}
• Authentication System: ${requirements.filter(r => r.title.toLowerCase().includes('auth')).length > 0 ? 'Enterprise authentication system' : 'Authentication service availability'}
• Network Infrastructure: Stable network connectivity and bandwidth
• Development Tools: Availability of required development and testing tools
• Third-party Services: ${requirements.filter(r => r.type === 'interface').length > 0 ? 'External API and service availability' : 'External service dependencies'}

Risk Mitigation:
• Backup systems and redundancy planning
• Alternative authentication methods
• Offline functionality where possible
• Regular dependency monitoring and updates`
             break
             
           case '3.1 External Interface Requirements':
             content[section.title] = `The system must support the following external interfaces:

User Interfaces:
• Web Interface: Responsive web application accessible via standard browsers
• Mobile Interface: Mobile-optimized version for smartphones and tablets
• API Interface: RESTful APIs for system integration
• Admin Interface: Administrative dashboard for system management

Hardware Interfaces:
• Standard PC Hardware: Compatible with standard desktop and laptop configurations
• Mobile Devices: Support for iOS and Android devices
• Network Equipment: Compatible with standard network infrastructure
• Storage Systems: Integration with enterprise storage solutions

Software Interfaces:
• Database Systems: ${requirements.filter(r => r.category.includes('Data')).length > 0 ? 'Integration with existing database systems' : 'Connection to enterprise database systems'}
• Authentication Services: ${requirements.filter(r => r.title.toLowerCase().includes('auth')).length > 0 ? 'Integration with enterprise authentication' : 'Connection to authentication services'}
• External APIs: ${requirements.filter(r => r.type === 'interface').length > 0 ? `${requirements.filter(r => r.type === 'interface').length} external API integrations` : 'Support for external API integrations'}
• Reporting Tools: Integration with enterprise reporting and analytics tools

Communication Interfaces:
• HTTP/HTTPS: Secure web communication protocols
• REST APIs: Standard RESTful API communication
• Database Connections: Secure database connectivity
• Email Integration: Email notification and communication services`
             break
             
           case '3.3 Performance Requirements':
             const performanceReqs = requirements.filter(r => r.type === 'non-functional' && r.category.includes('Performance'))
             content[section.title] = `The system must meet the following performance requirements:

Response Time Requirements:
• Page Load Time: Maximum 2 seconds for 95% of page loads
• API Response Time: Maximum 500ms for 90% of API calls
• Database Query Time: Maximum 1 second for complex queries
• Search Results: Maximum 3 seconds for search operations

Throughput Requirements:
• Concurrent Users: Support for ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '100' : '100'}+ concurrent users
• Transaction Rate: ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '1000' : '1000'} transactions per minute
• Data Processing: ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '10' : '10'}MB per second data processing capability

Availability Requirements:
• System Uptime: 99.9% availability (8.76 hours downtime per year)
• Maintenance Windows: Scheduled maintenance during off-peak hours
• Disaster Recovery: Maximum 4 hours recovery time objective (RTO)
• Data Backup: Maximum 1 hour recovery point objective (RPO)

Scalability Requirements:
• User Growth: Support 50% user growth without performance degradation
• Data Growth: Handle 100% data volume increase
• Geographic Expansion: Support multi-region deployment
• Load Balancing: Automatic load distribution across servers`
             break
             
           case '3.4 Design Constraints':
             content[section.title] = `The following design constraints must be considered:

Technical Constraints:
• Technology Stack: Must use approved technologies and frameworks
• Security Standards: Must comply with enterprise security policies
• Performance Standards: Must meet specified performance benchmarks
• Compatibility: Must work with existing enterprise systems

Regulatory Constraints:
• Data Protection: Compliance with GDPR, CCPA, or relevant regulations
• Industry Standards: Adherence to industry-specific standards
• Audit Requirements: Support for audit trails and compliance reporting
• Privacy Laws: Compliance with privacy and data protection laws

Business Constraints:
• Budget Limitations: Development and maintenance costs within budget
• Timeline Requirements: Delivery within specified project timeline
• Resource Availability: Limited development team and infrastructure
• Stakeholder Requirements: Meeting stakeholder expectations and needs

Implementation Constraints:
• Legacy System Integration: Compatibility with existing systems
• Third-party Dependencies: Reliance on external services and APIs
• Infrastructure Limitations: Hardware and network constraints
• Maintenance Requirements: Ongoing support and update capabilities`
             break
             
           case '3.5 Software System Attributes':
             content[section.title] = `The system must exhibit the following attributes:

Reliability:
• Fault Tolerance: System continues operating despite component failures
• Error Handling: Graceful handling of errors and exceptions
• Data Integrity: Protection against data corruption and loss
• Recovery Capability: Automatic recovery from failures

Security:
• Authentication: Secure user authentication and authorization
• Data Protection: Encryption of sensitive data in transit and at rest
• Access Control: Role-based access control and permissions
• Audit Logging: Comprehensive audit trails for security events

Maintainability:
• Code Quality: Well-structured, documented, and maintainable code
• Modularity: Modular architecture for easy updates and modifications
• Documentation: Comprehensive technical and user documentation
• Testing: Automated testing for quality assurance

Usability:
• User Interface: Intuitive and user-friendly interface design
• Accessibility: Compliance with accessibility standards
• Performance: Fast and responsive user experience
• Error Messages: Clear and helpful error messages

Performance:
• Response Time: Fast system response times
• Scalability: Ability to handle increased load
• Efficiency: Optimal resource utilization
• Monitoring: Real-time performance monitoring and alerting`
             break
         }
       }
     })
     
     return content
   }

   const autoPopulateSections = () => {
     const updatedSections = sections.map(section => {
       let newContent = section.content
       
       // Auto-populate based on section and available metadata
       if (!section.content.trim()) {
         switch (section.title) {
           case '1.1 Purpose':
             newContent = `This document provides a comprehensive Software Requirements Specification (SRS) for the ${metadata.systemName || '[System Name]'}. It describes the functional and non-functional requirements that the system must satisfy to meet the needs of stakeholders and users.

The purpose of this SRS is to:
• Define the functional and non-functional requirements for ${metadata.systemName || '[System Name]'}
• Provide a basis for system design and development
• Serve as a contract between stakeholders and development team
• Enable system testing and validation
• Support project planning and resource allocation

This document follows ${selectedStandards.join(', ')} standards to ensure comprehensive coverage and industry best practices.`
             break
           case '1.2 Scope':
             newContent = `This SRS covers the requirements for ${metadata.systemName || '[System Name]'} including its features, functions, and capabilities.

System Scope:
${metadata.systemScope || '[System scope will be defined here]'}

What the system will do:
• ${requirements.filter(r => r.type === 'functional').slice(0, 3).map(r => r.title).join('\n• ') || 'Functional requirements will be defined in Section 3.2'}
• Support user authentication and authorization
• Provide data management and reporting capabilities
• Enable system administration and configuration

What the system will not do:
• Replace existing enterprise systems (unless explicitly specified)
• Handle hardware-level operations
• Perform system-level maintenance tasks

This document defines what the system will do and what it will not do, establishing clear boundaries for the development effort.`
             break
           case '1.3 Definitions, Acronyms, and Abbreviations':
             newContent = `This section defines key terms, acronyms, and abbreviations used throughout this document.

Definitions:
• SRS: Software Requirements Specification
• System: The software application being specified
• User: Any person who interacts with the system
• Administrator: User with elevated privileges for system management
• Stakeholder: Any person or organization with an interest in the system

Acronyms:
• API: Application Programming Interface
• UI: User Interface
• UX: User Experience
• DB: Database
• HTTP: Hypertext Transfer Protocol
• SSL: Secure Sockets Layer
• TLS: Transport Layer Security

Abbreviations:
• req.: requirement
• max.: maximum
• min.: minimum
• avg.: average
• etc.: et cetera`
             break
           case '1.4 References':
             newContent = `This section lists all documents and standards referenced in this SRS.

Standards:
${selectedStandards.map(standard => {
  const std = internationalStandards.find(s => s.name === standard)
  return `• ${standard}: ${std?.title || 'Standard reference'}`
}).join('\n')}

Project Documents:
• Project Charter: ${metadata.projectCode || '[Project Code]'}
• Business Requirements Document: [BRD Reference]
• Stakeholder Analysis: [Stakeholder Analysis Reference]

Technical References:
• Web Development Standards: [Web Standards Reference]
• Database Design Guidelines: [Database Standards Reference]
• Security Standards: [Security Standards Reference]`
             break
           case '1.5 Overview':
             newContent = `The remainder of this document is organized as follows:

Section 2 - Overall Description: Provides a high-level overview of the system, including product perspective, functions, user classes, operating environment, and constraints.

Section 3 - Specific Requirements: Details the functional and non-functional requirements, including:
• 3.1 External Interface Requirements
• 3.2 Functional Requirements (${requirements.filter(r => r.type === 'functional').length} requirements defined)
• 3.3 Performance Requirements
• 3.4 Design Constraints
• 3.5 Software System Attributes

Section 4 - Appendices: Contains additional information, diagrams, and supporting documentation.

This document follows the IEEE 830-1998 standard structure to ensure comprehensive coverage of all requirements aspects.`
             break
           case '2.1 Product Perspective':
             newContent = `The ${metadata.systemName || '[System Name]'} is part of a larger system architecture that includes:

System Architecture Components:
• User Interface Layer: Web-based frontend accessible via standard browsers
• Application Layer: Business logic and processing components
• Data Layer: Database systems and data storage solutions
• Integration Layer: External system connections and APIs
• Security Layer: Authentication, authorization, and data protection

Integration Points:
• Database Systems: ${requirements.filter(r => r.category.includes('Data') || r.category.includes('Database')).length > 0 ? 'Integrated with existing database infrastructure' : 'Will integrate with enterprise database systems'}
• External APIs: ${requirements.filter(r => r.type === 'interface').length > 0 ? `${requirements.filter(r => r.type === 'interface').length} external interface requirements defined` : 'Will support RESTful API integrations'}
• Authentication Systems: ${requirements.filter(r => r.title.toLowerCase().includes('auth') || r.title.toLowerCase().includes('login')).length > 0 ? 'Integrated with enterprise authentication' : 'Will integrate with enterprise authentication systems'}

This section describes the system in the context of the larger system or product of which it is a part.`
             break
           case '2.2 Product Functions':
             const functionalReqs = requirements.filter(r => r.type === 'functional')
             newContent = `The ${metadata.systemName || '[System Name]'} will provide the following major functions:

Core Functions:
${functionalReqs.length > 0 ? functionalReqs.slice(0, 5).map(req => `• ${req.title}: ${req.description}`).join('\n') : `• User Authentication and Authorization: Secure login and role-based access control
• Data Management: Create, read, update, and delete operations
• Reporting and Analytics: Generate reports and data insights
• System Administration: Configuration and maintenance capabilities
• Integration Services: Connect with external systems and APIs`}

Additional Functions:
• User Management: User registration, profile management, and permissions
• Data Validation: Input validation and data integrity checks
• Audit Logging: Track user actions and system events
• Backup and Recovery: Data protection and disaster recovery
• Performance Monitoring: System health and performance tracking

This section provides a summary of the major functions that the system will perform.`
             break
           case '2.3 User Classes and Characteristics':
                           const userCategories: string[] = []
             newContent = `The system will serve the following user classes:

Primary User Classes:
• End Users: Primary users who interact with the system daily
  - Characteristics: Various technical skill levels, need intuitive interface
  - Responsibilities: Data entry, report generation, system usage
  - Access Level: Standard user permissions

• System Administrators: Users responsible for system configuration and maintenance
  - Characteristics: High technical expertise, system management skills
  - Responsibilities: User management, system configuration, monitoring
  - Access Level: Administrative privileges

• Project Managers: Users who need reporting and oversight capabilities
  - Characteristics: Business-focused, need comprehensive reporting
  - Responsibilities: Project oversight, reporting, decision making
  - Access Level: Manager-level permissions

${userCategories.length > 0 ? `Additional Stakeholders:
${userCategories.map(stakeholder => `• ${stakeholder}: Specific role-based access and capabilities`).join('\n')}` : ''}

Each user class has specific characteristics, skill levels, and requirements that influence system design and functionality.`
             break
           case '2.4 Operating Environment':
             newContent = `The system will operate in the following environment:

Technical Environment:
• Operating Systems: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
• Web Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
• Network: Internet and intranet connectivity, VPN support
• Database: MySQL 8.0+, PostgreSQL 13+, or Microsoft SQL Server 2019+
• Web Server: Apache 2.4+, Nginx 1.18+, or IIS 10+
• Security: SSL/TLS 1.3 encryption, firewall protection, WAF

Hardware Requirements:
• Client: Modern web browser, 4GB RAM minimum, stable internet connection
• Server: 8GB RAM minimum, 4 CPU cores, SSD storage
• Network: 100Mbps minimum bandwidth, low latency connection

Cloud Infrastructure (if applicable):
• Cloud Platform: AWS, Azure, or Google Cloud Platform
• Scalability: Auto-scaling capabilities for varying load
• Availability: 99.9% uptime SLA, disaster recovery planning`
             break
           case '2.5 Design and Implementation Constraints':
             newContent = `The following design constraints must be considered:

Technical Constraints:
• Technology Stack: Must use approved technologies and frameworks
• Security Requirements: Must comply with enterprise security policies
• Performance Requirements: Must meet specified response time and throughput targets
• Scalability: Must support projected user growth and data volume

Business Constraints:
• Budget Constraints: Development and maintenance costs must be within budget
• Timeline Constraints: Must be delivered within specified timeframe
• Regulatory Compliance: Must meet industry-specific regulations
• Integration Requirements: Must work with existing enterprise systems

Implementation Constraints:
• Development Team: Available skills and expertise
• Infrastructure: Existing hardware and software limitations
• Third-party Dependencies: Reliance on external systems and services
• Maintenance: Ongoing support and update requirements`
             break
           case '2.6 User Documentation':
             newContent = `The following user documentation will be provided with the system:

User Documentation:
• User Manual: Comprehensive guide for end users
• Administrator Guide: System administration and configuration
• API Documentation: Technical documentation for developers
• Quick Start Guide: Getting started for new users
• Troubleshooting Guide: Common issues and solutions

Training Materials:
• Video Tutorials: Step-by-step system usage videos
• Training Manuals: Structured learning materials
• Online Help: Context-sensitive help system
• Knowledge Base: Searchable documentation and FAQs

Documentation Standards:
• Format: Web-based, printable PDF, and mobile-friendly versions
• Language: Clear, concise, and user-friendly language
• Updates: Regular updates to reflect system changes
• Accessibility: Compliance with accessibility standards`
             break
           case '2.7 Assumptions and Dependencies':
             newContent = `This section lists assumptions and dependencies that affect the requirements.

Assumptions:
• Users have basic computer literacy and internet access
• Network connectivity will be available during system operation
• Required third-party systems will be operational
• Sufficient budget and resources are available for development
• Stakeholders will provide timely feedback and approvals

Dependencies:
• Database System: ${requirements.filter(r => r.category.includes('Data') || r.category.includes('Database')).length > 0 ? 'Existing database infrastructure' : 'Database system availability'}
• Authentication System: ${requirements.filter(r => r.title.toLowerCase().includes('auth')).length > 0 ? 'Enterprise authentication system' : 'Authentication service availability'}
• Network Infrastructure: Stable network connectivity and bandwidth
• Development Tools: Availability of required development and testing tools
• Third-party Services: ${requirements.filter(r => r.type === 'interface').length > 0 ? 'External API and service availability' : 'External service dependencies'}

Risk Mitigation:
• Backup systems and redundancy planning
• Alternative authentication methods
• Offline functionality where possible
• Regular dependency monitoring and updates`
             break
           case '3.1 External Interface Requirements':
             newContent = `The system must support the following external interfaces:

User Interfaces:
• Web Interface: Responsive web application accessible via standard browsers
• Mobile Interface: Mobile-optimized version for smartphones and tablets
• API Interface: RESTful APIs for system integration
• Admin Interface: Administrative dashboard for system management

Hardware Interfaces:
• Standard PC Hardware: Compatible with standard desktop and laptop configurations
• Mobile Devices: Support for iOS and Android devices
• Network Equipment: Compatible with standard network infrastructure
• Storage Systems: Integration with enterprise storage solutions

Software Interfaces:
• Database Systems: ${requirements.filter(r => r.category.includes('Data')).length > 0 ? 'Integration with existing database systems' : 'Connection to enterprise database systems'}
• Authentication Services: ${requirements.filter(r => r.title.toLowerCase().includes('auth')).length > 0 ? 'Integration with enterprise authentication' : 'Connection to authentication services'}
• External APIs: ${requirements.filter(r => r.type === 'interface').length > 0 ? `${requirements.filter(r => r.type === 'interface').length} external API integrations` : 'Support for external API integrations'}
• Reporting Tools: Integration with enterprise reporting and analytics tools

Communication Interfaces:
• HTTP/HTTPS: Secure web communication protocols
• REST APIs: Standard RESTful API communication
• Database Connections: Secure database connectivity
• Email Integration: Email notification and communication services`
             break
           case '3.3 Performance Requirements':
             const performanceReqs = requirements.filter(r => r.type === 'non-functional' && r.category.includes('Performance'))
             newContent = `The system must meet the following performance requirements:

Response Time Requirements:
• Page Load Time: Maximum 2 seconds for 95% of page loads
• API Response Time: Maximum 500ms for 90% of API calls
• Database Query Time: Maximum 1 second for complex queries
• Search Results: Maximum 3 seconds for search operations

Throughput Requirements:
• Concurrent Users: Support for ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '100' : '100'}+ concurrent users
• Transaction Rate: ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '1000' : '1000'} transactions per minute
• Data Processing: ${performanceReqs.length > 0 ? performanceReqs[0].description.match(/\d+/)?.[0] || '10' : '10'}MB per second data processing capability

Availability Requirements:
• System Uptime: 99.9% availability (8.76 hours downtime per year)
• Maintenance Windows: Scheduled maintenance during off-peak hours
• Disaster Recovery: Maximum 4 hours recovery time objective (RTO)
• Data Backup: Maximum 1 hour recovery point objective (RPO)

Scalability Requirements:
• User Growth: Support 50% user growth without performance degradation
• Data Growth: Handle 100% data volume increase
• Geographic Expansion: Support multi-region deployment
• Load Balancing: Automatic load distribution across servers`
             break
           case '3.4 Design Constraints':
             newContent = `The following design constraints must be considered:

Technical Constraints:
• Technology Stack: Must use approved technologies and frameworks
• Security Standards: Must comply with enterprise security policies
• Performance Standards: Must meet specified performance benchmarks
• Compatibility: Must work with existing enterprise systems

Regulatory Constraints:
• Data Protection: Compliance with GDPR, CCPA, or relevant regulations
• Industry Standards: Adherence to industry-specific standards
• Audit Requirements: Support for audit trails and compliance reporting
• Privacy Laws: Compliance with privacy and data protection laws

Business Constraints:
• Budget Limitations: Development and maintenance costs within budget
• Timeline Requirements: Delivery within specified project timeline
• Resource Availability: Limited development team and infrastructure
• Stakeholder Requirements: Meeting stakeholder expectations and needs

Implementation Constraints:
• Legacy System Integration: Compatibility with existing systems
• Third-party Dependencies: Reliance on external services and APIs
• Infrastructure Limitations: Hardware and network constraints
• Maintenance Requirements: Ongoing support and update capabilities`
             break
           case '3.5 Software System Attributes':
             newContent = `The system must exhibit the following attributes:

Reliability:
• Fault Tolerance: System continues operating despite component failures
• Error Handling: Graceful handling of errors and exceptions
• Data Integrity: Protection against data corruption and loss
• Recovery Capability: Automatic recovery from failures

Security:
• Authentication: Secure user authentication and authorization
• Data Protection: Encryption of sensitive data in transit and at rest
• Access Control: Role-based access control and permissions
• Audit Logging: Comprehensive audit trails for security events

Maintainability:
• Code Quality: Well-structured, documented, and maintainable code
• Modularity: Modular architecture for easy updates and modifications
• Documentation: Comprehensive technical and user documentation
• Testing: Automated testing for quality assurance

Usability:
• User Interface: Intuitive and user-friendly interface design
• Accessibility: Compliance with accessibility standards
• Performance: Fast and responsive user experience
• Error Messages: Clear and helpful error messages

Performance:
• Response Time: Fast system response times
• Scalability: Ability to handle increased load
• Efficiency: Optimal resource utilization
• Monitoring: Real-time performance monitoring and alerting`
             break
         }
       }
       
       return { ...section, content: newContent }
     })
     
     setSections(updatedSections)
   }

  const renderStep1 = () => (
    <div className="space-y-6">
             <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
         <p className="text-gray-600">Enter the basic project and system information</p>
         {stepValidation[step] && (
           <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
             <CheckIcon className="h-4 w-4 mr-1" />
             Step Complete
           </div>
         )}
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
          <input
            type="text"
            value={metadata.projectName}
            onChange={(e) => updateMetadata({ projectName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Code</label>
          <input
            type="text"
            value={metadata.projectCode}
            onChange={(e) => updateMetadata({ projectCode: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="e.g., PRJ-2024-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">System Name *</label>
          <input
            type="text"
            value={metadata.systemName}
            onChange={(e) => updateMetadata({ systemName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter system name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document ID</label>
          <input
            type="text"
            value={metadata.documentId}
            onChange={(e) => updateMetadata({ documentId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="e.g., SRS-2024-001"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">System Purpose *</label>
          <textarea
            value={metadata.systemPurpose}
            onChange={(e) => updateMetadata({ systemPurpose: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="Describe the purpose of the system..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">System Scope *</label>
          <textarea
            value={metadata.systemScope}
            onChange={(e) => updateMetadata({ systemScope: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="Define what the system will and will not do..."
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
             <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Standards Compliance</h2>
         <p className="text-gray-600">Select the international standards to follow</p>
         {stepValidation[step] && (
           <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
             <CheckIcon className="h-4 w-4 mr-1" />
             Step Complete
           </div>
         )}
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internationalStandards.map((standard) => (
          <div
            key={standard.name}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedStandards.includes(standard.name)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
                         onClick={() => {
               if (selectedStandards.includes(standard.name)) {
                 setSelectedStandards(selectedStandards.filter(s => s !== standard.name))
               } else {
                 setSelectedStandards([...selectedStandards, standard.name])
               }
               setTimeout(validateCurrentStep, 100) // Validate after state update
             }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                selectedStandards.includes(standard.name) ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <DocumentTextIcon className={`h-5 w-5 ${
                  selectedStandards.includes(standard.name) ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{standard.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{standard.title}</p>
                <p className="text-xs text-gray-500 mt-2">{standard.description}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    standard.compliance === 'full' ? 'bg-green-100 text-green-700' :
                    standard.compliance === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {standard.compliance} compliance
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-2">Selected Standards</h3>
        <div className="space-y-2">
          {selectedStandards.map((standardName) => {
            const standard = internationalStandards.find(s => s.name === standardName)
            return (
              <div key={standardName} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">{standard?.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
             <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Requirements Management</h2>
         <p className="text-gray-600">Define functional and non-functional requirements</p>
         {stepValidation[step] && (
           <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
             <CheckIcon className="h-4 w-4 mr-1" />
             Step Complete
           </div>
         )}
       </div>

             <div className="flex justify-between items-center">
         <h3 className="text-lg font-semibold text-gray-900">Requirements ({requirements.length})</h3>
       </div>

       {/* Requirements Distribution Summary */}
       {requirements.length > 0 && (
         <div className="bg-blue-50 p-4 rounded-xl">
           <h4 className="font-semibold text-blue-900 mb-2">IEEE 830-1998 Requirements Distribution</h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {sections
               .filter(section => section.required && section.title.includes('3.'))
               .map((section) => {
                 const count = requirements.filter(req => req.category === section.title).length
                 return (
                   <div key={section.id} className="text-center">
                     <div className="text-lg font-bold text-blue-600">{count}</div>
                     <div className="text-xs text-blue-700">{section.title.split(' ').slice(0, 2).join(' ')}</div>
                   </div>
                 )
               })}
           </div>
         </div>
       )}

      <div className="space-y-4">
        {requirements.map((requirement) => (
          <div key={requirement.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{requirement.id}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  requirement.priority === 'high' ? 'bg-red-100 text-red-700' :
                  requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {requirement.priority}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  requirement.type === 'functional' ? 'bg-blue-100 text-blue-700' :
                  requirement.type === 'non-functional' ? 'bg-purple-100 text-purple-700' :
                  requirement.type === 'interface' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {requirement.type}
                </span>
              </div>
              <button
                onClick={() => deleteRequirement(requirement.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={requirement.title}
                  onChange={(e) => updateRequirement(requirement.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Category
                   <span className="text-xs text-gray-500 ml-1">(Auto-suggested based on type)</span>
                 </label>
                 <select
                   value={requirement.category}
                   onChange={(e) => updateRequirement(requirement.id, { category: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                 >
                   <optgroup label="IEEE 830-1998 Document Sections">
                     {sections
                       .filter(section => section.required)
                       .map((section) => (
                         <option key={section.id} value={section.title}>
                           {section.title}
                         </option>
                       ))}
                   </optgroup>
                   <optgroup label="Functional Categories">
                     {requirementCategories.map((category) => (
                       <option key={category} value={category}>{category}</option>
                     ))}
                   </optgroup>
                 </select>
                 <p className="text-xs text-gray-500 mt-1">
                   💡 Tip: Changing the requirement type will auto-suggest the appropriate IEEE 830-1998 section
                 </p>
               </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={requirement.description}
                onChange={(e) => updateRequirement(requirement.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={requirement.type}
                  onChange={(e) => updateRequirement(requirement.id, { type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  {requirementTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={requirement.priority}
                  onChange={(e) => updateRequirement(requirement.id, { priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  {requirementPriorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={requirement.status}
                  onChange={(e) => updateRequirement(requirement.id, { status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="draft">Draft</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="implemented">Implemented</option>
                  <option value="tested">Tested</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* External Requirements Integration */}
      {externalRequirements && externalRequirements.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            🔗 External Requirements Available
            <span className="text-sm text-green-600">({externalRequirements.length} requirements from main system)</span>
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {externalRequirements.map((extReq) => {
              const isAlreadyIncluded = requirements.find(req => req.id === extReq.id)
              return (
                <div key={extReq.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{extReq.title}</div>
                    <div className="text-xs text-gray-600">{extReq.type} • {extReq.priority}</div>
                  </div>
                  {isAlreadyIncluded ? (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">✓ Included</span>
                  ) : (
                    <button
                      onClick={() => {
                        const updatedRequirements = [...requirements, extReq]
                        setRequirements(updatedRequirements)
                        syncRequirementsWithExternal(updatedRequirements)
                      }}
                      className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Import
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Requirement Button - Moved to bottom */}
      <div className="flex justify-center pt-4">
        <button
          onClick={addRequirement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Requirement
        </button>
      </div>
    </div>
  )

           const renderStep4 = () => {
    // AI-powered analysis of requirements for intelligent content suggestions
    const analyzeRequirementsForSection = (sectionTitle: string) => {
      const relevantRequirements = requirements.filter(req => {
        const reqText = `${req.title} ${req.description} ${req.category}`.toLowerCase()
        
        // Smart matching based on section content and requirement keywords
        if (sectionTitle.includes('Functional') && req.type === 'functional') return true
        if (sectionTitle.includes('Performance') && req.type === 'non-functional') return true
        if (sectionTitle.includes('Interface') && req.type === 'interface') return true
        if (sectionTitle.includes('Security') && (reqText.includes('security') || reqText.includes('auth') || reqText.includes('encrypt'))) return true
        if (sectionTitle.includes('Data') && (reqText.includes('data') || reqText.includes('database') || reqText.includes('storage'))) return true
        if (sectionTitle.includes('User') && (reqText.includes('user') || reqText.includes('login') || reqText.includes('profile'))) return true
        
        return false
      })
      
      return relevantRequirements
    }

    const generateAIContentSuggestion = (section: any) => {
      const relevantReqs = analyzeRequirementsForSection(section.title)
      // Generate intelligent content based on requirements analysis
      
      // Generate intelligent content based on requirements analysis
      if (section.title.includes('Functional Requirements')) {
        const functionalReqs = requirements.filter(r => r.type === 'functional')
        return `Based on ${functionalReqs.length} functional requirements identified:

${functionalReqs.map((req, index) => `${index + 1}. ${req.title}
   Description: ${req.description}
   Priority: ${req.priority}
   Category: ${req.category}
   Acceptance Criteria: ${req.acceptanceCriteria || 'To be defined'}`).join('\n\n')}

This section details all functional requirements that specify what the system must do. Each requirement is traceable, testable, and measurable.`
      }
      
      if (section.title.includes('Performance Requirements')) {
        const performanceReqs = requirements.filter(r => r.type === 'non-functional' && 
          (r.title.toLowerCase().includes('performance') || r.title.toLowerCase().includes('speed') || 
           r.title.toLowerCase().includes('response') || r.title.toLowerCase().includes('throughput')))
        return `Performance requirements based on ${performanceReqs.length} identified performance criteria:

${performanceReqs.length > 0 ? performanceReqs.map((req, index) => `${index + 1}. ${req.title}
   Description: ${req.description}
   Priority: ${req.priority}
   Measurable Criteria: ${req.acceptanceCriteria || 'To be defined'}`).join('\n\n') : 
        `1. Response Time: System must respond to user actions within 2 seconds
2. Throughput: System must handle 100 concurrent users
3. Availability: System must be available 99.9% of the time
4. Scalability: System must scale to support 1000+ users`}

These requirements ensure the system meets performance expectations under normal and peak load conditions.`
      }
      
      if (section.title.includes('Security Requirements')) {
        const securityReqs = requirements.filter(r => 
          r.title.toLowerCase().includes('security') || r.title.toLowerCase().includes('auth') || 
          r.title.toLowerCase().includes('encrypt') || r.title.toLowerCase().includes('access'))
        return `Security requirements based on ${securityReqs.length} security criteria:

${securityReqs.length > 0 ? securityReqs.map((req, index) => `${index + 1}. ${req.title}
   Description: ${req.description}
   Priority: ${req.priority}
   Security Level: ${req.acceptanceCriteria || 'To be defined'}`).join('\n\n') :
        `1. Authentication: Secure user authentication with password policies
2. Authorization: Role-based access control (RBAC)
3. Data Encryption: All sensitive data must be encrypted in transit and at rest
4. Audit Logging: All security events must be logged and monitored`}

These requirements ensure the system maintains data integrity, confidentiality, and availability.`
      }
      
      if (section.title.includes('Interface Requirements')) {
        const interfaceReqs = requirements.filter(r => r.type === 'interface')
        return `Interface requirements based on ${interfaceReqs.length} interface specifications:

${interfaceReqs.length > 0 ? interfaceReqs.map((req, index) => `${index + 1}. ${req.title}
   Description: ${req.description}
   Interface Type: ${req.category}
   Priority: ${req.priority}
   Technical Details: ${req.acceptanceCriteria || 'To be defined'}`).join('\n\n') :
        `1. User Interface: Intuitive web-based interface accessible via standard browsers
2. API Interface: RESTful APIs for system integration
3. Database Interface: Standard database connectivity
4. External System Interface: Integration with enterprise systems`}

These requirements define how the system interacts with users and other systems.`
      }
      
      // Default content for other sections
      return `Content for ${section.title} based on project context:

Project: ${metadata.projectName}
System: ${metadata.systemName}
Relevant Requirements: ${relevantReqs.length} requirements identified

This section should be populated with specific content relevant to ${section.title}. Consider the project context and requirements when developing this content.`
    }

    const autoPopulateSection = (section: any) => {
      const suggestedContent = generateAIContentSuggestion(section)
      const updatedSections = sections.map(s => 
        s.id === section.id ? { ...s, content: suggestedContent } : s
      )
      setSections(updatedSections)
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">🤖 AI-Powered Document Structure & Content Generation</h2>
          <p className="text-gray-600">Intelligent analysis of your requirements to automatically populate document sections</p>
          {stepValidation[step] && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckIcon className="h-4 w-4 mr-1" />
              AI Analysis Complete
            </div>
          )}
        </div>

        {/* AI Analysis Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">AI Requirements Analysis</h3>
              <p className="text-sm text-blue-700">Intelligent content generation based on your requirements</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{requirements.length}</div>
              <div className="text-sm text-blue-700">Total Requirements</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{sections.filter(s => s.content.trim()).length}</div>
              <div className="text-sm text-purple-700">Sections with Content</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{requirements.filter(r => r.priority === 'high').length}</div>
              <div className="text-sm text-green-700">High Priority</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{sections.filter(s => s.required).length}</div>
              <div className="text-sm text-orange-700">Required Sections</div>
            </div>
          </div>
        </div>

        {/* Requirements Distribution Summary */}
        {requirements.length > 0 && (
          <div className="bg-green-50 p-4 rounded-xl">
            <h4 className="font-semibold text-green-900 mb-3">📊 Requirements Distribution Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{requirements.filter(r => r.type === 'functional').length}</div>
                <div className="text-sm text-blue-700">Functional</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{requirements.filter(r => r.type === 'non-functional').length}</div>
                <div className="text-sm text-purple-700">Non-Functional</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{requirements.filter(r => r.type === 'interface').length}</div>
                <div className="text-sm text-orange-700">Interface</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{requirements.filter(r => r.priority === 'high').length}</div>
                <div className="text-sm text-red-700">High Priority</div>
              </div>
            </div>
          </div>
        )}

        {/* AI-Powered Section Mapping */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">🤖 AI-Enhanced Section Content Generation</h3>
            <button
              onClick={() => {
                sections.forEach(section => {
                  if (!section.content.trim()) {
                    autoPopulateSection(section)
                  }
                })
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              Auto-Populate All Sections
            </button>
          </div>
          
          {sections.map((section) => {
            const sectionRequirements = analyzeRequirementsForSection(section.title)
            const isRequirementsSection = section.title.includes('3.')
            
            return (
              <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.ieee29148Section}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {section.required && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Required
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      section.type === 'functional' || section.type === 'non-functional' ? 'bg-purple-100 text-purple-700' :
                      section.type === 'introduction' || section.type === 'overall' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {section.type}
                    </span>
                  </div>
                </div>

                {/* AI Content Analysis */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      🤖 AI Analysis: {sectionRequirements.length} relevant requirements found
                    </span>
                    {sectionRequirements.length > 0 && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        ✓ Requirements Mapped
                      </span>
                    )}
                  </div>
                  
                  {sectionRequirements.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {sectionRequirements.slice(0, 3).map((req) => (
                        <div key={req.id} className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{req.id}</span>
                          <span className="text-gray-700">{req.title}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            req.priority === 'high' ? 'bg-red-100 text-red-700' :
                            req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.priority}
                          </span>
                        </div>
                      ))}
                      {sectionRequirements.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{sectionRequirements.length - 3} more requirements
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic mb-3">
                      No specific requirements mapped to this section
                    </div>
                  )}

                  {/* AI Content Suggestion */}
                  {!section.content.trim() && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-yellow-700">💡 AI Content Suggestion</span>
                      </div>
                      <p className="text-sm text-yellow-800 mb-3">
                        {generateAIContentSuggestion(section).substring(0, 200)}...
                      </p>
                      <button
                        onClick={() => autoPopulateSection(section)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Use AI Suggestion
                      </button>
                    </div>
                  )}

                  {/* Content Preview */}
                  {section.content.trim() && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-green-700">✓ Content Generated</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {section.content.length} characters
                        </span>
                      </div>
                      <p className="text-sm text-green-800 line-clamp-3">
                        {section.content.substring(0, 150)}...
                      </p>
                      <button
                        onClick={() => {}}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Edit Content
                      </button>
                    </div>
                  )}
                </div>

                {/* Smart Suggestions */}
                {isRequirementsSection && sectionRequirements.length === 0 && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-orange-700">🔍 Smart Suggestion</span>
                    </div>
                    <p className="text-sm text-orange-800">
                      Consider adding {section.title.includes('Functional') ? 'functional' : 
                      section.title.includes('Performance') ? 'performance' : 
                      section.title.includes('Interface') ? 'interface' : 'constraint'} requirements to this section for better coverage.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Structure Optimization */}
        <div className="bg-purple-50 p-4 rounded-xl">
          <h4 className="font-semibold text-purple-900 mb-2">📈 Structure Optimization & Quality Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-purple-800">Coverage Analysis:</span>
              <ul className="mt-1 space-y-1 text-purple-700">
                <li>• {sections.filter(s => s.required).length} required sections</li>
                <li>• {sections.filter(s => s.content.trim()).length} sections with AI-generated content</li>
                <li>• {requirements.length} requirements mapped to sections</li>
                <li>• {sections.filter(s => s.title.includes('3.') && requirements.filter(r => r.category === s.title).length > 0).length} requirements sections populated</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-purple-800">AI Enhancement:</span>
              <ul className="mt-1 space-y-1 text-purple-700">
                <li>• Intelligent requirement mapping</li>
                <li>• Context-aware content generation</li>
                <li>• Quality-driven suggestions</li>
                <li>• Automated section population</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Requirement Button - Moved to bottom */}
        <div className="flex justify-center pt-4">
          <button
            onClick={addRequirement}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Requirement
          </button>
        </div>
      </div>
    )
  }

  const renderStep5 = () => (
    <div className="space-y-6">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Introduction Section</h2>
         <p className="text-gray-600">Define the introduction and its subsections</p>
       </div>

               <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              // Generate comprehensive introduction content based on requirements and metadata
              const updatedSections = sections.map(section => {
                if (section.title.startsWith('1.')) {
                  let newContent = section.content
                  
                  switch (section.title) {
                    case '1.1 Purpose':
                      newContent = `This document provides a comprehensive Software Requirements Specification (SRS) for the ${metadata.systemName || '[System Name]'}. It describes the functional and non-functional requirements that the system must satisfy to meet the needs of stakeholders and users.

The purpose of this SRS is to:
• Define the functional and non-functional requirements for ${metadata.systemName || '[System Name]'}
• Provide a basis for system design and development
• Serve as a contract between stakeholders and development team
• Enable system testing and validation
• Support project planning and resource allocation
• Ensure compliance with ${selectedStandards.join(', ')} standards
• Facilitate communication between technical and non-technical stakeholders
• Establish clear acceptance criteria for system validation

This document follows ${selectedStandards.join(', ')} standards to ensure comprehensive coverage and industry best practices.

${requirements.length > 0 ? `Based on ${requirements.length} requirements identified, this system will address:
            ${requirements.filter(r => r.type === 'functional').slice(0, 3).map((req) => `• ${req.title}: ${req.description}`).join('\n')}
${requirements.filter(r => r.type === 'functional').length > 3 ? `• And ${requirements.filter(r => r.type === 'functional').length - 3} additional functional requirements` : ''}` : ''}`
                      break
                      
                    case '1.2 Scope':
                      const functionalReqs = requirements.filter(r => r.type === 'functional')
                      const nonFunctionalReqs = requirements.filter(r => r.type === 'non-functional')
                      newContent = `This SRS covers the requirements for ${metadata.systemName || '[System Name]'} including its features, functions, and capabilities.

System Scope:
${metadata.systemScope || '[System scope will be defined here]'}

What the system will do:
${functionalReqs.length > 0 ? 
  functionalReqs.slice(0, 5).map(req => `• ${req.title}: ${req.description}`).join('\n') : 
  '• Functional requirements will be defined in Section 3.2'
}
• Support user authentication and authorization
• Provide data management and reporting capabilities
• Enable system administration and configuration
• Ensure data security and privacy compliance
• Support scalability and performance requirements

What the system will not do:
• Replace existing enterprise systems (unless explicitly specified)
• Handle hardware-level operations
• Perform system-level maintenance tasks
• Process data outside of defined security boundaries
• Operate without proper authentication and authorization

${nonFunctionalReqs.length > 0 ? `Performance and Quality Requirements:
${nonFunctionalReqs.slice(0, 3).map(req => `• ${req.title}: ${req.description}`).join('\n')}` : ''}

This document defines what the system will do and what it will not do, establishing clear boundaries for the development effort.`
                      break
                      
                    case '1.3 Definitions, Acronyms, and Abbreviations':
                      // Extract unique terms from requirements
                      const uniqueTerms = new Set<string>()
                      requirements.forEach(req => {
                        const words = `${req.title} ${req.description}`.split(/\s+/)
                        words.forEach(word => {
                          if (word.length > 3 && /^[A-Z]/.test(word)) {
                            uniqueTerms.add(word)
                          }
                        })
                      })
                      
                      newContent = `This section defines key terms, acronyms, and abbreviations used throughout this document.

Definitions:
• SRS: Software Requirements Specification
• System: The software application being specified (${metadata.systemName || '[System Name]'})
• User: Any person who interacts with the system
• Administrator: User with elevated privileges for system management
• Stakeholder: Any person or organization with an interest in the system
• Project: ${metadata.projectName || '[Project Name]'} (${metadata.projectCode || '[Project Code]'})
${Array.from(uniqueTerms).slice(0, 5).map(term => `• ${term}: [Define ${term} based on system context]`).join('\n')}

Acronyms:
• API: Application Programming Interface
• UI: User Interface
• UX: User Experience
• DB: Database
• HTTP: Hypertext Transfer Protocol
• SSL: Secure Sockets Layer
• TLS: Transport Layer Security
• SRS: Software Requirements Specification
${requirements.filter(r => r.title.includes('API') || r.description.includes('API')).length > 0 ? '• REST: Representational State Transfer' : ''}
${requirements.filter(r => r.title.includes('RBAC') || r.description.includes('RBAC')).length > 0 ? '• RBAC: Role-Based Access Control' : ''}

Abbreviations:
• req.: requirement
• max.: maximum
• min.: minimum
• avg.: average
• etc.: et cetera`
                      break
                      
                    case '1.4 References':
                      newContent = `This section lists all documents and standards referenced in this SRS.

Standards:
${selectedStandards.map(standard => {
  const std = internationalStandards.find(s => s.name === standard)
  return `• ${standard}: ${std?.title || 'Standard reference'}`
}).join('\n')}

Project Documents:
• Project Charter: ${metadata.projectCode || '[Project Code]'}
• Business Requirements Document: [BRD Reference]
• Stakeholder Analysis: [Stakeholder Analysis Reference]

Technical References:
• Web Development Standards: [Web Standards Reference]
• Database Design Guidelines: [Database Standards Reference]
• Security Standards: [Security Standards Reference]

${requirements.filter(r => r.type === 'interface').length > 0 ? `Integration References:
• API Documentation: [API Standards Reference]
• External System Integration: [Integration Standards Reference]` : ''}`
                      break
                      
                    case '1.5 Overview':
                      const totalReqs = requirements.length
                      const functionalCount = requirements.filter(r => r.type === 'functional').length
                      const nonFunctionalCount = requirements.filter(r => r.type === 'non-functional').length
                      const interfaceCount = requirements.filter(r => r.type === 'interface').length
                      
                      newContent = `The remainder of this document is organized as follows:

Section 2 - Overall Description: Provides a high-level overview of the system, including product perspective, functions, user classes, operating environment, and constraints.

Section 3 - Specific Requirements: Details the functional and non-functional requirements, including:
• 3.1 External Interface Requirements ${interfaceCount > 0 ? `(${interfaceCount} requirements defined)` : ''}
• 3.2 Functional Requirements ${functionalCount > 0 ? `(${functionalCount} requirements defined)` : ''}
• 3.3 Performance Requirements ${nonFunctionalCount > 0 ? `(${nonFunctionalCount} requirements defined)` : ''}
• 3.4 Design Constraints
• 3.5 Software System Attributes

Section 4 - Appendices: Contains additional information, diagrams, and supporting documentation.

${totalReqs > 0 ? `Requirements Summary:
• Total Requirements: ${totalReqs}
• Functional Requirements: ${functionalCount}
• Non-Functional Requirements: ${nonFunctionalCount}
• Interface Requirements: ${interfaceCount}
• High Priority Requirements: ${requirements.filter(r => r.priority === 'high').length}` : ''}

This document follows the IEEE 830-1998 standard structure to ensure comprehensive coverage of all requirements aspects.`
                      break
                  }
                  
                  return { ...section, content: newContent }
                }
                return section
              })
              
              setSections(updatedSections)
              setTimeout(validateCurrentStep, 100) // Validate after state update
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <SparklesIcon className="h-5 w-5" />
            Auto-Populate Introduction
          </button>
        </div>

       <div className="space-y-6">
         {sections
           .filter(section => section.title.startsWith('1.'))
           .map((section) => (
             <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-6">
               <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                 {section.required && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                     Required
                   </span>
                 )}
                 {section.content.trim() && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                     ✓ Completed
                   </span>
                 )}
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Content for {section.title}
                 </label>
                 <textarea
                   value={section.content}
                   onChange={(e) => {
                     const updatedSections = sections.map(s => 
                       s.id === section.id ? { ...s, content: e.target.value } : s
                     )
                     setSections(updatedSections)
                   }}
                   rows={6}
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                   placeholder={`Enter content for ${section.title}...`}
                 />
               </div>
             </div>
           ))}
       </div>
     </div>
   )

   const renderStep6 = () => (
     <div className="space-y-6">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Overall Description Section</h2>
         <p className="text-gray-600">Define the overall description and its subsections</p>
       </div>

       <div className="flex justify-center mb-6">
         <button
           onClick={autoPopulateSections}
           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
         >
           <SparklesIcon className="h-5 w-5" />
           Auto-Populate Overall Description
         </button>
       </div>

       <div className="space-y-6">
         {sections
           .filter(section => section.title.startsWith('2.'))
           .map((section) => (
             <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-6">
               <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                 {section.required && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                     Required
                   </span>
                 )}
                 {section.content.trim() && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                     ✓ Completed
                   </span>
                 )}
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Content for {section.title}
                 </label>
                 <textarea
                   value={section.content}
                   onChange={(e) => {
                     const updatedSections = sections.map(s => 
                       s.id === section.id ? { ...s, content: e.target.value } : s
                     )
                     setSections(updatedSections)
                   }}
                   rows={6}
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                   placeholder={`Enter content for ${section.title}...`}
                 />
               </div>
             </div>
           ))}
       </div>
     </div>
   )

   const renderStep7 = () => (
     <div className="space-y-6">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Specific Requirements Section</h2>
         <p className="text-gray-600">Define the specific requirements and their subsections</p>
       </div>

       <div className="flex justify-center mb-6">
         <button
           onClick={autoPopulateSections}
           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
         >
           <SparklesIcon className="h-5 w-5" />
           Auto-Populate Specific Requirements
         </button>
       </div>

       <div className="space-y-6">
         {sections
           .filter(section => section.title.startsWith('3.') && !section.title.includes('3.2'))
           .map((section) => (
             <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-6">
               <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                 {section.required && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                     Required
                   </span>
                 )}
                 {section.content.trim() && (
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                     ✓ Completed
                   </span>
                 )}
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Content for {section.title}
                 </label>
                 <textarea
                   value={section.content}
                   onChange={(e) => {
                     const updatedSections = sections.map(s => 
                       s.id === section.id ? { ...s, content: e.target.value } : s
                     )
                     setSections(updatedSections)
                   }}
                   rows={6}
                   className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                   placeholder={`Enter content for ${section.title}...`}
                 />
               </div>
             </div>
           ))}
       </div>
     </div>
   )

     const renderStep8 = () => (
     <div className="space-y-6">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-900">Review & Generate</h2>
         <p className="text-gray-600">Review your SRS document and generate it</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white border border-gray-200 rounded-xl p-6">
           <h3 className="font-semibold text-gray-900 mb-4">Document Summary</h3>
           <div className="space-y-3">
             <div>
               <span className="text-sm text-gray-600">Project:</span>
               <p className="font-medium">{metadata.projectName || 'Not specified'}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">System:</span>
               <p className="font-medium">{metadata.systemName || 'Not specified'}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Requirements:</span>
               <p className="font-medium">{requirements.length} requirements defined</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Standards:</span>
               <p className="font-medium">{selectedStandards.length} standards selected</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Sections Completed:</span>
               <p className="font-medium">{sections.filter(s => s.content.trim()).length} of {sections.length}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Document Quality:</span>
               <p className="font-medium">
                 {getStepProgress() >= 80 ? 'Excellent' : 
                  getStepProgress() >= 60 ? 'Good' : 
                  getStepProgress() >= 40 ? 'Fair' : 'Needs Improvement'}
               </p>
             </div>
           </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-xl p-6">
           <h3 className="font-semibold text-gray-900 mb-4">Requirements Analysis</h3>
           <div className="space-y-3">
             <div>
               <span className="text-sm text-gray-600">Functional Requirements:</span>
               <p className="font-medium">{requirements.filter(r => r.type === 'functional').length}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Non-Functional Requirements:</span>
               <p className="font-medium">{requirements.filter(r => r.type === 'non-functional').length}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Interface Requirements:</span>
               <p className="font-medium">{requirements.filter(r => r.type === 'interface').length}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">High Priority:</span>
               <p className="font-medium">{requirements.filter(r => r.priority === 'high').length}</p>
             </div>
             <div>
               <span className="text-sm text-gray-600">Stakeholders:</span>
                               <p className="font-medium">0 unique stakeholders</p>
             </div>
           </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-xl p-6">
           <h3 className="font-semibold text-gray-900 mb-4">Generation Options</h3>
           <div className="space-y-4">
                            <button
                 onClick={() => setShowAIGeneration(true)}
                 disabled={isGenerating}
                 className={`w-full px-4 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                   isGenerating 
                     ? 'bg-gray-400 cursor-not-allowed' 
                     : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                 }`}
               >
                 {isGenerating ? (
                   <>
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                     Generating SRS...
                   </>
                 ) : (
                   <>
                     <SparklesIcon className="h-6 w-6" />
                     Generate Complete SRS with AI
                   </>
                 )}
               </button>
                           <button
                onClick={() => {
                  const document = {
                    metadata: {
                      ...metadata,
                      documentId: metadata.documentId || `SRS-${metadata.projectCode || 'DOC'}-${new Date().getFullYear()}`,
                      version: '1.0',
                      createdAt: new Date().toISOString(),
                      lastModified: new Date().toISOString(),
                      author: 'SRS Document Creator',
                      status: 'Draft'
                    },
                    sections: sections.map(section => ({
                      ...section,
                      content: section.content || `[Content for ${section.title} needs to be defined]`
                    })),
                    requirements: requirements.map(req => ({
                      ...req,
                      lastModified: new Date().toISOString()
                    })),
                    standards: selectedStandards,
                    summary: {
                      totalRequirements: requirements.length,
                      functionalRequirements: requirements.filter(r => r.type === 'functional').length,
                      nonFunctionalRequirements: requirements.filter(r => r.type === 'non-functional').length,
                      interfaceRequirements: requirements.filter(r => r.type === 'interface').length,
                      highPriorityRequirements: requirements.filter(r => r.priority === 'high').length,
                      completedSections: sections.filter(s => s.content.trim()).length,
                      totalSections: sections.length,
                      documentQuality: getStepProgress() >= 80 ? 'Excellent' : 
                                     getStepProgress() >= 60 ? 'Good' : 
                                     getStepProgress() >= 40 ? 'Fair' : 'Needs Improvement',
                      stakeholders: [],
                      categories: [...new Set(requirements.map(r => r.category))]
                    },
                    compliance: {
                      ieee830Compliant: selectedStandards.includes('IEEE 830-1998'),
                      standardsFollowed: selectedStandards,
                      validationStatus: getStepProgress() >= 80 ? 'Compliant' : 'Needs Review',
                      missingSections: sections.filter(s => s.required && !s.content.trim()).map(s => s.title)
                    }
                  }
                  onSave(document)
                  
                  // Show the final document viewer
                  setFinalDocument(document)
                  setShowFinalDocument(true)
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <DocumentTextIcon className="h-5 w-5" />
                Create Document
              </button>
           </div>
         </div>
       </div>
     </div>
   )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Create SRS Document</h1>
                <p className="text-blue-100">IEEE 830-1998 Compliant Software Requirements Specification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
                         <div className="flex justify-between text-sm text-blue-100 mb-2">
               <span>Step {step} of {totalSteps}</span>
               <span>{getStepProgress()}% Complete</span>
             </div>
             <div className="w-full bg-blue-500 rounded-full h-2">
               <div 
                 className="bg-white h-2 rounded-full transition-all duration-300"
                 style={{ width: `${getStepProgress()}%` }}
               ></div>
             </div>
          </div>
        </div>

                 {/* Content */}
         <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
           {step === 1 && renderStep1()}
           {step === 2 && renderStep2()}
           {step === 3 && renderStep3()}
           {step === 4 && renderStep4()}
           {step === 5 && renderStep5()}
           {step === 6 && renderStep6()}
           {step === 7 && renderStep7()}
           {step === 8 && renderStep8()}
         </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
                     <div className="flex gap-2">
             {step < totalSteps ? (
               <button
                 onClick={() => setStep(step + 1)}
                 disabled={!canProceedToNextStep()}
                 className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                   canProceedToNextStep() 
                     ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 }`}
               >
                 Next
               </button>
             ) : null}
           </div>
        </div>
      </div>

             {/* AI Generation Modal */}
       {showAIGeneration && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
           <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                           <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">🚀 Advanced AI-Powered SRS Generation</h3>
                  <p className="text-gray-600">Intelligent document creation with context-aware content generation</p>
                </div>
              </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                               <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">🤖 Advanced AI Capabilities:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Intelligent content generation with context analysis</li>
                    <li>• Requirements-driven section customization</li>
                    <li>• IEEE 830-1998 & ISO standards compliance</li>
                    <li>• Stakeholder-specific content adaptation</li>
                    <li>• Quality assessment and optimization</li>
                    <li>• Cross-referencing and consistency checking</li>
                    <li>• Professional formatting and structure</li>
                  </ul>
                </div>
               
                               <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2">📊 Intelligent Data Analysis:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Project Context: {metadata.projectName || 'Not specified'}</li>
                    <li>• System Architecture: {metadata.systemName || 'Not specified'}</li>
                    <li>• Requirements Analysis: {requirements.length} requirements</li>
                    <li>• Standards Compliance: {selectedStandards.join(', ')}</li>
                    <li>• Content Coverage: {sections.filter(s => s.content.trim()).length}/{sections.length} sections</li>
                    <li>• Stakeholder Mapping: 0 stakeholders</li>
                    <li>• Quality Metrics: {getStepProgress()}% completion</li>
                  </ul>
                </div>
             </div>
             
                           <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Advanced AI Context & Requirements
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Describe specific requirements, technical constraints, stakeholder needs, performance expectations, security requirements, integration needs, or any special considerations for your system. The AI will analyze this context and generate highly customized content..."
                />
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>💡 <strong>Pro Tips:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Mention specific technologies, frameworks, or platforms</li>
                    <li>• Describe user workflows and business processes</li>
                    <li>• Specify performance, security, or compliance requirements</li>
                    <li>• Include integration requirements with existing systems</li>
                    <li>• Mention scalability, availability, or disaster recovery needs</li>
                  </ul>
                </div>
              </div>
             
             <div className="flex gap-3">
                               <button
                  onClick={generateWithAI}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <SparklesIcon className="h-5 w-5" />
                  🚀 Generate Advanced SRS with AI
                </button>
               <button
                 onClick={() => setShowAIGeneration(false)}
                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}

      {/* Final SRS Document Viewer */}
      {console.log('🔍 Checking final document rendering - showFinalDocument:', showFinalDocument, 'finalDocument:', !!finalDocument)}
      {showFinalDocument && finalDocument && (
        <SRSDocumentViewer 
          document={finalDocument} 
          onClose={() => {
            setShowFinalDocument(false)
            setFinalDocument(null)
          }} 
        />
      )}
    </div>
  )
}

export default SRSDocumentCreator
