import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

// Floating particle component
function FloatingParticle({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time + position[0]) * 0.5 + position[1];
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.1;
    }
  });

  const scale = useSpring(hovered ? size * 1.5 : size);

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Sphere args={[0.1, 8, 6]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </animated.mesh>
  );
}

// 3D Background Scene
function BackgroundScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<Array<{ position: [number, number, number], color: string, size: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
      size: Math.random() * 0.2 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <FloatingParticle key={index} {...particle} />
      ))}
    </group>
  );
}

// 2D Animated Background
function AnimatedBackground2D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Mouse-following gradient
  const mouseX = useMotionValue(mousePosition.x);
  const mouseY = useMotionValue(mousePosition.y);

  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [0, 100]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [0, 100]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${backgroundX}% ${backgroundY}%, 
            rgba(255, 107, 107, 0.3) 0%, 
            rgba(78, 205, 196, 0.3) 25%, 
            rgba(69, 183, 209, 0.3) 50%, 
            rgba(150, 206, 180, 0.3) 75%, 
            rgba(255, 234, 167, 0.3) 100%)`,
        }}
        animate={{
          scale: isHovering ? 1.1 : 1,
          rotate: isHovering ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating geometric shapes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Moving gradient lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, window.innerWidth],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        />
      ))}

      {/* Pulsing circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute border-2 border-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Interactive mouse trail */}
      <motion.div
        className="absolute w-8 h-8 bg-white/20 rounded-full pointer-events-none"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </div>
  );
}

// Main CrazyBackground Component
export default function CrazyBackground({ children, mode = '2d' }: { children: React.ReactNode, mode?: '2d' | '3d' }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const controls = useAnimation();

  useEffect(() => {
    // Crazy entrance animation
    controls.start({
      opacity: [0, 1],
      scale: [0.8, 1],
      rotate: [0, 360, 0],
      transition: { duration: 2, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <motion.div
      className="min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      {/* Background */}
      {currentMode === '3d' ? (
        <div className="fixed inset-0 -z-10">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <BackgroundScene />
          </Canvas>
        </div>
      ) : (
        <AnimatedBackground2D />
      )}

      {/* Mode Toggle */}
      <motion.button
        className="fixed top-4 right-4 z-50 bg-black/20 text-white px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
        onClick={() => setCurrentMode(currentMode === '2d' ? '3d' : '2d')}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {currentMode === '2d' ? '🌌 3D Mode' : '🎨 2D Mode'}
      </motion.button>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Crazy corner decorations */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-br-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <motion.div
        className="fixed bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-yellow-400 to-orange-500 rounded-tl-full opacity-20"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating emojis */}
      {['🚀', '💫', '⭐', '🎉', '✨', '🌟', '💥', '🔥'].map((emoji, i) => (
        <motion.div
          key={emoji}
          className="fixed text-2xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </motion.div>
  );
}
