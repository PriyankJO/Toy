import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading Toy Wonders...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        className="d-flex align-items-center justify-content-center mb-3 text-primary"
      >
        <Loader2 size={48} color="var(--color-primary)" />
      </motion.div>
      <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 800 }}>
        {text}
      </h5>
      <p className="text-muted small">Gathering the happiest toys for you...</p>
    </div>
  );
};
