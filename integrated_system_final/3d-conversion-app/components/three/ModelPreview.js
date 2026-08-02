import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" wireframe />
    </mesh>
  );
}

export default function ModelPreview({ file, previewUrl }) {
  const [error, setError] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const supportedFormats = ['glb', 'gltf'];
      setIsSupported(supportedFormats.includes(ext));
    }
  }, [file]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem' }}>❌</div>
        <h3>خطا در بارگذاری مدل</h3>
        <p>پیش‌نمایش این فرمت در مرورگر پشتیبانی نمی‌شود</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem' }}>📦</div>
        <p>فایل 3D خود را آپلود کنید</p>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {isSupported && previewUrl ? (
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={<LoadingSpinner />}>
            <Model url={previewUrl} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2rem' }}>📄</div>
          <h3>مدل 3D آپلود شده</h3>
          <p>{file.name}</p>
          <p style={{ color: '#666' }}>
            پیش‌نمایش فقط برای فرمت‌های GLB و GLTF در دسترس است
          </p>
          <div style={{ marginTop: '10px' }}>
            <strong>حجم:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}
    </div>
  );
}
