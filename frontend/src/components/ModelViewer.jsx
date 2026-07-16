import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, useProgress, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-[#FAF3E0]/95 rounded-[32px] backdrop-blur-xl border border-[#D4A373]/30 shadow-2xl min-w-[240px]">
        {/* Animated Temple Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-b-2 border-[#D4A373] animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <img src={logoImg} alt="Loading" className="w-full h-full object-cover object-center scale-150" />
            </div>
          </div>
          <div className="absolute -inset-4 border border-[#D4A373]/20 rounded-full animate-spin-slow"></div>
        </div>
        
        <p className="sans text-[#D4A373] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-center">Digitizing Sanctum</p>
        
        <div className="w-full h-1 bg-[#D4A373]/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#D4A373] to-[#FFD700]" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="serif text-[#2B1D11] font-bold text-xl">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function Model({ url }) {
  const { scene } = useGLTF(url, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  return <primitive object={scene} />;
}

const ModelViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-full bg-transparent relative group">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 20], fov: 40 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={1024} />
          <Stage 
            environment="city" 
            intensity={0.8} 
            contactShadow={{ opacity: 0.8, blur: 2, color: '#2B1D11' }} 
            adjustCamera={true}
            shadows="contact"
          >
            <Model url={modelUrl} />
          </Stage>
          
          <OrbitControls 
            makeDefault 
            autoRotate 
            autoRotateSpeed={1.5} 
            enableDamping
            dampingFactor={0.04}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
export default ModelViewer;
