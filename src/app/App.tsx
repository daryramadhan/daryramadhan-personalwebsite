import React from 'react';
import { BrowserRouter as Router, Routes, Route, useMatch, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CaseStudies } from './components/CaseStudies';
import { SelectedWork } from './components/SelectedWork';
import { Services } from './components/Services';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';

import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/admin/Login';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ProjectEditor } from './pages/admin/ProjectEditor';

// Separate component to handle the conditional modal rendering inside the Router context
function AppContent() {
  const match = useMatch('/project/:id');
  const location = useLocation();

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <CaseStudies />
          <SelectedWork />
          <Services />
          <CTA />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {match && match.params.id && (
          <ProjectModal projectId={match.params.id} key="modal" />
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<AppContent />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create" element={<ProjectEditor />} />
            <Route path="edit/:id" element={<ProjectEditor />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
