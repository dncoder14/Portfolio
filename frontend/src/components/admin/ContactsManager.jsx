import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'
import SidePanel from './SidePanel'

const ContactsManager = () => {
  const { contacts, markContactAsRead } = useAdmin()
  const [selectedContact, setSelectedContact] = useState(null)
  const [filter, setFilter] = useState('all') // all, read, unread
  const contactsRef = useRef()
  const modalRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline()

    gsap.set(contactsRef.current?.children, {
      opacity: 0,
      y: 20
    })

    tl.to(contactsRef.current?.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    })

  }, [contacts])

  // Auto-scroll to modal when it opens
  useEffect(() => {
    if (selectedContact && modalRef.current) {
      modalRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }
  }, [selectedContact])

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'read') return contact.read
    if (filter === 'unread') return !contact.read
    return true
  })

  const handleMarkAsRead = async (id) => {
    const result = await markContactAsRead(id)
    if (result.success) {
      toast.success('Message marked as read')
    } else {
      toast.error(result.error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_minmax(320px,480px)] lg:gap-6">
        <div ref={contactsRef} className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No messages found</div>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-700 ${
                  !contact.read ? 'border-l-4 border-green-400' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                      {!contact.read && (
                        <span className="px-2 py-1 bg-green-400 text-black text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{contact.email}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{contact.message}</p>
                    <p className="text-gray-500 text-xs mt-2">{formatDate(contact.createdAt)}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!contact.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(contact.id)
                        }}
                        className="px-3 py-1 bg-green-400 hover:bg-green-500 text-black text-xs rounded transition-colors duration-300"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Message Details</h3>
              {selectedContact ? (
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <p className="text-white">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <p className="text-white">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                      <p className="text-white">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                      <span className={`px-2 py-1 rounded text-xs ${selectedContact.read ? 'bg-gray-600 text-gray-300' : 'bg-green-400 text-black'}`}>{selectedContact.read ? 'Read' : 'Unread'}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                      <div className="bg-gray-700 rounded p-4 text-white whitespace-pre-wrap">{selectedContact.message}</div>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      {!selectedContact.read && (
                        <button onClick={() => { handleMarkAsRead(selectedContact.id); setSelectedContact({ ...selectedContact, read: true }) }} className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded transition-colors duration-300">Mark as Read</button>
                      )}
                      <a href={`mailto:${selectedContact.email}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-300">Reply via Email</a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Select a message to view details.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <SidePanel
          title="Message Details"
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          size="sm"
        >
          {selectedContact && (
            <div ref={modalRef}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <p className="text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <p className="text-white">{formatDate(selectedContact.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded text-xs ${selectedContact.read ? 'bg-gray-600 text-gray-300' : 'bg-green-400 text-black'}`}>{selectedContact.read ? 'Read' : 'Unread'}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                  <div className="bg-gray-700 rounded p-4 text-white whitespace-pre-wrap">{selectedContact.message}</div>
                </div>
                <div className="flex space-x-4 pt-4">
                  {!selectedContact.read && (
                    <button onClick={() => { handleMarkAsRead(selectedContact.id); setSelectedContact({ ...selectedContact, read: true }) }} className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded transition-colors duration-300">Mark as Read</button>
                  )}
                  <a href={`mailto:${selectedContact.email}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-300">Reply via Email</a>
                  <button onClick={() => setSelectedContact(null)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-300">Close</button>
                </div>
              </div>
            </div>
          )}
        </SidePanel>
      </div>
    </div>
  )
}

export default ContactsManager
