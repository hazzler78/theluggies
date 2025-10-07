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
  
  const springConfig = {damping: 25, stiffness: 200};
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
      
      const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
      const detectionRadius = isSmallScreen ? 420 : 350;
      
      if (distance < detectionRadius) {
        setIsBeingChased(true);
        setExpression('surprised'); // Show surprised face when being chased
        
        // RUN AWAY! Calculate escape direction
        const escapeStrength = Math.min((detectionRadius - distance) / detectionRadius, 1);
        const escapeDistance = 250;
        
        const newX = currentX - (distanceX / distance) * escapeDistance * escapeStrength;
        const newY = currentY - (distanceY / distance) * escapeDistance * escapeStrength;
        
        // Keep within bounds (with some padding)
        const maxX = (containerRect.width / 2) - 100;
        const maxY = (containerRect.height / 2) - 100;
        
        setPosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY))
        });
        
        rotate.set(-(distanceX / distance) * 20);
        scale.set(1.2);
      } else {
        setIsBeingChased(false);
        setExpression('idle'); // Back to normal when safe
        scale.set(1);
        rotate.set(0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => reactToPointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        reactToPointer(t.clientX, t.clientY);
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


