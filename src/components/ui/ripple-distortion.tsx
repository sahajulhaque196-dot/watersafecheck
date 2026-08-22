'use client'

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface RippleDistortionProps {
  imageSrc: string;
  frequency?: number;
  amplitude?: number;
  speed?: number;
  antialias?: boolean;
  className?: string;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform sampler2D uTexture;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // ── 1. Downward Falling Water Stream Animation (Right side x: 0.68 - 0.82, y: 0.22 - 0.78) ──
  float streamX = smoothstep(0.66, 0.72, uv.x) * (1.0 - smoothstep(0.76, 0.82, uv.x));
  float streamY = smoothstep(0.20, 0.28, uv.y) * (1.0 - smoothstep(0.72, 0.78, uv.y));
  float streamMask = streamX * streamY;

  // Rapid downward fluid displacement
  float verticalFlow = sin(uv.y * 55.0 + time * 14.0) * 0.006 + cos(uv.y * 95.0 + time * 22.0) * 0.003;
  float horizontalTurbulence = sin(uv.x * 60.0 + uv.y * 30.0 + time * 10.0) * 0.004;
  vec2 streamDisplacement = vec2(horizontalTurbulence, verticalFlow) * streamMask;

  // ── 2. Basin Water Impact & Splash Ripples (Center ~ (0.73, 0.22)) ──
  vec2 splashCenter = vec2(0.73, 0.22);
  float splashDist = distance(uv, splashCenter);
  float basinMask = smoothstep(0.48, 0.65, uv.x) * (1.0 - smoothstep(0.85, 0.98, uv.x)) * (1.0 - smoothstep(0.28, 0.40, uv.y));
  float basinRipples = sin(splashDist * 40.0 - time * 7.5) * exp(-splashDist * 4.5) * 0.007 * basinMask;
  vec2 splashDir = splashDist > 0.001 ? normalize(uv - splashCenter) : vec2(0.0);
  vec2 basinDisplacement = splashDir * basinRipples;

  // ── 3. Interactive Cursor Fluid Ripples ──
  float mouseDist = distance(uv, uMouse);
  float mouseFalloff = exp(-mouseDist * 3.2);
  float mouseRipples = sin(mouseDist * 22.0 - time * 3.5) * 0.005 * mouseFalloff;
  vec2 mouseDir = mouseDist > 0.001 ? normalize(uv - uMouse) : vec2(0.0);
  vec2 mouseDisplacement = mouseDir * mouseRipples;

  // Combine displacements
  vec2 finalUv = uv + streamDisplacement + basinDisplacement + mouseDisplacement;
  finalUv = clamp(finalUv, 0.001, 0.999);

  vec4 color = texture2D(uTexture, finalUv);

  // Add realistic sparkling caustics shimmer on the active stream & splash
  float shimmer = (sin(uv.y * 80.0 + time * 18.0) * 0.5 + 0.5) * streamMask * 0.12;
  float splashShimmer = (sin(splashDist * 50.0 - time * 10.0) * 0.5 + 0.5) * basinMask * 0.08;
  color.rgb += vec3(0.2, 0.5, 0.8) * (shimmer + splashShimmer);

  gl_FragColor = color;
}
`;

const RippleDistortion: React.FC<RippleDistortionProps> = ({
  imageSrc,
  antialias = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias, alpha: true });
    } catch (e) {
      console.warn("WebGL not supported for 3D Water:", e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    const targetMouse = new THREE.Vector2(0.73, 0.25);
    const currentMouse = new THREE.Vector2(0.73, 0.25);

    const uniforms = {
      time: { value: 0 },
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: currentMouse },
    };

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      imageSrc,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        uniforms.uTexture.value = texture;
        resize();
      },
      undefined,
      (err) => {
        console.warn("Could not load image for 3D Water:", err);
      }
    );

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── 3D Sparkling Water Droplets Particle System ──
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Position around the splash zone on the right (x: 0.3 to 0.85, y: -0.8 to -0.1)
      particlePositions[i * 3] = 0.35 + Math.random() * 0.55;
      particlePositions[i * 3 + 1] = -0.75 + Math.random() * 0.65;
      particlePositions[i * 3 + 2] = 0.1;
      particleSpeeds[i] = 0.002 + Math.random() * 0.005;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 3.5,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const resize = () => {
      if (!container || !renderer) return;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      uniforms.time.value += 0.016;

      // Animate 3D water droplets
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleSpeeds[i];
        if (pos[i * 3 + 1] > -0.1) {
          pos[i * 3 + 1] = -0.75;
          pos[i * 3] = 0.35 + Math.random() * 0.55;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Smooth mouse LERP
      currentMouse.lerp(targetMouse, 0.05);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
      if (container) container.innerHTML = "";
    };
  }, [imageSrc, antialias]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
    />
  );
};

export default RippleDistortion;


