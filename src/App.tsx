/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Book } from './components/Book';
import { MouseParticles } from './components/MouseParticles';

const BOOK_WIDTH = 900;
const BOOK_HEIGHT = 650;

function useViewportScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    const updateScale = () => {
      const node = containerRef.current;
      if (!node) return;
      const w = node.clientWidth;
      const h = node.clientHeight;
      if (w <= 0 || h <= 0) return;
      const s = Math.min(w / BOOK_WIDTH, h / BOOK_HEIGHT, 1);
      setScale(s);
    };

    updateScale();
    if (!el) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return { containerRef, scale };
}

export default function App() {
  const { containerRef, scale } = useViewportScale();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center py-4 px-2 overflow-hidden">
      <MouseParticles />
      <div
        ref={containerRef}
        className="flex-1 w-full min-h-0 flex items-center justify-center"
      >
        <div
          style={{
            width: BOOK_WIDTH,
            height: BOOK_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="shrink-0"
        >
          <Book />
        </div>
      </div>
      <div className="shrink-0 mt-4 text-center opacity-60">
        <p className="font-hand text-lg text-gray-500">
          Tap the right page to go forward, left page to go back.
        </p>
      </div>
    </div>
  );
}
