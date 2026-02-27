import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  rotate?: number;
}

export function ZoomableImage({ src, alt, className, rotate = 0 }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <motion.div
        className={`${className} cursor-zoom-in relative`}
        onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
        }}
        whileHover={{ scale: 1.02, rotate: rotate + (Math.random() * 2 - 1) }}
        style={{ rotate: rotate }}
        layoutId={`image-container-${src}`}
      >
        <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-lg shadow-md border-4 border-white"
            layoutId={`image-${src}`}
        />
      </motion.div>

      {isZoomed && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
            }}
          >
            <motion.img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] object-contain cursor-zoom-out rounded-lg shadow-2xl"
              layoutId={`image-${src}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself? Or maybe allow it.
            />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
