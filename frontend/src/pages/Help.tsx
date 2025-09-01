import React, { useState, useEffect } from 'react'
import { 
  QuestionMarkCircleIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { helpService, HelpSection, FAQ, SupportInfo, SupportTicket } from '@/services/helpService'
import { toast } from 'react-toastify'

const Help: React.FC = () => {
  const [helpSections, setHelpSections] = useState<HelpSection[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [supportInfo, setSupportInfo] = useState<SupportInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [ticketForm, setTicketForm] = useState<SupportTicket>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  })

  useEffect(() => {
    loadHelpData()
  }, [])

  const loadHelpData = async () => {
    try {
      setIsLoading(true)
      const [sections, faqData, support] = await Promise.all([
        helpService.getHelpSections(),
        helpService.getFaqs(),
        helpService.getSupportInfo()
      ])
      
      setHelpSections(sections)
      setFaqs(faqData)
      setSupportInfo(support)
    } catch (error) {
      console.error('Error loading help data:', error)
      toast.error('Failed to load help data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const results = await helpService.searchHelp(searchQuery)
      // Handle search results - you could display them in a modal or new section
      console.log('Search results:', results)
      toast.info(`Found ${results.total_results} results for "${searchQuery}"`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed')
    }
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await helpService.submitTicket(ticketForm)
      toast.success(`Ticket submitted successfully! Ticket ID: ${result.ticket_id}`)
      setShowTicketModal(false)
      setTicketForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
      })
    } catch (error) {
      console.error('Ticket submission error:', error)
      toast.error('Failed to submit ticket')
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'academic-cap': AcademicCapIcon,
      'document-text': DocumentTextIcon,
      'book-open': BookOpenIcon,
      'question-mark-circle': QuestionMarkCircleIcon
    }
    return iconMap[iconName] || QuestionMarkCircleIcon
  }

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: ChatBubbleLeftRightIcon,
      action: 'Start Chat',
      color: 'blue',
      onClick: () => {
        if (supportInfo?.live_chat) {
          toast.info('Live chat feature coming soon!')
        }
      }
    },
    {
      title: 'Email Support',
      description: `Send us a detailed message to ${supportInfo?.email || 'support@idap.com'}`,
      icon: EnvelopeIcon,
      action: 'Send Email',
      color: 'green',
      onClick: () => {
        if (supportInfo?.email) {
          window.open(`mailto:${supportInfo.email}`, '_blank')
        }
      }
    },
    {
      title: 'Phone Support',
      description: `Call us at ${supportInfo?.phone || '+1 (555) 123-4567'}`,
      icon: PhoneIcon,
      action: 'Call Now',
      color: 'purple',
      onClick: () => {
        if (supportInfo?.phone) {
          window.open(`tel:${supportInfo.phone}`, '_blank')
        }
      }
    },
    {
      title: 'Submit Ticket',
      description: 'Create a support ticket for detailed assistance',
      icon: VideoCameraIcon,
      action: 'Submit Ticket',
      color: 'orange',
      onClick: () => setShowTicketModal(true)
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading help content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help & Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to your questions, learn how to use IDAP effectively, and get the support you need.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or contact support..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            <QuestionMarkCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {helpSections.map((section) => {
            const IconComponent = getIconComponent(section.icon)
            return (
              <div key={section.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-gray-600">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Support Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Need More Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div className={`p-3 bg-gradient-to-br from-${option.color}-500 to-${option.color}-600 rounded-xl w-fit mb-4`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <button 
                  onClick={option.onClick}
                  className={`w-full py-2 px-4 bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 text-white rounded-lg font-medium hover:from-${option.color}-600 hover:to-${option.color}-700 transition-all duration-200`}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {faq.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Submit Support Ticket</h2>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="general">General</option>
                    <option value="feature-request">Feature Request</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Help
