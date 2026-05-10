import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';

const WireframeSphere = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Slowly revolve the globe all the time
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* High-segment sphere for a dense, detailed wireframe grid */}
      <sphereGeometry args={[2.8, 64, 64]} />
      <meshBasicMaterial 
        color="#3b82f6" // Sci-fi blue matching the image
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  );
};

const Globe = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* 🌍 SCI-FI WIREFRAME GLOBE */}
      <div className="relative w-64 h-64 lg:w-[450px] lg:h-[450px]">
        {/* Subtle Outer Glow */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px]" />
        
        {/* The Three.js Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <WireframeSphere />
          </Canvas>
        </div>

        {/* Orbiting Ring (Thin Blue) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-10 border border-blue-500/20 border-dashed rounded-full"
        />

        {/* Dynamic Nodes */}
        <div className="absolute inset-0">
          {[
            { label: 'System Ready', pos: 'top-10 left-10' },
            { label: 'Scan ID: HS_6.0', pos: 'bottom-20 right-10' }
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.5, duration: 1 }}
              className={`absolute ${node.pos} bg-[#09111c]/80 backdrop-blur-sm border border-blue-500/30 px-3 py-1.5 rounded shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center gap-2`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-blue-100">{node.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Scanning Line overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] bg-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Globe;
