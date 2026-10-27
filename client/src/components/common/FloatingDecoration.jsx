import React from 'react';
import { motion } from 'framer-motion';
import { Package, Rocket, Puzzle, Palette, Sparkles, Star } from 'lucide-react';

export const FloatingDecoration = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Background Soft Blobs */}
      <div
        className="hero-blob"
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(118, 87, 232, 0.22) 0%, rgba(118, 87, 232, 0) 70%)',
          top: '-60px',
          left: '-40px'
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(98, 200, 245, 0.22) 0%, rgba(98, 200, 245, 0) 70%)',
          top: '20%',
          right: '-80px'
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(255, 216, 94, 0.25) 0%, rgba(255, 216, 94, 0) 70%)',
          bottom: '10px',
          left: '30%'
        }}
      />

      {/* Floating Playful Icons */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', left: '8%' }}
        className="rounded-circle p-3 shadow-sm bg-white bg-opacity-75 d-inline-flex"
      >
        <Package size={28} color="#7657E8" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{ position: 'absolute', top: '22%', right: '12%' }}
        className="rounded-circle p-3 shadow-sm bg-white bg-opacity-75 d-inline-flex"
      >
        <Rocket size={28} color="#FF786E" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{ position: 'absolute', bottom: '25%', left: '14%' }}
        className="rounded-circle p-3 shadow-sm bg-white bg-opacity-75 d-inline-flex"
      >
        <Puzzle size={26} color="#62C8F5" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', bottom: '18%', right: '18%' }}
        className="rounded-circle p-3 shadow-sm bg-white bg-opacity-75 d-inline-flex"
      >
        <Palette size={28} color="#8EE5BE" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '35%', left: '22%' }}
      >
        <Sparkles size={24} color="#FFD85E" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', top: '12%', right: '32%' }}
      >
        <Star size={24} color="#62C8F5" fill="#62C8F5" />
      </motion.div>
    </div>
  );
};
