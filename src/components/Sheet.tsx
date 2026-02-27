import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SheetProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  zIndex: number;
  onFlip: () => void;
  onFlipComplete: () => void;
}

export const Sheet: React.FC<SheetProps> = ({ front, back, isFlipped, zIndex, onFlip, onFlipComplete }) => {
  return (
    <motion.div
      className="absolute top-0 right-0 w-1/2 h-full origin-left cursor-pointer preserve-3d"
      initial={false}
      animate={{ rotateY: isFlipped ? -180 : 0 }}
      transition={{ duration: 0.6, type: "tween", ease: "easeInOut" }}
      style={{ zIndex }}
      onClick={onFlip}
      onAnimationComplete={onFlipComplete}
    >
      {/* Front of the sheet */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-r-lg shadow-md border-l border-gray-200 overflow-hidden"
        style={{ borderRadius: '0 16px 16px 0' }}
      >
        {front}
        {/* Shadow overlay for front when flipping */}
        <motion.div 
            className="absolute inset-0 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipped ? 0.1 : 0 }}
            transition={{ duration: 0.6 }}
        />
      </div>

      {/* Back of the sheet */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-l-lg shadow-md border-r border-gray-200 overflow-hidden"
        style={{ 
          transform: 'rotateY(180deg)',
          borderRadius: '16px 0 0 16px'
        }}
      >
        {back}
        {/* Shadow overlay for back when flipping */}
        <motion.div 
            className="absolute inset-0 bg-black pointer-events-none"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: isFlipped ? 0 : 0.1 }}
            transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
}
