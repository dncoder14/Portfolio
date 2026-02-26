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
  experiences: [],
  isLoading: false,
  loadingStates: {
    userInfo: true,
    projects: true,
    certificates: true,
    experiences: true,
  },
  errorStates: {
    userInfo: false,
    projects: false,
    certificates: false,
    experiences: false,
  },
  error: null,
  currentSection: 'hero',
  isMenuOpen: false,
  debugMode: window.location.search.includes('debug=loading'),
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CERTIFICATES: 'SET_CERTIFICATES',
  SET_EXPERIENCES: 'SET_EXPERIENCES',
  SET_USER_INFO_ERROR: 'SET_USER_INFO_ERROR',
  SET_PROJECTS_ERROR: 'SET_PROJECTS_ERROR',
  SET_CERTIFICATES_ERROR: 'SET_CERTIFICATES_ERROR',
  SET_EXPERIENCES_ERROR: 'SET_EXPERIENCES_ERROR',
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
      return { ...state, error: action.payload }
    case ActionTypes.SET_USER_INFO:
      return { 
        ...state, 
        userInfo: action.payload, 
        loadingStates: { ...state.loadingStates, userInfo: false }
      }
    case ActionTypes.SET_PROJECTS:
      return { 
        ...state, 
        projects: action.payload, 
        loadingStates: { ...state.loadingStates, projects: false }
      }
    case ActionTypes.SET_CERTIFICATES:
      return { 
        ...state, 
        certificates: action.payload, 
        loadingStates: { ...state.loadingStates, certificates: false }
      }
    case ActionTypes.SET_EXPERIENCES:
      return { 
        ...state, 
        experiences: action.payload, 
        loadingStates: { ...state.loadingStates, experiences: false }
      }
    case ActionTypes.SET_USER_INFO_ERROR:
      return { 
        ...state, 
        errorStates: { ...state.errorStates, userInfo: true },
        loadingStates: { ...state.loadingStates, userInfo: false }
      }
    case ActionTypes.SET_PROJECTS_ERROR:
      return { 
        ...state, 
        errorStates: { ...state.errorStates, projects: true },
        loadingStates: { ...state.loadingStates, projects: false }
      }
    case ActionTypes.SET_CERTIFICATES_ERROR:
      return { 
        ...state, 
        errorStates: { ...state.errorStates, certificates: true },
        loadingStates: { ...state.loadingStates, certificates: false }
      }
    case ActionTypes.SET_EXPERIENCES_ERROR:
      return { 
        ...state, 
        errorStates: { ...state.errorStates, experiences: true },
        loadingStates: { ...state.loadingStates, experiences: false }
      }
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
      const response = await axios.get(`${API_BASE_URL}/userinfo`, { timeout: 30000 })
      dispatch({ type: ActionTypes.SET_USER_INFO, payload: response.data })
    } catch (error) {
      console.error('Error fetching user info:', error)
      dispatch({ type: ActionTypes.SET_USER_INFO_ERROR })
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, { timeout: 30000 })
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: response.data })
    } catch (error) {
      console.error('Error fetching projects:', error)
      dispatch({ type: ActionTypes.SET_PROJECTS_ERROR })
    }
  }

  // Fetch certificates
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificates`, { timeout: 30000 })
      dispatch({ type: ActionTypes.SET_CERTIFICATES, payload: response.data })
    } catch (error) {
      console.error('Error fetching certificates:', error)
      dispatch({ type: ActionTypes.SET_CERTIFICATES_ERROR })
    }
  }

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/experience`, { timeout: 30000 })
      dispatch({ type: ActionTypes.SET_EXPERIENCES, payload: response.data })
    } catch (error) {
      console.error('Error fetching experiences:', error)
      dispatch({ type: ActionTypes.SET_EXPERIENCES_ERROR })
    }
  }

  // Submit contact form
  const submitContactForm = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, formData)
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Error submitting contact form:', err)

      // Normalize common backend validation shape: { errors: [{ msg }...] }
      const validatorErrors = err.response?.data?.errors
      if (Array.isArray(validatorErrors) && validatorErrors.length > 0) {
        return { success: false, error: validatorErrors[0]?.msg || 'Invalid input' }
      }

      // Normalize { error: string } or { code, message }
      const raw = err.response?.data?.error || err.message || err.code
      const errorMessage = typeof raw === 'string' ? raw : (raw?.message || 'Failed to send message')

      return { success: false, error: errorMessage }
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
      console.log('Starting data fetch...', 'Debug mode:', state.debugMode)
      
      // If debug mode is enabled, stay in loading state
      if (state.debugMode) {
        console.log('Debug mode enabled - staying in loading state')
        return
      }
      
      try {
        await Promise.all([
          fetchUserInfo(),
          fetchProjects(),
          fetchCertificates(),
          fetchExperiences(),
        ])
        
        console.log('Data fetch completed')
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [state.debugMode])

  // Check if all data is loaded (either success or error)
  const allDataLoaded = !Object.values(state.loadingStates).some(loading => loading)
  const hasErrors = Object.values(state.errorStates).some(error => error)

  const value = {
    ...state,
    allDataLoaded,
    hasErrors,
    fetchUserInfo,
    fetchProjects,
    fetchCertificates,
    fetchExperiences,
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
