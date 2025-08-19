import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import { useSpring as useSpringThree, animated } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { Task } from '@/convex/_generated/dataModel';
import { CheckCircle, XCircle, Clock, Star, Zap, Fire, Rocket, Crown } from 'lucide-react';

interface TaskCard3DProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  index: number;
}

// 3D Floating Card Component
function FloatingCard({ task, onComplete, onDelete, onUpdate, index }: TaskCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Physics-like floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time + index * 0.5) * 0.1 + index * 0.3;
      meshRef.current.rotation.z = Math.sin(time * 0.5 + index * 0.3) * 0.1;
      meshRef.current.rotation.x = Math.cos(time * 0.3 + index * 0.2) * 0.05;
    }
  });

  // Interactive animations
  const scale = useSpring(clicked ? 1.2 : hovered ? 1.1 : 1);
  const rotation = useSpring(hovered ? [0, 0, 0.1] : [0, 0, 0]);

  // Gesture handling
  const bind = useDrag(({ down, movement: [x, y], velocity: [vx, vy] }) => {
    if (meshRef.current) {
      meshRef.current.position.x = x * 0.01;
      meshRef.current.position.z = y * 0.01;
      if (down) {
        meshRef.current.rotation.y = x * 0.01;
        meshRef.current.rotation.x = y * 0.01;
      }
    }
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'apocalypse': return <Fire className="w-4 h-4 text-red-500" />;
      case 'emergency': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'urgent': return <Rocket className="w-4 h-4 text-yellow-500" />;
      case 'normal': return <Star className="w-4 h-4 text-blue-500" />;
      case 'chill': return <Clock className="w-4 h-4 text-green-500" />;
      default: return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'apocalypse': return '#EF4444';
      case 'emergency': return '#F97316';
      case 'urgent': return '#EAB308';
      case 'normal': return '#3B82F6';
      case 'chill': return '#22C55E';
      default: return '#3B82F6';
    }
  };

  return (
    <animated.mesh
      ref={meshRef}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      {...bind()}
    >
      <Box args={[2, 1.5, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={task.color || '#4ECDC4'} 
          transparent 
          opacity={0.9}
          metalness={0.1}
          roughness={0.2}
        />
      </Box>
      
      {/* Task content */}
      <Text
        position={[0, 0.4, 0.06]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {task.emoji} {task.title}
      </Text>
      
      {/* Priority indicator */}
      <Box 
        args={[0.1, 0.1, 0.02]} 
        position={[-0.8, 0.5, 0.06]}
      >
        <meshStandardMaterial color={getPriorityColor(task.priority || 'normal')} />
      </Box>
      
      {/* Action buttons */}
      <Box 
        args={[0.2, 0.2, 0.02]} 
        position={[0.7, 0.5, 0.06]}
        onClick={(e) => {
          e.stopPropagation();
          onComplete(task._id);
        }}
      >
        <meshStandardMaterial color="#22C55E" />
      </Box>
      
      <Box 
        args={[0.2, 0.2, 0.02]} 
        position={[0.7, -0.5, 0.06]}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task._id);
        }}
      >
        <meshStandardMaterial color="#EF4444" />
      </Box>
      
      {/* Floating particles around the card */}
      {hovered && (
        <>
          <Sphere args={[0.02, 8, 6]} position={[-1.2, 0, 0]}>
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.02, 8, 6]} position={[1.2, 0, 0]}>
            <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.02, 8, 6]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4" emissiveIntensity={0.5} />
          </Sphere>
        </>
      )}
    </animated.mesh>
  );
}

// Main TaskCard3D Component
export default function TaskCard3D({ task, onComplete, onDelete, onUpdate, index }: TaskCard3DProps) {
  const [is3D, setIs3D] = useState(true);
  const controls = useAnimation();

  // Crazy entrance animation
  useEffect(() => {
    controls.start({
      scale: [0, 1.2, 1],
      rotateY: [0, 360, 0],
      transition: { duration: 1.5, ease: "easeOut" }
    });
  }, [controls]);

  if (is3D) {
    return (
      <div className="h-64 w-full">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <FloatingCard 
            task={task} 
            onComplete={onComplete} 
            onDelete={onDelete} 
            onUpdate={onUpdate}
            index={index}
          />
        </Canvas>
        
        {/* 2D/3D Toggle */}
        <motion.button
          className="absolute top-2 right-2 bg-black/20 text-white px-2 py-1 rounded text-xs"
          onClick={() => setIs3D(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          2D Mode
        </motion.button>
      </div>
    );
  }

  // 2D Fallback with crazy animations
  return (
    <motion.div
      className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6 rounded-2xl shadow-2xl border-2 border-white/20"
      initial={{ scale: 0, rotate: -180 }}
      animate={controls}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5, 
        rotateX: 5,
        transition: { type: "spring", stiffness: 300 }
      }}
      style={{
        background: `linear-gradient(45deg, ${task.color || '#4ECDC4'}, ${task.color || '#4ECDC4'}80)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Crazy background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      {/* Task content */}
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl">{task.emoji}</span>
          <motion.button
            className="bg-white/20 p-2 rounded-full"
            onClick={() => setIs3D(true)}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.8 }}
          >
            3D Mode
          </motion.button>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-white/80 mb-4">{task.description}</p>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            {getPriorityIcon(task.priority || 'normal')}
            <span className="text-sm capitalize">{task.priority || 'normal'}</span>
          </span>
          
          {task.category && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
              {task.category}
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
            onClick={() => onComplete(task._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete! 🎉
          </motion.button>
          
          <motion.button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
            onClick={() => onDelete(task._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete 🗑️
          </motion.button>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
