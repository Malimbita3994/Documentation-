import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Get the return URL from location state, or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/'

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    if (!form.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const success = await login(form.email, form.password)
      
      if (success) {
        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true })
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
         <div className="min-h-screen flex items-start justify-center p-2 sm:p-4 relative py-8">
      {/* SVG Wave Background */}
             <svg 
         version="1.1" 
         xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink" 
         x="0px" 
         y="0px" 
         width="100%" 
         height="100%" 
         viewBox="0 0 1600 900" 
         preserveAspectRatio="xMidYMax slice"
         className="absolute inset-0 w-full h-full overflow-hidden"
       >
        <defs>
          <linearGradient id="bg">
            <stop offset="0%" style={{ stopColor: 'rgba(130, 158, 249, 0.06)' }}></stop>
            <stop offset="50%" style={{ stopColor: 'rgba(76, 190, 255, 0.6)' }}></stop>
            <stop offset="100%" style={{ stopColor: 'rgba(115, 209, 72, 0.2)' }}></stop>
          </linearGradient>
          <path 
            id="wave" 
            fill="url(#bg)" 
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z" 
          />
        </defs>
        <g>
          <use xlinkHref='#wave' opacity=".3">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="10s"
              calcMode="spline"
              values="270 230; -334 180; 270 230"
              keyTimes="0; .5; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" 
            />
          </use>
          <use xlinkHref='#wave' opacity=".6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="8s"
              calcMode="spline"
              values="-270 230;243 220;-270 230"
              keyTimes="0; .6; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" 
            />
          </use>
          <use xlinkHref='#wave' opacity=".9">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              dur="6s"
              calcMode="spline"
              values="0 230;-140 200;0 230"
              keyTimes="0; .4; 1"
              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
              repeatCount="indefinite" 
            />
          </use>
        </g>
      </svg>

             <div className="relative z-10 w-full max-w-sm animate-fade-in-up my-8">
                 {/* Logo/Brand */}
                   <div className="text-center mb-4 sm:mb-6">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
             <User className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
           <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
         </div>

                   {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6 border border-gray-100 transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
                                           <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                                 <input
                   id="email"
                   type="email"
                   value={form.email}
                   onChange={(e) => handleInputChange('email', e.target.value)}
                   className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                     errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                   }`}
                   placeholder="Enter your email"
                 />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                                 <input
                   id="password"
                   type={showPassword ? 'text' : 'password'}
                   value={form.password}
                   onChange={(e) => handleInputChange('password', e.target.value)}
                   className={`block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                     errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                   }`}
                   placeholder="Enter your password"
                 />
                                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-200 ease-in-out transform hover:scale-110"
                 >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
                             <button
                 type="button"
                 className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
               >
                Forgot password?
              </button>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

                         {/* Submit Button */}
             <button
               type="submit"
               disabled={loading}
               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95"
             >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

                     

                     

                     {/* Sign Up Link */}
           <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* SVG Background Styles */}
             <style>{`
         svg {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           box-sizing: border-box;
           display: block;
           background-color: #0e4166;
           background-image: linear-gradient(to bottom, rgba(14, 65, 102, 0.86), #0e4166);
           overflow: hidden;
         }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
