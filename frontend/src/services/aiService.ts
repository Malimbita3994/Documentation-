import { env } from '../config/environment'

export interface AIGenerationRequest {
  prompt: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
  context?: any
}

export interface AIGenerationResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason: string
}

export interface DocumentGenerationContext {
  documentType: string
  industry: string
  requirements: string
  additionalSpecs?: string
  projectContext?: any
  standards?: string[]
  compliance?: string[]
}

class AIService {
  private apiKey: string
  private baseUrl: string
  private defaultModel: string

  constructor() {
    this.apiKey = env.OPENAI_API_KEY || ''
    this.baseUrl = 'https://api.openai.com/v1'
    this.defaultModel = 'gpt-4o'  // Updated to current model
  }

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      // Fallback to mock response for testing without API key
      console.warn('OpenAI API key not configured. Using fallback mock response.')
      return {
        content: `[AI Mock Response] This is a fallback response for testing. To get real AI-generated content, please configure your OpenAI API key in the .env file.

Request: ${request.prompt}

For setup instructions, see: OPENAI_API_SETUP.md`,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        model: 'mock-fallback',
        finishReason: 'mock'
      }
    }

    // Try different models in order of preference
    const modelsToTry = [
      request.model || this.defaultModel,
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo'
    ]

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`)
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: request.systemPrompt || 'You are an expert software documentation specialist with deep knowledge of IEEE standards, industry best practices, and technical writing.'
              },
              {
                role: 'user',
                content: request.prompt
              }
            ],
            temperature: request.temperature || 0.3,
            max_tokens: request.maxTokens || 4000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        })

        if (!response.ok) {
          const error = await response.json()
          const errorMessage = error.error?.message || response.statusText
          
          // If it's a quota or billing issue, provide enhanced fallback
          if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('exceeded')) {
            console.warn(`Quota exceeded for model ${model}. Using enhanced fallback.`)
            return this.getEnhancedFallbackResponse(request)
          }
          
          // If it's a model access issue, try the next model
          if (errorMessage.includes('does not exist') || errorMessage.includes('access')) {
            console.warn(`Model ${model} not available, trying next model...`)
            continue
          }
          
          throw new Error(`AI API Error: ${errorMessage}`)
        }

        const data = await response.json()
        
        return {
          content: data.choices[0].message.content,
          usage: data.usage,
          model: data.model,
          finishReason: data.choices[0].finish_reason
        }
      } catch (error: any) {
        // If it's the last model, provide enhanced fallback
        if (model === modelsToTry[modelsToTry.length - 1]) {
          console.warn('All models failed. Using enhanced fallback response.')
          return this.getEnhancedFallbackResponse(request)
        }
        // Otherwise, continue to the next model
        console.warn(`Failed with model ${model}:`, error.message)
      }
    }

    // This should never be reached, but just in case
    return this.getEnhancedFallbackResponse(request)
  }

  private getEnhancedFallbackResponse(request: AIGenerationRequest): AIGenerationResponse {
    const prompt = request.prompt.toLowerCase()
    let fallbackContent = ''

    // Generate contextually relevant fallback content
    if (prompt.includes('srs') || prompt.includes('requirements')) {
      fallbackContent = `# Software Requirements Specification (SRS) - Enhanced Fallback

## Introduction
This is a comprehensive SRS template generated using industry best practices and IEEE 830-1998 standards.

## 1. Purpose and Scope
The purpose of this document is to define the software requirements for the system based on the provided context: "${request.prompt}"

## 2. Overall Description
### 2.1 Product Perspective
The system will be designed as a modern web application with the following characteristics:
- Scalable architecture
- User-friendly interface
- Secure data handling
- Cross-platform compatibility

### 2.2 Product Functions
Based on the requirements, the system should provide:
- User authentication and authorization
- Data management and storage
- Reporting and analytics
- Integration capabilities

### 2.3 User Characteristics
The system will serve multiple user types:
- End users requiring intuitive interfaces
- Administrators needing management tools
- Technical users requiring advanced features

## 3. Specific Requirements
### 3.1 Functional Requirements
- FR-01: User authentication and session management
- FR-02: Data input, validation, and storage
- FR-03: Search and retrieval functionality
- FR-04: Reporting and export capabilities

### 3.2 Non-Functional Requirements
- Performance: Response time < 2 seconds
- Security: Encrypted data transmission
- Reliability: 99.9% uptime
- Usability: Intuitive user interface

## 4. External Interfaces
- Web browser compatibility
- Mobile device support
- API integration capabilities
- Database connectivity

---
*Note: This is an enhanced fallback response. For real AI-generated content, please resolve your OpenAI API quota or billing issues.*`
    } else if (prompt.includes('test') || prompt.includes('testing')) {
      fallbackContent = `# Test Cases and Test Plan - Enhanced Fallback

## Test Plan Overview
This document outlines comprehensive testing strategies for the system based on: "${request.prompt}"

## 1. Test Objectives
- Verify functional requirements
- Validate non-functional requirements
- Ensure system reliability
- Confirm user acceptance criteria

## 2. Test Strategy
### 2.1 Unit Testing
- Component-level testing
- Function validation
- Error handling verification

### 2.2 Integration Testing
- Module interaction testing
- API endpoint validation
- Database integration testing

### 2.3 System Testing
- End-to-end workflow testing
- Performance testing
- Security testing

### 2.4 User Acceptance Testing
- User interface testing
- Business process validation
- User experience evaluation

## 3. Test Cases
### TC-001: User Authentication
- **Objective**: Verify user login functionality
- **Preconditions**: Valid user account exists
- **Steps**: Enter credentials, submit form
- **Expected Result**: Successful login, session created

### TC-002: Data Validation
- **Objective**: Ensure data integrity
- **Preconditions**: System is operational
- **Steps**: Submit invalid data, submit valid data
- **Expected Result**: Errors for invalid data, success for valid data

## 4. Test Environment
- Development environment
- Staging environment
- Production-like testing environment

---
*Note: This is an enhanced fallback response. For real AI-generated content, please resolve your OpenAI API quota or billing issues.*`
    } else {
      fallbackContent = `# Enhanced Fallback Response

## Generated Content
Based on your request: "${request.prompt}"

This is an enhanced fallback response that provides structured, professional content even when the AI service is unavailable due to quota or billing issues.

## Key Features of This Fallback:
- Professional document structure
- Industry-standard formatting
- Contextual content generation
- IEEE compliance guidelines
- Best practices integration

## Next Steps:
1. **Resolve API Quota**: Add billing information to your OpenAI account
2. **Check Usage**: Monitor your API usage at https://platform.openai.com/account/usage
3. **Set Limits**: Configure spending limits to avoid unexpected charges
4. **Alternative Models**: Consider using different models with lower costs

## Benefits of Real AI Integration:
- Dynamic content generation
- Industry-specific customization
- Real-time updates and improvements
- Advanced prompt engineering
- Multi-model optimization

---
*Note: This is an enhanced fallback response. For real AI-generated content, please resolve your OpenAI API quota or billing issues.*`
    }

    return {
      content: fallbackContent,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      model: 'enhanced-fallback',
      finishReason: 'quota_exceeded'
    }
  }

  // Document-specific generation methods
  async generateSRS(context: DocumentGenerationContext): Promise<string> {
    const prompt = this.buildSRSPrompt(context)
    const systemPrompt = this.getSRSSystemPrompt()
    
    const response = await this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 6000
    })

    return response.content
  }

  async generateSDD(context: DocumentGenerationContext): Promise<string> {
    const prompt = this.buildSDDPrompt(context)
    const systemPrompt = this.getSDDSystemPrompt()
    
    const response = await this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 6000
    })

    return response.content
  }

  async generateTestCases(context: DocumentGenerationContext): Promise<string> {
    const prompt = this.buildTestCasesPrompt(context)
    const systemPrompt = this.getTestCasesSystemPrompt()
    
    const response = await this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 5000
    })

    return response.content
  }

  async generateUserManual(context: DocumentGenerationContext): Promise<string> {
    const prompt = this.buildUserManualPrompt(context)
    const systemPrompt = this.getUserManualSystemPrompt()
    
    const response = await this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 5000
    })

    return response.content
  }

  async generateProgressReport(context: DocumentGenerationContext): Promise<string> {
    const prompt = this.buildProgressReportPrompt(context)
    const systemPrompt = this.getProgressReportSystemPrompt()
    
    const response = await this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 4000
    })

    return response.content
  }

  // Prompt Engineering Methods
  private buildSRSPrompt(context: DocumentGenerationContext): string {
    return `
# Software Requirements Specification (SRS) Generation

## Project Context
- Industry: ${context.industry}
- Requirements: ${context.requirements}
- Additional Specifications: ${context.additionalSpecs || 'None provided'}

## Standards & Compliance
- IEEE 830-1998 Standard for Software Requirements Specifications
- ${context.standards?.join(', ') || 'Industry best practices'}

## Instructions
Generate a comprehensive SRS document that includes:

1. **Introduction**
   - Purpose and scope
   - Definitions and acronyms
   - References

2. **Overall Description**
   - Product perspective
   - Product functions
   - User characteristics
   - Constraints and assumptions

3. **Specific Requirements**
   - Functional requirements
   - Non-functional requirements
   - External interface requirements
   - Performance requirements
   - Design constraints

4. **Appendices**
   - Use case diagrams
   - Data flow diagrams
   - Requirements traceability matrix

Please ensure the document follows IEEE 830-1998 standards and includes proper traceability, testability, and completeness criteria.
    `.trim()
  }

  private buildSDDPrompt(context: DocumentGenerationContext): string {
    return `
# Software Design Document (SDD) Generation

## Project Context
- Industry: ${context.industry}
- Requirements: ${context.requirements}
- Additional Specifications: ${context.additionalSpecs || 'None provided'}

## Standards & Compliance
- IEEE 1016-2009 Standard for Information Technology—Systems Design—Software Design Descriptions
- ${context.standards?.join(', ') || 'Industry best practices'}

## Instructions
Generate a comprehensive SDD document that includes:

1. **Introduction**
   - Purpose and scope
   - Definitions and acronyms
   - References

2. **System Overview**
   - System context
   - Design goals and constraints
   - Assumptions and dependencies

3. **System Architecture**
   - Architectural design
   - Component design
   - Interface design
   - Data design

4. **Detailed Design**
   - Module specifications
   - Algorithm descriptions
   - Data structures
   - Error handling

5. **Implementation Considerations**
   - Development environment
   - Testing strategy
   - Deployment considerations

Please ensure the document follows IEEE 1016-2009 standards and includes proper design patterns, architectural decisions, and implementation details.
    `.trim()
  }

  private buildTestCasesPrompt(context: DocumentGenerationContext): string {
    return `
# Test Cases & Test Plan Generation

## Project Context
- Industry: ${context.industry}
- Requirements: ${context.requirements}
- Additional Specifications: ${context.additionalSpecs || 'None provided'}

## Standards & Compliance
- IEEE 829-2008 Standard for Software and System Test Documentation
- ${context.standards?.join(', ') || 'Industry best practices'}

## Instructions
Generate comprehensive test cases and test plan that includes:

1. **Test Plan**
   - Test objectives and scope
   - Test strategy and approach
   - Test environment requirements
   - Test schedule and resources

2. **Test Cases**
   - Functional test cases
   - Non-functional test cases
   - Integration test cases
   - User acceptance test cases

3. **Test Data**
   - Test data requirements
   - Test data preparation
   - Test data validation

4. **Test Execution**
   - Test execution procedures
   - Test result documentation
   - Defect reporting

Please ensure the test cases are traceable to requirements, include proper test data, and follow industry best practices for testing.
    `.trim()
  }

  private buildUserManualPrompt(context: DocumentGenerationContext): string {
    return `
# User Manual Generation

## Project Context
- Industry: ${context.industry}
- Requirements: ${context.requirements}
- Additional Specifications: ${context.additionalSpecs || 'None provided'}

## Standards & Compliance
- ISO/IEC 26515:2011 Systems and software engineering — Developing information for users
- ${context.standards?.join(', ') || 'Industry best practices'}

## Instructions
Generate a comprehensive user manual that includes:

1. **Introduction**
   - Purpose and scope
   - Target audience
   - How to use this manual

2. **Getting Started**
   - System overview
   - Installation instructions
   - First-time setup
   - Basic navigation

3. **User Guide**
   - Feature descriptions
   - Step-by-step procedures
   - Screenshots and examples
   - Troubleshooting

4. **Reference Information**
   - Glossary of terms
   - Keyboard shortcuts
   - Error messages
   - Contact information

Please ensure the manual is user-friendly, includes clear instructions, and follows usability best practices.
    `.trim()
  }

  private buildProgressReportPrompt(context: DocumentGenerationContext): string {
    return `
# Project Progress Report Generation

## Project Context
- Industry: ${context.industry}
- Requirements: ${context.requirements}
- Additional Specifications: ${context.additionalSpecs || 'None provided'}

## Instructions
Generate a comprehensive project progress report that includes:

1. **Executive Summary**
   - Project overview
   - Current status
   - Key achievements

2. **Progress Summary**
   - Completed milestones
   - Deliverables status
   - Timeline progress
   - Resource utilization

3. **Issues and Risks**
   - Current issues
   - Risk assessment
   - Mitigation strategies

4. **Next Steps**
   - Upcoming milestones
   - Action items
   - Resource requirements

Please ensure the report provides clear insights into project progress, identifies issues early, and includes actionable recommendations.
    `.trim()
  }

  // System Prompts for different document types
  private getSRSSystemPrompt(): string {
    return `You are an expert software requirements engineer with 20+ years of experience in IEEE 830-1998 standards, requirements engineering, and software development. You specialize in creating comprehensive, traceable, and testable software requirements specifications.

Your expertise includes:
- IEEE 830-1998 Standard for Software Requirements Specifications
- Requirements traceability and validation
- Use case modeling and analysis
- Functional and non-functional requirements engineering
- Industry-specific compliance requirements
- Best practices in requirements documentation

Generate SRS documents that are:
- Complete and comprehensive
- Traceable to business objectives
- Testable and verifiable
- Compliant with IEEE standards
- Industry-specific and contextual
- Professional and well-structured`
  }

  private getSDDSystemPrompt(): string {
    return `You are an expert software architect and designer with 20+ years of experience in IEEE 1016-2009 standards, software architecture, and system design. You specialize in creating comprehensive software design documents that bridge requirements to implementation.

Your expertise includes:
- IEEE 1016-2009 Standard for Software Design Descriptions
- Software architecture patterns and principles
- Component and interface design
- Data modeling and database design
- Design patterns and best practices
- Performance and scalability considerations

Generate SDD documents that are:
- Architecturally sound and well-structured
- Detailed enough for implementation
- Compliant with IEEE standards
- Include proper design patterns
- Address non-functional requirements
- Professional and comprehensive`
  }

  private getTestCasesSystemPrompt(): string {
    return `You are an expert software testing specialist with 20+ years of experience in IEEE 829-2008 standards, test planning, and quality assurance. You specialize in creating comprehensive test strategies and test cases that ensure software quality.

Your expertise includes:
- IEEE 829-2008 Standard for Software and System Test Documentation
- Test planning and strategy development
- Functional and non-functional testing
- Test case design and execution
- Test data management
- Quality assurance best practices

Generate test documentation that is:
- Comprehensive and thorough
- Traceable to requirements
- Executable and measurable
- Compliant with IEEE standards
- Industry-specific and contextual
- Professional and well-structured`
  }

  private getUserManualSystemPrompt(): string {
    return `You are an expert technical writer and user experience specialist with 20+ years of experience in ISO/IEC 26515:2011 standards, user documentation, and information design. You specialize in creating user-friendly, comprehensive user manuals.

Your expertise includes:
- ISO/IEC 26515:2011 Systems and software engineering standards
- User experience and usability principles
- Technical writing and documentation
- Information architecture and design
- User training and support
- Accessibility and internationalization

Generate user manuals that are:
- User-friendly and accessible
- Comprehensive and complete
- Well-structured and navigable
- Compliant with ISO standards
- Industry-specific and contextual
- Professional and engaging`
  }

  private getProgressReportSystemPrompt(): string {
    return `You are an expert project manager and business analyst with 20+ years of experience in project management, progress reporting, and stakeholder communication. You specialize in creating clear, actionable project progress reports.

Your expertise includes:
- Project management methodologies (PMBOK, PRINCE2, Agile)
- Progress tracking and reporting
- Risk management and mitigation
- Stakeholder communication
- Resource management
- Quality assurance in project delivery

Generate progress reports that are:
- Clear and actionable
- Data-driven and objective
- Comprehensive and informative
- Professional and well-structured
- Industry-specific and contextual
- Focused on stakeholder needs`
  }
}

export const aiService = new AIService()
