import React, { useState } from 'react'
import { 
  RectangleStackIcon,
  ArrowPathIcon,
  CircleStackIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface UseCase {
  id: string
  name: string
  description: string
  actor: string
  preconditions: string[]
  postconditions: string[]
  mainFlow: string[]
  alternativeFlows: string[]
  requirements: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface SequenceDiagram {
  id: string
  name: string
  description: string
  actors: string[]
  components: string[]
  interactions: Array<{
    id: string
    from: string
    to: string
    message: string
    type: 'request' | 'response' | 'notification'
    sequence: number
  }>
  requirements: string[]
}

interface StateTransition {
  id: string
  name: string
  description: string
  states: Array<{
    id: string
    name: string
    description: string
    isInitial: boolean
    isFinal: boolean
  }>
  transitions: Array<{
    id: string
    from: string
    to: string
    trigger: string
    condition?: string
    action?: string
  }>
  requirements: string[]
}

interface DataFlow {
  id: string
  name: string
  description: string
  processes: Array<{
    id: string
    name: string
    description: string
    inputs: string[]
    outputs: string[]
  }>
  dataStores: Array<{
    id: string
    name: string
    description: string
    dataType: string
  }>
  externalEntities: Array<{
    id: string
    name: string
    description: string
    type: 'user' | 'system' | 'database'
  }>
  flows: Array<{
    id: string
    from: string
    to: string
    data: string
    frequency: 'continuous' | 'periodic' | 'on-demand'
  }>
  requirements: string[]
}

interface AdvancedModelingToolsProps {
  // Add any props if needed
}

const AdvancedModelingTools: React.FC<AdvancedModelingToolsProps> = () => {
  const [viewMode, setViewMode] = useState<'useCase' | 'sequence' | 'state' | 'dataFlow'>('useCase')
  // const [showCreateModal, setShowCreateModal] = useState(false)
  // const [editingModel, setEditingModel] = useState<any>(null)

  // Local delete function since we're not using props for this demo
  const handleDelete = (id: string) => {
    // In a real app, this would call the prop function or API
    console.log('Delete model with id:', id)
  }

  // Sample data - in real app this would come from props or API
  const [useCases] = useState<UseCase[]>([
    {
      id: '1',
      name: 'User Authentication',
      description: 'User logs into the system with credentials',
      actor: 'User',
      preconditions: ['User has valid account', 'System is accessible'],
      postconditions: ['User is authenticated', 'Session is created'],
      mainFlow: [
        'User enters username and password',
        'System validates credentials',
        'System creates user session',
        'User is redirected to dashboard'
      ],
      alternativeFlows: [
        'Invalid credentials - show error message',
        'Account locked - show lock message'
      ],
      requirements: ['REQ-001', 'REQ-002'],
      priority: 'high'
    }
  ])

  const [sequenceDiagrams] = useState<SequenceDiagram[]>([
    {
      id: '1',
      name: 'User Login Sequence',
      description: 'Sequence of interactions during user login',
      actors: ['User'],
      components: ['Web Interface', 'Authentication Service', 'User Database'],
      interactions: [
        {
          id: '1',
          from: 'User',
          to: 'Web Interface',
          message: 'Enter credentials',
          type: 'request',
          sequence: 1
        },
        {
          id: '2',
          from: 'Web Interface',
          to: 'Authentication Service',
          message: 'Validate credentials',
          type: 'request',
          sequence: 2
        },
        {
          id: '3',
          from: 'Authentication Service',
          to: 'User Database',
          message: 'Query user data',
          type: 'request',
          sequence: 3
        }
      ],
      requirements: ['REQ-001']
    }
  ])

  const [stateTransitions] = useState<StateTransition[]>([
    {
      id: '1',
      name: 'User Session States',
      description: 'Different states of user session',
      states: [
        { id: '1', name: 'Logged Out', description: 'User not authenticated', isInitial: true, isFinal: false },
        { id: '2', name: 'Authenticating', description: 'Credentials being verified', isInitial: false, isFinal: false },
        { id: '3', name: 'Logged In', description: 'User authenticated and active', isInitial: false, isFinal: false },
        { id: '4', name: 'Session Expired', description: 'User session has timed out', isInitial: false, isFinal: true }
      ],
      transitions: [
        { id: '1', from: 'Logged Out', to: 'Authenticating', trigger: 'Login attempt' },
        { id: '2', from: 'Authenticating', to: 'Logged In', trigger: 'Valid credentials' },
        { id: '3', from: 'Authenticating', to: 'Logged Out', trigger: 'Invalid credentials' },
        { id: '4', from: 'Logged In', to: 'Session Expired', trigger: 'Timeout' }
      ],
      requirements: ['REQ-001', 'REQ-003']
    }
  ])

  const [dataFlows] = useState<DataFlow[]>([
    {
      id: '1',
      name: 'User Data Management',
      description: 'Data flow for user information management',
      processes: [
        {
          id: '1',
          name: 'User Registration',
          description: 'Process new user registration',
          inputs: ['User details', 'Email verification'],
          outputs: ['User account', 'Welcome email']
        }
      ],
      dataStores: [
        {
          id: '1',
          name: 'User Database',
          description: 'Stores user account information',
          dataType: 'User Profile'
        }
      ],
      externalEntities: [
        {
          id: '1',
          name: 'User',
          description: 'End user of the system',
          type: 'user'
        }
      ],
      flows: [
        {
          id: '1',
          from: 'User',
          to: 'User Registration',
          data: 'Registration form data',
          frequency: 'on-demand'
        }
      ],
      requirements: ['REQ-001', 'REQ-004']
    }
  ])

  const renderUseCaseView = () => (
    <div className="space-y-4">
      {useCases.map(useCase => (
        <div key={useCase.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{useCase.name}</h4>
              <p className="text-sm text-gray-600">{useCase.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                useCase.priority === 'critical' ? 'bg-red-100 text-red-700' :
                useCase.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                useCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {useCase.priority}
              </span>
              <button
                onClick={() => {/* setEditingModel(useCase) */}}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(useCase.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Actor</h5>
              <p className="text-sm text-gray-600">{useCase.actor}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Requirements</h5>
              <div className="flex flex-wrap gap-1">
                {useCase.requirements.map(req => (
                  <span key={req} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Preconditions</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {useCase.preconditions.map((pre, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {pre}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Postconditions</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {useCase.postconditions.map((post, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {post}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-medium text-gray-900 mb-2">Main Flow</h5>
            <ol className="text-sm text-gray-600 space-y-1">
              {useCase.mainFlow.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {useCase.alternativeFlows.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Alternative Flows</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {useCase.alternativeFlows.map((flow, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    {flow}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderSequenceView = () => (
    <div className="space-y-4">
      {sequenceDiagrams.map(diagram => (
        <div key={diagram.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{diagram.name}</h4>
              <p className="text-sm text-gray-600">{diagram.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* setEditingModel(diagram) */}}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(diagram.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Actors</h5>
              <div className="flex flex-wrap gap-1">
                {diagram.actors.map(actor => (
                  <span key={actor} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Components</h5>
              <div className="flex flex-wrap gap-1">
                {diagram.components.map(component => (
                  <span key={component} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {component}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-2">Interactions</h5>
            <div className="space-y-2">
              {diagram.interactions
                .sort((a, b) => a.sequence - b.sequence)
                .map(interaction => (
                  <div key={interaction.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {interaction.sequence}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{interaction.from}</span>
                    <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{interaction.to}</span>
                    <span className="text-sm text-gray-600 flex-1">{interaction.message}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      interaction.type === 'request' ? 'bg-blue-100 text-blue-700' :
                      interaction.type === 'response' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {interaction.type}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderStateView = () => (
    <div className="space-y-4">
      {stateTransitions.map(state => (
        <div key={state.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{state.name}</h4>
              <p className="text-sm text-gray-600">{state.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* setEditingModel(state) */}}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(state.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">States</h5>
              <div className="space-y-2">
                {state.states.map(stateItem => (
                  <div key={stateItem.id} className={`p-2 rounded border ${
                    stateItem.isInitial ? 'border-green-300 bg-green-50' :
                    stateItem.isFinal ? 'border-red-300 bg-red-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">{stateItem.name}</span>
                      {stateItem.isInitial && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Initial
                        </span>
                      )}
                      {stateItem.isFinal && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Final
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stateItem.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Transitions</h5>
              <div className="space-y-2">
                {state.transitions.map(transition => (
                  <div key={transition.id} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-blue-900">{transition.from}</span>
                      <ArrowPathIcon className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-900">{transition.to}</span>
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      <div>Trigger: {transition.trigger}</div>
                      {transition.condition && <div>Condition: {transition.condition}</div>}
                      {transition.action && <div>Action: {transition.action}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderDataFlowView = () => (
    <div className="space-y-4">
      {dataFlows.map(dataFlow => (
        <div key={dataFlow.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{dataFlow.name}</h4>
              <p className="text-sm text-gray-600">{dataFlow.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* setEditingModel(dataFlow) */}}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(dataFlow.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Processes</h5>
              <div className="space-y-2">
                {dataFlow.processes.map(process => (
                  <div key={process.id} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="font-medium text-sm text-blue-900">{process.name}</div>
                    <p className="text-xs text-blue-700 mt-1">{process.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Data Stores</h5>
              <div className="space-y-2">
                {dataFlow.dataStores.map(store => (
                  <div key={store.id} className="p-2 bg-green-50 rounded border border-green-200">
                    <div className="font-medium text-sm text-green-900">{store.name}</div>
                    <p className="text-xs text-green-700 mt-1">{store.dataType}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">External Entities</h5>
              <div className="space-y-2">
                {dataFlow.externalEntities.map(entity => (
                  <div key={entity.id} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="font-medium text-sm text-yellow-900">{entity.name}</div>
                    <p className="text-xs text-yellow-700 mt-1">{entity.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-medium text-gray-900 mb-2">Data Flows</h5>
            <div className="space-y-2">
              {dataFlow.flows.map(flow => (
                <div key={flow.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-medium text-sm text-gray-700">{flow.from}</span>
                  <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-sm text-gray-700">{flow.to}</span>
                  <span className="text-sm text-gray-600 flex-1">{flow.data}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    flow.frequency === 'continuous' ? 'bg-red-100 text-red-700' :
                    flow.frequency === 'periodic' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {flow.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Modeling Tools</h2>
          <p className="text-gray-600">Create and manage UML diagrams and modeling artifacts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {/* setShowCreateModal(true) */}}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Model
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('useCase')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'useCase' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <RectangleStackIcon className="h-4 w-4 inline mr-2" />
          Use Cases ({useCases.length})
        </button>
        <button
          onClick={() => setViewMode('sequence')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'sequence' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowPathIcon className="h-4 w-4 inline mr-2" />
          Sequence Diagrams ({sequenceDiagrams.length})
        </button>
        <button
          onClick={() => setViewMode('state')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'state' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CircleStackIcon className="h-4 w-4 inline mr-2" />
          State Transitions ({stateTransitions.length})
        </button>
        <button
          onClick={() => setViewMode('dataFlow')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'dataFlow' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChartBarIcon className="h-4 w-4 inline mr-2" />
          Data Flows ({dataFlows.length})
        </button>
      </div>

      {/* Content */}
      {viewMode === 'useCase' && renderUseCaseView()}
      {viewMode === 'sequence' && renderSequenceView()}
      {viewMode === 'state' && renderStateView()}
      {viewMode === 'dataFlow' && renderDataFlowView()}
    </div>
  )
}

export default AdvancedModelingTools
