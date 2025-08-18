import { DocumentGenerationRequest, DocumentGenerationResult } from './types'
import BaseDocumentGenerator from './BaseDocumentGenerator'
import SRSGenerator from './SRSGenerator'
import SDDGenerator from './SDDGenerator'
import TestCasesGenerator from './TestCasesGenerator'
import ConceptNoteGenerator from './ConceptNoteGenerator'
import ProjectProgressReportGenerator from './ProjectProgressReportGenerator'
import UserManualGenerator from './UserManualGenerator'
import FeasibilityStudyGenerator from './FeasibilityStudyGenerator'

export default class DocumentGeneratorFactory {
  private static generators: Map<string, BaseDocumentGenerator> = new Map()
  private static initialized = false

  private static async initializeGenerators(): Promise<void> {
    if (this.initialized) return

    console.log('Initializing document generators...')

    // Initialize all document generators
    const generators = [
      { type: 'SRS', generator: new SRSGenerator() },
      { type: 'SDD', generator: new SDDGenerator() },
      { type: 'Test Cases', generator: new TestCasesGenerator() },
      { type: 'Concept Note', generator: new ConceptNoteGenerator() },
      { type: 'Project Progress Report', generator: new ProjectProgressReportGenerator() },
      { type: 'User Manual', generator: new UserManualGenerator() },
      { type: 'Feasibility Study', generator: new FeasibilityStudyGenerator() }
    ]

    for (const { type, generator } of generators) {
      this.generators.set(type, generator)
      console.log(`Initialized generator for: ${type}`)
    }

    this.initialized = true
    console.log('All document generators initialized successfully!')
  }

  static async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResult> {
    await this.initializeGenerators()

    const generator = this.generators.get(request.documentType)
    if (!generator) {
      throw new Error(`No generator found for document type: ${request.documentType}`)
    }

    console.log(`Generating ${request.documentType} document...`)
    return await generator.generateDocument(request)
  }

  static getSupportedDocumentTypes(): string[] {
    return Array.from(this.generators.keys())
  }

  static getGenerator(documentType: string): BaseDocumentGenerator | undefined {
    return this.generators.get(documentType)
  }

  static async validateDocumentType(documentType: string): Promise<boolean> {
    await this.initializeGenerators()
    return this.generators.has(documentType)
  }

  static getGeneratorCapabilities(documentType: string): any {
    const generator = this.generators.get(documentType)
    if (!generator) {
      return null
    }

    const standard = generator.getStandard()
    const pipeline = generator.getPipeline()

    return {
      documentType,
      standard: {
        name: standard.name,
        version: standard.version,
        sections: standard.sections.map(s => ({
          id: s.id,
          title: s.title,
          required: s.required,
          minWordCount: s.minWordCount
        }))
      },
      pipeline: {
        name: pipeline.name,
        steps: pipeline.steps.map(s => ({
          name: s.name,
          description: s.description,
          dependencies: s.dependencies
        }))
      }
    }
  }

  static async getDocumentTemplate(documentType: string): Promise<any> {
    const generator = this.generators.get(documentType)
    if (!generator) {
      throw new Error(`No generator found for document type: ${documentType}`)
    }

    const standard = generator.getStandard()
    return {
      documentType,
      sections: standard.sections.map(section => ({
        id: section.id,
        title: section.title,
        required: section.required,
        minWordCount: section.minWordCount,
        maxWordCount: section.maxWordCount,
        subsections: section.subsections.map(sub => ({
          id: sub.id,
          title: sub.title,
          required: sub.required,
          content: sub.content
        }))
      })),
      requirements: standard.requirements.map(req => ({
        type: req.type,
        description: req.description,
        mandatory: req.mandatory,
        validation: req.validation
      }))
    }
  }

  static async estimateGenerationTime(documentType: string, complexity: 'simple' | 'medium' | 'complex' = 'medium'): Promise<number> {
    const generator = this.generators.get(documentType)
    if (!generator) {
      throw new Error(`No generator found for document type: ${documentType}`)
    }

    const pipeline = generator.getPipeline()
    const baseTime = pipeline.steps.length * 1000 // 1 second per step base time

    // Adjust based on complexity
    const complexityMultiplier = {
      simple: 0.5,
      medium: 1.0,
      complex: 2.0
    }

    return Math.round(baseTime * complexityMultiplier[complexity])
  }

  static async getQualityMetrics(documentType: string): Promise<any> {
    const generator = this.generators.get(documentType)
    if (!generator) {
      throw new Error(`No generator found for document type: ${documentType}`)
    }

    return {
      documentType,
      qualityFactors: [
        {
          name: 'Completeness',
          description: 'Percentage of required sections and content present',
          weight: 0.3
        },
        {
          name: 'Consistency',
          description: 'Terminology and formatting consistency',
          weight: 0.25
        },
        {
          name: 'Clarity',
          description: 'Readability and understandability',
          weight: 0.25
        },
        {
          name: 'Compliance',
          description: 'Adherence to standards and requirements',
          weight: 0.2
        }
      ],
      validationRules: generator.getStandard().validators
    }
  }

  static async getGenerationHistory(documentType: string): Promise<any[]> {
    // This would typically fetch from a database
    // For now, return mock data
    return [
      {
        id: '1',
        documentType,
        generatedAt: new Date().toISOString(),
        generationTime: 5000,
        qualityScore: 85,
        status: 'completed'
      },
      {
        id: '2',
        documentType,
        generatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        generationTime: 4200,
        qualityScore: 88,
        status: 'completed'
      }
    ]
  }

  static async getRecommendedImprovements(_documentType: string, qualityMetrics: any): Promise<string[]> {
    const recommendations: string[] = []

    if (qualityMetrics.completeness < 90) {
      recommendations.push('Add missing required sections to improve completeness')
    }

    if (qualityMetrics.consistency < 85) {
      recommendations.push('Review and standardize terminology usage')
    }

    if (qualityMetrics.clarity < 80) {
      recommendations.push('Simplify complex sentences and reduce passive voice')
    }

    if (qualityMetrics.compliance < 95) {
      recommendations.push('Ensure all sections meet standard requirements')
    }

    return recommendations
  }
}
