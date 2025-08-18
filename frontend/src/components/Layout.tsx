import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC = () => {
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const isSRS = location.pathname === '/srs'
  const isProjects = location.pathname === '/projects'
  const isDocuments = location.pathname === '/documents'
  const isUserManagement = location.pathname === '/user-management'
  const isSettings = location.pathname === '/settings'
  const isTemplates = location.pathname === '/templates'
  const isTeam = location.pathname === '/team'
  const isAnalytics = location.pathname === '/analytics'
  const isUserProfile = location.pathname === '/user-profile'
  const isSDD = location.pathname === '/sdd'
  const isTestCases = location.pathname === '/test-cases'
  const isConceptNote = location.pathname === '/concept-note'
  const isFeasibilityStudy = location.pathname === '/feasibility-study'
  const isProgressReport = location.pathname === '/progress-report'
  const isUserManual = location.pathname === '/user-manual'
  
  // Pages that should have ocean background
  const hasOceanBackground = isDashboard || isSRS || isProjects || isDocuments || isUserManagement || isSettings || isTemplates || isTeam || isAnalytics || isUserProfile || isSDD || isTestCases || isConceptNote || isFeasibilityStudy || isProgressReport || isUserManual
  
  return (
    <div className="flex h-screen relative overflow-hidden w-full max-w-full">
      {/* Ocean Background - For Dashboard and Key Pages */}
      {hasOceanBackground && (
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(255,254,234,1)] via-[rgba(255,254,234,1)] to-[#B7E8EB] overflow-hidden">
          <div className="ocean">
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex h-full w-full relative z-10">
        {/* Sidebar with integrated header */}
        <div className="flex flex-col h-full">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <Header />
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <main className={`p-8 pb-4 ${hasOceanBackground ? 'relative' : ''}`}>
              {hasOceanBackground && (
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-blue-100/20 to-transparent pointer-events-none"></div>
              )}
              <div className="max-w-7xl mx-auto relative z-10">
                <Outlet />
              </div>
            </main>
          </div>

          {/* Footer - always at bottom */}
          <Footer />
        </div>
      </div>

      {/* Ocean Wave Styles */}
      <style>{`
        .ocean { 
          height: 15%;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: #015871;
          overflow: hidden;
        }

        .wave {
          background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x; 
          position: absolute;
          top: -198px;
          width: 200%;
          height: 198px;
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform: translate3d(0, 0, 0);
          background-size: auto 100%;
        }

        .wave:nth-of-type(2) {
          top: -175px;
          animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite, swell 7s ease -1.25s infinite;
          opacity: 1;
        }

        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes swell {
          0%, 100% {
            transform: translate3d(0, -25px, 0);
          }
          50% {
            transform: translate3d(0, 5px, 0);
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, rgba(255,254,234,1) 0%, rgba(255,254,234,1) 35%, #B7E8EB 100%);
        }

        /* Responsive adjustments for smaller screens */
        @media (max-width: 768px) {
          .ocean {
            height: 12%;
          }
          .wave {
            height: 150px;
            top: -150px;
          }
          .wave:nth-of-type(2) {
            top: -130px;
          }
        }

        @media (max-width: 480px) {
          .ocean {
            height: 10%;
          }
          .wave {
            height: 120px;
            top: -120px;
          }
          .wave:nth-of-type(2) {
            top: -100px;
          }
        }
      `}</style>
    </div>
  )
}

export default Layout
