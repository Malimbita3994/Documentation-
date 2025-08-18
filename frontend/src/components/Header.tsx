import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, refreshUserData } = useAuth()

  // Force refresh user data when component mounts and periodically
  useEffect(() => {
    // Always refresh user data on mount to ensure consistency
    console.log('Header: Refreshing user data...')
    refreshUserData()
    
    // Set up periodic refresh every 30 seconds to keep data in sync
    const interval = setInterval(() => {
      console.log('Header: Periodic user data refresh...')
      refreshUserData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [refreshUserData])

  // Debug log when user data changes
  useEffect(() => {
    console.log('Header: User data updated:', user)
  }, [user])

  // Fallback user data if no user is logged in
  const userData = user || {
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: 'GU'
  }

  // Get avatar display - use actual avatar URL if available, otherwise use initials
  const getAvatarDisplay = () => {
    if (user?.avatar) {
      return user.avatar
    }
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return userData.avatar
  }

  return (
    <header className="bg-white border-b border-gray-200/60 backdrop-blur-sm bg-white/80 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search documents, requirements, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          {/* Right side - Notifications and User Profile */}
          <div className="flex items-center space-x-3 ml-6">
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
              <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* User Profile Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-10 w-10 rounded-xl shadow-sm group-hover:shadow-md transition-shadow object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <span className="text-white text-sm font-semibold">{getAvatarDisplay()}</span>
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || userData.name}</p>
                    <p className="text-xs text-gray-500">{user?.email || userData.email}</p>
                  </div>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-72 origin-top-right bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100">
                  {/* User Info Header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">{getAvatarDisplay()}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.name || userData.name}</p>
                        <p className="text-xs text-gray-500">{user?.email || userData.email}</p>
                        <p className="text-xs text-gray-400">{user?.roles?.[0]?.display_name || 'User'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          } flex items-center px-6 py-3 text-sm transition-colors`}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          } flex items-center px-6 py-3 text-sm transition-colors`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                          } flex items-center px-6 py-3 text-sm transition-colors`}
                        >
                          <QuestionMarkCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Help & Support
                        </a>
                      )}
                    </Menu.Item>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-red-50 text-red-700' : 'text-red-600'
                          } flex items-center w-full px-6 py-3 text-sm transition-colors`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
