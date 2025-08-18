import { Document } from '../../types/index'

export interface DocumentGenerationRequest {
  documentType: string
  projectId: string
  systemRequirements: string
  additionalSpecs: string
  projectContext?: any
}

export interface DocumentGenerationResult {
  document: Document
  metadata: DocumentGenerationMetadata
  quality: DocumentQualityMetrics
  traceability: TraceabilityMatrix
}

export interface DocumentGenerationMetadata {
  generationTime: number
  algorithmsUsed: string[]
  sectionsGenerated: number
  requirementsExtracted: number
  confidence: number
  warnings: string[]
  recommendations: string[]
}

export interface DocumentQualityMetrics {
  completeness: number
  consistency: number
  clarity: number
  compliance: number
  overallScore: number
  issues: QualityIssue[]
}

export interface QualityIssue {
  type: 'error' | 'warning' | 'info'
  section: string
  message: string
  severity: 'high' | 'medium' | 'low'
  suggestion?: string
}

export interface TraceabilityMatrix {
  requirements: Requirement[]
  links: TraceabilityLink[]
  coverage: number
  gaps: string[]
}

export interface Requirement {
  id: string
  type: 'FR' | 'NFR' | 'ASSUMPTION' | 'CONSTRAINT' | 'RISK' | 'STAKEHOLDER' | 'BUSINESS_RULE'
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  source: string
  dependencies: string[]
  acceptanceCriteria: string[]
  status: 'identified' | 'analyzed' | 'approved' | 'implemented' | 'tested'
}

export interface TraceabilityLink {
  from: string
  to: string
  type: 'implements' | 'tests' | 'depends_on' | 'mitigates' | 'validates' | 'constrains'
  confidence: number
  rationale: string
}

// Document-specific interfaces
export interface SRSDocument {
  sections: SRSSections
  requirements: FunctionalRequirement[]
  nonFunctionalRequirements: NonFunctionalRequirement[]
  useCases: UseCase[]
  systemInterfaces: SystemInterface[]
}

export interface SRSSections {
  introduction: Section
  systemOverview: Section
  functionalRequirements: Section
  nonFunctionalRequirements: Section
  systemInterfaces: Section
  constraints: Section
  assumptions: Section
  glossary: Section
}

export interface SDDDocument extends Document {
  sections: SDDSections
  architecture: SystemArchitecture
  components: Component[]
  dataModels: DataModel[]
  algorithms: Algorithm[]
}

export interface SDDSections {
  introduction: Section
  systemArchitecture: Section
  componentDesign: Section
  interfaceDesign: Section
  dataDesign: Section
  algorithms: Section
  testingStrategy: Section
}

export interface TestCasesDocument extends Document {
  sections: TestCasesSections
  testPlan: TestPlan
  testCases: TestCase[]
  testScenarios: TestScenario[]
  testData: TestData[]
}

export interface TestCasesSections {
  introduction: Section
  testStrategy: Section
  testPlan: Section
  testCases: Section
  testScenarios: Section
  testData: Section
  testExecution: Section
}

export interface ConceptNoteDocument extends Document {
  sections: ConceptNoteSections
  businessCase: BusinessCase
  stakeholders: Stakeholder[]
  risks: Risk[]
  timeline: Timeline[]
}

export interface ConceptNoteSections {
  executiveSummary: Section
  problemStatement: Section
  proposedSolution: Section
  businessCase: Section
  stakeholders: Section
  risks: Section
  timeline: Section
  nextSteps: Section
}

export interface ProjectProgressReportDocument extends Document {
  sections: ProgressReportSections
  milestones: Milestone[]
  deliverables: Deliverable[]
  issues: Issue[]
  risks: Risk[]
  budget: BudgetInfo
}

export interface ProgressReportSections {
  executiveSummary: Section
  projectOverview: Section
  progressSummary: Section
  milestones: Section
  deliverables: Section
  issues: Section
  risks: Section
  budget: Section
  nextPeriod: Section
}

// Detailed type definitions
export interface Section {
  id: string
  title: string
  content: string
  subsections: Subsection[]
  requirements: string[]
  wordCount: number
  status: 'draft' | 'review' | 'approved'
}

export interface Subsection {
  id: string
  title: string
  content: string
  requirements: string[]
}

export interface FunctionalRequirement {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  complexity: 'simple' | 'medium' | 'complex'
  acceptanceCriteria: string[]
  dependencies: string[]
  useCases: string[]
}

export interface NonFunctionalRequirement {
  id: string
  category: 'performance' | 'security' | 'reliability' | 'usability' | 'maintainability' | 'scalability'
  title: string
  description: string
  metrics: string[]
  constraints: string[]
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface UseCase {
  id: string
  title: string
  description: string
  actors: string[]
  preconditions: string[]
  postconditions: string[]
  mainFlow: string[]
  alternativeFlows: string[][]
  exceptions: string[]
}

export interface SystemInterface {
  id: string
  name: string
  type: 'user' | 'hardware' | 'software' | 'communication'
  description: string
  inputs: string[]
  outputs: string[]
  protocols: string[]
}

export interface SystemArchitecture {
  type: 'layered' | 'microservices' | 'monolithic' | 'event-driven' | 'service-oriented'
  description: string
  layers: ArchitectureLayer[]
  components: Component[]
  interfaces: Interface[]
}

export interface ArchitectureLayer {
  name: string
  description: string
  responsibilities: string[]
  components: string[]
}

export interface Component {
  id: string
  name: string
  type: 'service' | 'module' | 'class' | 'function'
  description: string
  responsibilities: string[]
  interfaces: Interface[]
  dependencies: string[]
}

export interface Interface {
  id: string
  name: string
  type: 'API' | 'UI' | 'database' | 'external'
  description: string
  methods: Method[]
  dataStructures: DataStructure[]
}

export interface Method {
  name: string
  description: string
  parameters: Parameter[]
  returnType: string
  exceptions: string[]
}

export interface Parameter {
  name: string
  type: string
  description: string
  required: boolean
  defaultValue?: any
}

export interface DataStructure {
  name: string
  type: 'class' | 'interface' | 'struct' | 'enum'
  fields: Field[]
  methods: Method[]
}

export interface Field {
  name: string
  type: string
  description: string
  constraints: string[]
}

export interface DataModel {
  id: string
  name: string
  type: 'ERD' | 'UML' | 'JSON' | 'XML'
  entities: Entity[]
  relationships: Relationship[]
}

export interface Entity {
  id: string
  name: string
  attributes: Attribute[]
  primaryKey: string
  foreignKeys: string[]
}

export interface Attribute {
  name: string
  type: string
  constraints: string[]
  description: string
}

export interface Relationship {
  from: string
  to: string
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  cardinality: string
  description: string
}

export interface Algorithm {
  id: string
  name: string
  description: string
  complexity: string
  pseudocode: string[]
  inputs: string[]
  outputs: string[]
  performance: string
}

export interface TestPlan {
  id: string
  title: string
  objectives: string[]
  scope: string[]
  approach: string
  resources: string[]
  schedule: string
  risks: string[]
}

export interface TestCase {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  type: 'functional' | 'non-functional' | 'integration' | 'system' | 'user-acceptance'
  preconditions: string[]
  testSteps: TestStep[]
  expectedResults: string[]
  actualResults?: string[]
  status: 'not-executed' | 'passed' | 'failed' | 'blocked'
}

export interface TestStep {
  stepNumber: number
  action: string
  expectedResult: string
  actualResult?: string
}

export interface TestScenario {
  id: string
  title: string
  description: string
  testCases: string[]
  dataSets: string[]
  environment: string
}

export interface TestData {
  id: string
  name: string
  type: 'input' | 'output' | 'expected'
  format: string
  sample: any
  constraints: string[]
}

export interface BusinessCase {
  problem: string
  solution: string
  benefits: string[]
  costs: Cost[]
  roi: number
  paybackPeriod: string
  risks: Risk[]
}

export interface Cost {
  category: string
  amount: number
  currency: string
  period: string
  description: string
}

export interface Stakeholder {
  id: string
  name: string
  role: string
  interests: string[]
  influence: 'high' | 'medium' | 'low'
  requirements: string[]
}

export interface Risk {
  id: string
  title: string
  description: string
  probability: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  mitigation: string
  owner: string
}

export interface Timeline {
  phase: string
  startDate: string
  endDate: string
  deliverables: string[]
  milestones: string[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed'
  deliverables: string[]
  dependencies: string[]
}

export interface Deliverable {
  id: string
  title: string
  description: string
  type: 'document' | 'code' | 'design' | 'test'
  status: 'not-started' | 'in-progress' | 'completed' | 'review'
  dueDate: string
  assignedTo: string
}

export interface Issue {
  id: string
  title: string
  description: string
  type: 'bug' | 'feature' | 'task' | 'improvement'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignedTo: string
  dueDate: string
}

export interface BudgetInfo {
  totalBudget: number
  spent: number
  remaining: number
  currency: string
  breakdown: BudgetBreakdown[]
}

export interface BudgetBreakdown {
  category: string
  budgeted: number
  actual: number
  variance: number
  description: string
}

// Document generation pipeline interfaces
export interface GenerationPipeline {
  name: string
  steps: GenerationStep[]
  validators: Validator[]
  postProcessors: PostProcessor[]
}

export interface GenerationStep {
  name: string
  description: string
  execute: (context: GenerationContext) => Promise<GenerationContext>
  dependencies: string[]
}

export interface GenerationContext {
  request: DocumentGenerationRequest
  intermediateResults: Map<string, any>
  metadata: DocumentGenerationMetadata
  errors: string[]
  warnings: string[]
}

export interface Validator {
  name: string
  validate: (document: Document) => ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number
}

export interface PostProcessor {
  name: string
  process: (document: Document) => Promise<Document>
}

// Document standards and templates
export interface DocumentStandard {
  name: string
  version: string
  sections: StandardSection[]
  requirements: StandardRequirement[]
  validators: string[]
}

export interface StandardSection {
  id: string
  title: string
  required: boolean
  minWordCount: number
  maxWordCount?: number
  subsections: StandardSubsection[]
}

export interface StandardSubsection {
  id: string
  title: string
  required: boolean
  content: string
}

export interface StandardRequirement {
  type: string
  description: string
  mandatory: boolean
  validation: string
}
