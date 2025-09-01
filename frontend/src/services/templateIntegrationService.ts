import { templateService, Template } from './templateService'
import { aiService } from './aiService'
import { knowledgeBaseService } from './knowledgeBaseService'

export interface TemplateIntegrationContext {
  contentType: string
  industry: string
  projectContext?: any
  requirements?: string
  additionalSpecs?: string
}

export interface TemplateEnhancedGeneration {
  template: Template
  enhancedContent: string
  standards: string[]
  compliance: string[]
  industryBestPractices: string[]
}

class TemplateIntegrationService {
  /**
   * Get the best template for a specific document type and industry
   */
  async getBestTemplate(contentType: string, industry: string): Promise<Template | null> {
    try {
      const templates = await templateService.getTemplatesForGeneration(contentType, industry)
      
      if (templates.length === 0) {
        // Try to get any template for this content type
        const allTemplates = await templateService.getTemplatesForGeneration(contentType)
        return allTemplates[0] || null
      }

      // Return the most downloaded template (most popular)
      return templates[0]
    } catch (error) {
      console.error('Error getting best template:', error)
      return null
    }
  }

  /**
   * Enhance document generation with template and knowledge base
   */
  async enhanceDocumentGeneration(
    context: TemplateIntegrationContext
  ): Promise<TemplateEnhancedGeneration | null> {
    try {
      // Get the best template for this content type and industry
      const template = await this.getBestTemplate(context.contentType, context.industry)
      
      if (!template) {
        console.warn('No suitable template found for:', context.contentType, context.industry)
        return null
      }

      // Query knowledge base for relevant standards and best practices
      const knowledgeQuery = {
        query: `${context.contentType} ${context.industry} standards best practices`,
        sources: ['standards', 'compliance', 'best-practices']
      }
      const knowledgeResult = await knowledgeBaseService.queryKnowledge(knowledgeQuery)

      // Extract standards and compliance information
      const standards = template.standards || []
      const compliance = this.extractComplianceInfo(knowledgeResult)
      const industryBestPractices = this.extractBestPractices(knowledgeResult)

      // Generate enhanced content using AI
      const enhancedContent = await this.generateEnhancedContent(template, context, {
        standards,
        compliance,
        industryBestPractices
      })

      return {
        template,
        enhancedContent,
        standards,
        compliance,
        industryBestPractices
      }
    } catch (error) {
      console.error('Error enhancing document generation:', error)
      return null
    }
  }

  /**
   * Generate enhanced content using AI and template
   */
  private async generateEnhancedContent(
    template: Template,
    context: TemplateIntegrationContext,
    knowledge: {
      standards: string[]
      compliance: string[]
      industryBestPractices: string[]
    }
  ): Promise<string> {
    try {
      const prompt = this.buildEnhancedPrompt(template, context, knowledge)
      
      const response = await aiService.generateContent({
        prompt,
        systemPrompt: this.getEnhancedSystemPrompt(context.contentType),
        temperature: 0.3,
        maxTokens: 6000
      })

      return response.content
    } catch (error) {
      console.error('Error generating enhanced content:', error)
      return this.getFallbackContent(template, context)
    }
  }

  /**
   * Build enhanced prompt for AI generation
   */
  private buildEnhancedPrompt(
    template: Template,
    context: TemplateIntegrationContext,
    knowledge: {
      standards: string[]
      compliance: string[]
      industryBestPractices: string[]
    }
  ): string {
    return `
# Enhanced ${context.contentType} Document Generation

## Template Information
- Template Name: ${template.name}
- Template Category: ${template.category}
- Template Industry: ${template.industry}
- Template Standards: ${template.standards?.join(', ') || 'None specified'}

## Project Context
- Content Type: ${context.contentType}
- Industry: ${context.industry}
- Requirements: ${context.requirements || 'Not specified'}
- Additional Specifications: ${context.additionalSpecs || 'None'}

## Knowledge Base Integration
### Standards & Compliance
${knowledge.standards.map(std => `- ${std}`).join('\n')}

### Compliance Requirements
${knowledge.compliance.map(comp => `- ${comp}`).join('\n')}

### Industry Best Practices
${knowledge.industryBestPractices.map(bp => `- ${bp}`).join('\n')}

## Instructions
Generate a comprehensive ${context.contentType} document that:

1. **Follows the template structure** from the provided template
2. **Incorporates industry standards** and compliance requirements
3. **Applies best practices** for ${context.industry} industry
4. **Ensures completeness** and professional quality
5. **Maintains consistency** with the template format
6. **Includes all necessary sections** for a complete ${context.contentType}

Please ensure the document is:
- Professional and well-structured
- Industry-specific and contextual
- Compliant with relevant standards
- Ready for immediate use
- Comprehensive and detailed

Generate the complete document content following the template structure and incorporating all the knowledge base information.
    `.trim()
  }

  /**
   * Get enhanced system prompt for specific content type
   */
  private getEnhancedSystemPrompt(contentType: string): string {
    const basePrompt = `You are an expert document generation specialist with deep knowledge of industry standards, best practices, and professional documentation. You specialize in creating comprehensive, compliant, and industry-specific documents.`

    switch (contentType) {
      case 'SRS':
        return `${basePrompt} You have extensive experience with IEEE 830-1998 standards, requirements engineering, and software development lifecycle. Generate SRS documents that are complete, traceable, and testable.`
      
      case 'SDD':
        return `${basePrompt} You have extensive experience with IEEE 1016-2009 standards, software architecture, and system design. Generate SDD documents that are architecturally sound and implementation-ready.`
      
      case 'Test Cases':
        return `${basePrompt} You have extensive experience with IEEE 829-2008 standards, test planning, and quality assurance. Generate comprehensive test documentation that ensures software quality.`
      
      case 'User Manual':
        return `${basePrompt} You have extensive experience with ISO/IEC 26515:2011 standards, user experience, and technical writing. Generate user-friendly and comprehensive user manuals.`
      
      case 'Progress Report':
        return `${basePrompt} You have extensive experience with project management methodologies, progress tracking, and stakeholder communication. Generate clear and actionable progress reports.`
      
      default:
        return basePrompt
    }
  }

  /**
   * Extract compliance information from knowledge base results
   */
  private extractComplianceInfo(knowledgeResult: any): string[] {
    const compliance: string[] = []
    
    if (knowledgeResult && knowledgeResult.content) {
      const content = knowledgeResult.content.toLowerCase()
      
      // Extract compliance-related information
      if (content.includes('ieee')) {
        compliance.push('IEEE Standards Compliance')
      }
      if (content.includes('iso')) {
        compliance.push('ISO Standards Compliance')
      }
      if (content.includes('gdpr')) {
        compliance.push('GDPR Compliance')
      }
      if (content.includes('hipaa')) {
        compliance.push('HIPAA Compliance')
      }
      if (content.includes('sox')) {
        compliance.push('SOX Compliance')
      }
    }
    
    return compliance.length > 0 ? compliance : ['Industry Standard Compliance']
  }

  /**
   * Extract best practices from knowledge base results
   */
  private extractBestPractices(knowledgeResult: any): string[] {
    const bestPractices: string[] = []
    
    if (knowledgeResult && knowledgeResult.content) {
      const content = knowledgeResult.content
      
      // Extract best practices (simplified extraction)
      const lines = content.split('\n')
      lines.forEach((line: string) => {
        if (line.toLowerCase().includes('best practice') || 
            line.toLowerCase().includes('recommended') ||
            line.toLowerCase().includes('should') ||
            line.toLowerCase().includes('must')) {
          bestPractices.push(line.trim())
        }
      })
    }
    
    return bestPractices.length > 0 ? bestPractices.slice(0, 5) : ['Follow industry best practices']
  }

  /**
   * Get fallback content when AI generation fails
   */
  private getFallbackContent(template: Template, context: TemplateIntegrationContext): string {
    return `
# ${context.contentType} Document - Template-Based Generation

## Template Information
- **Template Name**: ${template.name}
- **Template Category**: ${template.category}
- **Template Industry**: ${template.industry}
- **Content Type**: ${context.contentType}

## Document Structure
This document follows the structure and format of the selected template: "${template.name}"

## Project Context
- **Industry**: ${context.industry}
- **Requirements**: ${context.requirements || 'To be specified'}
- **Additional Specifications**: ${context.additionalSpecs || 'None provided'}

## Template Standards
${template.standards?.map(std => `- ${std}`).join('\n') || '- Industry standard compliance'}

## Next Steps
1. Review the template structure
2. Customize content for your specific project
3. Add project-specific details
4. Validate against industry standards
5. Finalize and approve the document

---
*Note: This is a template-based document. Please customize it according to your specific project requirements and industry standards.*
    `.trim()
  }

  /**
   * Get template recommendations for a project
   */
  async getTemplateRecommendations(
    contentType: string,
    industry: string
  ): Promise<Template[]> {
    try {
      const templates = await templateService.getTemplatesForGeneration(contentType, industry)
      
      // Sort by relevance (download count, industry match, etc.)
      return templates.sort((a, b) => {
        // Prioritize industry-specific templates
        const aIndustryMatch = a.industry === industry ? 1 : 0
        const bIndustryMatch = b.industry === industry ? 1 : 0
        
        if (aIndustryMatch !== bIndustryMatch) {
          return bIndustryMatch - aIndustryMatch
        }
        
        // Then by download count
        return b.download_count - a.download_count
      })
    } catch (error) {
      console.error('Error getting template recommendations:', error)
      return []
    }
  }

  /**
   * Validate template compatibility with project requirements
   */
  validateTemplateCompatibility(
    template: Template,
    requirements: string[]
  ): { compatible: boolean; issues: string[]; recommendations: string[] } {
    const issues: string[] = []
    const recommendations: string[] = []

    // Check content type compatibility
    if (!requirements.some(req => req.toLowerCase().includes(template.content_type.toLowerCase()))) {
      issues.push(`Template content type (${template.content_type}) may not match project requirements`)
      recommendations.push('Consider reviewing project requirements and template alignment')
    }

    // Check industry compatibility
    if (template.industry !== 'general' && !requirements.some(req => req.toLowerCase().includes(template.industry))) {
      issues.push(`Template industry (${template.industry}) may not match project industry`)
      recommendations.push('Consider industry-specific templates for better alignment')
    }

    // Check standards compatibility
    if (template.standards && template.standards.length > 0) {
      const hasStandardsRequirement = requirements.some(req => 
        req.toLowerCase().includes('standard') || 
        req.toLowerCase().includes('compliance')
      )
      
      if (!hasStandardsRequirement) {
        recommendations.push('Template includes standards compliance - ensure project requirements align')
      }
    }

    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    }
  }
}

export const templateIntegrationService = new TemplateIntegrationService()




