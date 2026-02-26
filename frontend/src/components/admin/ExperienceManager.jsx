import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'
import SidePanel from './SidePanel'

const ExperienceManager = () => {
  const { experiences, createExperience, updateExperience, deleteExperience } = useAdmin()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: [],
    location: '',
    companyLogo: ''
  })
  const [newTech, setNewTech] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const experiencesRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(experiencesRef.current?.children, {
      opacity: 0,
      y: 20
    })

    tl.to(experiencesRef.current?.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    })

  }, [experiences])

  const handleOpenModal = (experience = null) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
        current: experience.current || false,
        description: experience.description,
        technologies: experience.technologies || [],
        location: experience.location || '',
        companyLogo: experience.companyLogo || ''
      })
    } else {
      setEditingExperience(null)
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        technologies: [],
        location: '',
        companyLogo: ''
      })
    }
    setLogoFile(null)
    setIsPanelOpen(true)
  }

  const handleCloseModal = () => {
    setIsPanelOpen(false)
    setEditingExperience(null)
    setLogoFile(null)
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: [],
      location: '',
      companyLogo: ''
    })
  }

  const handleLogoUpload = async (file) => {
    const formData = new FormData()
    formData.append('companyLogo', file)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/experience/upload`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (response.ok) {
        return data.imageUrl
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalFormData = { ...formData }
      
      if (logoFile) {
        try {
          const imageUrl = await handleLogoUpload(logoFile)
          finalFormData.companyLogo = imageUrl
        } catch (error) {
          toast.error('Failed to upload logo: ' + error.message)
          setUploading(false)
          return
        }
      }
      
      const result = editingExperience 
        ? await updateExperience(editingExperience.id, finalFormData)
        : await createExperience(finalFormData)
      
      if (result.success) {
        toast.success(editingExperience ? 'Experience updated successfully!' : 'Experience created successfully!')
        handleCloseModal()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const result = await deleteExperience(id)
      if (result.success) {
        toast.success('Experience deleted successfully!')
      } else {
        toast.error(result.error)
      }
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()]
      })
      setNewTech('')
    }
  }

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
        <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
        <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
          <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
          <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} disabled={formData.current} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 disabled:opacity-50" />
        </div>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="current" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })} className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400" />
        <label htmlFor="current" className="ml-2 text-sm text-gray-300">Currently working here</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Company Logo</label>
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-400 file:text-black hover:file:bg-green-500" />
        {formData.companyLogo && (
          <div className="mt-2">
            <img src={formData.companyLogo} alt="Current" className="w-16 h-16 object-cover rounded" />
            <p className="text-xs text-gray-400 mt-1">Current logo</p>
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Technologies</label>
        <div className="flex space-x-2 mb-2">
          <input type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Add technology" className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())} />
          <button type="button" onClick={addTechnology} className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black rounded transition-colors duration-300">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded flex items-center space-x-1">
              <span>{tech}</span>
              <button type="button" onClick={() => removeTechnology(tech)} className="text-red-400 hover:text-red-300">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-4 pt-2">
        <button type="submit" disabled={uploading} className="px-6 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-500 text-black font-semibold rounded transition-colors duration-300">
          {uploading ? 'Uploading...' : (editingExperience ? 'Update' : 'Create')}
        </button>
        <button type="button" onClick={handleCloseModal} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300">Cancel</button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Experience Management</h2>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-lg transition-colors duration-300">
          Add New Experience
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(360px,520px)] lg:gap-6">
        <div ref={experiencesRef} className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className={`bg-gray-800 rounded-lg p-6 ${editingExperience?.id === exp.id ? 'ring-2 ring-green-400' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  {exp.companyLogo && (
                    <img src={exp.companyLogo} alt={exp.company} className="w-12 h-12 rounded object-cover" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                    <p className="text-green-400 text-sm">{exp.company}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.current && (
                  <span className="px-2 py-1 bg-green-400 text-black text-xs rounded-full">Current</span>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{exp.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {exp.technologies?.slice(0, 4).map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">{tech}</span>
                ))}
                {exp.technologies?.length > 4 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">+{exp.technologies.length - 4} more</span>
                )}
              </div>

              <div className="flex space-x-2">
                <button onClick={() => handleOpenModal(exp)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-300">Edit</button>
                <button onClick={() => handleDelete(exp.id)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{editingExperience ? 'Edit Experience' : 'Create Experience'}</h3>
              {isPanelOpen ? renderForm() : <p className="text-gray-400 text-sm">Select an experience to edit, or click "Add New Experience".</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <SidePanel title={editingExperience ? 'Edit Experience' : 'Add New Experience'} isOpen={isPanelOpen} onClose={handleCloseModal} size="lg">
          {renderForm()}
        </SidePanel>
      </div>
    </div>
  )
}

export default ExperienceManager
