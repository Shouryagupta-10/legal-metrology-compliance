import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Circle, Layers, RotateCcw, Sparkles, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle, Maximize2, Compass } from 'lucide-react';
import { SampleProduct, ComplianceReport } from '../../types/compliance';
import { sounds } from '../../services/soundEffects';

interface Packaging3DLabProps {
  currentSample: SampleProduct;
  report: ComplianceReport | null;
}

export const Packaging3DLab: React.FC<Packaging3DLabProps> = ({ currentSample, report }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<'box' | 'cylinder' | 'pouch'>('box');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activeFace, setActiveFace] = useState<'front' | 'back' | 'side' | 'top'>('front');

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 3.8);
    cameraRef.current = camera;

    // 3. Renderer with antialias & shadow support
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0xffffff, 2.2);
    mainSpot.position.set(4, 5, 5);
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const purpleRimLight = new THREE.PointLight(0xa855f7, 2.5, 10);
    purpleRimLight.position.set(-4, 3, -3);
    scene.add(purpleRimLight);

    const blueFillLight = new THREE.PointLight(0x38bdf8, 1.8, 10);
    blueFillLight.position.set(3, -2, 2);
    scene.add(blueFillLight);

    // 5. Studio Floor Grid / Reflection Plane
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080e1e,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.3;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Helper
    const grid = new THREE.GridHelper(8, 16, 0x38bdf8, 0x1e293b);
    grid.position.y = -1.29;
    scene.add(grid);

    // 6. Build 3D Packaging Model Geometry & Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(currentSample.thumbnail, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      buildPackageGeometry(shape, texture, scene);
    }, undefined, () => {
      // Fallback procedural texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#0f2f63';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(currentSample.name, 40, 100);
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      buildPackageGeometry(shape, fallbackTexture, scene);
    });

    // 7. Mouse/Touch Rotation handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      meshRef.current.rotation.y += deltaX * 0.008;
      meshRef.current.rotation.x += deltaY * 0.008;

      if (wireframeMeshRef.current) {
        wireframeMeshRef.current.rotation.y = meshRef.current.rotation.y;
        wireframeMeshRef.current.rotation.x = meshRef.current.rotation.x;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !meshRef.current || !e.touches[0]) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      meshRef.current.rotation.y += deltaX * 0.01;
      meshRef.current.rotation.x += deltaY * 0.01;

      if (wireframeMeshRef.current) {
        wireframeMeshRef.current.rotation.y = meshRef.current.rotation.y;
        wireframeMeshRef.current.rotation.x = meshRef.current.rotation.x;
      }

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // 8. Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotate && meshRef.current && !isDraggingRef.current) {
        meshRef.current.rotation.y += 0.006;
        if (wireframeMeshRef.current) {
          wireframeMeshRef.current.rotation.y = meshRef.current.rotation.y;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      renderer.dispose();
    };
  }, [currentSample, shape]);

  const buildPackageGeometry = (packageShape: 'box' | 'cylinder' | 'pouch', labelTexture: THREE.Texture, scene: THREE.Scene) => {
    // Remove previous mesh if exists
    if (meshRef.current) scene.remove(meshRef.current);
    if (wireframeMeshRef.current) scene.remove(wireframeMeshRef.current);

    let geometry: THREE.BufferGeometry;
    let materials: THREE.Material | THREE.Material[];

    if (packageShape === 'box') {
      geometry = new THREE.BoxGeometry(1.4, 2.0, 0.8);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x111c36, roughness: 0.4, metalness: 0.1 });
      const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.3, metalness: 0.05 });
      const topMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

      materials = [
        sideMat, // right
        sideMat, // left
        topMat,  // top
        topMat,  // bottom
        labelMat, // front (PDP)
        sideMat  // back
      ];
    } else if (packageShape === 'cylinder') {
      geometry = new THREE.CylinderGeometry(0.75, 0.75, 2.1, 32);
      const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.25, metalness: 0.3 });
      const capMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });

      materials = [
        labelMat, // body
        capMat,   // top lid
        capMat    // bottom
      ];
    } else {
      // Stand-up Pouch shape
      geometry = new THREE.BoxGeometry(1.5, 2.1, 0.4);
      const pouchMat = new THREE.MeshStandardMaterial({
        map: labelTexture,
        roughness: 0.35,
        metalness: 0.15
      });
      materials = pouchMat;
    }

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.y = 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Wireframe Box outline
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: wireframeMode ? 0.8 : 0.15
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireMesh.position.y = 0;
    scene.add(wireMesh);
    wireframeMeshRef.current = wireMesh;
  };

  const handleResetCamera = () => {
    sounds.playClick();
    if (meshRef.current) {
      meshRef.current.rotation.set(0.1, -0.3, 0);
    }
  };

  const handleFaceSelect = (face: 'front' | 'back' | 'side' | 'top') => {
    sounds.playClick();
    setActiveFace(face);
    if (!meshRef.current) return;
    if (face === 'front') meshRef.current.rotation.set(0, 0, 0);
    if (face === 'back') meshRef.current.rotation.set(0, Math.PI, 0);
    if (face === 'side') meshRef.current.rotation.set(0, Math.PI / 2, 0);
    if (face === 'top') meshRef.current.rotation.set(Math.PI / 2, 0, 0);
  };

  const isCompliant = report?.overallStatus === 'COMPLIANT';

  return (
    <div className="rounded-[2rem] border border-[var(--hairline)] bg-[#080d1a] p-5 sm:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden">
      {/* Background Neon Halo */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center shadow-lg shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                Rule 7 Principal Display Panel (PDP)
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> 360° Real-time Engine
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              3D Packaging Virtual Laboratory &amp; Surface Projector
            </h3>
          </div>
        </div>

        {/* 3D Geometry Selector Pills */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-full border border-white/15 self-start md:self-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setShape('box');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile ${
              shape === 'box' ? 'bg-sky-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Box SKU</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShape('cylinder');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile ${
              shape === 'cylinder' ? 'bg-sky-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            <span>Cylinder Can</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setShape('pouch');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all btn-tactile ${
              shape === 'pouch' ? 'bg-sky-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Poly Pouch</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport with Floating Studio HUD */}
      <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl bg-gradient-to-b from-black/80 to-[#0b1328] border border-white/10 overflow-hidden select-none">
        
        {/* Three.js DOM Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Left Floating Specimen Badge */}
        <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs space-y-0.5 pointer-events-none shadow-lg">
          <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">
            Active 3D Specimen
          </div>
          <div className="font-semibold text-white truncate max-w-[200px]">
            {currentSample.name}
          </div>
          <div className="text-[10px] text-white/60 font-mono">
            Shape: {shape.toUpperCase()} &bull; Drag to orbit 360°
          </div>
        </div>

        {/* Top Right Rule 7 Surface Area Readout */}
        <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-right space-y-0.5 shadow-lg">
          <div className="text-[10px] font-mono text-purple-300 font-bold uppercase">
            Rule 7 Surface Area
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {currentSample.pdpDefaults.heightMm * currentSample.pdpDefaults.widthMm / 100} cm²
          </div>
          <div className="text-[10px] font-mono text-emerald-400">
            Min Numeral: {report?.pdpCalculation.requiredMinNumeralHeightMm || 4.0} mm (Schedule II)
          </div>
        </div>

        {/* Floating Bottom View Toolbar */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-black/80 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-white/15 shadow-xl">
          
          {/* Quick Face Presets */}
          <div className="flex items-center gap-1">
            {(['front', 'side', 'back', 'top'] as const).map(f => (
              <button
                key={f}
                onClick={() => handleFaceSelect(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase font-semibold transition-all ${
                  activeFace === f ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {f} Face
              </button>
            ))}
          </div>

          {/* Interactive Mode Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setIsAutoRotate(prev => !prev);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                isAutoRotate ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              Auto-Orbit: {isAutoRotate ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Reset 3D Angle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Statutory Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm">
            40%
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase font-bold">Rule 7(1) Surface Mandate</div>
            <div className="text-xs font-semibold text-white">PDP covers ≥ 40% of front visual area</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-sm">
            3D
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase font-bold">Spatial Packaging Caliper</div>
            <div className="text-xs font-semibold text-white">Full geometric bounding calculation</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {isCompliant ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase font-bold">Statutory Height Status</div>
            <div className="text-xs font-semibold text-white">
              {isCompliant ? '100% Meets Schedule II Font Table' : 'Numeral height below Table 1'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
