import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useProjects } from '../hooks/useProjects';

export function CaseStudies() {
  const { projects } = useProjects();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter only the case studies (supporting both new dynamic type and legacy static slice)
  // Logic: If it has project_type 'case_study', OR if it's one of the first 3 static items (legacy)
  const caseStudies = projects.filter((p, i) =>
    p.is_published !== false && (p.project_type === 'case_study' || (!p.project_type && i < 3))
  );
  const totalSlides = caseStudies.length + 1; // +1 for "View All" card

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="case-studies" className="py-12 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Sticky Title & Info */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start flex flex-col justify-between h-full min-h-[200px]">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 mb-4"
              >Case <br /> Studies</motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                  Deep dives into my process, strategy, and execution for complex digital products.
                </p>

                <div className="hidden lg:flex gap-3">
                  <button
                    onClick={scrollPrev}
                    disabled={!prevBtnEnabled}
                    className={`w-10 h-10 border border-gray-200 flex items-center justify-center rounded-full transition-colors ${prevBtnEnabled ? 'text-black hover:bg-gray-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    onClick={scrollNext}
                    disabled={!nextBtnEnabled}
                    className={`w-10 h-10 border border-gray-200 flex items-center justify-center rounded-full transition-colors ${nextBtnEnabled ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-100 text-gray-300 cursor-not-allowed border-none'
                      }`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="hidden lg:block mt-12">
              <span className="text-xs font-mono uppercase text-gray-400">
                {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right Column: Embla Carousel */}
          <div className="lg:col-span-8 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 touch-pan-y">
              {caseStudies.map((project, index) => (
                <div
                  key={project.id}
                  className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] group"
                >
                  <Link to={`/project/${project.id}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-200 pb-3 group-hover:border-black transition-colors duration-300">
                      <div>
                        <h3 className="text-2xl font-medium text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-gray-500">{project.category}</p>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{project.year}</span>
                    </div>
                  </Link>
                </div>
              ))}

              {/* View All Card */}
              <div className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] flex items-center justify-center">
                <a href="#work" className="group flex flex-col items-center justify-center w-full h-full aspect-[4/3] bg-gray-50 border border-gray-200 hover:bg-black hover:border-black transition-all duration-300">
                  <span className="text-2xl font-medium text-gray-900 group-hover:text-white mb-3">View All</span>
                  <div className="w-10 h-10 rounded-full border border-gray-300 group-hover:border-white/30 flex items-center justify-center text-gray-900 group-hover:text-white transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
