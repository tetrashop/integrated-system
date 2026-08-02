// Three.js Setup for 2D to 3D Converter

let scene, camera, renderer, controls;
let model = null;
let texture = null;
let geometry = null;
let material = null;
let mesh = null;

function initThreeJS() {
    console.log('Initializing Three.js...');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Create renderer
    const canvas = document.getElementById('3d-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const canvas = document.getElementById('3d-canvas');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function create3DModelFromImage(imageData, depth = 0.5, detail = 10) {
    console.log('Creating 3D model from image...');
    
    // Remove existing model
    if (mesh) {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
    }
    
    // Create texture from image
    texture = new THREE.Texture(imageData);
    texture.needsUpdate = true;
    
    // Create geometry based on image data
    const width = imageData.width;
    const height = imageData.height;
    
    // Create plane geometry
    geometry = new THREE.PlaneGeometry(4, 4, detail * 2, detail * 2);
    
    // Get image data for height mapping
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageData, 0, 0);
    const imageDataMap = ctx.getImageData(0, 0, width, height);
    const data = imageDataMap.data;
    
    // Modify vertices based on image brightness
    const vertices = geometry.attributes.position.array;
    const detailLevel = detail * 2 + 1;
    
    for (let i = 0; i < vertices.length; i += 3) {
        const vertexIndex = i / 3;
        const x = vertices[i];
        const y = vertices[i + 1];
        
        // Map vertex position to image coordinates
        const imgX = Math.floor(((x + 2) / 4) * width);
        const imgY = Math.floor(((y + 2) / 4) * height);
        
        if (imgX >= 0 && imgX < width && imgY >= 0 && imgY < height) {
            const pixelIndex = (imgY * width + imgX) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            
            // Calculate brightness (0-1)
            const brightness = (r + g + b) / (3 * 255);
            
            // Set Z coordinate based on brightness
            vertices[i + 2] = brightness * depth;
        }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Create material
    material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 30,
        side: THREE.DoubleSide
    });
    
    // Create mesh
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    
    // Update model info
    updateModelInfo(geometry);
}

function createSimpleCube() {
    // Create a simple cube as fallback
    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6,
        shininess: 100 
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    updateModelInfo(geometry);
}

function updateModelInfo(geometry) {
    if (!geometry) return;
    
    const vertices = geometry.attributes.position.count;
    const faces = geometry.index ? geometry.index.count / 3 : vertices / 3;
    const size = (geometry.attributes.position.array.length * 4) / 1024; // KB
    
    document.getElementById('vertex-count').textContent = vertices.toLocaleString();
    document.getElementById('face-count').textContent = faces.toLocaleString();
    document.getElementById('model-size').textContent = size.toFixed(2);
}

function exportModel(format = 'stl') {
    if (!mesh) {
        alert('لطفاً ابتدا یک مدل ایجاد کنید.');
        return;
    }
    
    let exporter, blob, fileName;
    
    switch(format.toLowerCase()) {
        case 'stl':
            exporter = new THREE.STLExporter();
            const stlString = exporter.parse(mesh);
            blob = new Blob([stlString], { type: 'text/plain' });
            fileName = '3d-model.stl';
            break;
            
        case 'obj':
            exporter = new THREE.OBJExporter();
            const objString = exporter.parse(mesh);
            blob = new Blob([objString], { type: 'text/plain' });
            fileName = '3d-model.obj';
            break;
            
        case 'gltf':
            // For GLTF we need a different approach
            alert('فرمت GLTF نیاز به بارگذاری کتابخانه اضافی دارد.');
            return;
            
        default:
            alert('فرمت پشتیبانی نمی‌شود.');
            return;
    }
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`مدل با فرمت ${format.toUpperCase()} دانلود شد!`, 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `converter-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export functions globally
window.converter3D = {
    initThreeJS,
    create3DModelFromImage,
    createSimpleCube,
    exportModel,
    updateModelInfo
};
