import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { DICE_THEMES, type DiceTheme } from '@/components/dice/diceThemes';

interface Dice3DProps {
  sides: number;
  value: number | null;
  isRolling: boolean;
  onRollComplete?: (value: number) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  theme?: DiceTheme;
}

// Stylized number component with Solo Leveling aesthetic
function StylizedNumber({ value, position, size = 0.3, theme = 'shadow-monarch' }: { value: number; position: [number, number, number]; size?: number; theme?: DiceTheme }) {
  const themeConfig = DICE_THEMES[theme];
  const isCritical = value === 20;
  const isFumble = value === 1;
  
  // Determine color based on value and theme
  let numberColor = '#ffffff';
  let glowColor = themeConfig.emissiveColor;
  let glowIntensity = themeConfig.glowIntensity;
  
  if (isCritical) {
    numberColor = '#10b981';
    glowColor = '#10b981';
    glowIntensity = 1.0;
  } else if (isFumble) {
    numberColor = '#ef4444';
    glowColor = '#ef4444';
    glowIntensity = 0.9;
  }
  
  return (
    <group position={position}>
      {/* Outer black outline for maximum visibility */}
      <Text
        position={[0, 0, -0.02]}
        fontSize={size * 1.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#000000"
        fontWeight="900"
      >
        {value}
      </Text>
      {/* Glow effect behind number */}
      <Text
        position={[0, 0, -0.01]}
        fontSize={size * 1.3}
        color={glowColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0}
      >
        {value}
      </Text>
      {/* Main number with Solo Leveling style outline */}
      <Text
        position={[0, 0, 0]}
        fontSize={size}
        color={numberColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor={isCritical || isFumble ? glowColor : '#000000'}
        fontWeight="900"
      >
        {value}
      </Text>
      {/* Additional glow layer for critical/fumble */}
      {(isCritical || isFumble) && (
        <Text
          position={[0, 0, 0.01]}
          fontSize={size * 1.15}
          color={glowColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor={glowColor}
          fontWeight="900"
        >
          {value}
        </Text>
      )}
    </group>
  );
}

// Particle system for dice
function DiceParticles({ position, theme, isActive }: { position: [number, number, number]; theme: DiceTheme; isActive: boolean }) {
  const themeConfig = DICE_THEMES[theme];
  
  if (!isActive) return null;
  
  return (
    <Sparkles
      count={20}
      scale={2}
      size={2}
      speed={0.4}
      color={themeConfig.particleColor}
      position={position}
      opacity={0.8}
    />
  );
}

// Create a 3D die based on number of sides
function Die({ sides, value, isRolling, onRollComplete, position, rotation = [0, 0, 0], theme = 'shadow-monarch' }: Dice3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const velocityRef = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  ));
  const angularVelocityRef = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.3,
    (Math.random() - 0.5) * 0.3,
    (Math.random() - 0.5) * 0.3
  ));
  const dampingRef = useRef(0.98);
  const themeConfig = DICE_THEMES[theme];
  const timeRef = useRef(0);

  useEffect(() => {
    if (isRolling && !isAnimating) {
      setIsAnimating(true);
      velocityRef.current = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 15
      );
      angularVelocityRef.current = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
      dampingRef.current = 0.98;
    }
  }, [isRolling, isAnimating]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta;

    if (isAnimating) {
      // Apply physics
      meshRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
      meshRef.current.rotation.x += angularVelocityRef.current.x * delta;
      meshRef.current.rotation.y += angularVelocityRef.current.y * delta;
      meshRef.current.rotation.z += angularVelocityRef.current.z * delta;

      // Apply damping
      velocityRef.current.multiplyScalar(dampingRef.current);
      angularVelocityRef.current.multiplyScalar(dampingRef.current);

      // Bounce off ground (y = 0)
      if (meshRef.current.position.y < 0.5) {
        meshRef.current.position.y = 0.5;
        velocityRef.current.y *= -0.6;
        angularVelocityRef.current.multiplyScalar(0.9);
      }

      // Pulsing glow effect while rolling
      const pulse = Math.sin(timeRef.current * 5) * 0.2 + 0.8;
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = themeConfig.glowIntensity * pulse;
      }

      // Stop when velocity is very low
      if (velocityRef.current.length() < 0.1 && angularVelocityRef.current.length() < 0.01) {
        setIsAnimating(false);
        if (value !== null && onRollComplete) {
          setTimeout(() => onRollComplete(value), 100);
        }
      }
    } else if (value !== null) {
      // Snap to final value orientation
      const targetRotation = getRotationForValue(sides, value);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation[0], 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation[1], 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation[2], 0.1);
      
      // Subtle pulse for critical/fumble
      if (value === 20 || value === 1) {
        const pulse = Math.sin(timeRef.current * 2) * 0.1 + 0.9;
        if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
          meshRef.current.material.emissiveIntensity = themeConfig.glowIntensity * pulse;
        }
      }
    }
  });

  // Get rotation for a specific value (simplified - would need proper mapping for each die type)
  const getRotationForValue = (sides: number, val: number): [number, number, number] => {
    // Simplified rotation mapping - in production, you'd want proper face mapping
    const angle = (val / sides) * Math.PI * 2;
    return [angle * 0.3, angle * 0.5, angle * 0.2];
  };

  // Create geometry based on sides
  const getGeometry = () => {
    switch (sides) {
      case 4:
        return <tetrahedronGeometry args={[1, 0]} />;
      case 6:
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 8:
        return <octahedronGeometry args={[1, 0]} />;
      case 10:
        return <dodecahedronGeometry args={[0.8, 0]} />;
      case 12:
        return <dodecahedronGeometry args={[1, 0]} />;
      case 20:
        return <icosahedronGeometry args={[1, 0]} />;
      case 100:
        return <dodecahedronGeometry args={[1, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  // Get number position based on die type
  const getNumberPosition = (): [number, number, number] => {
    switch (sides) {
      case 6:
        return [0, 0, 0.7];
      case 4:
        return [0, 0.3, 0];
      case 8:
        return [0, 0, 0.6];
      case 20:
        return [0, 0, 0.6];
      default:
        return [0, 0, 0.5];
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        rotation={rotation}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial
          color={themeConfig.baseColor}
          metalness={themeConfig.metalness}
          roughness={themeConfig.roughness}
          emissive={themeConfig.emissiveColor}
          emissiveIntensity={isAnimating ? themeConfig.glowIntensity * 0.8 : themeConfig.glowIntensity * 0.3}
        />
      </mesh>
      
      {/* Stylized number display */}
      {value !== null && !isAnimating && sides <= 20 && (
        <StylizedNumber
          value={value}
          position={getNumberPosition()}
          size={sides === 20 ? 0.25 : 0.3}
          theme={theme}
        />
      )}
      
      {/* Particle effects */}
      <DiceParticles
        position={position}
        theme={theme}
        isActive={isAnimating || (value !== null && (value === 20 || value === 1))}
      />
    </group>
  );
}

interface Dice3DSceneProps {
  dice: Array<{ sides: number; value: number | null }>;
  isRolling: boolean;
  onRollComplete?: (index: number, value: number) => void;
  theme?: DiceTheme;
}

function Dice3DScene({ dice, isRolling, onRollComplete, theme = 'shadow-monarch' }: Dice3DSceneProps) {
  const themeConfig = DICE_THEMES[theme];
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color={themeConfig.emissiveColor} />
      <pointLight position={[10, 10, -10]} intensity={0.6} color={themeConfig.baseColor} />
      <pointLight position={[0, 15, 0]} intensity={0.4} color={themeConfig.particleColor} />
      
      {/* Shadow plane with Solo Leveling aesthetic */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0a0a1a"
          metalness={0.1}
          roughness={0.9}
          emissive={themeConfig.particleColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Solo Leveling themed environment */}
      <fog attach="fog" args={['#1a1a2e', 5, 20]} />
      
      {/* Render dice */}
      {dice.map((die, index) => {
        const spacing = 2.5;
        const offset = (dice.length - 1) * spacing / 2;
        const x = index * spacing - offset;
        return (
          <Die
            key={index}
            sides={die.sides}
            value={die.value}
            isRolling={isRolling}
            onRollComplete={(value) => onRollComplete?.(index, value)}
            position={[x, 2, 0]}
            theme={theme}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={!isRolling}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

interface Dice3DRollerProps {
  dice: Array<{ sides: number; value: number | null }>;
  isRolling: boolean;
  onRollComplete?: (index: number, value: number) => void;
  theme?: DiceTheme;
  className?: string;
}

export function Dice3DRoller({ dice, isRolling, onRollComplete, theme = 'shadow-monarch', className }: Dice3DRollerProps) {
  const themeConfig = DICE_THEMES[theme];
  
  return (
    <div className={cn("w-full h-[400px] rounded-lg overflow-hidden border border-border/50 bg-gradient-to-b from-void-black via-shadow-deep to-void-black relative", className)}>
      {/* Solo Leveling glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-32 h-32 rounded-full blur-2xl animate-pulse" 
          style={{ 
            backgroundColor: `${themeConfig.baseColor}20`,
          }} 
        />
        <div 
          className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-2xl animate-pulse" 
          style={{ 
            animationDelay: '0.5s',
            backgroundColor: `${themeConfig.emissiveColor}20`,
          }} 
        />
      </div>
      
      <Canvas shadows className="relative z-10">
        <Dice3DScene dice={dice} isRolling={isRolling} onRollComplete={onRollComplete} theme={theme} />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border" style={{ borderColor: `${themeConfig.emissiveColor}30` }}>
          <p className="text-xs text-muted-foreground text-center font-heading">
            {isRolling ? 'The System is calculating your fate...' : 'Click and drag to rotate • Scroll to zoom'}
          </p>
        </div>
      </div>
    </div>
  );
}
