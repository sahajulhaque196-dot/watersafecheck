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
uniform float frequency;
uniform float amplitude;
uniform float speed;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Distance from mouse
  float dist = distance(uv, uMouse);

  // Smooth realistic water ripple with gentle radial falloff (no harsh center stretching)
  float falloff = exp(-dist * 2.8);
  float ripple = sin(dist * frequency - time * speed) * amplitude * falloff;

  vec2 dir = dist > 0.001 ? normalize(uv - uMouse) : vec2(0.0);
  vec2 distortedUv = uv + dir * ripple;

  // Clamp UVs to avoid edge distortion
  distortedUv = clamp(distortedUv, 0.001, 0.999);

  gl_FragColor = texture2D(uTexture, distortedUv);
}
`;

const RippleDistortion: React.FC<RippleDistortionProps> = ({
  imageSrc,
  frequency = 18.0,
  amplitude = 0.008,
  speed = 2.8,
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
      console.warn("WebGL not supported for RippleDistortion:", e);
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

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);

    const uniforms = {
      time: { value: 0 },
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: currentMouse },
      frequency: { value: frequency },
      amplitude: { value: amplitude },
      speed: { value: speed },
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
        console.warn("Could not load image for RippleDistortion:", err);
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
      uniforms.time.value += 0.015;
      // Smoothly interpolate mouse movement (fluid water momentum)
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
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
      if (container) container.innerHTML = "";
    };
  }, [imageSrc, frequency, amplitude, speed, antialias]);


  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
    />
  );
};

export default RippleDistortion;

