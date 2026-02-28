import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from './Sheet';
import { Cake } from './Cake';
import { ZoomableImage } from './ZoomableImage';
import { CelebrationEmojiRain, CelebrationEmojiRainRef } from './CelebrationEmojiRain';
import { motion } from 'motion/react';
import { Gift, PartyPopper, Cake as CakeIcon, Heart, Star, Sparkles } from 'lucide-react';
import { getPublicBaseUrl } from '../utils/baseUrl';
import { IMAGES } from '../data/images';

// Helper component for content animation
const PageContent = ({ children, isVisible, delay = 0.3 }: { children: React.ReactNode, isVisible: boolean, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay: isVisible ? delay : 0, ease: "easeOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export function Book() {
  const flipSfxRef = useRef<HTMLAudioElement | null>(null);
  const carSfxRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmStartedRef = useRef(false);
  const [cakeResetToken, setCakeResetToken] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(-1);
  const [flippingIndex, setFlippingIndex] = useState(-1);
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; delay: string; size: string }[]>([]);
  const [showSnowman, setShowSnowman] = useState(false);
  const [showInfj, setShowInfj] = useState(false);
  const [showRv, setShowRv] = useState(false);
  const [showSummerHeart, setShowSummerHeart] = useState(false);
  const rainRef = useRef<CelebrationEmojiRainRef>(null);

  useEffect(() => {
    const base = getPublicBaseUrl();
    // Page flip sound
    flipSfxRef.current = new Audio(`${base}music/ding.mp3`);
    flipSfxRef.current.volume = 0.3;

    // RV sound
    carSfxRef.current = new Audio(`${base}music/car.mp3`);
    carSfxRef.current.volume = 0.55;

    // Background music (starts on first user interaction; loops forever)
    bgmRef.current = new Audio(`${base}music/happy_birthday.mp3`);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.22;
  }, []);

  const triggerSnow = () => {
    if (showSnowman) return; // Prevent multiple triggers at once
    
    setShowSnowman(true);
    const newSnow = Array.from({ length: 50 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size: `${0.5 + Math.random() * 2}rem`
    }));
    setSnowflakes(prev => [...prev, ...newSnow]);
    
    // Cleanup after animation
    setTimeout(() => {
      setSnowflakes(prev => prev.filter(s => !newSnow.find(ns => ns.id === s.id)));
      setShowSnowman(false);
    }, 7000);
  };

  const triggerInfj = () => {
    if (showInfj) return;
    setShowInfj(true);
    setTimeout(() => setShowInfj(false), 3000);
  };

  const triggerRv = () => {
    if (showRv) return;
    setShowRv(true);
    const sfx = carSfxRef.current;
    if (sfx) {
      try {
        sfx.currentTime = 0;
      } catch {
        // ignore
      }
      sfx.play().catch(() => {
        // ignore autoplay/missing file errors
      });
    }
    setTimeout(() => setShowRv(false), 6500);
  };

  const triggerSummer = () => {
    if (showSummerHeart) return;
    setShowSummerHeart(true);
    setTimeout(() => setShowSummerHeart(false), 3000);
  };

  const handleCelebrate = React.useCallback(() => {
    rainRef.current?.celebrate();
  }, []);

  const playFlipSfx = () => {
    const sfx = flipSfxRef.current;
    if (!sfx) return;
    try {
      sfx.currentTime = 0;
    } catch {
      // ignore
    }
    sfx.play().catch(() => {
      // ignore autoplay/missing file errors
    });
  };

  const startBgmOnce = () => {
    if (bgmStartedRef.current) return;
    const bgm = bgmRef.current;
    if (!bgm) return;
    bgmStartedRef.current = true;
    bgm.play().catch(() => {
      // ignore (autoplay restrictions or missing file)
    });
  };

  const handleFlip = (index: number) => {
    if (flippingIndex !== -1) return;

    // Clear celebration emojis when turning pages so they don't "come back"
    // when returning to this spread.
    rainRef.current?.clear();
    setCakeResetToken((t) => t + 1);

    playFlipSfx();
    startBgmOnce();
    setFlippingIndex(index);
    
    if (flippedIndex === index) {
      setFlippedIndex(index - 1);
    } else {
      setFlippedIndex(index);
    }
  };

  // Define the content for each sheet
  // Sheet 0: Cover / Page 1 (Photos: 5043, 5035)
  // Sheet 1: Page 2 (Text) / Page 3 (Photos: 8431, 8434)
  // Sheet 2: Page 4 (Text) / Page 5 (Photo: Qian-17)
  // Sheet 3: Page 6 (Text) / Page 7 (Blank)
  // Sheet 4: Page 8 (Cake) / Back Cover

  const sheets: { front: React.ReactNode; back: React.ReactNode }[] = React.useMemo(() => [
    // Sheet 0: Cover & Page 1
    {
      front: (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white p-8 text-center relative overflow-hidden border-r-4 border-gray-200">
          <PageContent isVisible={flippedIndex === -1}>
            {/* Decorations */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-10 left-10 text-yellow-400"
            >
              <div className="w-16 h-20 bg-yellow-300 rounded-full opacity-80 border-2 border-black/10 relative">
                 <div className="absolute -bottom-4 left-1/2 w-0.5 h-10 bg-gray-400"></div>
              </div>
            </motion.div>
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute top-16 right-12 text-pink-400"
            >
              <div className="w-14 h-18 bg-pink-300 rounded-full opacity-80 border-2 border-black/10 relative">
                 <div className="absolute -bottom-4 left-1/2 w-0.5 h-10 bg-gray-400"></div>
              </div>
            </motion.div>

            <h1 className="text-6xl font-heading font-bold text-blue-500 mb-2 drop-shadow-sm mt-10">Happy</h1>
            <h1 className="text-7xl font-heading font-bold text-pink-500 mb-4 drop-shadow-sm">Birthday</h1>
            <p className="text-gray-500 font-hand text-xl mb-12">To Qianqian Shao 💗</p>

            <button
              type="button"
              className="inline-block px-8 py-3 bg-yellow-400 rounded-full font-heading font-bold text-gray-800 shadow-lg uppercase tracking-wider hover:bg-yellow-300 transition-colors"
              onClick={() => {
                // Start music even if the user doesn't flip (but click will usually bubble to flip).
                startBgmOnce();
              }}
            >
              Open Card
            </button>

            <div className="absolute bottom-12 w-full flex justify-center space-x-8 opacity-80">
               <PartyPopper className="text-yellow-500 w-8 h-8" />
               <CakeIcon className="text-orange-400 w-8 h-8" />
               <Gift className="text-red-500 w-8 h-8" />
            </div>
          </PageContent>
        </div>
      ),
      back: (
        <div className="h-full w-full bg-gray-50 bg-grid p-6 flex flex-col items-center justify-center relative border-l-4 border-gray-200">
          <PageContent isVisible={flippedIndex >= 0}>
            <div className="grid grid-cols-1 gap-6 w-full h-full content-center">
               <div className="rotate-[-3deg]">
                 <ZoomableImage src={IMAGES.IMG_5043} alt="Graduation Day" className="w-full h-48" rotate={-2} />
                 <p className="text-center font-hand text-gray-500 mt-2">Graduation Day</p>
               </div>
               <div className="rotate-[2deg] translate-x-4">
                 <ZoomableImage src={IMAGES.IMG_5035} alt="Best Friends" className="w-full h-48" rotate={3} />
                 <p className="text-center font-hand text-gray-500 mt-2">Best Friends</p>
               </div>
            </div>
            <Sparkles className="absolute top-4 left-4 text-yellow-400 w-6 h-6 animate-pulse" />
          </PageContent>
        </div>
      )
    },
    // Sheet 1: Page 2 (Text) & Page 3 (Photos)
    {
      front: (
        <div className="h-full w-full bg-white bg-grid p-10 relative border-r-4 border-gray-200 flex flex-col justify-start overflow-y-auto">
          <PageContent isVisible={flippedIndex < 1}>
             <div className="absolute top-4 right-6 text-yellow-400 opacity-30">
               <Star className="w-8 h-8 fill-current rotate-12" />
             </div>

             <h2 className="text-4xl font-hand-zh font-bold text-gray-800 mb-6">亲爱的Qianqian，</h2>
             
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={flippedIndex >= 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="font-hand-zh text-2xl text-gray-700 space-y-8 leading-relaxed"
             >
               <p>
                 你在纽黑文的
                 <span 
                   className="cursor-pointer hover:text-blue-300 transition-colors"
                   onClick={(e) => { e.stopPropagation(); triggerSnow(); }}
                 >
                   雪天
                 </span>
                 过得好吗？我时常在Lawn的阳光里面想念你，想念我们一起在AFC打空手道，想念我们一起在Makers Lab做手工，想念我们去逛超市，下厨，讨论INFJ的心理活动……
               </p>
               <p>
                 遇见你就像遇见了镜子里的另一个自己，我们好像能理解对方的一些奇怪的想法和行为，能倾听对方的诉说，但是我又的确因你而拓宽了我对世界认知的边界。
               </p>
             </motion.div>
             
             {showSnowman && (
               <div className="snowman">
                 ☃️
               </div>
             )}
             
             <div className="absolute bottom-6 right-8 text-pink-300 opacity-30">
               <Heart className="w-10 h-10 fill-current" />
             </div>
          </PageContent>
        </div>
      ),
      back: (
        <div className="h-full w-full bg-blue-50 bg-grid p-6 flex flex-col items-center justify-center relative border-l-4 border-gray-200">
          <PageContent isVisible={flippedIndex >= 1}>
            <div className="grid grid-cols-1 gap-8 w-full h-full content-center">
               <div className="rotate-[1deg]">
                 <ZoomableImage src={IMAGES.IMG_8431} alt="Adventure 1" className="w-full h-48" rotate={1} />
               </div>
               <div className="rotate-[-2deg] -translate-x-2">
                 <ZoomableImage src={IMAGES.IMG_8434} alt="Adventure 2" className="w-full h-48" rotate={-2} />
               </div>
            </div>
            <div className="absolute bottom-4 right-4 font-hand text-gray-500 text-lg">So many adventures...</div>
          </PageContent>
        </div>
      )
    },
    // Sheet 2: Page 4 (Text) & Page 5 (Photo)
    {
      front: (
        <div className="h-full w-full bg-white bg-grid p-10 relative border-r-4 border-gray-200 flex flex-col justify-start overflow-y-auto">
          <PageContent isVisible={flippedIndex < 2}>
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={flippedIndex >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="font-hand-zh text-2xl text-gray-700 space-y-8 leading-relaxed"
             >
               <p>
                 <span 
                   className="cursor-pointer hover:text-green-500 transition-colors"
                   onClick={(e) => { e.stopPropagation(); triggerInfj(); }}
                 >
                   INFJ
                 </span>
                 总喜欢在角落里观察别人，我也很喜欢观察你。在我的心里，你总是一个果断的，坚定的人，我惊讶于你小小的个子能有那么大的力量和气场。比如你组织的高中underrepresented minority女生访学活动让我一直钦佩不已。
               </p>
               <p>
                 你会是我探索世界的好伙伴！虽然去年我们没有能如愿完成
                 <span 
                   className="cursor-pointer hover:text-orange-400 transition-colors"
                   onClick={(e) => { e.stopPropagation(); triggerRv(); }}
                 >
                   房车旅行
                 </span>
                 ，但是我希望我们今年可以去实现我们的梦想。如果今年不行，那就明年，后年，以后的每一年希望我们都能有机会去游览，去体验世界之大！
               </p>
             </motion.div>
             
             <div className="flex justify-center mt-8 space-x-4 opacity-20">
                <Star className="text-yellow-400 w-6 h-6" />
                <Star className="text-yellow-400 w-6 h-6" />
                <Star className="text-yellow-400 w-6 h-6" />
             </div>
          </PageContent>
        </div>
      ),
      back: (
        <div className="h-full w-full bg-pink-50 bg-grid p-6 flex flex-col items-center justify-center relative border-l-4 border-gray-200">
          <PageContent isVisible={flippedIndex >= 2}>
            <div className="w-full h-full flex items-center justify-center p-4">
               <div className="rotate-[3deg] w-full">
                 <ZoomableImage src={IMAGES.QIAN_17} alt="Special Memory" className="w-full h-[400px]" rotate={3} />
                 <p className="text-center font-hand text-gray-500 mt-4 text-xl">A day to remember</p>
               </div>
            </div>
          </PageContent>
        </div>
      )
    },
    // Sheet 3: Page 6 (Text) & Page 7 (Blank)
    {
      front: (
        <div className="h-full w-full bg-white bg-grid p-10 relative border-r-4 border-gray-200 flex flex-col justify-start overflow-y-auto">
          <PageContent isVisible={flippedIndex < 3}>
             <div className="absolute top-6 left-10 opacity-10">
                <Gift className="w-16 h-16 text-purple-400" />
             </div>
             
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={flippedIndex >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="font-hand-zh text-2xl text-gray-700 space-y-8 leading-relaxed"
             >
               <p>
                 最后的最后，祝你生日快乐！希望你在工作中，在生活里都快乐越来越多，烦恼越来越少，幸福越来越多，焦虑越来越少。
               </p>
               <p>
                 如果有焦虑和难过，我随时欢迎你来找我聊聊（虽然我最近会忙于毕业），次数无限，且永久有效！
               </p>
               <p className="font-bold text-purple-600">
                 你永远是“心有猛虎，细嗅蔷薇”的勇猛女侠！
               </p>
             </motion.div>

              <div className="mt-12 text-right relative">
                <p className="font-hand-zh text-xl text-gray-600">爱你，</p>
                <div className="relative inline-block">
                  {showSummerHeart && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.8, 1.5], opacity: [0, 1, 0.9] }}
                      transition={{ duration: 1, ease: "backOut" }}
                      className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
                    >
                      <Heart className="w-40 h-40 text-pink-500 fill-current" />
                    </motion.div>
                  )}
                  <motion.p 
                    animate={showSummerHeart ? { scale: 1.5, color: "#ec4899" } : { scale: 1, color: "#ec4899" }}
                    transition={{ duration: 0.5 }}
                    className="font-hand-zh text-4xl font-bold mt-2 cursor-pointer select-none relative z-10"
                    onClick={(e) => { e.stopPropagation(); triggerSummer(); }}
                  >
                    Summer
                  </motion.p>
                </div>
              </div>
          </PageContent>
        </div>
      ),
      back: (
        <div className="h-full w-full bg-white p-8 flex flex-col items-center justify-center relative border-l-4 border-gray-200 overflow-hidden">
           <PageContent isVisible={flippedIndex >= 3}>
             <div className="opacity-10 flex items-center justify-center h-full w-full">
                <Sparkles className="w-24 h-24 text-gray-300" />
             </div>
           </PageContent>
        </div>
      )
    },
    // Sheet 4: Page 8 (Cake) & Back Cover
    {
      front: (
        <div className="h-full w-full bg-white p-4 flex flex-col items-center justify-center relative overflow-hidden border-r-4 border-gray-200">
           <PageContent isVisible={flippedIndex < 4}>
             {/* Bunting */}
             <div className="absolute top-0 left-0 w-full flex justify-between px-4">
                {[...Array(7)].map((_, i) => (
                   <div key={i} className={`w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] ${['border-t-red-400', 'border-t-yellow-400', 'border-t-blue-400', 'border-t-green-400', 'border-t-pink-400'][i % 5]}`}></div>
                ))}
             </div>

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Cake onCelebrate={handleCelebrate} resetToken={cakeResetToken} />
              </div>
             
             <div className="absolute bottom-12 flex space-x-6 opacity-40">
                <Star className="text-yellow-300 w-6 h-6" />
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <Gift className="text-gray-400 w-6 h-6" />
                <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                <Star className="text-yellow-300 w-6 h-6" />
             </div>
           </PageContent>
        </div>
      ),
      back: (
        <div className="h-full w-full bg-rose-900 flex items-center justify-center border-l-4 border-rose-950 shadow-inner">
           <div className="text-rose-200 font-hand text-sm opacity-50">Handmade for You</div>
        </div>
      )
    }
  ], [flippedIndex, showSnowman, showInfj, showRv, showSummerHeart, cakeResetToken, handleCelebrate]);

  return (
    <div className="relative w-[500px] md:w-[900px] h-[550px] md:h-[650px] perspective-1000 mx-auto my-10 select-none">
      {/* Emoji rain overlay: exactly the left page (left half) */}
      <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none z-[1000] overflow-hidden">
        <CelebrationEmojiRain ref={rainRef} />
      </div>

      {/* Snowflakes */}
      {snowflakes.map(snow => (
        <div 
          key={snow.id} 
          className="snowflake" 
          style={{ left: snow.left, animationDelay: snow.delay, fontSize: snow.size }}
        >
          ❄
        </div>
      ))}

      {/* INFJ Runner */}
      {showInfj && (
        <div className="infj-runner">
          🧙‍♂️
        </div>
      )}

      {/* Book Spine/Back Cover visual aid */}
      <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gray-300 -translate-x-1/2 rounded-sm z-0 shadow-inner"></div>

      {/* RV Runner - Now inside the relative container to orbit the book */}
      {showRv && (
        <div className="rv-runner">
          🚐
        </div>
      )}

      {sheets.map((sheet, i) => {
        const isFlipped = i <= flippedIndex;
        
        let zIndex: number;
        if (i === flippingIndex) {
          zIndex = 100;
        } else {
          zIndex = isFlipped ? i : sheets.length - i;
        }

        return (
          <Sheet
            key={i}
            front={sheet.front}
            back={sheet.back}
            isFlipped={isFlipped}
            zIndex={zIndex}
            onFlip={() => handleFlip(i)}
            onFlipComplete={() => setFlippingIndex(-1)}
          />
        );
      })}
    </div>
  );
}
