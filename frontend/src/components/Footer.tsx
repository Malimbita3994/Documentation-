import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-8">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>© 2025 IDAP System Analysis Platform</span>
          <span>•</span>
          <span>Version 1.0.0</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            All systems operational
          </span>
          <span>•</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
