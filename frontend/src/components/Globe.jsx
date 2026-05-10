import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Globe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // --- Scene Setup ---
    const width = el.clientWidth;
    const height = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    el.appendChild(renderer.domElement);

    // --- Wireframe Globe ---
    const geometry = new THREE.SphereGeometry(2.2, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // --- Animation Loop ---
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* 🌍 SCI-FI WIREFRAME GLOBE */}
      <div className="relative w-64 h-64 lg:w-[450px] lg:h-[450px]">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px]" />

        {/* Three.js Mount Point */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* Orbiting Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-10 border border-blue-500/20 border-dashed rounded-full"
        />

        {/* HUD Labels */}
        <div className="absolute inset-0">
          {[
            { label: 'System Ready', pos: 'top-10 left-10' },
            { label: 'Scan ID: HS_6.0', pos: 'bottom-20 right-10' },
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.5, duration: 1 }}
              className={`absolute ${node.pos} bg-[#09111c]/80 backdrop-blur-sm border border-blue-500/30 px-3 py-1.5 rounded flex items-center gap-2`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-blue-100">{node.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Scanning Line */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-[1px] bg-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Globe;

