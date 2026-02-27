import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Matter from 'matter-js';

export interface CelebrationPhysicsRef {
  addItems: () => void;
}

const CelebrationPhysics = forwardRef<CelebrationPhysicsRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const boundsRef = useRef<Matter.Body[] | null>(null);

  useImperativeHandle(ref, () => ({
    addItems: () => {
      const engine = engineRef.current;
      const container = containerRef.current;
      if (!engine || !container) return;

      const { world } = engine;
      const icons = [
        '🎁', '🎈', '🧙‍♂️', '☃️', 
        '❤️', '💖', '💝', '🧡', '💛', '💚', '💙', '💜', '💕', '💞', '💓', '💗', '✨'
      ];
      const width = container.clientWidth || 450;
      
      const newBodies = Array.from({ length: 35 }).map(() => {
        const x = width / 2 + (Math.random() - 0.5) * (width * 0.5); 
        const y = -100 - Math.random() * 400;
        const scale = 0.8 + Math.random() * 0.45; // 0.8 to 1.25
        const radius = 16 * scale;
        
        const body = Matter.Bodies.circle(x, y, radius, {
          restitution: 0.4, // Less bouncy for better piling
          friction: 0.3,    // More friction to prevent sliding
          frictionAir: 0.02,
          render: {
            visible: false
          }
        });

        (body as any).icon = icons[Math.floor(Math.random() * icons.length)];
        (body as any).iconScale = scale;

        return body;
      });

      Matter.World.add(world, newBodies);
    }
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create a fresh engine per mount. This avoids StrictMode double-mount
    // issues where a cleared engine is reused.
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const { world } = engine;

    const getSize = () => ({
      width: container.clientWidth || 450,
      height: container.clientHeight || 650,
    });

    let { width, height } = getSize();

    const render = Matter.Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
      }
    });

    renderRef.current = render;

    const addBounds = (w: number, h: number) => {
      // Boundaries - slightly wider to catch rolling items
      const ground = Matter.Bodies.rectangle(w / 2, h + 20, w * 2, 40, { 
        isStatic: true, 
        render: { visible: false },
        friction: 0.5 
      });
      const leftWall = Matter.Bodies.rectangle(-20, h / 2, 40, h * 2, { isStatic: true, render: { visible: false } });
      const rightWall = Matter.Bodies.rectangle(w + 20, h / 2, 40, h * 2, { isStatic: true, render: { visible: false } });
      boundsRef.current = [ground, leftWall, rightWall];
      Matter.World.add(world, boundsRef.current);
    };

    addBounds(width, height);

    // Custom rendering for emojis
    const context = render.context;

    const afterRender = () => {
      const bodies = Matter.Composite.allBodies(world);
      
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      bodies.forEach((body: any) => {
        if (body.isStatic || !body.icon) return;

        const { x, y } = body.position;
        const angle = body.angle;
        const scale = body.iconScale || 1;

        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.font = `${Math.round(32 * scale)}px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", Arial, sans-serif`;
        context.fillText(body.icon, 0, 0);
        context.restore();
      });
    };

    Matter.Events.on(render, 'afterRender', afterRender);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    runnerRef.current = runner;

    const resize = () => {
      const next = getSize();
      if (!next.width || !next.height) return;
      if (next.width === width && next.height === height) return;

      width = next.width;
      height = next.height;

      Matter.Render.setSize(render, width, height);
      if (boundsRef.current) {
        Matter.World.remove(world, boundsRef.current);
        boundsRef.current = null;
      }
      addBounds(width, height);
    };

    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(() => resize());
      ro.observe(container);
    } catch {
      // ignore
    }

    return () => {
      if (ro) ro.disconnect();
      Matter.Events.off(render, 'afterRender', afterRender);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
      boundsRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-[200]" />
  );
});

CelebrationPhysics.displayName = 'CelebrationPhysics';

export default CelebrationPhysics;
