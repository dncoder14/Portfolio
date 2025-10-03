import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'

const ChangePassword = ({ onBack }) => {
  const formRef = useRef()
  const titleRef = useRef()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { changePassword } = useAdmin()

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial setup
    gsap.set([titleRef.current, formRef.current], {
      opacity: 0,
      y: 50
    })

    // Animate elements
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(formRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")

  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(formData)
      if (result.success) {
        toast.success('Password changed successfully! Please log in again.')
        // The context will handle logout automatically
      } else {
        toast.error(result.error || 'Failed to change password')
      }
    } catch (error) {
      toast.error('An error occurred while changing password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 
          ref={titleRef}
          className="text-4xl font-bold text-white text-center mb-8"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          Change Password
        </h1>

        <div 
          ref={formRef}
          className="bg-gray-800 rounded-lg p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors duration-300 ${
                  errors.currentPassword 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                    : 'border-gray-600 focus:border-green-400 focus:ring-green-400'
                }`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors duration-300 ${
                  errors.newPassword 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                    : 'border-gray-600 focus:border-green-400 focus:ring-green-400'
                }`}
                placeholder="Enter new password (min 6 characters)"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors duration-300 ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400' 
                    : 'border-gray-600 focus:border-green-400 focus:ring-green-400'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-400 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Changing Password...
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

