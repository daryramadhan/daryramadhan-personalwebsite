import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects, Project } from '../data/projects';
import { supabase } from '../lib/supabase';

interface ProjectModalProps {
  projectId: string;
}

export function ProjectModal({ projectId }: ProjectModalProps) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const [dynamicProject, setDynamicProject] = useState<Project | null>(null);

  const projectIndex = projects.findIndex(p => p.id === projectId);
  const staticProject = projectIndex !== -1 ? projects[projectIndex] : null;
  const project = staticProject || dynamicProject;

  // Calculate next project (fallback to first project if dynamic)
  const nextProject = projectIndex !== -1
    ? projects[(projectIndex + 1) % projects.length]
    : projects[0];

  useEffect(() => {
    if (!staticProject && projectId) {
      const fetchProject = async () => {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (data) {
          setDynamicProject(data as Project);
        }
      };
      fetchProject();
    }
  }, [projectId, staticProject]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!project) return null;

  const handleClose = () => {
    navigate('/');
  };

  const handleNextProject = () => {
    navigate(`/project/${nextProject.id}`);
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2 }}
        onClick={handleClose}
        className="absolute top-2 right-2 z-[70] w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-colors hover:bg-white/10"
      >
        <X size={20} className="text-white" />
      </motion.button>

      {/* Bottom Sheet Container */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="absolute bottom-0 left-0 right-0 top-16 sm:top-14 bg-white rounded-t-[1rem] overflow-hidden pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col"
      >
        {/* Scrollable Content */}
        <div
          ref={modalRef}
          className="overflow-y-auto h-full w-full"
        >
          {/* Header / Hero Section */}
          <div className="relative w-full h-[50vh] sm:h-[65vh]">
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 xl:px-[350px] 2xl:px-[400px] flex justify-start text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl w-full"
              >
                <div className="flex flex-wrap gap-3 mb-6 justify-start">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10 uppercase tracking-wide">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10 font-mono">
                    {project.year}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-2">
                  {project.title}
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Single Column Content */}
          <div className="px-6 py-16 sm:px-12 xl:px-[350px] 2xl:px-[400px] max-w-none">

            {/* Project Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 pb-12 border-b border-gray-100">
              <div>
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Client</h3>
                <p className="text-sm font-medium text-gray-900">{project.client || "Confidential"}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Role</h3>
                <p className="text-sm font-medium text-gray-900">{project.role || "Design & Development"}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Link</h3>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                  Visit Live Site <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Overview / Blog Content */}
            <div className="space-y-16">

              <div className="prose prose-lg prose-gray max-w-none [&_p]:min-h-[1em] [&_p:empty]:min-h-[1em]">
                {/* Render HTML content if it's from the editor, otherwise simple text */}
                <div dangerouslySetInnerHTML={{ __html: project.description || '' }} />
              </div>

              {/* Stacked Images */}
              <div className="space-y-8 md:space-y-12">
                {project.images?.map((img, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    key={i}
                    className="w-full rounded-sm overflow-hidden bg-gray-50 shadow-sm"
                  >
                    <img src={img} alt={`Detail ${i + 1}`} className="w-full h-auto object-cover" />
                  </motion.div>
                ))}

              </div>

            </div>
          </div>

          {/* Next Project Teaser */}
          <div
            onClick={handleNextProject}
            className="relative w-full h-[45vh] rounded-t-[1rem] bg-black cursor-pointer group overflow-hidden"
          >
            <img
              src={nextProject.image}
              alt="Next Project"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-500"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-4 text-center">
              <span className="text-xs font-mono uppercase tracking-wider mb-4 opacity-70">Next Project</span>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 group-hover:scale-105 transition-transform duration-700 ease-out">
                {nextProject.title}
              </h2>
              <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full group-hover:bg-white group-hover:text-black transition-all duration-300">
                <span>View Case Study</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
