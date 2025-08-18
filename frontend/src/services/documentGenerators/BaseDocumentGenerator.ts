import { Document } from '../../types/index'
import {
  DocumentGenerationRequest,
  DocumentGenerationResult,
  DocumentGenerationMetadata,
  DocumentQualityMetrics,

  GenerationPipeline,
  GenerationContext,
  Validator,
  ValidationResult,
  PostProcessor,
  DocumentStandard
} from './types'

export default abstract class BaseDocumentGenerator {
  protected standard: DocumentStandard
  protected pipeline: GenerationPipeline
  protected validators: Validator[]
  protected postProcessors: PostProcessor[]

  constructor(standard: DocumentStandard) {
    this.standard = standard
    this.validators = []
    this.postProcessors = []
    this.pipeline = this.createPipeline()
  }

  abstract generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResult>

  protected abstract createPipeline(): GenerationPipeline

  protected async executePipeline(context: GenerationContext): Promise<GenerationContext> {
    console.log(`Executing pipeline: ${this.pipeline.name}`)
    
    for (const step of this.pipeline.steps) {
      try {
        console.log(`Executing step: ${step.name}`)
        context = await step.execute(context)
      } catch (error) {
        console.error(`Error in step ${step.name}:`, error)
        context.errors.push(`Step ${step.name} failed: ${error}`)
      }
    }

    return context
  }

  protected async validateDocument(document: Document): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []
    
    for (const validator of this.validators) {
      try {
        const result = validator.validate(document)
        results.push(result)
      } catch (error) {
        console.error(`Validation error in ${validator.name}:`, error)
        results.push({
          isValid: false,
          errors: [`Validation failed: ${error}`],
          warnings: [],
          score: 0
        })
      }
    }

    return results
  }

  protected async postProcessDocument(document: Document): Promise<Document> {
    let processedDocument = document
    
    for (const processor of this.postProcessors) {
      try {
        processedDocument = await processor.process(processedDocument)
      } catch (error) {
        console.error(`Post-processing error in ${processor.name}:`, error)
      }
    }

    return processedDocument
  }

  protected calculateQualityMetrics(document: Document, validationResults: ValidationResult[]): DocumentQualityMetrics {
    const completeness = this.calculateCompleteness(document)
    const consistency = this.calculateConsistency(document)
    const clarity = this.calculateClarity(document)
    const compliance = this.calculateCompliance(validationResults)

    const overallScore = (completeness + consistency + clarity + compliance) / 4

    const issues = this.identifyQualityIssues(document, validationResults)

    return {
      completeness,
      consistency,
      clarity,
      compliance,
      overallScore,
      issues
    }
  }

  protected calculateCompleteness(document: Document): number {
    const requiredSections = this.standard.sections.filter(s => s.required)
    const presentSections = requiredSections.filter(section => {
      // Check if section exists in document
      return document.content.sections.some(s => s.id === section.id)
    })

    return (presentSections.length / requiredSections.length) * 100
  }

  protected calculateConsistency(document: Document): number {
    // Check for consistency in terminology, formatting, etc.
    let consistencyScore = 100


    // Check for consistent terminology
    const terms = this.extractTerms(document)
    const termFrequency = new Map<string, number>()
    
    terms.forEach(term => {
      termFrequency.set(term, (termFrequency.get(term) || 0) + 1)
    })

    // Penalize inconsistent terminology
    const inconsistentTerms = Array.from(termFrequency.entries())
      .filter(([_term, count]) => count === 1)
      .length

    consistencyScore -= inconsistentTerms * 5

    return Math.max(0, consistencyScore)
  }

  protected calculateClarity(document: Document): number {
    // Analyze readability and clarity
    let clarityScore = 100

    // Check average sentence length
    const sentences = this.extractSentences(document)
    const avgSentenceLength = sentences.reduce((sum, sentence) => 
      sum + sentence.split(' ').length, 0) / sentences.length

    if (avgSentenceLength > 25) {
      clarityScore -= 20
    }

    // Check for passive voice
    const passiveVoiceCount = sentences.filter(sentence => 
      sentence.toLowerCase().includes('is') || sentence.toLowerCase().includes('are')
    ).length

    clarityScore -= (passiveVoiceCount / sentences.length) * 30

    return Math.max(0, clarityScore)
  }

  protected calculateCompliance(validationResults: ValidationResult[]): number {
    if (validationResults.length === 0) return 100

    const totalScore = validationResults.reduce((sum, result) => sum + result.score, 0)
    return totalScore / validationResults.length
  }

  protected identifyQualityIssues(document: Document, validationResults: ValidationResult[]) {
    const issues: any[] = []

    // Add validation issues
    validationResults.forEach(result => {
      result.errors.forEach(error => {
        issues.push({
          type: 'error',
          section: 'validation',
          message: error,
          severity: 'high'
        })
      })

      result.warnings.forEach(warning => {
        issues.push({
          type: 'warning',
          section: 'validation',
          message: warning,
          severity: 'medium'
        })
      })
    })

    // Add completeness issues
    const missingSections = this.standard.sections.filter(section => 
      section.required && !document.content.sections.some(s => s.id === section.id)
    )

    missingSections.forEach(section => {
      issues.push({
        type: 'error',
        section: section.id,
        message: `Missing required section: ${section.title}`,
        severity: 'high',
        suggestion: `Add the ${section.title} section to complete the document`
      })
    })

    return issues
  }

  protected extractTerms(document: Document): string[] {
    const text = document.content.sections.map(s => s.content).join(' ')
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    return words.filter(word => word.length > 3)
  }

  protected extractSentences(document: Document): string[] {
    const text = document.content.sections.map(s => s.content).join(' ')
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  }

  protected createGenerationMetadata(
    startTime: number,
    algorithmsUsed: string[],
    sectionsGenerated: number,
    requirementsExtracted: number,
    warnings: string[],
    recommendations: string[]
  ): DocumentGenerationMetadata {
    const endTime = Date.now()
    
    return {
      generationTime: endTime - startTime,
      algorithmsUsed,
      sectionsGenerated,
      requirementsExtracted,
      confidence: this.calculateConfidence(sectionsGenerated, requirementsExtracted),
      warnings,
      recommendations
    }
  }

  protected calculateConfidence(sectionsGenerated: number, requirementsExtracted: number): number {
    // Simple confidence calculation based on completeness
    const sectionConfidence = Math.min(sectionsGenerated / this.standard.sections.length, 1) * 100
    const requirementConfidence = Math.min(requirementsExtracted / 10, 1) * 100 // Assuming 10 is a good baseline
    
    return (sectionConfidence + requirementConfidence) / 2
  }

  protected addValidator(validator: Validator): void {
    this.validators.push(validator)
  }

  protected addPostProcessor(processor: PostProcessor): void {
    this.postProcessors.push(processor)
  }

  public getStandard(): DocumentStandard {
    return this.standard
  }

  public getPipeline(): GenerationPipeline {
    return this.pipeline
  }
}
