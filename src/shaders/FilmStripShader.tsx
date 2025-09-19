// src/components/ShaderPlane.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ShaderPlane() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          gl_FragColor = vec4(st.x, st.y, abs(sin(u_time)), 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[280px] rounded-xl border border-zinc-700/30 overflow-hidden"
    />
  );
}
