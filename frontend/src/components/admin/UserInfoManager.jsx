import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'
import MultiSelectSkills from './MultiSelectSkills'

const UserInfoManager = () => {
  const { 
    userInfo, 
    updateUserInfo, 
    skills, 
    userSkills, 
    createSkill, 
    updateUserSkills, 
    fetchSkills, 
    fetchUserSkills,
    uploadProfileImage,
    uploadCV 
  } = useAdmin()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    summary: '',
    location: '',
    profileImage: '',
    cvUrl: '',
    socialLinks: {
      codeforces: '',
      codechef: '',
      github: '',
      linkedin: '',
      leetcode: ''
    },
    skills: []
  })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const formRef = useRef()

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        summary: userInfo.summary || '',
        location: userInfo.location || '',
        profileImage: userInfo.profileImage || '',
        cvUrl: userInfo.cvUrl || '',
        socialLinks: userInfo.socialLinks || {
          codeforces: '',
          codechef: '',
          github: '',
          linkedin: '',
          leetcode: ''
        },
        skills: userInfo.skills || []
      })
    }
  }, [userInfo])

  // Set selected skills from userSkills
  useEffect(() => {
    if (userSkills && Array.isArray(userSkills)) {
      const skillsWithDetails = userSkills.map(us => ({
        skillId: us.skillId,
        skill: {
          id: us.skillId,
          name: us.name,
          logoUrl: us.logoUrl,
          logoSvg: us.logoSvg,
          category: us.category
        }
      }))
      setSelectedSkills(skillsWithDetails)
    }
  }, [userSkills])

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills()
    if (userInfo?.id) {
      fetchUserSkills(userInfo.id)
    }
  }, [userInfo?.id])

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(formRef.current, {
      opacity: 0,
      y: 20
    })

    tl.to(formRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    })

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const loadingToast = toast.loading('Saving...')
    
    try {
      // Update basic user info
      const result = await updateUserInfo(formData)
      if (result.success) {
        // Update user skills
        const skillIds = selectedSkills.map(s => s.skillId)
        
        if (userInfo?.id) {
          const skillsResult = await updateUserSkills(userInfo.id, skillIds)
          if (skillsResult.success) {
            toast.dismiss(loadingToast)
            toast.success('Updated successfully!')
            setIsEditing(false)
          } else {
            toast.dismiss(loadingToast)
            toast.error(skillsResult.error)
          }
        } else {
          toast.dismiss(loadingToast)
          toast.success('Updated successfully!')
          setIsEditing(false)
        }
      } else {
        toast.dismiss(loadingToast)
        toast.error(result.error)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value
      }
    })
  }

  const handleSkillSelectionChange = (newSelection) => {
    setSelectedSkills(newSelection)
  }

  const handleAddNewSkill = async (skillData) => {
    try {
      const result = await createSkill(skillData)
      if (result.success) {
        toast.success('New skill added successfully!')
        // Refresh skills list
        await fetchSkills()
        return result.data
      } else {
        toast.error(result.error)
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error('Failed to add new skill')
      throw error
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)')
      return
    }

    try {
      toast.loading('Uploading image...')
      const result = await uploadProfileImage(file)
      
      if (result.success) {
        setFormData({ ...formData, profileImage: result.data.profileImageUrl })
        toast.dismiss()
        toast.success('Profile image uploaded successfully!')
      } else {
        toast.dismiss()
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.dismiss()
      toast.error('Failed to upload image')
    }
  }

  const handleCVUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file')
      return
    }

    try {
      toast.loading('Uploading CV...')
      const result = await uploadCV(file)
      
      if (result.success) {
        setFormData({ ...formData, cvUrl: result.data.cvUrl })
        toast.dismiss()
        toast.success('CV uploaded successfully!')
      } else {
        toast.dismiss()
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Error uploading CV:', error)
      toast.dismiss()
      toast.error('Failed to upload CV')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-lg transition-colors duration-300"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div ref={formRef} className="bg-gray-800 rounded-lg p-6">
        {!userInfo ? (
          // Skeleton Loading Animation
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-20 bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-28"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded w-40"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Image
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-400 file:text-black hover:file:bg-green-500"
                  />
                  <p className="text-xs text-gray-400">{formData.profileImage ? 'Select new image' : 'Upload a new profile image'} (max 5MB, JPG/PNG/GIF/WebP)</p>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                      onError={(e) => {
                        e.target.src = '/images/profile.png'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">👤</span>
                    </div>
                  )}
                  <span className="text-gray-300 text-sm">
                    {formData.profileImage ? 'Current profile image' : 'No profile image set'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CV/Resume
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-400 file:text-black hover:file:bg-green-500"
                />
                <p className="text-xs text-gray-400">{formData.cvUrl ? 'Select new PDF' : 'Upload a new CV/Resume'} (max 10MB, PDF only)</p>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {formData.cvUrl ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">CV uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">📄</span>
                    </div>
                    <span className="text-gray-300 text-sm">No CV uploaded</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Codeforces
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.codeforces}
                  onChange={(e) => handleSocialLinkChange('codeforces', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="https://codeforces.com/profile/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CodeChef
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.codechef}
                  onChange={(e) => handleSocialLinkChange('codechef', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="https://www.codechef.com/users/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LeetCode
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.leetcode}
                  onChange={(e) => handleSocialLinkChange('leetcode', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="https://leetcode.com/username"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Skills Management</h3>
            
            {isEditing ? (
              <MultiSelectSkills
                availableSkills={skills || []}
                selectedSkills={selectedSkills}
                onSelectionChange={handleSkillSelectionChange}
                onAddNewSkill={handleAddNewSkill}
                disabled={false}
              />
            ) : (
              <div className="space-y-3">
                {selectedSkills.length > 0 ? (
                  selectedSkills.map((selectedSkill, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {selectedSkill.skill?.logoSvg ? (
                            <span
                              className="w-8 h-8"
                              dangerouslySetInnerHTML={{ __html: selectedSkill.skill.logoSvg }}
                            />
                          ) : (
                            <img 
                              src={selectedSkill.skill?.logoUrl} 
                              alt={selectedSkill.skill?.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <span className="text-white font-medium">{selectedSkill.skill?.name}</span>
                            <div className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded inline-block ml-2">
                              {selectedSkill.skill?.category}
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No skills selected. Click "Edit" to add skills.
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-semibold rounded transition-colors duration-300"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
        )}
      </div>
    </div>
  )
}

export default UserInfoManager
