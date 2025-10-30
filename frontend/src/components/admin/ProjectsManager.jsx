import React, { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'
import SidePanel from './SidePanel'

const ProjectsManager = () => {
  const { projects, createProject, updateProject, deleteProject } = useAdmin()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    technologies: [],
    featured: false
  })
  const [newTech, setNewTech] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const projectsRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(projectsRef.current?.children, {
      opacity: 0,
      y: 20
    })

    tl.to(projectsRef.current?.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    })

  }, [projects])

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl || '',
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        technologies: project.technologies || [],
        featured: project.featured || false
      })
    } else {
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        githubUrl: '',
        demoUrl: '',
        technologies: [],
        featured: false
      })
    }
    setIsPanelOpen(true)
  }

  const handleCloseModal = () => {
    setIsPanelOpen(false)
    setEditingProject(null)
    setImageFile(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      technologies: [],
      featured: false
    })
  }

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('projectImage', file)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/upload`, {
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
      
      // Upload image if a new file is selected
      if (imageFile) {
        try {
          const imageUrl = await handleImageUpload(imageFile)
          finalFormData.imageUrl = imageUrl
        } catch (error) {
          toast.error('Failed to upload image: ' + error.message)
          setUploading(false)
          return
        }
      }
      
      const result = editingProject 
        ? await updateProject(editingProject.id, finalFormData)
        : await createProject(finalFormData)
      
      if (result.success) {
        toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
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
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await deleteProject(id)
      if (result.success) {
        toast.success('Project deleted successfully!')
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

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-400 file:text-black hover:file:bg-green-500"
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img src={formData.imageUrl} alt="Current" className="w-20 h-20 object-cover rounded" />
            <p className="text-xs text-gray-400 mt-1">Current image</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
          <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL</label>
          <input type="url" value={formData.demoUrl} onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
        </div>
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
      <div className="flex items-center">
        <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400" />
        <label htmlFor="featured" className="ml-2 text-sm text-gray-300">Featured Project</label>
      </div>
      <div className="flex space-x-4 pt-2">
        <button 
          type="submit" 
          disabled={uploading}
          className="px-6 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-500 text-black font-semibold rounded transition-colors duration-300"
        >
          {uploading ? 'Uploading...' : (editingProject ? 'Update' : 'Create')}
        </button>
        <button type="button" onClick={handleCloseModal} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300">Cancel</button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-lg transition-colors duration-300"
        >
          Add New Project
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(360px,520px)] lg:gap-6">
        <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className={`bg-gray-800 rounded-lg p-6 ${editingProject?.id === project.id ? 'ring-2 ring-green-400' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              {project.featured && (
                <span className="px-2 py-1 bg-green-400 text-black text-xs rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies?.slice(0, 3).map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenModal(project)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-300"
              >
                Delete
              </button>
            </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{editingProject ? 'Edit Project' : 'Create Project'}</h3>
              {isPanelOpen ? (
                renderForm()
              ) : (
                <p className="text-gray-400 text-sm">Select a project to edit, or click "Add New Project".</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <SidePanel
          title={editingProject ? 'Edit Project' : 'Add New Project'}
          isOpen={isPanelOpen}
          onClose={handleCloseModal}
          size="lg"
        >
          {renderForm()}
        </SidePanel>
      </div>
    </div>
  )
}

export default ProjectsManager
