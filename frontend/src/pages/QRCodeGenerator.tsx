import React, { useState, useEffect, useRef } from 'react'
import { 
  QrCodeIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  WifiIcon,
  CalendarIcon,
  PhotoIcon,
  FolderIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  EyeIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import QRCode from 'qrcode'
import { toast } from 'react-toastify'

interface QRCodeData {
  type: 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'location' | 'calendar' | 'vcard'
  content: string
  title?: string
  description?: string
  additionalFields?: { [key: string]: string }
}

interface QRCodeStyle {
  frame: 'none' | 'rounded' | 'circular' | 'double' | 'decorative'
  foregroundColor: string
  backgroundColor: string
  logo?: string
  logoSize: number
  margin: number
  size: number
}

const QRCodeGenerator: React.FC = () => {
  const [qrData, setQrData] = useState<QRCodeData>({
    type: 'text',
    content: 'Scan me to see something amazing! ✨',
    title: 'My QR Code',
    description: 'A beautiful, dynamic QR code',
    additionalFields: {}
  })
  
  const [qrStyle, setQrStyle] = useState<QRCodeStyle>({
    frame: 'rounded',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoSize: 20,
    margin: 4,
    size: 400
  })
  
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
  const [generatedQR, setGeneratedQR] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const qrTypes = [
    { id: 'text', label: 'Text', icon: DocumentTextIcon, color: 'blue', description: 'Plain text message' },
    { id: 'url', label: 'URL', icon: GlobeAltIcon, color: 'green', description: 'Website link' },
    { id: 'email', label: 'Email', icon: EnvelopeIcon, color: 'purple', description: 'Email address' },
    { id: 'phone', label: 'Phone', icon: PhoneIcon, color: 'red', description: 'Phone number' },
    { id: 'sms', label: 'SMS', icon: ChatBubbleLeftRightIcon, color: 'indigo', description: 'Text message' },
    { id: 'wifi', label: 'WiFi', icon: WifiIcon, color: 'yellow', description: 'WiFi network' },
    { id: 'location', label: 'Location', icon: MapPinIcon, color: 'pink', description: 'GPS coordinates' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, color: 'teal', description: 'Calendar event' },
    { id: 'vcard', label: 'vCard', icon: UserIcon, color: 'orange', description: 'Contact information' }
  ]

  const getTypeButtonClasses = (type: any, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:shadow-md border border-gray-100'
    }
    
    const colorMap: { [key: string]: string } = {
      'text': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-200',
      'url': 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg ring-2 ring-green-200',
      'email': 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg ring-2 ring-purple-200',
      'phone': 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg ring-2 ring-red-200',
      'sms': 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg ring-2 ring-indigo-200',
      'wifi': 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg ring-2 ring-yellow-200',
      'location': 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg ring-2 ring-pink-200',
      'calendar': 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg ring-2 ring-teal-200',
      'vcard': 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg ring-2 ring-orange-200'
    }
    
    return colorMap[type.id] || 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg ring-2 ring-purple-200'
  }

  const getTypeIconClasses = (type: any, isSelected: boolean) => {
    if (isSelected) return 'text-white'
    
    const colorMap: { [key: string]: string } = {
      'text': 'text-blue-500',
      'url': 'text-green-500',
      'email': 'text-purple-500',
      'phone': 'text-red-500',
      'sms': 'text-indigo-500',
      'wifi': 'text-yellow-500',
      'location': 'text-pink-500',
      'calendar': 'text-teal-500',
      'vcard': 'text-orange-500'
    }
    
    return colorMap[type.id] || 'text-purple-500'
  }

  const colorPresets = [
    { name: 'Classic', fg: '#000000', bg: '#FFFFFF' },
    { name: 'Ocean', fg: '#1E40AF', bg: '#E0F2FE' },
    { name: 'Sunset', fg: '#DC2626', bg: '#FEF3C7' },
    { name: 'Forest', fg: '#059669', bg: '#D1FAE5' },
    { name: 'Royal', fg: '#7C3AED', bg: '#F3E8FF' },
    { name: 'Midnight', fg: '#1F2937', bg: '#F9FAFB' },
    { name: 'Coral', fg: '#EA580C', bg: '#FED7AA' },
    { name: 'Lavender', fg: '#8B5CF6', bg: '#F3E8FF' }
  ]

  useEffect(() => {
    generateQRCode()
  }, [qrData, qrStyle, uploadedLogo])

  const validateInput = (type: string, content: string): boolean => {
    switch (type) {
      case 'url':
        try {
          new URL(content.startsWith('http') ? content : `https://${content}`)
          return true
        } catch {
          return false
        }
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(content)
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        return phoneRegex.test(content.replace(/[\s\-\(\)]/g, ''))
      case 'location':
        const locationRegex = /^-?\d+\.\d+,\s*-?\d+\.\d+$/
        return locationRegex.test(content)
      default:
        return content.trim().length > 0
    }
  }

  const formatContent = (type: string, data: QRCodeData): string => {
    switch (type) {
      case 'url':
        return data.content.startsWith('http') ? data.content : `https://${data.content}`
      
      case 'email':
        let emailContent = `mailto:${data.content}`
        if (data.title) emailContent += `?subject=${encodeURIComponent(data.title)}`
        if (data.description) emailContent += `${data.title ? '&' : '?'}body=${encodeURIComponent(data.description)}`
        return emailContent
      
      case 'phone':
        return `tel:${data.content.replace(/[\s\-\(\)]/g, '')}`
      
      case 'sms':
        let smsContent = `sms:${data.content.replace(/[\s\-\(\)]/g, '')}`
        if (data.description) smsContent += `?body=${encodeURIComponent(data.description)}`
        return smsContent
      
      case 'wifi':
        const ssid = data.title || 'WiFi Network'
        const password = data.content
        const encryption = data.additionalFields?.encryption || 'WPA'
        const hidden = data.additionalFields?.hidden === 'true' ? 'H:true' : 'H:false'
        return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};;`
      
      case 'location':
        const [lat, lng] = data.content.split(',').map(coord => coord.trim())
        return `geo:${lat},${lng}`
      
      case 'calendar':
        const startDate = data.additionalFields?.startDate || new Date().toISOString()
        const endDate = data.additionalFields?.endDate || new Date(Date.now() + 3600000).toISOString()
        const summary = data.title || 'Event'
        const description = data.description || ''
        const location = data.additionalFields?.location || ''
        
        return `BEGIN:VEVENT
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${startDate.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT`
      
      case 'vcard':
        const name = data.title || 'Contact'
        const phone = data.content
        const email = data.additionalFields?.email || ''
        const company = data.additionalFields?.company || ''
        const website = data.additionalFields?.website || ''
        
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ORG:${company}
URL:${website}
END:VCARD`
      
      default:
        return data.content
    }
  }

  const generateQRCode = async () => {
    if (!qrData.content.trim()) return
    
    if (!validateInput(qrData.type, qrData.content)) {
      toast.error(`Invalid ${qrData.type} format`)
      return
    }
    
    setIsGenerating(true)
    try {
      const qrContent = formatContent(qrData.type, qrData)
      
      // Generate QR code without logo first
      const qrDataURL = await QRCode.toDataURL(qrContent, {
        width: qrStyle.size,
        margin: qrStyle.margin,
        color: {
          dark: qrStyle.foregroundColor,
          light: qrStyle.backgroundColor
        },
        errorCorrectionLevel: 'H'
      })
      
      // If logo is uploaded, embed it into the QR code
      if (uploadedLogo) {
        const finalQRCode = await embedLogoInQRCode(qrDataURL, uploadedLogo)
        setGeneratedQR(finalQRCode)
      } else {
        setGeneratedQR(qrDataURL)
      }
      
      toast.success('QR Code generated successfully!')
      
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const embedLogoInQRCode = async (qrDataURL: string, logoDataURL: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = qrStyle.size
      canvas.height = qrStyle.size
      
      const qrImage = new Image()
      const logoImage = new Image()
      
      qrImage.onload = () => {
        // Draw QR code
        ctx.drawImage(qrImage, 0, 0, qrStyle.size, qrStyle.size)
        
        logoImage.onload = () => {
          // Calculate logo position (center of QR code)
          const logoSize = qrStyle.logoSize
          const logoX = (qrStyle.size - logoSize) / 2
          const logoY = (qrStyle.size - logoSize) / 2
          
          // Create circular clipping path for logo
          ctx.save()
          ctx.beginPath()
          ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI)
          ctx.clip()
          
          // Draw logo
          ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
          ctx.restore()
          
          // Add white border around logo
          ctx.save()
          ctx.strokeStyle = 'white'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI)
          ctx.stroke()
          ctx.restore()
          
          resolve(canvas.toDataURL('image/png'))
        }
        
        logoImage.src = logoDataURL
      }
      
      qrImage.src = qrDataURL
    })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedLogo(e.target?.result as string)
        setQrStyle(prev => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadQR = (format: 'png' | 'svg') => {
    if (!generatedQR) return
    
    const link = document.createElement('a')
    link.download = `qr-code-${qrData.type}-${Date.now()}.${format}`
    
    if (format === 'png') {
      link.href = generatedQR
    } else {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrStyle.size}" height="${qrStyle.size}">
        <rect width="100%" height="100%" fill="${qrStyle.backgroundColor}"/>
        <image href="${generatedQR}" width="100%" height="100%"/>
      </svg>`
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      link.href = URL.createObjectURL(blob)
    }
    
    link.click()
    toast.success(`${format.toUpperCase()} downloaded successfully!`)
  }

  const clearQR = () => {
    setQrData({
      type: 'text',
      content: '',
      title: '',
      description: '',
      additionalFields: {}
    })
    setGeneratedQR('')
    setUploadedLogo(null)
    toast.info('Form cleared')
  }

  const copyToClipboard = async () => {
    if (!generatedQR) return
    
    try {
      await navigator.clipboard.writeText(generatedQR)
      toast.success('QR Code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleTypeChange = (newType: string) => {
    setQrData(prev => ({
      ...prev,
      type: newType as any,
      content: '',
      title: '',
      description: '',
      additionalFields: {}
    }))
    setGeneratedQR('')
  }

  const handleAdditionalFieldChange = (field: string, value: string) => {
    setQrData(prev => ({
      ...prev,
      additionalFields: {
        ...prev.additionalFields,
        [field]: value
      }
    }))
  }

  const getInputPlaceholder = (type: string): string => {
    switch (type) {
      case 'url': return 'Enter website URL (e.g., example.com)'
      case 'email': return 'Enter email address (e.g., user@example.com)'
      case 'phone': return 'Enter phone number (e.g., +1234567890)'
      case 'sms': return 'Enter phone number for SMS'
      case 'wifi': return 'Enter WiFi password'
      case 'location': return 'Enter coordinates (e.g., 40.7128, -74.0060)'
      case 'calendar': return 'Enter event title'
      case 'vcard': return 'Enter phone number'
      default: return 'Enter your text content'
    }
  }

  const getInputLabel = (type: string): string => {
    switch (type) {
      case 'url': return 'Website URL'
      case 'email': return 'Email Address'
      case 'phone': return 'Phone Number'
      case 'sms': return 'Phone Number'
      case 'wifi': return 'WiFi Password'
      case 'location': return 'GPS Coordinates'
      case 'calendar': return 'Event Title'
      case 'vcard': return 'Phone Number'
      default: return 'Content'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-md rounded-3xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl mb-6 border border-white/20">
          <QrCodeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Create stunning, dynamic QR codes with advanced customization options
        </p>
        
        {/* Cross-Page Navigation */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
          <button 
            onClick={() => window.location.href = '/srs'}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 border border-blue-200 hover:shadow-md hover:scale-105"
          >
            <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Go to SRS</span>
            <span className="sm:hidden">SRS</span>
          </button>
          <button 
            onClick={() => window.location.href = '/sdd'}
            className="bg-green-50 hover:bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 border border-green-200 hover:shadow-md hover:scale-105"
          >
            <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Go to SDD</span>
            <span className="sm:hidden">SDD</span>
          </button>
          <button 
            onClick={() => window.location.href = '/projects'}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 border border-purple-200 hover:shadow-md hover:scale-105"
          >
            <FolderIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">View Projects</span>
            <span className="sm:hidden">Projects</span>
          </button>
          <button 
            onClick={() => window.location.href = '/documents'}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 border border-indigo-200 hover:shadow-md hover:scale-105"
          >
            <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">All Documents</span>
            <span className="sm:hidden">Documents</span>
          </button>
          <button 
            onClick={() => window.location.href = '/templates'}
            className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center space-x-2 border border-teal-200 hover:shadow-md hover:scale-105"
          >
            <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Document Templates</span>
            <span className="sm:hidden">Templates</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Input & Options */}
          <div className="space-y-6">
            {/* QR Type Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <QrCodeIcon className="w-5 h-5 mr-2 text-purple-600" />
                QR Code Type
              </h3>
                             <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
                 {qrTypes.map((type) => {
                   const isSelected = qrData.type === type.id
                   return (
                     <button
                       key={type.id}
                       onClick={() => handleTypeChange(type.id)}
                       className={`group p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${getTypeButtonClasses(type, isSelected)}`}
                       title={type.description}
                     >
                       <type.icon className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 transition-transform group-hover:scale-110 ${getTypeIconClasses(type, isSelected)}`} />
                       <span className="text-xs font-semibold block">{type.label}</span>
                     </button>
                   )
                 })}
               </div>
            </div>

            {/* Content Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Enter your details
                </h3>
                <button
                  onClick={clearQR}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all duration-200 hover:scale-110"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {getInputLabel(qrData.type)}
                  </label>
                  <input
                    type={qrData.type === 'email' ? 'email' : 'text'}
                    value={qrData.content}
                    onChange={(e) => setQrData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={getInputPlaceholder(qrData.type)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm"
                  />
                  {qrData.content && !validateInput(qrData.type, qrData.content) && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Invalid {qrData.type} format
                    </p>
                  )}
                </div>

                {/* Additional Fields for different types */}
                {qrData.type === 'wifi' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={qrData.title || ''}
                        onChange={(e) => setQrData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter WiFi network name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Type</label>
                      <select
                        value={qrData.additionalFields?.encryption || 'WPA'}
                        onChange={(e) => handleAdditionalFieldChange('encryption', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="WPA">WPA/WPA2/WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No Password</option>
                      </select>
                    </div>
                  </>
                )}

                {qrData.type === 'vcard' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        value={qrData.title || ''}
                        onChange={(e) => setQrData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={qrData.additionalFields?.email || ''}
                        onChange={(e) => handleAdditionalFieldChange('email', e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={qrData.additionalFields?.company || ''}
                        onChange={(e) => handleAdditionalFieldChange('company', e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </>
                )}

                {qrData.type === 'email' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
                      <input
                        type="text"
                        value={qrData.title || ''}
                        onChange={(e) => setQrData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter email subject"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                      <textarea
                        value={qrData.description || ''}
                        onChange={(e) => setQrData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter email message content"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </>
                )}

                {qrData.type === 'sms' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      value={qrData.description || ''}
                      onChange={(e) => setQrData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter SMS message content"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {qrData.type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <textarea
                      value={qrData.description || ''}
                      onChange={(e) => setQrData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add a description..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

                     {/* Center Panel - QR Code Display */}
           <div className="space-y-6">
             {/* QR Code Preview */}
             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8 text-center border border-white/20">
               <div className="mb-6">
                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                   <QrCodeIcon className="w-5 h-5 mr-2 text-purple-600" />
                   Generated QR Code
                 </h3>
                 <p className="text-sm text-gray-500">Scan with any QR code reader</p>
               </div>
               
               <div className="relative inline-block">
                 {isGenerating ? (
                   <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-purple-200">
                     <div className="text-center">
                       <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-2"></div>
                       <p className="text-sm text-purple-600 font-medium">Generating...</p>
                     </div>
                   </div>
                 ) : generatedQR ? (
                   <div className="relative inline-block group">
                     <img 
                       src={generatedQR} 
                       alt="Generated QR Code"
                       className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl shadow-2xl transition-all duration-300 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   </div>
                 ) : (
                   <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300">
                     <div className="text-center">
                       <QrCodeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2" />
                       <p className="text-sm text-gray-500 font-medium">Enter content to generate QR code</p>
                     </div>
                   </div>
                 )}
               </div>

               {/* Action Buttons */}
               {generatedQR && (
                 <div className="mt-6 space-y-3">
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       onClick={() => downloadQR('png')}
                       className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                     >
                       <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                       <span className="text-sm sm:text-base font-medium">Download PNG</span>
                     </button>
                     <button
                       onClick={() => downloadQR('svg')}
                       className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                     >
                       <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                       <span className="text-sm sm:text-base font-medium">Download SVG</span>
                     </button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       onClick={copyToClipboard}
                       className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                     >
                       <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                       <span className="text-sm sm:text-base font-medium">Copy to Clipboard</span>
                     </button>
                     <button
                       onClick={() => setShowPreview(true)}
                       className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                     >
                       <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                       <span className="text-sm sm:text-base font-medium">Preview</span>
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>

          {/* Right Panel - Advanced Options */}
          <div className="space-y-6">
                         {/* Style Options */}
             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 border border-white/20">
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                 <SparklesIcon className="w-5 h-5 mr-2 text-purple-600" />
                 Style & Customization
               </h3>
               
               {/* Color Presets */}
               <div className="mb-6">
                 <label className="block text-sm font-semibold text-gray-700 mb-3">Color Presets</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                   {colorPresets.map((preset) => (
                     <button
                       key={preset.name}
                       onClick={() => setQrStyle(prev => ({ 
                         ...prev, 
                         foregroundColor: preset.fg, 
                         backgroundColor: preset.bg 
                       }))}
                       className="group p-2 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                       title={preset.name}
                     >
                       <div className="w-full h-6 sm:h-8 rounded-lg shadow-sm" style={{ 
                         background: `linear-gradient(45deg, ${preset.fg} 50%, ${preset.bg} 50%)` 
                       }} />
                       <span className="text-xs text-gray-600 mt-1 block font-medium group-hover:text-purple-600 transition-colors">{preset.name}</span>
                     </button>
                   ))}
                 </div>
               </div>

               {/* Custom Colors */}
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Foreground</label>
                   <div className="relative">
                     <input
                       type="color"
                       value={qrStyle.foregroundColor}
                       onChange={(e) => setQrStyle(prev => ({ ...prev, foregroundColor: e.target.value }))}
                       className="w-full h-10 sm:h-12 rounded-2xl border-2 border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                     />
                     <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-purple-300 transition-colors pointer-events-none"></div>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Background</label>
                   <div className="relative">
                     <input
                       type="color"
                       value={qrStyle.backgroundColor}
                       onChange={(e) => setQrStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                       className="w-full h-10 sm:h-12 rounded-2xl border-2 border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                     />
                     <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-purple-300 transition-colors pointer-events-none"></div>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Logo Upload */}
             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 border border-white/20">
               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                 <PhotoIcon className="w-5 h-5 mr-2 text-purple-600" />
                 Logo & Branding
               </h3>
               
               <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={() => fileInputRef.current?.click()}
                     className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 sm:px-4 py-3 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-dashed border-purple-300 hover:border-purple-400 shadow-sm hover:shadow-md transform hover:scale-105"
                   >
                     <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     <span className="text-sm sm:text-base font-medium">Upload Logo</span>
                   </button>
                   <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleLogoUpload}
                     className="hidden"
                   />
                 </div>
                 
                 {uploadedLogo && (
                   <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-2xl border border-green-200">
                     <img 
                       src={uploadedLogo} 
                       alt="Uploaded Logo" 
                       className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-green-300 shadow-sm"
                     />
                     <div className="flex-1">
                       <p className="text-sm font-semibold text-green-800">Logo uploaded</p>
                       <p className="text-xs text-green-600">Click to change</p>
                     </div>
                     <button
                       onClick={() => {
                         setUploadedLogo(null)
                         setQrStyle(prev => ({ ...prev, logo: undefined }))
                       }}
                       className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                     >
                       <XMarkIcon className="w-4 h-4" />
                     </button>
                   </div>
                 )}
                 
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-3">Logo Size</label>
                   <div className="relative">
                     <input
                       type="range"
                       min="10"
                       max="50"
                       value={qrStyle.logoSize}
                       onChange={(e) => {
                         setQrStyle(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))
                         // Regenerate QR code with new logo size
                         if (generatedQR && uploadedLogo) {
                           setTimeout(() => generateQRCode(), 100)
                         }
                       }}
                       className="w-full h-3 bg-gradient-to-r from-purple-200 to-blue-200 rounded-2xl appearance-none cursor-pointer shadow-inner"
                       style={{
                         background: `linear-gradient(to right, #e9d5ff 0%, #e9d5ff ${(qrStyle.logoSize - 10) / 40 * 100}%, #bfdbfe ${(qrStyle.logoSize - 10) / 40 * 100}%, #bfdbfe 100%)`
                       }}
                     />
                     <div className="flex justify-between text-xs text-gray-500 mt-2">
                       <span className="font-medium">Small</span>
                       <span className="font-bold text-purple-600">{qrStyle.logoSize}px</span>
                       <span className="font-medium">Large</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

             {/* Preview Modal */}
       {showPreview && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
             <div className="p-6 sm:p-8">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                   <EyeIcon className="w-6 h-6 mr-2 text-purple-600" />
                   QR Code Preview
                 </h2>
                 <button
                   onClick={() => setShowPreview(false)}
                   className="p-2 text-gray-400 hover:text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-200 hover:scale-110"
                 >
                   <XMarkIcon className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="text-center">
                 <div className="mb-6">
                   <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{qrData.title || 'QR Code'}</h3>
                   <p className="text-gray-600">{qrData.description || 'Generated QR Code'}</p>
                 </div>
                 
                 <div className="mb-6">
                   <div className="relative inline-block group">
                     <img 
                       src={generatedQR} 
                       alt="QR Code Preview" 
                       className="mx-auto w-48 h-48 sm:w-64 sm:h-64 rounded-3xl shadow-2xl transition-all duration-300 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                   <button
                     onClick={() => downloadQR('png')}
                     className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 sm:px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                   >
                     <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     <span className="text-sm sm:text-base font-medium">Download PNG</span>
                   </button>
                   <button
                     onClick={() => downloadQR('svg')}
                     className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                   >
                     <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     <span className="text-sm sm:text-base font-medium">Download SVG</span>
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  )
}

export default QRCodeGenerator
