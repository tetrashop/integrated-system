import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Chess3DOptimized = ({ onEarnCoins }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 600/600, 0.1, 1000));
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // تنظیمات رندرر
    renderer.setSize(600, 600);
    renderer.setClearColor(0xf0f0f0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // نورپردازی پیشرفته
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // ایجاد صفحه شطرنج
    createChessBoard(scene);

    // موقعیت دوربین
    camera.position.set(0, 12, 12);
    camera.lookAt(0, 0, 0);

    // کنترل‌های دوربین
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // چرخش دوربین
      camera.position.x -= deltaMove.x * 0.01;
      camera.position.y -= deltaMove.y * 0.01;
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: event.clientX, y: event.clientY };
      
      // پاداش برای تعامل با دوربین
      onEarnCoins?.(1, "چرخش دیدگاه 3D");
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    if (mountRef.current) {
      mountRef.current.addEventListener('mousedown', handleMouseDown);
      mountRef.current.addEventListener('mousemove', handleMouseMove);
      mountRef.current.addEventListener('mouseup', handleMouseUp);
    }

    // انیمیشن
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [onEarnCoins]);

  const createChessBoard = (scene) => {
    // ایجاد خانه‌های شطرنج با متریال پیشرفته
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const isLight = (i + j) % 2 === 0;
        const color = isLight ? 0xf0d9b5 : 0xb58863;
        
        const geometry = new THREE.BoxGeometry(1, 0.1, 1);
        const material = new THREE.MeshLambertMaterial({ 
          color,
          transparent: true,
          opacity: 0.9
        });
        
        const square = new THREE.Mesh(geometry, material);
        square.position.set(i - 3.5, -0.05, j - 3.5);
        square.userData = { type: 'square', row: i, col: j };
        square.receiveShadow = true;
        
        scene.add(square);
      }
    }

    // ایجاد مهره‌ها
    createPieces(scene);
  };

  const createPieces = (scene) => {
    const pieceConfigs = [
      // پیاده (Pawn)
      { type: 'p', geometry: new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16) },
      // رخ (Rook)
      { type: 'r', geometry: new THREE.CylinderGeometry(0.4, 0.4, 0.8, 8) },
      // اسب (Knight)
      { type: 'n', geometry: new THREE.ConeGeometry(0.35, 0.8, 8) },
      // فیل (Bishop)
      { type: 'b', geometry: new THREE.ConeGeometry(0.3, 0.9, 16) },
      // وزیر (Queen)
      { type: 'q', geometry: new THREE.SphereGeometry(0.4, 16, 16) },
      // شاه (King)
      { type: 'k', geometry: new THREE.CylinderGeometry(0.25, 0.4, 0.9, 16) }
    ];

    // مهره‌های سفید
    const whitePositions = {
      'p': [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
      'r': [[0,0],[7,0]],
      'n': [[1,0],[6,0]],
      'b': [[2,0],[5,0]],
      'q': [[3,0]],
      'k': [[4,0]]
    };

    // مهره‌های سیاه
    const blackPositions = {
      'p': [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]],
      'r': [[0,7],[7,7]],
      'n': [[1,7],[6,7]],
      'b': [[2,7],[5,7]],
      'q': [[3,7]],
      'k': [[4,7]]
    };

    // ایجاد مهره‌های سفید
    pieceConfigs.forEach(config => {
      whitePositions[config.type].forEach(([x, z]) => {
        createPiece(scene, config.geometry, 0xffffff, x, z, config.type, 'white');
      });
    });

    // ایجاد مهره‌های سیاه
    pieceConfigs.forEach(config => {
      blackPositions[config.type].forEach(([x, z]) => {
        createPiece(scene, config.geometry, 0x222222, x, z, config.type, 'black');
      });
    });
  };

  const createPiece = (scene, geometry, color, x, z, type, team) => {
    const material = new THREE.MeshLambertMaterial({ 
      color,
      shininess: 30
    });
    
    const piece = new THREE.Mesh(geometry, material);
    piece.position.set(x - 3.5, 0.5, z - 3.5);
    piece.userData = { type: 'piece', pieceType: type, team, row: x, col: z };
    piece.castShadow = true;
    
    scene.add(piece);
    return piece;
  };

  const handlePieceClick = (event) => {
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    
    mouse.x = ((event.clientX - rect.left) / 600) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / 600) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      
      if (object.userData.type === 'piece') {
        // انتخاب مهره
        if (selectedPiece) {
          selectedPiece.material.emissive.setHex(0x000000);
        }
        
        setSelectedPiece(object);
        object.material.emissive.setHex(0x444444);
        
        // پاداش برای تعامل
        onEarnCoins?.(3, "انتخاب مهره در شطرنج 3D");
      }
    }
  };

  return (
    <div className="chess-3d-optimized">
      <div className="game-header">
        <h3>♟️ شطرنج 3D پیشرفته - Three.js</h3>
        <p>تجربه بازی سه‌بعدی واقعی با گرافیک بهینه</p>
      </div>

      <div className="revenue-notice">
        <p>💰 <strong>سیستم درآمدزایی فعال:</strong> با هر تعامل در شطرنج 3D سکه تترا کسب کنید!</p>
      </div>

      <div 
        ref={mountRef} 
        onClick={handlePieceClick}
        className="chess-3d-canvas"
        style={{ 
          cursor: 'pointer',
          border: '2px solid #ddd',
          borderRadius: '15px',
          margin: '20px auto',
          display: 'block',
          width: '600px',
          height: '600px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      />

      <div className="3d-controls">
        <div className="control-group">
          <h4>🎮 کنترل‌های بازی:</h4>
          <div className="control-buttons">
            <button onClick={() => cameraRef.current.position.set(0, 15, 0)}>
              👆 نمای بالا
            </button>
            <button onClick={() => cameraRef.current.position.set(8, 8, 8)}>
              ↗️ نمای مورب
            </button>
            <button onClick={() => cameraRef.current.position.set(0, 8, 12)}>
              👀 نمای جلو
            </button>
            <button onClick={() => {
              cameraRef.current.position.set(0, 12, 12);
              cameraRef.current.lookAt(0, 0, 0);
            }}>
              🔄 بازنشانی دید
            </button>
          </div>
        </div>

        <div className="features-list">
          <h4>✨ ویژگی‌های بهینه‌شده:</h4>
          <ul>
            <li>✅ گرافیک سه‌بعدی واقعی با Three.js</li>
            <li>✅ سایه‌های نرم و نورپردازی پویا</li>
            <li>✅ انیمیشن‌های روان و بهینه</li>
            <li>✅ کنترل دوربین با Drag & Drop</li>
            <li>✅ انتخاب مهره با Raycasting</li>
            <li>✅ سیستم درآمدزایی یکپارچه</li>
            <li>✅ طراحی واکنش‌گرا و بهینه</li>
          </ul>
        </div>

        <div className="revenue-tips">
          <h4>💡 نکات درآمدزایی:</h4>
          <ul>
            <li>🎯 انتخاب مهره: +3 سکه</li>
            <li>🔄 چرخش دیدگاه: +1 سکه</li>
            <li>🎮 حرکت مهره: +5 سکه</li>
            <li>🏆 تکمیل بازی: +50 سکه</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chess3DOptimized;
