export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  role?: string;
  client?: string;
  images?: string[];
  project_type?: 'case_study' | 'selected_work';
  className?: string; // For grid layout in SelectedWork
  is_published?: boolean;
}

export const projects: Project[] = [
  // Case Studies
  {
    id: "sketch",
    title: "Sketch",
    category: "Content Design, Marketing",
    year: "2023",
    image: "https://images.unsplash.com/photo-1764776257398-ee6913125975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBhYnN0cmFjdCUyMDNkJTIwZ2VvbWV0cmljJTIwc2hhcGV8ZW58MXx8fHwxNzcwNDY0MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Reimagining the digital presence for a leading design tool. The goal was to create a seamless experience that empowers creators to do their best work.",
    role: "Art Direction & Design",
    client: "Sketch",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1614850523011-8f49ffc73908?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "frame-io",
    title: "Frame.io",
    category: "User Interface Design",
    year: "2022",
    image: "https://images.unsplash.com/photo-1659035260002-11d486d6e9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9kZSUyMGlwYWQlMjB1aSUyMGRlc2lnbiUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzA0NjQwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "A complete overhaul of the mobile collaboration platform. Focusing on speed, clarity, and intuitive gestures for video professionals on the go.",
    role: "UI/UX Design",
    client: "Adobe",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1609921205527-54991fcb9666?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "lumina",
    title: "Lumina",
    category: "Product Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1758560936904-4eb0049284aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2hpdGUlMjBwcm9kdWN0JTIwZGVzaWdufGVufDF8fHx8MTc3MDQ2NDA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Designing the next generation of smart home lighting. A minimalist approach to hardware and software integration.",
    role: "Product Design",
    client: "Lumina Tech",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1558002038-10915571429f?auto=format&fit=crop&q=80&w=2000"
    ]
  },

  // Selected Works
  {
    id: "minimalist-architecture",
    title: "Minimalist Architecture",
    category: "Web Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1761870065047-f2da9429db23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcwMzczMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "md:col-span-2 aspect-[16/9]",
    description: "A portfolio site for a renowned architectural firm. The design reflects their philosophy: less is more.",
    role: "Web Design & Development",
    client: "Arch Studio",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "finance-app",
    title: "Finance App",
    category: "Mobile UI",
    year: "2023",
    image: "https://images.unsplash.com/photo-1762341119237-98df67c9c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjB1aSUyMGRlc2lnbnxlbnwxfHx8fDE3NzA0NjM2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "aspect-square",
    description: "Simplifying personal finance with a clean, approachable interface that makes tracking expenses a breeze.",
    role: "UI Design",
    client: "FinTech Co",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "modern-furniture",
    title: "Modern Furniture",
    category: "E-commerce",
    year: "2024",
    image: "https://images.unsplash.com/photo-1760716478125-aa948e99ef85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBkZXNpZ24lMjBjaGFpcnxlbnwxfHx8fDE3NzA0NjM2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "aspect-square",
    description: "An e-commerce experience that feels like walking through a high-end showroom. Smooth transitions and high-fidelity imagery.",
    role: "UX/UI Design",
    client: "Moda",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "abstract-3d",
    title: "Abstract 3D",
    category: "Art Direction",
    year: "2023",
    image: "https://images.unsplash.com/photo-1666302707255-13651d539be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwc2hhcGVzJTIwcmVuZGVyfGVufDF8fHx8MTc3MDQ2MzY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    className: "md:col-span-2 aspect-[16/9]",
    description: "A series of 3D explorations playing with light, texture, and geometry to create immersive digital art pieces.",
    role: "3D Artist",
    client: "Personal Project",
    images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1633596683562-4a47eb4883c7?auto=format&fit=crop&q=80&w=2000"
    ]
  }
];
