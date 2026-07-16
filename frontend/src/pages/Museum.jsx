import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Box, Compass } from 'lucide-react';
import ModelViewer from '../components/ModelViewer.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

const Museum = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const sections = [
    {
      id: 'dravidian',
      title: 'Dravidian Heritage',
      region: 'South India',
      description: 'The Dravidian style is distinguished by its pyramid-shaped Vimana, monumental Gopurams, and pillared Mandapas. It represents a spiritual ascent through geometric precision.',
      models: [
        { name: 'Modular Temple Kit', url: '/models/south_indian_temple_-_modular_kit.glb', info: 'Exploring the base components of the Vimana and Adhisthana levels.' },
        { name: 'Uthirakosamangai', url: '/models/uthirakosamangai_temple_india.glb', info: 'A showcase of the complex tiered towers and sacred geometry of Tamil Nadu.' }
      ]
    },
    {
      id: 'nagara',
      title: 'Nagara Excellence',
      region: 'North India',
      description: 'Defined by the curvilinear Shikhara that symbolizes the holy Mount Meru. Nagara architecture emphasizes verticality and the seamless flow of stone into sacred form.',
      models: [
        { name: 'Ram Mandir', url: '/models/ram_temple.glb', info: 'A contemporary evolution of the Maru-Gurjara Nagara style with multi-faceted shikharas.' },
        { name: 'Nagara Shikhara', url: '/models/nagara.glb', info: 'Studying the beehive-shaped tower and its intricate urushringas (subsidiary towers).' }
      ]
    },
    {
      id: 'kalinga',
      title: 'Kalinga Grandeur',
      region: 'Odisha / Eastern India',
      description: 'A unique synthesis of form where the Deula and Jagamohana create a massive, chariot-like presence. Famous for its exquisite relief carvings and sandstone majesty.',
      models: [
        { name: 'Konark Sun Temple', url: '/models/konark_sun_temple.glb', info: 'The Black Pagoda—designed as a celestial chariot for the Sun God, Surya.' }
      ]
    }
  ];

  const [currentIndices, setCurrentIndices] = useState({
    dravidian: 0,
    nagara: 0,
    kalinga: 0
  });

  const nextModel = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    setCurrentIndices(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] + 1) % section.models.length
    }));
  };

  const prevModel = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    setCurrentIndices(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] - 1 + section.models.length) % section.models.length
    }));
  };

  return (
    <div className="min-h-screen selection:bg-[#FFD700]/30">

      {/* Hero Section - Parchment Aesthetic */}
      <section className="pt-24 pb-16 bg-transparent border-b border-[#FFD700]/10 relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/temple_pattern_background.png')", backgroundSize: '300px' }}></div>
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-px bg-[#FFD700]/50 mb-6"></div>
            <h2 className="serif text-4xl md:text-6xl mb-4 tracking-tight text-[#FAF3E0]">3D Heritage <span className="text-[#FFD700]">Museum</span></h2>
            <p className="sans text-lg text-[#FAF3E0]/70 max-w-2xl mx-auto leading-relaxed italic font-light">
              "Every stone tells a story of the divine. Step into the digital sanctum and witness the structural poetry of ancient India."
            </p>
            <div className="w-16 h-px bg-[#FFD700]/50 mt-8"></div>
          </motion.div>
        </div>
      </section>

      {/* Museum Content */}
      <main className="container py-20">
        {sections.map((section) => (
          <section key={section.id} className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              
              {/* Architecture Details Card (Left Column) */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full z-10 order-2 lg:order-1"
              >
                <div 
                  className="bg-[#2B1D11]/60 backdrop-blur-2xl border border-[#FFD700]/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-3xl lg:rounded-[40px] relative overflow-hidden flex flex-col"
                  style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem)' }}
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4A373] to-[#FFD700]"></div>
                  
                  <span className="style-region sans tracking-[0.25em] font-bold text-[#FFD700] block mb-3 uppercase text-xs md:text-sm">
                    {section.region}
                  </span>
                  <h3 className="serif text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-white drop-shadow-md leading-tight break-words">{section.title}</h3>
                  <p className="sans text-[#FAF3E0] mb-6 md:mb-8 leading-relaxed text-base md:text-lg lg:text-xl font-light">
                    {section.description}
                  </p>
                  
                  <div 
                    className="bg-black/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-[#FFD700]/30 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 shadow-2xl w-full"
                    style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}
                  >
                    <div className="shrink-0 mt-1 sm:mt-0">
                      <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#C5A059] rounded-xl md:rounded-2xl shadow-lg text-[#1A110A]">
                        <Info size={24} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="sans font-bold text-xs md:text-sm uppercase tracking-widest text-[#FFD700] mb-2 break-words">Architectural Insight</h4>
                      <p className="sans text-sm md:text-base font-medium text-[#FAF3E0] leading-relaxed break-words">
                        {section.models[currentIndices[section.id]].info}
                      </p>
                    </div>
                  </div>

                  {section.models.length > 1 && (
                    <div 
                      className="mt-10 flex items-center justify-between bg-black/50 backdrop-blur-md rounded-full border border-[#FFD700]/30 shadow-sm"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      <button 
                        onClick={() => prevModel(section.id)}
                        className="w-12 h-12 rounded-full bg-[#1A110A] shadow flex items-center justify-center hover:bg-[#FFD700] hover:text-[#1A110A] border border-[#FFD700]/50 transition-all duration-300 active:scale-95 text-[#FFD700]"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <span className="sans text-xs font-bold uppercase tracking-[0.15em] text-[#FAF3E0]/80 text-center">
                        {currentIndices[section.id] + 1} / {section.models.length} Artifacts
                      </span>
                      <button 
                        onClick={() => nextModel(section.id)}
                        className="w-12 h-12 rounded-full bg-[#1A110A] shadow flex items-center justify-center hover:bg-[#FFD700] hover:text-[#1A110A] border border-[#FFD700]/50 transition-all duration-300 active:scale-95 text-[#FFD700]"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 3D Viewer Container (Right Column) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="w-full relative h-[600px] lg:h-[800px] group order-1 lg:order-2 flex items-center justify-center"
              >
                {/* Decorative Frame */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#FFD700] via-[#C5A059] to-[#FFD700] rounded-[40px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                
                <div className="relative h-full w-full bg-[#0F0A06] rounded-[32px] overflow-hidden shadow-2xl border border-[#FFD700]/30 ring-1 ring-[#FFD700]/10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${section.id}-${currentIndices[section.id]}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full"
                    >
                      <ErrorBoundary>
                        <ModelViewer modelUrl={section.models[currentIndices[section.id]].url} />
                      </ErrorBoundary>
                    </motion.div>
                  </AnimatePresence>

                  {/* Viewer Overlays */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-black/60 backdrop-blur shadow-lg px-4 py-2 rounded-full border border-[#FFD700]/30 flex items-center gap-2">
                      <Box size={14} className="text-[#FFD700]" />
                      <span className="sans text-[10px] font-bold text-[#FAF3E0]">{section.models[currentIndices[section.id]].name}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="bg-[#2B1D11]/80 backdrop-blur px-6 py-2 rounded-full flex items-center gap-3 shadow-2xl">
                      <Compass size={14} className="text-[#FFD700] animate-spin-slow" />
                      <span className="sans text-[10px] text-white font-bold tracking-[0.2em]">360° INTERACTIVE VIEW</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>
        ))}
      </main>

      {/* Content wrapper closes here */}
    </div>
  );
};

export default Museum;
