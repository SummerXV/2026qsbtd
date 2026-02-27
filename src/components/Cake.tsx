import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export function Cake() {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const blowCandles = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!candlesBlown) {
      setCandlesBlown(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC0CB', '#FFD700', '#87CEEB', '#98FB98']
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer" onClick={blowCandles}>
      <div className="relative mt-4">
        {/* Cake Base - Bottom Tier */}
        <div className="w-48 h-16 bg-yellow-100 rounded-xl relative border-2 border-gray-700 shadow-sm z-10"></div>
        
        {/* Middle Tier */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-36 h-14 bg-white rounded-xl border-2 border-gray-700 shadow-sm z-20"></div>

        {/* Top Tier */}
        <div className="absolute bottom-26 left-1/2 -translate-x-1/2 w-24 h-12 bg-white rounded-xl border-2 border-gray-700 shadow-sm z-30"></div>

        {/* Plate */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-56 h-3 bg-gray-200 rounded-full border-2 border-gray-700 z-0"></div>

        {/* Candles */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-24 flex justify-center space-x-2 z-40">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              {/* Flame */}
              {!candlesBlown && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-5 bg-orange-400 rounded-full blur-[1px] shadow-[0_0_8px_#fbbf24] mb-1"
                />
              )}
              {/* Smoke when blown */}
              {candlesBlown && (
                 <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0.8, 0], y: -20, x: i % 2 === 0 ? 5 : -5 }}
                  transition={{ duration: 1.5 }}
                  className="w-2 h-4 bg-gray-300 rounded-full blur-sm mb-1"
                />
              )}
              {/* Candle Stick */}
              <div className={`w-2 h-8 ${['bg-pink-400', 'bg-blue-400', 'bg-green-400'][i]} rounded-sm border border-gray-600`}></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-4xl font-heading font-bold text-gray-800 mb-2">
          {candlesBlown ? "Yay! Happy Birthday!" : "Make a Wish!"}
        </h3>
        <p className="text-gray-500 text-sm font-hand mb-6">
          May your special day be filled with magic and your year with joy.
        </p>
        
        <button className="px-8 py-3 bg-yellow-400 rounded-xl font-heading font-bold text-gray-800 shadow-md hover:bg-yellow-300 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wide">
          Celebrate!
        </button>
      </div>
    </div>
  );
}
