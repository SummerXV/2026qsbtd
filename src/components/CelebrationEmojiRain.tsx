import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export interface CelebrationEmojiRainRef {
  celebrate: () => void;
  clear: () => void;
}

type EmojiItem = {
  id: string;
  emoji: string;
  leftPx: number;
  startTopPx: number;
  endYPx: number;
  scale: number;
  rotateDeg: number;
  durationMs: number;
  delayMs: number;
  blurPx: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickWeighted<T>(choices: Array<{ value: T; weight: number }>): T {
  const total = choices.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of choices) {
    r -= c.weight;
    if (r <= 0) return c.value;
  }
  return choices[choices.length - 1]!.value;
}

export const CelebrationEmojiRain = forwardRef<CelebrationEmojiRainRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<EmojiItem[]>([]);

  const emojiPicker = useMemo(() => {
    const hearts = ['❤️', '💖', '💗', '💓', '💕', '💞', '💝', '🧡', '💛', '💚', '💙', '💜'];
    const others = ['🎈', '☃️', '🧙‍♂️'];
    const heartWeight = 5;
    const giftWeight = hearts.length * heartWeight; // gifts as frequent as all hearts combined

    return () =>
      pickWeighted<string>([
        { value: '🎁', weight: giftWeight },
        ...hearts.map((h) => ({ value: h, weight: heartWeight })),
        ...others.map((o) => ({ value: o, weight: 2 })),
      ]);
  }, []);

  const clear = () => setItems([]);

  const celebrate = () => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width <= 2 || height <= 2) return;

    const count = 55;
    const baseFontPx = Math.max(26, Math.min(44, Math.floor(width / 12)));

    const nextItems: EmojiItem[] = Array.from({ length: count }).map((_, i) => {
      const emoji = emojiPicker();
      const scale = rand(0.8, 1.5);
      const fontPx = baseFontPx * scale;

      const leftPx = rand(8, Math.max(8, width - fontPx - 8));
      const finalTop = rand(height * 0.8, height * 1.0 - fontPx - 6);
      const startTopPx = -fontPx - rand(20, 120);
      const endYPx = finalTop - startTopPx;

      const isHeart = /❤️|💖|💗|💓|💕|💞|💝|🧡|💛|💚|💙|💜/.test(emoji);
      const durationMs = isHeart ? rand(1500, 2600) : rand(1300, 2400);
      const delayMs = rand(0, 450) + i * 14;
      const rotateDeg = rand(-25, 25);
      const blurPx = isHeart ? rand(0, 0.45) : rand(0, 0.25);

      return {
        id: `${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
        emoji,
        leftPx,
        startTopPx,
        endYPx,
        scale,
        rotateDeg,
        durationMs,
        delayMs,
        blurPx,
      };
    });

    setItems(nextItems);
  };

  useImperativeHandle(ref, () => ({ celebrate, clear }), []);

  // Animate items using WAAPI (not dependent on CSS keyframes).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!items.length) return;

    const nodeList = container.querySelectorAll<HTMLElement>('[data-celebration-emoji="1"]');
    nodeList.forEach((el: HTMLElement) => {
      const endY = Number(el.dataset.endy ?? '0');
      const rot = el.dataset.rot ?? '0deg';
      const dur = Number(el.dataset.dur ?? '1200');
      const delay = Number(el.dataset.delay ?? '0');

      ((el as any).getAnimations?.() ?? []).forEach((a: any) => a.cancel());
      (el as any).animate(
        [
          { transform: `translateY(0px) rotate(${rot})`, opacity: 0 },
          { opacity: 1, offset: 0.12 },
          { transform: `translateY(${endY}px) rotate(${rot})`, opacity: 1 },
        ],
        {
          duration: dur,
          delay,
          easing: 'cubic-bezier(0.18, 0.85, 0.2, 1)',
          fill: 'forwards',
        },
      );
    });
  }, [items]);

  return (
    <div ref={containerRef} className="relative w-full h-full" aria-hidden="true">
      {items.map((it) => (
        <div
          key={it.id}
          className="celebration-emoji"
          style={{
            left: `${it.leftPx}px`,
            top: `${it.startTopPx}px`,
            fontSize: `${Math.round(36 * it.scale)}px`,
            filter: it.blurPx ? `blur(${it.blurPx}px)` : undefined,
            transform: `translateY(0px) rotate(${Math.round(it.rotateDeg)}deg)`,
            opacity: 0,
          }}
          data-celebration-emoji="1"
          data-endy={String(Math.round(it.endYPx))}
          data-rot={`${Math.round(it.rotateDeg)}deg`}
          data-dur={String(Math.round(it.durationMs))}
          data-delay={String(Math.round(it.delayMs))}
        >
          {it.emoji}
        </div>
      ))}
    </div>
  );
});

CelebrationEmojiRain.displayName = 'CelebrationEmojiRain';

