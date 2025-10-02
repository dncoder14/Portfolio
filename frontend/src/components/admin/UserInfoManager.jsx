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
    fetchUserSkills 
  } = useAdmin()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    summary: '',
    location: '',
    profileImage: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      email: ''
    },
    skills: []
  })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef()

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        summary: userInfo.summary || '',
        location: userInfo.location || '',
        profileImage: userInfo.profileImage || '',
        socialLinks: userInfo.socialLinks || {
          linkedin: '',
          github: '',
          twitter: '',
          email: ''
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
        level: us.level,
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
    
    try {
      // Update basic user info
      const result = await updateUserInfo(formData)
      if (result.success) {
        // Update user skills
        const skillIds = selectedSkills.map(s => ({
          skillId: s.skillId,
          level: s.level
        }))
        
        if (userInfo?.id) {
          const skillsResult = await updateUserSkills(userInfo.id, skillIds)
          if (skillsResult.success) {
            toast.success('User information and skills updated successfully!')
            setIsEditing(false)
          } else {
            toast.error(skillsResult.error)
          }
        } else {
          toast.success('User information updated successfully!')
          setIsEditing(false)
        }
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An error occurred')
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
                Profile Image URL
              </label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.socialLinks.email}
                  onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed"
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
                        <div className="text-sm text-gray-300">
                          Level: {selectedSkill.level}%
                        </div>
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
                className="px-6 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded transition-colors duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default UserInfoManager
