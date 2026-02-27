import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as Matter from 'matter-js';

export interface CelebrationPhysicsRef {
  addItems: () => void;
}

const CelebrationPhysics = forwardRef<CelebrationPhysicsRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(Matter.Engine.create());
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useImperativeHandle(ref, () => ({
    addItems: () => {
      const { world } = engineRef.current;
      const icons = [
        '🎁', '🎈', '🧙‍♂️', '☃️', 
        '❤️', '💖', '💝', '🧡', '💛', '💚', '💙', '💜', '💕', '💞', '💓', '💗', '✨'
      ];
      const width = containerRef.current?.clientWidth || 450;
      
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
    if (!containerRef.current) return;

    const engine = engineRef.current;
    const { world } = engine;
    
    const width = containerRef.current.clientWidth || 450;
    const height = containerRef.current.clientHeight || 650;

    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent'
      }
    });

    renderRef.current = render;

    // Boundaries - slightly wider to catch rolling items
    const ground = Matter.Bodies.rectangle(width / 2, height + 20, width * 2, 40, { 
      isStatic: true, 
      render: { visible: false },
      friction: 0.5 
    });
    const leftWall = Matter.Bodies.rectangle(-20, height / 2, 40, height * 2, { isStatic: true, render: { visible: false } });
    const rightWall = Matter.Bodies.rectangle(width + 20, height / 2, 40, height * 2, { isStatic: true, render: { visible: false } });

    Matter.World.add(world, [ground, leftWall, rightWall]);

    // Custom rendering for emojis
    const originalRender = render as any;
    const context = originalRender.context;

    Matter.Events.on(render, 'afterRender', () => {
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
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    runnerRef.current = runner;

    if (render.canvas) {
      render.canvas.width = width;
      render.canvas.height = height;
      render.canvas.style.width = `${width}px`;
      render.canvas.style.height = `${height}px`;
    }

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.World.clear(world, false);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-50" />
  );
});

CelebrationPhysics.displayName = 'CelebrationPhysics';

export default CelebrationPhysics;
