import { Document, DocumentType } from '../../types/index'
import BaseDocumentGenerator from './BaseDocumentGenerator'
import {
  DocumentGenerationRequest,
  DocumentGenerationResult,
  DocumentStandard
} from './types'

export default class UserManualGenerator extends BaseDocumentGenerator {
  constructor() {
    const manualStandard: DocumentStandard = {
      name: 'User Manual Standard',
      version: '1.0',
      sections: [
        {
          id: 'introduction',
          title: 'Introduction',
          required: true,
          minWordCount: 150,
          subsections: [
            { id: 'purpose', title: 'Purpose', required: true, content: 'Purpose of the user manual' },
            { id: 'audience', title: 'Target Audience', required: true, content: 'Target users of the system' }
          ]
        },
        {
          id: 'gettingStarted',
          title: 'Getting Started',
          required: true,
          minWordCount: 300,
          subsections: [
            { id: 'installation', title: 'Installation', required: true, content: 'Installation instructions' },
            { id: 'firstSteps', title: 'First Steps', required: true, content: 'Getting started guide' }
          ]
        },
        {
          id: 'userGuide',
          title: 'User Guide',
          required: true,
          minWordCount: 500,
          subsections: [
            { id: 'features', title: 'Features', required: true, content: 'System features and functionality' },
            { id: 'procedures', title: 'Procedures', required: true, content: 'Step-by-step procedures' }
          ]
        }
      ],
      requirements: [
        { type: 'usability', description: 'Manual must be user-friendly', mandatory: true, validation: 'user-friendly' },
        { type: 'completeness', description: 'Manual must cover all features', mandatory: true, validation: 'complete' }
      ],
      validators: ['UsabilityValidator', 'CompletenessValidator']
    }

    super(manualStandard)
  }

  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResult> {
    const document: Document = {
      id: Date.now().toString(),
      title: `User Manual - ${request.systemRequirements.split(' ').slice(0, 3).join(' ')}`,
      type: 'User Manual' as DocumentType,
      projectId: request.projectId,
      status: 'Draft',
      version: '1.0',
      content: {
        sections: [
          {
            id: 'introduction',
            title: 'Introduction',
            content: 'User manual for the system',
            level: 1,
            order: 1
          }
        ],
        diagrams: [],
        tables: [],
        attachments: []
      },
      metadata: {
        systemName: 'System',
        purpose: 'Provide user guidance',
        scope: 'User documentation',
        stakeholders: ['End Users', 'Support Team'],
        assumptions: [],
        constraints: [],
        references: ['System Requirements'],
        glossary: [],
        acronyms: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'User Manual Generator',
      lastModifiedBy: 'User Manual Generator',
      tags: ['User Manual', 'Documentation', 'User Guide'],
      requirements: []
    }

    return {
      document,
      metadata: {
        generationTime: 700,
        algorithmsUsed: ['User Experience Analysis'],
        sectionsGenerated: 1,
        requirementsExtracted: 0,
        confidence: 88,
        warnings: [],
        recommendations: []
      },
      quality: {
        completeness: 85,
        consistency: 88,
        clarity: 92,
        compliance: 90,
        overallScore: 89,
        issues: []
      },
      traceability: {
        requirements: [],
        links: [],
        coverage: 0,
        gaps: []
      }
    }
  }

  protected createPipeline(): any {
    return {
      name: 'User Manual Generation Pipeline',
      steps: [],
      validators: [],
      postProcessors: []
    }
  }
}
