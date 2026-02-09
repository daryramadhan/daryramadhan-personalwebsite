import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [time, setTime] = useState('');
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    setIsProjectsOpen(false);

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Case Studies', id: 'case-studies' },
    { name: 'Selected Works', id: 'projects' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-8 px-6 sm:px-12 mix-blend-difference text-white">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-2 md:grid-cols-12 items-baseline">

          {/* Left: Brand */}
          <div className="col-span-1 md:col-span-3">
            <a
              href="#"
              onClick={(e) => scrollToSection(e, 'top')}
              className="font-medium text-xs md:text-sm tracking-wide uppercase hover:opacity-70 transition-opacity text-gray-300"
            >DARY RAMADHAN</a>
          </div>

          {/* Center: Time & Projects Dropdown (Desktop) */}
          <div className="hidden md:flex col-span-6 justify-center items-baseline gap-12 text-xs md:text-sm font-medium uppercase tracking-wide relative">
            <span className="text-gray-400 tabular-nums">{time} JKT</span>

            <div className="relative" ref={projectsRef}>
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className="flex text-xs md:text-sm font-medium items-center gap-1 hover:opacity-70 transition-opacity focus:outline-none"
              >
                PROJECTS
                <ChevronDown size={14} className={`transition-transform duration-300 ${isProjectsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProjectsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-6 py-4 px-6 bg-white text-black min-w-[180px] flex flex-col gap-3 shadow-2xl"
                  >
                    <a
                      href="#case-studies"
                      onClick={(e) => scrollToSection(e, 'case-studies')}
                      className="whitespace-nowrap hover:opacity-50 transition-opacity"
                    >
                      Case Studies
                    </a>
                    <a
                      href="#projects"
                      onClick={(e) => scrollToSection(e, 'projects')}
                      className="whitespace-nowrap hover:opacity-50 transition-opacity"
                    >
                      Selected Works
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:opacity-70 transition-opacity">Contact</a>
          </div>

          {/* Right: Secondary Links (Desktop) */}
          <div className="hidden md:flex col-span-3 justify-end items-baseline gap-8 text-xs md:text-sm font-medium uppercase tracking-wide">
            <a href="/daryramadhan-resume.pdf" download="Dary Ramadhan - Resume 2026.pdf" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity text-gray-400 hover:text-white">Download Latest Resume</a>
            <a href="mailto:hello@daryramadhan.com" className="hover:opacity-70 transition-opacity cursor-pointer">Schedule CALL</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden col-span-1 flex justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none hover:opacity-70 transition-opacity"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white text-black z-40 pt-32 px-4 sm:px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="text-4xl md:text-5xl font-medium tracking-tight hover:text-gray-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-2 gap-8">
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider mb-4">Socials</span>
                  <div className="flex flex-col gap-2 text-lg">
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                    <a href="https://www.linkedin.com/in/daryramadhan/">LinkedIn</a>
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase tracking-wider mb-4">Contact</span>
                  <a href="mailto:hello@daryramadhan.com" className="text-lg">hello@daryramadhan.com</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
