import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useAdmin } from '../../context/AdminContext'
import ProjectsManager from './ProjectsManager'
import CertificatesManager from './CertificatesManager'
import ContactsManager from './ContactsManager'
import UserInfoManager from './UserInfoManager'
import ChangePassword from './ChangePassword'

const AdminDashboard = () => {
  const { 
    admin, 
    stats, 
    fetchDashboardData, 
    isLoading, 
    logout 
  } = useAdmin()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const dashboardRef = useRef()
  const statsRef = useRef()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const tl = gsap.timeline()

    // Initial setup
    gsap.set([dashboardRef.current, statsRef.current], {
      opacity: 0,
      y: 30
    })

    // Animate elements
    tl.to(dashboardRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    .to(statsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.3")

  }, [])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'certificates', label: 'Certificates', icon: '🏆' },
    { id: 'contacts', label: 'Contacts', icon: '📧' },
    { id: 'userinfo', label: 'User Info', icon: '👤' }
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/admin'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (showChangePassword) {
    return <ChangePassword onBack={() => setShowChangePassword(false)} />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono' }}>
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {admin?.username}</span>
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-green-400 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div ref={dashboardRef}>
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-400/20 rounded-lg">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Projects</p>
                      <p className="text-2xl font-bold text-white">{stats.projects}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-400/20 rounded-lg">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Certificates</p>
                      <p className="text-2xl font-bold text-white">{stats.certificates}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-400/20 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Total Contacts</p>
                      <p className="text-2xl font-bold text-white">{stats.contacts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-400/20 rounded-lg">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Unread Messages</p>
                      <p className="text-2xl font-bold text-white">{stats.unreadContacts}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-300"
                  >
                    <div className="text-green-400 text-2xl mb-2">💼</div>
                    <h4 className="text-white font-medium">Manage Projects</h4>
                    <p className="text-gray-400 text-sm">Add, edit, or delete projects</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('certificates')}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-300"
                  >
                    <div className="text-blue-400 text-2xl mb-2">🏆</div>
                    <h4 className="text-white font-medium">Manage Certificates</h4>
                    <p className="text-gray-400 text-sm">Add, edit, or delete certificates</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors duration-300"
                  >
                    <div className="text-yellow-400 text-2xl mb-2">📧</div>
                    <h4 className="text-white font-medium">View Messages</h4>
                    <p className="text-gray-400 text-sm">Read and manage contact messages</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'certificates' && <CertificatesManager />}
          {activeTab === 'contacts' && <ContactsManager />}
          {activeTab === 'userinfo' && <UserInfoManager />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
