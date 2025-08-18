import React, { useState, useRef } from 'react'
import { 
  DocumentTextIcon,
  PrinterIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

interface SRSDocumentViewerProps {
  document: any
  onClose: () => void
}

const SRSDocumentViewer: React.FC<SRSDocumentViewerProps> = ({ document, onClose }) => {
  console.log('🎯 SRSDocumentViewer rendered with document:', document)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [isExporting, setIsExporting] = useState(false)
  const documentRef = useRef<HTMLDivElement>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      // Use html2pdf.js for PDF generation
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = documentRef.current
      if (!element) return

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${document.metadata.documentId || 'SRS-Document'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      }

      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToWord = async () => {
    setIsExporting(true)
    try {
      // Generate Word document using mammoth.js or similar
      const docx = await import('docx')
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx

      const children = [
        // Title
        new Paragraph({
          text: 'Software Requirements Specification',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        
        // System Name
        new Paragraph({
          text: document.metadata.systemName || 'System Name',
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),

        // Document Info
        new Paragraph({
          children: [
            new TextRun({ text: 'Document ID: ', bold: true }),
            new TextRun(document.metadata.documentId || 'N/A')
          ],
          spacing: { after: 200 }
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: 'Version: ', bold: true }),
            new TextRun(document.metadata.version || '1.0')
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: 'Date: ', bold: true }),
            new TextRun(new Date(document.metadata.createdAt).toLocaleDateString())
          ],
          spacing: { after: 400 }
        }),

        // Table of Contents
        new Paragraph({
          text: 'Table of Contents',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        }),

        // Sections
        ...document.sections.map((section: any) => [
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 200 }
          }),
          new Paragraph({
            text: section.content || '[Content not available]',
            spacing: { after: 200 }
          })
        ]).flat()
      ]

      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      })

      const blob = await Packer.toBlob(doc)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${document.metadata.documentId || 'SRS-Document'}.docx`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating Word document:', error)
      alert('Error generating Word document. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const printDocument = () => {
    window.print()
  }

  const renderDocumentHeader = () => (
    <div className="text-center border-b-2 border-gray-300 pb-6 mb-8 srs-document">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Software Requirements Specification
      </h1>
      <p className="text-xl text-gray-600 mb-4">
        {document.metadata.systemName || 'System Name'}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Document ID:</span>
          <p className="text-gray-600">{document.metadata.documentId}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Version:</span>
          <p className="text-gray-600">{document.metadata.version}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date:</span>
          <p className="text-gray-600">{new Date(document.metadata.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Status:</span>
          <p className="text-gray-600">{document.metadata.status}</p>
        </div>
      </div>
    </div>
  )

  const renderDocumentSummary = () => {
    if (!document.summary) return null

    return (
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Document Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{document.summary.totalRequirements}</div>
            <div className="text-sm text-gray-600">Total Requirements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{document.summary.functionalRequirements}</div>
            <div className="text-sm text-gray-600">Functional</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{document.summary.nonFunctionalRequirements}</div>
            <div className="text-sm text-gray-600">Non-Functional</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{document.summary.highPriorityRequirements}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>
      </div>
    )
  }

  const renderTableOfContents = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6 no-print">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Table of Contents</h2>
          <button
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="text-gray-600 hover:text-gray-800"
          >
            {showTableOfContents ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        
        {showTableOfContents && (
          <div className="space-y-2">
            {document.sections.map((section: any, index: number) => (
              <div key={section.id} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{index + 1}.</span>
                <button
                  onClick={() => {
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-blue-600 hover:text-blue-800 text-left"
                >
                  {section.title}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderRequirementsTable = () => {
    const requirements = document.requirements || []
    if (requirements.length === 0) return null

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Priority</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req: any) => (
                <tr key={req.id}>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{req.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{req.title}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      req.type === 'functional' ? 'bg-blue-100 text-blue-700' :
                      req.type === 'non-functional' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {req.type}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      req.priority === 'high' ? 'bg-red-100 text-red-700' :
                      req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className="capitalize">{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderSection = (section: any) => (
    <div key={section.id} id={`section-${section.id}`} className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => toggleSection(section.id)}
          className="text-gray-600 hover:text-gray-800 no-print"
        >
          {expandedSections[section.id] ? 
            <ChevronDownIcon className="h-5 w-5" /> : 
            <ChevronRightIcon className="h-5 w-5" />
          }
        </button>
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
        {section.required && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Required
          </span>
        )}
      </div>
      
      {expandedSections[section.id] !== false && (
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {section.content || '[Content not available]'}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">SRS Document Viewer</h1>
                <p className="text-blue-100">Final Software Requirements Specification</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <DocumentArrowDownIcon className="h-5 w-5" />
                )}
                PDF
              </button>
              <button
                onClick={exportToWord}
                disabled={isExporting}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <DocumentArrowDownIcon className="h-5 w-5" />
                )}
                Word
              </button>
              <button
                onClick={printDocument}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" />
                Print
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]" ref={documentRef}>
          {renderDocumentHeader()}
          {renderDocumentSummary()}
          {renderTableOfContents()}
          {renderRequirementsTable()}
          
          <div className="space-y-8">
            {document.sections.map((section: any) => 
              renderSection(section)
            )}
          </div>

          {/* Document Footer */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                This document was generated on {new Date(document.metadata.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">
                IEEE 830-1998 Compliant Software Requirements Specification
              </p>
              {document.metadata.generatedBy && (
                <p className="text-sm mt-1">
                  Generated by: {document.metadata.generatedBy}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SRSDocumentViewer
