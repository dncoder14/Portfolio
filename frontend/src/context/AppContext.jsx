import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const AppContext = createContext()

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Initial state
const initialState = {
  userInfo: null,
  projects: [],
  certificates: [],
  isLoading: true,
  error: null,
  currentSection: 'hero',
  isMenuOpen: false,
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CERTIFICATES: 'SET_CERTIFICATES',
  SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
  TOGGLE_MENU: 'TOGGLE_MENU',
  CLOSE_MENU: 'CLOSE_MENU',
}

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    case ActionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload, isLoading: false }
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload, isLoading: false }
    case ActionTypes.SET_CERTIFICATES:
      return { ...state, certificates: action.payload, isLoading: false }
    case ActionTypes.SET_CURRENT_SECTION:
      return { ...state, currentSection: action.payload }
    case ActionTypes.TOGGLE_MENU:
      return { ...state, isMenuOpen: !state.isMenuOpen }
    case ActionTypes.CLOSE_MENU:
      return { ...state, isMenuOpen: false }
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      const response = await axios.get(`${API_BASE_URL}/userinfo`)
      dispatch({ type: ActionTypes.SET_USER_INFO, payload: response.data })
    } catch (error) {
      console.error('Error fetching user info:', error)
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load user information' })
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`)
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: response.data })
    } catch (error) {
      console.error('Error fetching projects:', error)
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load projects' })
    }
  }

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificates`)
      dispatch({ type: ActionTypes.SET_CERTIFICATES, payload: response.data })
    } catch (error) {
      console.error('Error fetching certificates:', error)
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load certificates' })
    }
  }

  // Submit contact form
  const submitContactForm = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send message' 
      }
    }
  }

  // Set current section
  const setCurrentSection = (section) => {
    dispatch({ type: ActionTypes.SET_CURRENT_SECTION, payload: section })
  }

  // Toggle menu
  const toggleMenu = () => {
    dispatch({ type: ActionTypes.TOGGLE_MENU })
  }

  // Close menu
  const closeMenu = () => {
    dispatch({ type: ActionTypes.CLOSE_MENU })
  }

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUserInfo(),
        fetchProjects(),
        fetchCertificates(),
      ])
    }
    loadData()
  }, [])

  const value = {
    ...state,
    fetchUserInfo,
    fetchProjects,
    fetchCertificates,
    submitContactForm,
    setCurrentSection,
    toggleMenu,
    closeMenu,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
