import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

export function SelectedWork() {
  const { projects } = useProjects();
  // Filter selected works
  // Logic: If it has project_type 'selected_work', OR if it's NOT a case study (legacy fallback)
  const selectedWorks = projects.filter((p, i) =>
    p.is_published !== false && (p.project_type === 'selected_work' || (!p.project_type && i >= 3))
  );

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left Column: Sticky Title & Info (Matches Hero Logic) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 mb-8"
            >Selected <br /> Works</motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                A curated selection of projects that showcase my passion for clean design, interactivity, and user-centric problem solving.
              </p>

              <div className="flex items-center gap-4">
                <a href="#" className="inline-flex items-center text-sm font-medium text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity">
                  View Archive
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: The Bento Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedWorks.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`group relative overflow-hidden rounded-none bg-gray-200 ${project.className}`}
                >
                  <Link to={`/project/${project.id}`} className="block w-full h-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay - Minimalist Style */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex justify-between items-end">
                        <div className="text-white">
                          <span className="text-xs font-mono uppercase tracking-wider opacity-80 mb-2 block">{project.category} — {project.year}</span>
                          <h3 className="text-2xl font-medium">{project.title}</h3>
                        </div>
                        <div className="bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
