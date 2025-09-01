import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'
import KnowledgeBaseManager from '../components/KnowledgeBaseManager'
import KnowledgeBaseTester from '../components/KnowledgeBaseTester'
import AIEffectivenessAnalyzer from '../components/AIEffectivenessAnalyzer'

const Settings = () => {
  const tabs = [
    { name: 'System Settings', component: <SystemSettings /> },
    { name: 'Knowledge Base', component: <KnowledgeBaseManager /> },
    { name: 'Testing Suite', component: <KnowledgeBaseTester /> },
    { name: 'AI Analytics', component: <AIEffectivenessAnalyzer /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Cog6ToothIcon className="h-8 w-8 text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings & Testing</h1>
          <p className="mt-1 text-sm text-gray-600">System configuration and knowledge base testing</p>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        {/* System Status Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            SYSTEM STATUS
          </h2>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="mt-8 space-y-6">
          {/* General Settings */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    defaultValue="IDAP System Analysis Platform"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Africa/Dar_es_Salaam (GMT+3)</option>
                    <option>UTC (GMT+0)</option>
                    <option>America/New_York (GMT-5)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                    <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Project Updates</h4>
                    <p className="text-sm text-gray-500">Get notified about project changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 text-gray-900">1.0.0</span>
                </div>
                <div>
                  <span className="text-gray-500">Build Date:</span>
                  <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Database:</span>
                  <span className="ml-2 text-gray-900">MySQL 8.0</span>
                </div>
                <div>
                  <span className="text-gray-500">Server:</span>
                  <span className="ml-2 text-gray-900">Apache/2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
