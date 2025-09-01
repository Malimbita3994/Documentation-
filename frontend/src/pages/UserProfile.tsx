import React, { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { 
  UserIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  BellIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { classNames } from '@/lib/utils'
import { env } from '@/config/environment'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  id: number
  name: string
  username: string
  email: string
  phone: string
  avatar: string | null
  bio: string
  status: 'active' | 'inactive'
  last_login_at: string
  last_login_ip: string
  created_at: string
  updated_at: string
  roles: Array<{
    id: number
    name: string
    display_name: string
  }>
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    language: string
    timezone: string
  }
}

const UserProfile: React.FC = () => {
  const { user, refreshUserData } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      
      if (!token) {
        setError('No authentication token found. Please log in again.')
        setLoading(false)
        return
      }

      const apiUrl = `${env.API_URL}/profile`
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else if (response.status === 401) {
        setError('Authentication failed. Please log in again.')
      } else {
        setError(`Failed to load profile: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Network error. Please check your connection.')
      
      // Fallback to current user data if available
      if (user) {
        const fallbackProfile: UserProfile = {
          id: user.id || 1,
          name: user.name || 'User',
          username: user.username || 'user',
          email: user.email || 'user@example.com',
          phone: '',
          avatar: user.avatar || null,
          bio: '',
          status: 'active',
          last_login_at: new Date().toISOString(),
          last_login_ip: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          roles: user.roles || [],
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            language: 'en',
            timezone: 'UTC'
          }
        }
        setProfile(fallbackProfile)
        setError(null) // Clear error since we have fallback data
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    const formData = new FormData()
    formData.append('avatar', avatarFile)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const response = await fetch(`${env.API_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, avatar: data.avatar_url } : null)
        setAvatarFile(null)
        setAvatarPreview(null)
        // Refresh user data to update avatar in header
        refreshUserData()
      } else {
        setError('Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handlePreferenceUpdate = async (preferences: UserProfile['preferences']) => {
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, preferences: data.preferences } : null)
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      )}



      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
          <div className="mt-2 space-x-2">
            <button
              onClick={fetchProfile}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
            {!user && (
              <a
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Go to Login
              </a>
            )}
          </div>
        </div>
      )}

      {/* Content - Only show if not loading and no error */}
      {!loading && !error && (

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Profile</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Security</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <CogIcon className="h-5 w-5" />
              <span>Preferences</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <BellIcon className="h-5 w-5" />
              <span>Notifications</span>
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Profile Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>{editing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Profile avatar" 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                      <CameraIcon className="h-4 w-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {editing && avatarFile && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAvatarUpload}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview(null)
                      }}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Form */}
              <ProfileForm 
                profile={profile} 
                editing={editing} 
                onUpdate={handleProfileUpdate} 
              />
            </div>
          </Tab.Panel>

          {/* Security Tab */}
          <Tab.Panel>
            <SecuritySettings />
          </Tab.Panel>

          {/* Preferences Tab */}
          <Tab.Panel>
            <PreferencesSettings 
              preferences={profile.preferences} 
              onUpdate={handlePreferenceUpdate} 
            />
          </Tab.Panel>

          {/* Notifications Tab */}
          <Tab.Panel>
            <NotificationSettings 
              preferences={profile.preferences} 
              onUpdate={handlePreferenceUpdate} 
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      )}
    </div>
  )
}

// Profile Form Component
const ProfileForm: React.FC<{
  profile: UserProfile
  editing: boolean
  onUpdate: (data: Partial<UserProfile>) => void
}> = ({ profile, editing, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    username: profile.username || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || ''
  })

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      username: profile.username || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || ''
    })
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!editing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Tell us about yourself..."
        />
      </div>

      {editing && (
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setFormData({
              name: profile.name,
              username: profile.username,
              email: profile.email,
              phone: profile.phone,
              bio: profile.bio
            })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  )
}

// Security Settings Component
const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })

      if (response.ok) {
        alert('Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert('Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Error updating password')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
      
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  )
}

// Preferences Settings Component
const PreferencesSettings: React.FC<{
  preferences: UserProfile['preferences']
  onUpdate: (preferences: UserProfile['preferences']) => void
}> = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState(preferences)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  )
}

// Notification Settings Component
const NotificationSettings: React.FC<{
  preferences: UserProfile['preferences']
  onUpdate: (preferences: UserProfile['preferences']) => void
}> = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState(preferences.notifications)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...preferences,
      notifications: formData
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="email"
                checked={formData.email}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications in the browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="push"
                checked={formData.push}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="sms"
                checked={formData.sms}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            Save Notification Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserProfile
