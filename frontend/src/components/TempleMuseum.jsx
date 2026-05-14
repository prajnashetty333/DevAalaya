import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, OrbitControls, PerspectiveCamera, Center, Float, Text, useTexture, Image } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 2.5D Holographic Model Viewer
 * Loads the user's PNGs and displays them in a 3D space.
 */
const HologramModel = ({ url, wireframe }) => {
  // Using Drei's Image for a clean, aspect-ratio preserved display
  return (
    <group>
      {/* The main image display */}
      {!wireframe && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Image 
            url={url} 
            transparent 
            scale={[3, 3]} // Adjust scale as needed
            side={THREE.DoubleSide}
          />
        </Float>
      )}

      {/* The skeletal/structural mesh (shown when wireframe is true) */}
      {wireframe && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh>
             {/* High-segment plane for a cool wireframe effect */}
            <planeGeometry args={[3, 3, 16, 16]} />
            <meshBasicMaterial color="#10b981" wireframe={true} side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
          <Text position={[0, 0, 0.1]} fontSize={0.2} color="#10b981" anchorX="center" anchorY="middle">
            STRUCTURAL ANALYSIS
          </Text>
        </Float>
      )}

      {/* Holographic Base */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color={wireframe ? "#10b981" : "#f59e0b"} wireframe={true} transparent opacity={0.3} />
      </mesh>
      
      {/* Light coming from base */}
      <pointLight position={[0, -1.5, 0]} color={wireframe ? "#10b981" : "#f59e0b"} intensity={2} distance={3} />
    </group>
  );
};

const Loader = () => (
  <Center>
    <Text fontSize={0.2} color="white">
      Loading Archives...
    </Text>
  </Center>
);

const TempleMuseum = () => {
  const [style, setStyle] = useState('Dravidian');
  const [isSkeletal, setIsSkeletal] = useState(false);

  const styleConfig = {
    'Dravidian': '/architecture/dravidiantemp.png',
    'Nagara': '/architecture/nagaratemp.png',
    'Kalinga': '/architecture/kalingatemp.png'
  };

  const styles = Object.keys(styleConfig);

  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <Suspense fallback={<Loader />}>
          <Center>
            <HologramModel url={styleConfig[style]} wireframe={isSkeletal} />
          </Center>
        </Suspense>
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
          makeDefault 
          autoRotate={!isSkeletal}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 flex flex-col gap-4">
        <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
          <h2 className="text-white font-bold px-4 py-2 text-lg tracking-wider uppercase">Devalaya Museum</h2>
          <div className="flex flex-col gap-1 mt-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  style === s 
                    ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {s} Style
              </button>
            ))}
          </div>
        </div>

        {/* Skeletal Toggle */}
        <button
          onClick={() => setIsSkeletal(!isSkeletal)}
          className={`group relative flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-500 overflow-hidden ${
            isSkeletal 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isSkeletal ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="font-semibold tracking-tight">
            {isSkeletal ? 'SKELETAL SCAN ACTIVE' : 'RUN STRUCTURAL SCAN'}
          </span>
          {/* Progress background effect */}
          <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
        </button>
      </div>

      {/* Info Badge */}
      <div className="absolute bottom-6 left-6 text-slate-500 text-xs font-mono uppercase tracking-[0.2em] pointer-events-none">
        Visual Data Archive // v2.0
      </div>

      {/* Mobile Indicator */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" />
        Drag to Orbit
      </div>
    </div>
  );
};

export default TempleMuseum;
