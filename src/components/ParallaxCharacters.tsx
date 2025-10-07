"use client";
import {motion, useSpring} from 'framer-motion';
import Lenis from 'lenis';
import {useEffect, useRef, useState} from 'react';

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis?.destroy?.();
    };
  }, []);
}

interface CharacterPosition {
  x: number;
  y: number;
  index: number;
}

function Character({
  color,
  label,
  index,
  containerRef,
  allPositions,
  onPositionChange
}: {
  color: string;
  label: string;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  allPositions: CharacterPosition[];
  onPositionChange: (index: number, pos: {x: number, y: number}) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isBeingChased, setIsBeingChased] = useState(false);
  const [expression, setExpression] = useState<'idle' | 'surprised' | 'happy'>('idle');
  
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const springConfig = {damping: isSmallScreen ? 50 : 25, stiffness: isSmallScreen ? 120 : 200};
  const x = useSpring(position.x, springConfig);
  const y = useSpring(position.y, springConfig);
  const rotate = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Set initial positions spread out
  useEffect(() => {
    const positions = [
      {x: -200, y: -50},   // Yellow left
      {x: 0, y: 50},       // Blue center
      {x: 200, y: -50}     // Purple right
    ];
    setPosition(positions[index]);
  }, [index]);

  // Update parent with position changes
  useEffect(() => {
    onPositionChange(index, position);
  }, [position, index, onPositionChange]);

  // Check collisions with other characters and push away
  useEffect(() => {
    const checkCollisions = () => {
      const characterSize = 176; // Size of character blocks
      const repulsionRadius = characterSize + 20; // Add some padding
      
      let adjustX = 0;
      let adjustY = 0;
      
      allPositions.forEach(other => {
        if (other.index === index) return; // Skip self
        
        const dx = position.x - other.x;
        const dy = position.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < repulsionRadius && distance > 0) {
          // Push away from other character
          const pushStrength = (repulsionRadius - distance) / repulsionRadius;
          adjustX += (dx / distance) * 100 * pushStrength;
          adjustY += (dy / distance) * 100 * pushStrength;
          
          // Show happy face when bumping into friends!
          setExpression('happy');
          setTimeout(() => setExpression('idle'), 1000); // Back to normal after 1 second
        }
      });
      
      if (adjustX !== 0 || adjustY !== 0) {
        setPosition(prev => ({
          x: prev.x + adjustX,
          y: prev.y + adjustY
        }));
      }
    };
    
    checkCollisions();
  }, [allPositions, position, index]);

  // Independent random wandering movement
  useEffect(() => {
    const wander = () => {
      if (isBeingChased) return; // Don't wander if being chased
      
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const maxX = (containerRect.width / 2) - 150;
      const maxY = (containerRect.height / 2) - 150;
      
      // Random target within bounds
      const targetX = (Math.random() - 0.5) * maxX * 2;
      const targetY = (Math.random() - 0.5) * maxY * 2;
      
      setPosition({x: targetX, y: targetY});
    };

    // Each character has different timing
    const intervals = [3000, 4000, 3500]; // Different speeds for each
    const intervalTime = intervals[index] + Math.random() * 1000;
    
    const interval = setInterval(wander, intervalTime);
    return () => clearInterval(interval);
  }, [index, isBeingChased, containerRef]);

  useEffect(() => {
    const reactToPointer = (clientX: number, clientY: number) => {
      if (!ref.current || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Get current position in container space
      const currentX = position.x;
      const currentY = position.y;
      
      // Convert to screen coordinates
      const centerX = containerRect.left + containerRect.width / 2 + currentX;
      const centerY = containerRect.top + containerRect.height / 2 + currentY;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      const detectionRadius = isSmallScreen ? 280 : 350;
      
      if (distance < detectionRadius) {
        setIsBeingChased(true);
        setExpression('surprised'); // Show surprised face when being chased
        
        // RUN AWAY! Calculate escape direction
        const escapeStrength = Math.min((detectionRadius - distance) / detectionRadius, 1);
        const escapeDistance = isSmallScreen ? 180 : 250;
        
        const targetX = currentX - (distanceX / distance) * escapeDistance * escapeStrength;
        const targetY = currentY - (distanceY / distance) * escapeDistance * escapeStrength;
        
        // Keep within bounds (with some padding)
        const maxX = (containerRect.width / 2) - 100;
        const maxY = (containerRect.height / 2) - 100;
        
        const clampedX = Math.max(-maxX, Math.min(maxX, targetX));
        const clampedY = Math.max(-maxY, Math.min(maxY, targetY));

        // Smoother movement on mobile - bigger steps but less frequent
        if (isSmallScreen) {
          setPosition({x: clampedX, y: clampedY});
        } else {
          const alpha = 0.6;
          setPosition({
            x: currentX + (clampedX - currentX) * alpha,
            y: currentY + (clampedY - currentY) * alpha
          });
        }
        
        rotate.set(-(distanceX / Math.max(distance, 1)) * (isSmallScreen ? 8 : 20));
        scale.set(isSmallScreen ? 1.05 : 1.2);
      } else {
        setIsBeingChased(false);
        setExpression('idle'); // Back to normal when safe
        scale.set(1);
        rotate.set(0);
      }
    };

    let rafId: number | null = null;
    let queuedX = 0, queuedY = 0, hasQueue = false;

    const flush = () => {
      if (hasQueue) {
        reactToPointer(queuedX, queuedY);
        hasQueue = false;
      }
      rafId = null;
    };

    const schedule = (x: number, y: number) => {
      queuedX = x; queuedY = y; hasQueue = true;
      if (rafId == null) rafId = requestAnimationFrame(flush);
    };

    const handleMouseMove = (e: MouseEvent) => schedule(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        schedule(t.clientX, t.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, {passive: true});
    window.addEventListener('touchstart', handleTouchMove as (e: Event) => void, {passive: true});
    window.addEventListener('touchmove', handleTouchMove as (e: Event) => void, {passive: true});
    window.addEventListener('touchend', handleTouchMove as (e: Event) => void, {passive: true});
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove as (e: Event) => void);
      window.removeEventListener('touchmove', handleTouchMove as (e: Event) => void);
      window.removeEventListener('touchend', handleTouchMove as (e: Event) => void);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [position, rotate, scale, containerRef]);

  // Sync spring values with position state
  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position, x, y]);

  // Get the correct image based on color and expression
  const getImageSrc = () => {
    const colorName = color.replace('bg-', '').replace('-300', '').replace('-400', '');
    return `/luggisarna/${colorName}-${expression}.png`;
  };

  return (
    <motion.div
      ref={ref}
      style={{x, y, rotate, scale}}
      className="absolute w-32 h-32 sm:w-44 sm:h-44 cursor-pointer"
      aria-label={label}
    >
      <img 
        src={getImageSrc()}
        alt={`${label} Luggie with ${expression} expression`}
        className="w-full h-full object-contain drop-shadow-xl"
        draggable={false}
      />
    </motion.div>
  );
}

export function ParallaxCharacters() {
  useLenis();
  const ref = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<CharacterPosition[]>([
    {x: -200, y: -50, index: 0},
    {x: 0, y: 50, index: 1},
    {x: 200, y: -50, index: 2}
  ]);

  const handlePositionChange = (index: number, pos: {x: number, y: number}) => {
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = {...pos, index};
      return newPositions;
    });
  };

  return (
    <section ref={ref} className="w-full max-w-5xl h-[70vh] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <Character 
          color="bg-yellow-300" 
          label="Yellow" 
          index={0} 
          containerRef={ref} 
          allPositions={positions}
          onPositionChange={handlePositionChange}
        />
        <Character 
          color="bg-blue-400" 
          label="Blue" 
          index={1} 
          containerRef={ref} 
          allPositions={positions}
          onPositionChange={handlePositionChange}
        />
        <Character 
          color="bg-purple-400" 
          label="Purple" 
          index={2} 
          containerRef={ref} 
          allPositions={positions}
          onPositionChange={handlePositionChange}
        />
      </div>
    </section>
  );
}


