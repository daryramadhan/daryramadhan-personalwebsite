import React from 'react';
import { usePartners } from '../hooks/usePartners';
import {
  BarChart3,
  Gem,
  AudioLines,
  Box,
  Infinity,
  Sparkles,
  Hexagon,
  Zap,
  Triangle,
  Layers,
  CircleDot,
  Aperture,
} from 'lucide-react';

// User's preferred static list
const staticPartners = [
  { name: 'Metricly', icon: BarChart3 },
  { name: 'Velora', icon: Gem },
  { name: 'Auralink', icon: AudioLines },
  { name: 'Fluxbit', icon: Box },
  { name: 'Taskly', icon: Infinity },
  { name: 'Optima AI', icon: Sparkles },
  { name: 'Hexacore', icon: Hexagon },
  { name: 'Voltex', icon: Zap },
  { name: 'Prisma', icon: Triangle },
  { name: 'Layerform', icon: Layers },
  { name: 'Orbion', icon: CircleDot },
  { name: 'Lenscape', icon: Aperture },
];

function PartnerItem({ name, icon: Icon, logoUrl }: { name: string; icon?: React.ElementType; logoUrl?: string }) {
  return (
    <div className="group/logo flex-shrink-0 flex items-center justify-center px-8 md:px-6 cursor-default select-none transition-transform duration-300 hover:scale-105">
      {logoUrl ? (
        // Dynamic partner from DB (Image)
        <img
          src={logoUrl}
          alt={name}
          className="h-5 w-auto object-contain opacity-50 grayscale transition-all duration-500 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
        />
      ) : Icon ? (
        // Static partner (Icon)
        <Icon
          size={24}
          strokeWidth={1.5}
          className="text-gray-300 transition-colors duration-500 group-hover/logo:text-gray-900"
        />
      ) : null}

      {/* Name removed as requested */}
    </div>
  );
}

export function Partners() {
  const { partners: dbPartners, loading } = usePartners();
  const hasDynamicPartners = dbPartners.length > 0;

  // Duplicate list for seamless infinite scroll
  // If we have DB partners, duplicate them. If not, duplicate the static list.
  const partnersToDisplay = hasDynamicPartners ? dbPartners : staticPartners;
  const duplicated = [...partnersToDisplay, ...partnersToDisplay];

  return (
    <section className="py-6 bg-gray-50 overflow-hidden border-t border-gray-200 border-b">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-12">
        <div className="flex items-center gap-6 lg:gap-12">

          {/* Left: Trusted text — fixed width */}
          <div className="hidden md:block flex-shrink-0 w-[140px] md:w-[170px] pr-6 lg:pr-10 border-r border-gray-200">
            <p className="text-xs font-mono uppercase tracking-wider text-gray-400 leading-relaxed">
              Trusted By
            </p>
          </div>

          {/* Right: Marquee */}
          <div className="flex-1 relative overflow-hidden group min-w-0">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div className="flex items-center w-max animate-marquee group-hover:[animation-play-state:paused] py-2">
              {duplicated.map((partner: any, index: number) => (
                <PartnerItem
                  key={`${partner.name || partner.id}-${index}`}
                  name={partner.name}
                  icon={partner.icon}
                  logoUrl={partner.logo_url}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}