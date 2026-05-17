import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS, SCROLL_SECTIONS } from "../data/portfolio";
import { useDeviceType, getAdaptiveDpr } from "../hooks/useDeviceType";
import { usePreloadModels } from "../hooks/usePreloadModels";
import { sectionStateRef } from "../hooks/useScrollProgress";
import {
  MODEL_KEYS,
  useVisibleModels,
  type ModelKey,
} from "../hooks/useVisibleModels";
import "./ScrollBackground3D.css";

const HACKER_SECTION_IDS = new Set(["projects"]);
const EXPERIENCE_SECTION_INDEX = SCROLL_SECTIONS.findIndex((s) => s.id === "experience");
const CONTACT_SECTION_INDEX = SCROLL_SECTIONS.findIndex((s) => s.id === "contact");

function setGroupOpacity(group: THREE.Group, opacity: number) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (!mat) return;
      mat.transparent = true;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.9;
    });
  });
}

function opacityForModelKey(weights: number[], modelKey: ModelKey): number {
  if (modelKey === "hackerRoom") {
    return SCROLL_SECTIONS.reduce((sum, section, i) => {
      if (HACKER_SECTION_IDS.has(section.id)) return sum + weights[i];
      return sum;
    }, 0);
  }
  let max = 0;
  SCROLL_SECTIONS.forEach((section, i) => {
    if (section.modelKey === modelKey) max = Math.max(max, weights[i]);
  });
  return max;
}

type ScrollModelProps = {
  modelKey: ModelKey;
  config: (typeof SCROLL_SECTIONS)[number];
};

/** Un seul GLB monté à la fois dans le tree → chargement à la demande */
function ScrollModel({ modelKey, config }: ScrollModelProps) {
  const url = ASSETS.models[modelKey];
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const opacity = useRef(modelKey === "programmer" ? 1 : 0);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    return () => {
      useGLTF.clear(url);
    };
  }, [url]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const weights = sectionStateRef.weights;
    const target = Math.min(1, opacityForModelKey(weights, modelKey));
    opacity.current = THREE.MathUtils.lerp(opacity.current, target, 0.14);
    const o = opacity.current;

    group.visible = o > 0.02;
    setGroupOpacity(group, o);
    group.rotation.y += delta * 0.25;

    const s = config.scale * (0.92 + o * 0.08);
    group.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={config.position}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

function SceneModels({ visible }: { visible: Set<ModelKey> }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  const modelConfig = useMemo(() => {
    const byKey: Partial<Record<ModelKey, (typeof SCROLL_SECTIONS)[number]>> = {};
    for (const section of SCROLL_SECTIONS) {
      if (!byKey[section.modelKey]) byKey[section.modelKey] = section;
    }
    return byKey as Record<ModelKey, (typeof SCROLL_SECTIONS)[number]>;
  }, []);

  useFrame(() => {
    const weights = sectionStateRef.weights;
    const time = performance.now() * 0.001;

    const projectsIdx = SCROLL_SECTIONS.findIndex((s) => s.id === "projects");
    const projectsWeight = weights[projectsIdx];

    let camFrom = 0;
    let camTo = 0;
    let camBlend = 0;
    let maxPair = 0;

    for (let i = 0; i < weights.length - 1; i++) {
      const pair = weights[i] + weights[i + 1];
      if (pair > maxPair) {
        maxPair = pair;
        camFrom = i;
        camTo = i + 1;
        camBlend = weights[i + 1] / (pair + 0.0001);
      }
    }

    let camA = SCROLL_SECTIONS[camFrom].camera;
    let camB = SCROLL_SECTIONS[camTo].camera;
    let blend = camBlend;

    if (projectsWeight > 0.35) {
      const cam = SCROLL_SECTIONS[projectsIdx].camera;
      camA = cam;
      camB = cam;
      blend = 0;
    }

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(camA.position[0], camB.position[0], blend),
      THREE.MathUtils.lerp(camA.position[1], camB.position[1], blend),
      THREE.MathUtils.lerp(camA.position[2], camB.position[2], blend),
    );
    const targetLook = new THREE.Vector3(
      THREE.MathUtils.lerp(camA.target[0], camB.target[0], blend),
      THREE.MathUtils.lerp(camA.target[1], camB.target[1], blend),
      THREE.MathUtils.lerp(camA.target[2], camB.target[2], blend),
    );
    const targetFov = THREE.MathUtils.lerp(camA.fov, camB.fov, blend);

    const onHome = sectionStateRef.activeIndex === 0;
    const orbit = Math.sin(time * 0.35) * (onHome ? 0.15 : 0.4);
    targetPos.x += orbit;
    targetPos.z += Math.cos(time * 0.3) * (onHome ? 0.15 : 0.3);

    camera.position.lerp(targetPos, 0.06);
    lookAt.lerp(targetLook, 0.06);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.06);
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookAt);
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[10, 14, 8]} intensity={1.85} color="#ffffff" />
      <directionalLight position={[-8, 6, -6]} intensity={0.85} color="#00ff88" />
      <pointLight position={[0, 6, 4]} intensity={1} color="#00d4ff" distance={30} />
      <hemisphereLight args={["#a8ffd8", "#1a2822", 0.65]} />

      {MODEL_KEYS.filter((key) => visible.has(key)).map((modelKey) => (
        <ScrollModel key={modelKey} modelKey={modelKey} config={modelConfig[modelKey]} />
      ))}
    </>
  );
}

function ScrollCanvas({ visible }: { visible: Set<ModelKey> }) {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  const maxDpr = getAdaptiveDpr(width);

  return (
    <Canvas
      camera={{ position: [8, 6, 10], fov: 42, near: 0.1, far: 300 }}
      gl={{
        antialias: width >= 768,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      dpr={[1, maxDpr]}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneModels visible={visible} />
      </Suspense>
    </Canvas>
  );
}

export function ScrollBackground3D({ enabled }: { enabled: boolean }) {
  const device = useDeviceType();
  const enable3d = enabled && device !== "mobile";
  const visible = useVisibleModels(enable3d);
  const [isHome, setIsHome] = useState(true);
  const [videoBlend, setVideoBlend] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [mountCanvas, setMountCanvas] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  usePreloadModels();

  useEffect(() => {
    if (!enable3d) return;
    const id = requestAnimationFrame(() => setMountCanvas(true));
    return () => cancelAnimationFrame(id);
  }, [enable3d]);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      const home = sectionStateRef.activeIndex === 0;
      const w = sectionStateRef.weights;
      const experienceW = w[EXPERIENCE_SECTION_INDEX] ?? 0;
      const contactW = w[CONTACT_SECTION_INDEX] ?? 0;
      const blend = Math.min(1, (experienceW + contactW) * 1.1);
      setIsHome(home);
      setVideoBlend(blend);
      document.body.classList.toggle("is-home", home);
      document.body.classList.toggle("is-video-bg", blend > 0.12);
    };
    tick();
    const t = setInterval(tick, 80);
    return () => {
      clearInterval(t);
      document.body.classList.remove("is-home");
      document.body.classList.remove("is-video-bg");
    };
  }, [enabled]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (videoBlend > 0.12) {
      if (!videoReady) {
        v.src = ASSETS.video;
        v.load();
        setVideoReady(true);
      }
      v.play().catch(() => undefined);
    } else if (videoReady) {
      v.pause();
    }
  }, [videoBlend, videoReady]);

  if (!enabled) return null;

  return (
    <div
      className={`scroll-bg-3d ${isHome ? "scroll-bg-3d--home" : ""} ${videoBlend > 0.08 ? "scroll-bg-3d--video" : ""} ${!enable3d ? "scroll-bg-3d--lite" : ""}`.trim()}
      aria-hidden
      style={{ "--section-video-opacity": videoBlend } as CSSProperties}
    >
      <video
        ref={videoRef}
        className="scroll-bg-3d__video"
        muted
        loop
        playsInline
        preload="none"
        poster={ASSETS.poster}
      />
      {mountCanvas && enable3d && (
        <div className="scroll-bg-3d__canvas-wrap" style={{ opacity: 1 - videoBlend * 0.95 }}>
          <ScrollCanvas visible={visible} />
        </div>
      )}
      {isHome && videoBlend < 0.15 && <div className="scroll-bg-3d__lift" />}
      <div className="scroll-bg-3d__overlay" />
      <div className="scroll-bg-3d__vignette" />
    </div>
  );
}
