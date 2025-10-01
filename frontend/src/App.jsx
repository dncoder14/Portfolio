import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';

// Context
import { AppProvider } from './context/AppContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Components
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

function PortfolioApp() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // GSAP ScrollTrigger integration
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Preloader timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <AppProvider>
      <div className="App relative min-h-screen bg-black text-white overflow-x-hidden">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#00ff00',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff0000',
                secondary: '#000',
              },
            },
          }}
        />

        <ScrollProgress />
        <Navigation />

        <main className="relative z-10">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Certificates />
          <Contact />
        </main>
      </div>
    </AppProvider>
  );
}

function AdminLoginApp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return <AdminLogin onLogin={() => navigate('/admin/dashboard')} />;
}

function AdminDashboardApp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdmin();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function App() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<PortfolioApp />} />
          <Route path="/admin" element={<AdminLoginApp />} />
          <Route path="/admin/dashboard" element={<AdminDashboardApp />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;