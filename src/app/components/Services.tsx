import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const stats = [
  { value: '20+', label: 'Satisfied Clients' },
  { value: '42', label: 'Projects' },
  { value: '4', label: 'Industries' },
  { value: '4.7', label: 'Fastwork Rating' },
];

export function Services() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12">

        {/* Top Section: Heading and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 border-t border-white/20 pt-12">

          {/* Main Headline */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]"
            >
              As your design partner, I help founders and business owners build great, scalable products.
            </motion.h2>
          </div>

          {/* Right Column: Description & Button */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-8 lg:max-w-md ml-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 leading-relaxed text-lg"
              >
                Collaborating with brands and agencies to create impactful digital experiences.
                Focusing on clean aesthetics, functional design, and technical precision to bring visions to life.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a
                  href="https://cal.com/daryramadhan/discovery-call" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 group"
                >
                  <span>Schedule a call</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Stats */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <span className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-2">
                {stat.value}
              </span>
              <span className="text-gray-500 text-sm md:text-base font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
