import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';

export function CTA() {
  return (
    <section id="contact" className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/20 pt-8">

          {/* Left Column: Label */}
          <div className="lg:col-span-4">
            <span className="text-sm font-mono uppercase tracking-wider text-gray-400 block mb-4">
              Get in touch
            </span>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              I'm currently available for freelance work. If you have a project that needs some creative injection, hit me up.
            </p>
          </div>

          {/* Right Column: Big Action */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-start"
            >
              <a
                href="https://cal.com/daryramadhan/discovery-call" target="_blank" rel="noopener noreferrer"
                className="group relative inline-block"
              >
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter hover:text-gray-300 transition-colors duration-300">
                  Let's talk
                </h2>
                <div className="h-1 w-0 bg-white group-hover:w-full transition-all duration-500 ease-out mt-4" />
              </a>

              <div className="mt-16 flex flex-col md:flex-row gap-8 md:gap-16 w-full">
                <div>
                  <span className="block text-sm text-gray-500 mb-2">Email</span>
                  <a href="mailto:hello@daryramadhan.com" className="text-xl md:text-2xl hover:text-gray-300 transition-colors">
                    daryramadhan23@gmail.com
                  </a>
                </div>

                <div>
                  <span className="block text-sm text-gray-500 mb-2">Socials</span>
                  <div className="flex gap-6 text-xl md:text-2xl">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Twitter</a>
                    <a href="https://dribbble.com/daryramadhan" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Dribbble</a>
                    <a href="https://www.linkedin.com/in/daryramadhan/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>

              <motion.a
                href="https://cal.com/daryramadhan/discovery-call" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-16 inline-flex items-center gap-4 px-8 py-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
              >
                <span>Start a project</span>
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
