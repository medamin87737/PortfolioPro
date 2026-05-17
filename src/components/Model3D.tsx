import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";

type Model3DProps = {
  url: string;
  scale?: number;
  autoRotate?: boolean;
  position?: [number, number, number];
};

function Model({ url, scale = 1, autoRotate = true, position = [0, 0, 0] }: Model3DProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);

  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <Center>
        <primitive object={scene.clone()} />
      </Center>
    </group>
  );
}

export function Model3D(props: Model3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#00ff88" />
      <Suspense fallback={null}>
        <Model {...props} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}
