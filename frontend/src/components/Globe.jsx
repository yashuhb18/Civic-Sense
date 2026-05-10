import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Globe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Always use a perfect square so the sphere is circular
    const size = el.clientWidth;

    const scene = new THREE.Scene();
    // 1:1 aspect so the sphere is always a perfect circle
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 7.5; // Far enough that the entire sphere fits inside the frame

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // Dense wireframe sphere — smaller radius so it never clips
    const geometry = new THREE.SphereGeometry(2.0, 72, 72);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Continuous rotation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

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
    <div className="flex items-center justify-center w-full py-8">
      {/* Fixed square container — guarantees a circular globe */}
      <div className="relative w-[380px] h-[380px] lg:w-[480px] lg:h-[480px]">
        {/* Subtle glow behind */}
        <div className="absolute inset-8 bg-blue-400/10 rounded-full blur-[60px]" />

        {/* Three.js canvas mount — must be square */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* Orbiting ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-6 border border-blue-400/20 border-dashed rounded-full pointer-events-none"
        />

        {/* HUD labels */}
        {[
          { label: 'System Ready', pos: 'top-8 left-4' },
          { label: 'Scan ID: HS_6.0', pos: 'bottom-16 right-4' },
        ].map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.6 + 0.5, duration: 0.6 }}
            className={`absolute ${node.pos} bg-slate-900/70 backdrop-blur-sm border border-blue-400/30 px-3 py-1.5 rounded-md flex items-center gap-2 pointer-events-none`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-200">{node.label}</span>
          </motion.div>
        ))}

        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-px bg-blue-400/50 shadow-[0_0_12px_rgba(96,165,250,0.9)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Globe;
