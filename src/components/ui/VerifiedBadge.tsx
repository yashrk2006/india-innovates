'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ 
  size = 'md', 
  className = '', 
  showText = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} suppressHydrationWarning>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`${sizes[size]} bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: iconSizes[size], fontWeight: 'bold' }}>
          check
        </span>
      </motion.div>
      {showText && (
        <span className={`font-medium text-blue-600 ${size === 'lg' ? 'text-sm' : 'text-[10px] uppercase tracking-widest'}`}>
          Verified Citizen
        </span>
      )}
    </div>
  );
};

export default VerifiedBadge;
