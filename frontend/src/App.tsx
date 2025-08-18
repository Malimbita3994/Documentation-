
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from '@components/ProtectedRoute'
import Layout from '@components/Layout'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Dashboard from '@pages/Dashboard'
import Documents from '@pages/Documents'
import ComprehensiveSRS from '@pages/ComprehensiveSRS'
import SDD from '@pages/SDD'
import TestCases from '@pages/TestCases'
import ConceptNote from '@pages/ConceptNote'
import FeasibilityStudy from '@pages/FeasibilityStudy'
import ProgressReport from '@pages/ProgressReport'
import UserManual from '@pages/UserManual'
import UserManagement from '@pages/UserManagement'
import UserProfile from '@pages/UserProfile'
import Projects from '@pages/Projects'

import Templates from '@pages/Templates'
import Team from '@pages/Team'
import Settings from '@pages/Settings'
import Analytics from '@pages/Analytics'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="srs" element={<ComprehensiveSRS />} />
            <Route path="sdd" element={<SDD />} />
            <Route path="test-cases" element={<TestCases />} />
            <Route path="concept-note" element={<ConceptNote />} />
            <Route path="feasibility-study" element={<FeasibilityStudy />} />
            <Route path="progress-report" element={<ProgressReport />} />
            <Route path="user-manual" element={<UserManual />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="projects" element={<Projects />} />

            <Route path="templates" element={<Templates />} />
            <Route path="team" element={<Team />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
