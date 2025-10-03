import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'
import SidePanel from './SidePanel'

const CertificatesManager = () => {
  const { certificates, createCertificate, updateCertificate, deleteCertificate } = useAdmin()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    date: '',
    certificateUrl: '',
    imageUrl: ''
  })
  const certificatesRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(certificatesRef.current?.children, {
      opacity: 0,
      y: 20
    })

    tl.to(certificatesRef.current?.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    })

  }, [certificates])

  const handleOpenModal = (certificate = null) => {
    if (certificate) {
      setEditingCertificate(certificate)
      setFormData({
        title: certificate.title,
        organization: certificate.organization,
        date: certificate.date ? new Date(certificate.date).toISOString().split('T')[0] : '',
        certificateUrl: certificate.certificateUrl || '',
        imageUrl: certificate.imageUrl || ''
      })
    } else {
      setEditingCertificate(null)
      setFormData({
        title: '',
        organization: '',
        date: '',
        certificateUrl: '',
        imageUrl: ''
      })
    }
    setIsPanelOpen(true)
  }

  const handleCloseModal = () => {
    setIsPanelOpen(false)
    setEditingCertificate(null)
    setFormData({
      title: '',
      organization: '',
      date: '',
      certificateUrl: '',
      imageUrl: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const result = editingCertificate 
        ? await updateCertificate(editingCertificate.id, formData)
        : await createCertificate(formData)
      
      if (result.success) {
        toast.success(editingCertificate ? 'Certificate updated successfully!' : 'Certificate created successfully!')
        handleCloseModal()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      const result = await deleteCertificate(id)
      if (result.success) {
        toast.success('Certificate deleted successfully!')
      } else {
        toast.error(result.error)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Organization *</label>
        <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
        <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Certificate URL</label>
        <input type="url" value={formData.certificateUrl} onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
        <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400" />
      </div>
      <div className="flex space-x-4 pt-2">
        <button type="submit" className="px-6 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded transition-colors duration-300">{editingCertificate ? 'Update' : 'Create'}</button>
        <button type="button" onClick={handleCloseModal} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300">Cancel</button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Certificates Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-lg transition-colors duration-300"
        >
          Add New Certificate
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(340px,500px)] lg:gap-6">
        <div ref={certificatesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className={`bg-gray-800 rounded-lg p-6 ${editingCertificate?.id === certificate.id ? 'ring-2 ring-green-400' : ''}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">{certificate.title}</h3>
              <p className="text-gray-300 text-sm mb-2">{certificate.organization}</p>
              <p className="text-gray-400 text-xs">{formatDate(certificate.date)}</p>
            </div>

            {certificate.imageUrl && (
              <div className="mb-4">
                <img 
                  src={certificate.imageUrl} 
                  alt={certificate.title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenModal(certificate)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(certificate.id)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-300"
              >
                Delete
              </button>
            </div>

            {certificate.certificateUrl && (
              <div className="mt-3">
                <a
                  href={certificate.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-3 py-2 bg-green-400 hover:bg-green-500 text-black text-sm rounded text-center transition-colors duration-300"
                >
                  View Certificate
                </a>
              </div>
            )}
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{editingCertificate ? 'Edit Certificate' : 'Create Certificate'}</h3>
              {isPanelOpen ? (
                renderForm()
              ) : (
                <p className="text-gray-400 text-sm">Select a certificate to edit, or click "Add New Certificate".</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <SidePanel
          title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
          isOpen={isPanelOpen}
          onClose={handleCloseModal}
          size="md"
        >
          {renderForm()}
        </SidePanel>
      </div>
    </div>
  )
}

export default CertificatesManager
