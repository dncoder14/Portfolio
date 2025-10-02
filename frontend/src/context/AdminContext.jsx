import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create a dedicated axios instance for API requests
const api = axios.create({
  baseURL: API_BASE_URL
});

// Initial state
const initialState = {
  isAuthenticated: false,
  admin: null,
  token: localStorage.getItem('adminToken'),
  isLoading: true,
  error: null,
  projects: [],
  certificates: [],
  contacts: [],
  userInfo: null,
  skills: [],
  userSkills: [],
  stats: {
    projects: 0,
    certificates: 0,
    contacts: 0,
    unreadContacts: 0
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CERTIFICATES: 'SET_CERTIFICATES',
  SET_CONTACTS: 'SET_CONTACTS',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_STATS: 'SET_STATS',
  SET_SKILLS: 'SET_SKILLS',
  SET_USER_SKILLS: 'SET_USER_SKILLS',
  ADD_SKILL: 'ADD_SKILL',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_CERTIFICATE: 'ADD_CERTIFICATE',
  UPDATE_CERTIFICATE: 'UPDATE_CERTIFICATE',
  DELETE_CERTIFICATE: 'DELETE_CERTIFICATE',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO'
};

// Reducer
function adminReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        token: action.payload.token,
        isLoading: false,
        error: null
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        token: null,
        isLoading: false
      };
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload, isLoading: false };
    case ActionTypes.SET_CERTIFICATES:
      return { ...state, certificates: action.payload, isLoading: false };
    case ActionTypes.SET_CONTACTS:
      return { ...state, contacts: action.payload, isLoading: false };
    case ActionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload, isLoading: false };
    case ActionTypes.SET_STATS:
      return { ...state, stats: action.payload, isLoading: false };
    case ActionTypes.SET_SKILLS:
      return { ...state, skills: action.payload, isLoading: false };
    case ActionTypes.SET_USER_SKILLS:
      return { ...state, userSkills: action.payload, isLoading: false };
    case ActionTypes.ADD_SKILL:
      return { ...state, skills: [...state.skills, action.payload] };
    case ActionTypes.ADD_PROJECT:
      return { ...state, projects: [...state.projects, action.payload] };
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case ActionTypes.ADD_CERTIFICATE:
      return { ...state, certificates: [...state.certificates, action.payload] };
    case ActionTypes.UPDATE_CERTIFICATE:
      return {
        ...state,
        certificates: state.certificates.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case ActionTypes.DELETE_CERTIFICATE:
      return {
        ...state,
        certificates: state.certificates.filter(c => c.id !== action.payload)
      };
    case ActionTypes.UPDATE_USER_INFO:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
}

// Provider component
export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Set up axios interceptor for auth
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await api.get('/admin/verify');
          dispatch({
            type: ActionTypes.LOGIN_SUCCESS,
            payload: {
              admin: response.data.user,
              token: state.token
            }
          });
        } catch (error) {
          dispatch({ type: ActionTypes.LOGOUT });
          localStorage.removeItem('adminToken');
        }
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };
    checkAuth();
  }, [state.token]);

  // Login
  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await api.post('/admin/login', credentials);

      const { token, admin } = response.data;
      localStorage.setItem('adminToken', token);

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { admin, token }
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    dispatch({ type: ActionTypes.LOGOUT });
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, certificatesRes, contactsRes, userInfoRes, skillsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/projects'),
        api.get('/certificates'),
        api.get('/contact'),
        api.get('/userinfo'),
        api.get('/skills')
      ]);

      dispatch({ type: ActionTypes.SET_STATS, payload: statsRes.data.stats });
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: projectsRes.data });
      dispatch({ type: ActionTypes.SET_CERTIFICATES, payload: certificatesRes.data });
      dispatch({ type: ActionTypes.SET_CONTACTS, payload: contactsRes.data });
      dispatch({ type: ActionTypes.SET_USER_INFO, payload: userInfoRes.data });
      dispatch({ type: ActionTypes.SET_SKILLS, payload: skillsRes.data });
      
      // Fetch user skills if user exists
      if (userInfoRes.data?.id) {
        const userSkillsRes = await api.get(`/skills/user/${userInfoRes.data.id}`);
        dispatch({ type: ActionTypes.SET_USER_SKILLS, payload: userSkillsRes.data });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load dashboard data' });
    }
  };

  // Project CRUD operations
  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create project' };
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update project' };
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete project' };
    }
  };

  // Certificate CRUD operations
  const createCertificate = async (certificateData) => {
    try {
      const response = await api.post('/certificates', certificateData);
      dispatch({ type: ActionTypes.ADD_CERTIFICATE, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create certificate' };
    }
  };

  const updateCertificate = async (id, certificateData) => {
    try {
      const response = await api.put(`/certificates/${id}`, certificateData);
      dispatch({ type: ActionTypes.UPDATE_CERTIFICATE, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update certificate' };
    }
  };

  const deleteCertificate = async (id) => {
    try {
      await api.delete(`/certificates/${id}`);
      dispatch({ type: ActionTypes.DELETE_CERTIFICATE, payload: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete certificate' };
    }
  };

  // Update user info
  const updateUserInfo = async (userData) => {
    try {
      const response = await api.put('/userinfo', userData);
      dispatch({ type: ActionTypes.UPDATE_USER_INFO, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update user info' };
    }
  };

  // Mark contact as read
  const markContactAsRead = async (id) => {
    try {
      const response = await api.put(`/contact/${id}/read`);
      dispatch({
        type: ActionTypes.SET_CONTACTS,
        payload: state.contacts.map(contact =>
          contact.id === id ? { ...contact, read: true } : contact
        )
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to mark contact as read' };
    }
  };

  // Skills management
  const createSkill = async (skillData) => {
    try {
      const response = await api.post('/skills', skillData);
      dispatch({ type: ActionTypes.ADD_SKILL, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create skill' };
    }
  };

  const updateUserSkills = async (userId, skillIds) => {
    try {
      const response = await api.post(`/skills/user/${userId}`, { skillIds });
      dispatch({ type: ActionTypes.SET_USER_SKILLS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update user skills' };
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      dispatch({ type: ActionTypes.SET_SKILLS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch skills' };
    }
  };

  const fetchUserSkills = async (userId) => {
    try {
      const response = await api.get(`/skills/user/${userId}`);
      dispatch({ type: ActionTypes.SET_USER_SKILLS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch user skills' };
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await api.post('/userinfo/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update user info with new profile image
      dispatch({ 
        type: ActionTypes.UPDATE_USER_INFO, 
        payload: { ...state.userInfo, profileImage: response.data.profileImageUrl }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to upload profile image' };
    }
  };

  // Upload CV
  const uploadCV = async (file) => {
    try {
      const formData = new FormData();
      formData.append('cvFile', file);
      
      const response = await api.post('/userinfo/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update user info with new CV URL
      dispatch({ 
        type: ActionTypes.UPDATE_USER_INFO, 
        payload: { ...state.userInfo, cvUrl: response.data.cvUrl }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to upload CV' };
    }
  };

  const value = {
    ...state,
    login,
    logout,
    fetchDashboardData,
    createProject,
    updateProject,
    deleteProject,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    updateUserInfo,
    markContactAsRead,
    createSkill,
    updateUserSkills,
    fetchSkills,
    fetchUserSkills,
    uploadProfileImage,
    uploadCV
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook to use the admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export default AdminContext;