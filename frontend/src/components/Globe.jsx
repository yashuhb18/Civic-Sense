import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import createGlobe from 'cobe';

const Globe = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 900,
      height: 900,
      phi: 0,
      theta: 0,
      dark: 1, // dark map (white dots)
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.05], // Dark globe base
      markerColor: [0, 0.93, 0.39], // #00ED64 (MongoDB green)
      glowColor: [0.1, 0.1, 0.1], // Subtle dark glow
      markers: [
        { location: [20.5937, 78.9629], size: 0.08 }, // India
        { location: [37.7749, -122.4194], size: 0.05 }, // SF
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [-33.8688, 151.2093], size: 0.05 } // Sydney
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* 🌍 MONGODB ATLAS STYLE GLOBE */}
      <div className="relative w-64 h-64 lg:w-[450px] lg:h-[450px]">
        {/* Subtle Outer Glow */}
        <div className="absolute inset-0 bg-[#00ED64]/10 rounded-full blur-[60px]" />
        
        {/* The Cobe Globe */}
        <div className="absolute inset-0 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 0.9 }}
            />
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
