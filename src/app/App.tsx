import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useMatch, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroPartnersWrapper } from './components/HeroPartnersWrapper';
import { CaseStudies } from './components/CaseStudies';
import { SelectedWork } from './components/SelectedWork';
import { Services } from './components/Services';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';

import { AuthProvider } from './context/AuthContext';

// Lazy load admin components to reduce initial bundle size
const Login = lazy(() => import('./pages/admin/Login').then(m => ({ default: m.Login })));
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectEditor = lazy(() => import('./pages/admin/ProjectEditor').then(m => ({ default: m.ProjectEditor })));
const PartnersManager = lazy(() => import('./pages/admin/PartnersManager').then(m => ({ default: m.PartnersManager })));

// Separate component to handle the conditional modal rendering inside the Router context
function AppContent() {
  const match = useMatch('/project/:id');
  const location = useLocation();

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
        <Navbar />
        <main>
          <HeroPartnersWrapper />
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
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
              <Route path="partners" element={<PartnersManager />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
