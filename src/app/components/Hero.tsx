import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the movement
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // We want the center of the 130px circle to be at the cursor
    mouseX.set(e.clientX - 65);
    mouseY.set(e.clientY - 65);
  };
  return (
    <section id="about" className="relative min-h-[90vh] flex flex-col justify-end pb-20 pt-32 bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Left Column: Description & Date */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-12 lg:space-y-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xs"
            >
              <p className="text-gray-500 text-sm leading-relaxed">
                I’m a Product Designer & UX/UI Designer for Startups. I help founders and business owners build great, scalable products.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:pt-32"
            >
              <div className="flex gap-4 text-xs font-mono text-gray-400 uppercase tracking-wider">
                <span>Last updated</span>
                <span className="text-gray-900">07-02-2026</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Main Heading */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
              className="text-4xl md:text-6xl lg:text-[5.5rem] leading-[0.95] font-medium tracking-tight text-gray-900 cursor-none"
            >
              High-Agency Product Designer with <br />Emphaty currently <br />based in Jakarta
            </motion.h1>

            {/* Floating Image Cursor */}
            <motion.div
              style={{
                left: smoothX,
                top: smoothY,
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 100,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="w-[130px] h-[130px] rounded-full overflow-hidden border-2 border-white shadow-xl"
            >
              <img
                src="public/daryramadhan.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
