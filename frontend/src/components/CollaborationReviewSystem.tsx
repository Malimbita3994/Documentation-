import React, { useState, useMemo } from 'react'
import {
  ChatBubbleLeftIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  PencilIcon,
  DocumentTextIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Comment {
  id: string
  requirementId: string
  authorId: string
  authorName: string
  content: string
  timestamp: string
  status: 'active' | 'resolved' | 'rejected'
  replies: Comment[]
  lineNumber?: number
  section?: string
}

interface ChangeRequest {
  id: string
  requirementId: string
  title: string
  description: string
  type: 'modification' | 'addition' | 'deletion' | 'clarification'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented'
  authorId: string
  authorName: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  impact: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
}

interface ReviewWorkflow {
  id: string
  requirementId: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'changes_requested'
  reviewers: string[]
  currentReviewer?: string
  submittedAt: string
  deadline?: string
  comments: Comment[]
  finalDecision?: 'approved' | 'rejected' | 'changes_requested'
  decisionNotes?: string
}

interface CollaborationReviewSystemProps {
  requirements: any[]
}

const CollaborationReviewSystem: React.FC<CollaborationReviewSystemProps> = ({
  requirements
}) => {
  const [viewMode, setViewMode] = useState<'comments' | 'changes' | 'reviews' | 'workflow'>('comments')
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null)



  // Sample data - in real app this would come from props or API
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      requirementId: 'REQ-001',
      authorId: 'user1',
      authorName: 'John Doe',
      content: 'This requirement needs more specific acceptance criteria',
      timestamp: '2024-01-15T10:00:00Z',
      status: 'active',
      replies: [],
      lineNumber: 15,
      section: '3.2 Functional Requirements'
    }
  ])

  const [changeRequests] = useState<ChangeRequest[]>([
    {
      id: '1',
      requirementId: 'REQ-001',
      title: 'Add performance metrics to acceptance criteria',
      description: 'The current acceptance criteria lack specific performance measurements',
      type: 'modification',
      priority: 'high',
      status: 'under_review',
      authorId: 'user1',
      authorName: 'John Doe',
      submittedAt: '2024-01-15T10:00:00Z',
      impact: 'medium',
      effort: 'low'
    }
  ])

  const [reviewWorkflows] = useState<ReviewWorkflow[]>([
    {
      id: '1',
      requirementId: 'REQ-001',
      status: 'in_review',
      reviewers: ['user2', 'user3'],
      currentReviewer: 'user2',
      submittedAt: '2024-01-15T10:00:00Z',
      deadline: '2024-01-20T10:00:00Z',
      comments: []
    }
  ])

  // Filter data based on selected requirement
  const filteredComments = useMemo(() => {
    if (!selectedRequirement) return comments
    return comments.filter(c => c.requirementId === selectedRequirement)
  }, [comments, selectedRequirement])

  const filteredChangeRequests = useMemo(() => {
    if (!selectedRequirement) return changeRequests
    return changeRequests.filter(cr => cr.requirementId === selectedRequirement)
  }, [changeRequests, selectedRequirement])

  const filteredReviewWorkflows = useMemo(() => {
    if (!selectedRequirement) return reviewWorkflows
    return reviewWorkflows.filter(rw => rw.requirementId === selectedRequirement)
  }, [reviewWorkflows, selectedRequirement])

  const renderCommentsView = () => (
    <div className="space-y-4">
      {filteredComments.map(comment => (
        <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{comment.authorName}</div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                  {comment.section && (
                    <span className="ml-2 text-blue-600">• {comment.section}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                comment.status === 'active' ? 'bg-blue-100 text-blue-700' :
                comment.status === 'resolved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {comment.status}
              </span>
              <button
                onClick={() => console.log('Edit comment:', comment)}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="text-gray-700 mb-3">{comment.content}</div>
          
          {comment.replies.length > 0 && (
            <div className="ml-8 space-y-2">
              {comment.replies.map(reply => (
                <div key={reply.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-gray-900">{reply.authorName}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{reply.content}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Reply
            </button>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              Resolve
            </button>
          </div>
        </div>
      ))}
      
      {filteredComments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-2" />
          <p>No comments for this requirement</p>
        </div>
      )}
    </div>
  )

  const renderChangeRequestsView = () => (
    <div className="space-y-4">
      {filteredChangeRequests.map(changeRequest => (
        <div key={changeRequest.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900">{changeRequest.title}</h4>
              <p className="text-sm text-gray-600">{changeRequest.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                changeRequest.priority === 'critical' ? 'bg-red-100 text-red-700' :
                changeRequest.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                changeRequest.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {changeRequest.priority}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                changeRequest.status === 'approved' ? 'bg-green-100 text-green-700' :
                changeRequest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                changeRequest.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {changeRequest.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <div className="font-medium">{changeRequest.type}</div>
            </div>
            <div>
              <span className="text-gray-600">Impact:</span>
              <div className="font-medium">{changeRequest.impact}</div>
            </div>
            <div>
              <span className="text-gray-600">Effort:</span>
              <div className="font-medium">{changeRequest.effort}</div>
            </div>
            <div>
              <span className="text-gray-600">Submitted:</span>
              <div className="font-medium">
                {new Date(changeRequest.submittedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => console.log('Edit change request:', changeRequest)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </button>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Approve
            </button>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Reject
            </button>
          </div>
        </div>
      ))}
      
      {filteredChangeRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2" />
          <p>No change requests for this requirement</p>
        </div>
      )}
    </div>
  )

  const renderReviewsView = () => (
    <div className="space-y-4">
      {filteredReviewWorkflows.map(workflow => (
        <div key={workflow.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900">Review for {workflow.requirementId}</h4>
              <p className="text-sm text-gray-600">
                Status: {workflow.status.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                workflow.status === 'approved' ? 'bg-green-100 text-green-700' :
                workflow.status === 'rejected' ? 'bg-red-100 text-red-700' :
                workflow.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {workflow.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
            <div>
              <span className="text-gray-600">Reviewers:</span>
              <div className="font-medium">{workflow.reviewers.length}</div>
            </div>
            <div>
              <span className="text-gray-600">Current:</span>
              <div className="font-medium">{workflow.currentReviewer || 'None'}</div>
            </div>
            <div>
              <span className="text-gray-600">Deadline:</span>
              <div className="font-medium">
                {workflow.deadline ? new Date(workflow.deadline).toLocaleDateString() : 'No deadline'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Start Review
            </button>
          </div>
        </div>
      ))}
      
      {filteredReviewWorkflows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <EyeIcon className="h-12 w-12 mx-auto mb-2" />
          <p>No review workflows for this requirement</p>
        </div>
      )}
    </div>
  )

  const renderWorkflowView = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Workflow</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">1</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Submit for Review</div>
            <div className="text-sm text-gray-600">Requirement is submitted for review</div>
          </div>
          <CheckIcon className="h-5 w-5 text-green-500" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">2</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Review Process</div>
            <div className="text-sm text-gray-600">Multiple reviewers examine the requirement</div>
          </div>
          <ClockIcon className="h-5 w-5 text-yellow-500" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">3</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">Decision</div>
            <div className="text-sm text-gray-600">Final approval or changes requested</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Collaboration & Review System</h2>
          <p className="text-gray-600">Manage comments, change requests, and review workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log('Show comment modal')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Comment
          </button>
          <button
            onClick={() => console.log('Show change request modal')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Change Request
          </button>
        </div>
      </div>

      {/* Requirement Selector */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Requirement</label>
        <select
          value={selectedRequirement || ''}
          onChange={(e) => setSelectedRequirement(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">All Requirements</option>
          {requirements.map(req => (
            <option key={req.id} value={req.id}>{req.id}: {req.title}</option>
          ))}
        </select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('comments')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'comments' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Comments ({filteredComments.length})
        </button>
        <button
          onClick={() => setViewMode('changes')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'changes' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Change Requests ({filteredChangeRequests.length})
        </button>
        <button
          onClick={() => setViewMode('reviews')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'reviews' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reviews ({filteredReviewWorkflows.length})
        </button>
        <button
          onClick={() => setViewMode('workflow')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === 'workflow' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Workflow
        </button>
      </div>

      {/* Content */}
      {viewMode === 'comments' && renderCommentsView()}
      {viewMode === 'changes' && renderChangeRequestsView()}
      {viewMode === 'reviews' && renderReviewsView()}
      {viewMode === 'workflow' && renderWorkflowView()}
    </div>
  )
}

export default CollaborationReviewSystem
