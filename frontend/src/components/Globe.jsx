import React from 'react';
import { motion } from 'framer-motion';

const Globe = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* 🌍 MONGODB ATLAS STYLE GLOBE */}
      <div className="relative w-64 h-64 lg:w-[450px] lg:h-[450px]">
        {/* Subtle Outer Glow */}
        <div className="absolute inset-0 bg-[#00ED64]/10 rounded-full blur-[60px]" />
        
        {/* The Sphere */}
        <div className="absolute inset-0 rounded-full bg-white overflow-hidden border border-slate-200 shadow-[inset_0_0_80px_rgba(0,104,74,0.1),0_10px_30px_rgba(0,0,0,0.05)]">
          
          {/* Rotating Map Layer (Green continents) */}
          <motion.div 
            animate={{ x: [-1000, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-[2000px] opacity-80"
            style={{
              backgroundImage: `url('https://www.transparenttextures.com/patterns/world-map.png')`,
              backgroundSize: '1000px 100%',
              filter: 'invert(37%) sepia(93%) saturate(543%) hue-rotate(119deg) brightness(92%) contrast(101%)' // MongoDB Green
            }}
          />

          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40" />
        </div>

        {/* Orbiting Ring (Thin Green) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-10 border border-[#00684A]/10 border-dashed rounded-full"
        />

        {/* Dynamic Nodes */}
        <div className="absolute inset-0">
          {[
            { label: 'CivicSync Active', pos: 'top-10 left-10' },
            { label: 'Verified Access', pos: 'bottom-20 right-10' }
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.5, duration: 1 }}
              className={`absolute ${node.pos} bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm flex items-center gap-2`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ED64] animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#001E2B]">{node.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Globe;
