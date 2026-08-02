// src/App.jsx (کامل)
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Stats } from '@react-three/drei';

function RotatingCube({ color, speed }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.8;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

function App() {
  const [color, setColor] = useState('#ff6600');
  const [speed, setSpeed] = useState(0.008);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube color={color} speed={speed} />
        <OrbitControls enableZoom enablePan />
        <Stats />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
        padding: '15px', borderRadius: 20, color: 'white',
        display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center'
      }}>
        <div>
          <label>🎨 رنگ: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div>
          <label>🌀 سرعت: {speed.toFixed(3)}</label>
          <input type="range" min="0" max="0.03" step="0.001" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
        </div>
        <button onClick={() => setShowHelp(!showHelp)} style={{ padding: '5px 15px', borderRadius: 20, background: '#ff6600', border: 'none', color: 'white' }}>📘 راهنما</button>
      </div>

      {showHelp && (
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          background: '#1e1e2f', padding: 20, borderRadius: 20, width: '80%', maxWidth: 400,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'white', textAlign: 'center'
        }}>
          <h3>راهنمای برنامه</h3>
          <p>▪️ با ماوس بکشید تا دوربین بچرخد<br/>
          ▪️ اسکرول کنید تا زوم کنید<br/>
          ▪️ رنگ و سرعت را از پنل پایین تغییر دهید</p>
          <button onClick={() => setShowHelp(false)} style={{ marginTop: 10, padding: '5px 15px', background: '#ff6600', border: 'none', borderRadius: 20, color: 'white' }}>بستن</button>
        </div>
      )}
    </div>
  );
}

export default App;
