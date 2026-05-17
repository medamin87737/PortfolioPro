import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ASSETS, SCROLL_SECTIONS } from "../data/portfolio";
import { getAdaptiveDpr } from "../hooks/useDeviceType";
import { sectionStateRef } from "../hooks/useScrollProgress";
import "./ScrollBackground3D.css";

type ModelKey = keyof typeof ASSETS.models;

const MODEL_KEYS = [...new Set(SCROLL_SECTIONS.map((s) => s.modelKey))] as ModelKey[];
/** Modèles masqués : accueil (programmer), compétences (icon → vidéo) */
const VISIBLE_MODEL_KEYS = MODEL_KEYS.filter((k) => k !== "programmer" && k !== "icon");

const VIDEO_SECTION_IDS = new Set(["skills", "experience", "contact"]);

VISIBLE_MODEL_KEYS.forEach((key) => useGLTF.preload(ASSETS.models[key]));

const HACKER_SECTION_IDS = new Set(["projects"]);

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

function videoBlendFromWeights(weights: number[]): number {
  const sum = SCROLL_SECTIONS.reduce((acc, section, i) => {
    if (VIDEO_SECTION_IDS.has(section.id)) return acc + weights[i];
    return acc;
  }, 0);
  return Math.min(1, sum * 1.1);
}

function opacityForModelKey(weights: number[], modelKey: ModelKey): number {
  if (modelKey === "laptop" || modelKey === "programmer" || modelKey === "icon") {
    return 0;
  }
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

function SceneModels() {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const opacities = useRef<Record<ModelKey, number>>(
    Object.fromEntries(MODEL_KEYS.map((k) => [k, 0])) as Record<ModelKey, number>,
  );

  const gltfMap = {
    hackerRoom: useGLTF(ASSETS.models.hackerRoom),
    hack: useGLTF(ASSETS.models.hack),
    laptop: useGLTF(ASSETS.models.laptop),
  };

  const scenesByKey = useMemo(
    () =>
      Object.fromEntries(
        VISIBLE_MODEL_KEYS.map((key) => [key, gltfMap[key].scene.clone()]),
      ) as Record<Exclude<ModelKey, "programmer" | "icon">, THREE.Group>,
    [gltfMap.hackerRoom.scene, gltfMap.hack.scene, gltfMap.laptop.scene],
  );

  const modelConfig = useMemo(() => {
    const byKey: Partial<Record<ModelKey, (typeof SCROLL_SECTIONS)[number]>> = {};
    for (const section of SCROLL_SECTIONS) {
      if (!byKey[section.modelKey]) byKey[section.modelKey] = section;
    }
    return byKey as Record<ModelKey, (typeof SCROLL_SECTIONS)[number]>;
  }, []);

  const groups = useRef<Partial<Record<ModelKey, THREE.Group | null>>>({});

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

    VISIBLE_MODEL_KEYS.forEach((modelKey) => {
      const group = groups.current[modelKey];
      if (!group) return;

      const target = Math.min(1, opacityForModelKey(weights, modelKey));
      opacities.current[modelKey] = THREE.MathUtils.lerp(
        opacities.current[modelKey],
        target,
        0.14,
      );
      const o = opacities.current[modelKey];
      const section = modelConfig[modelKey];

      group.visible = o > 0.02;
      setGroupOpacity(group, o);
      group.rotation.y = time * 0.25;

      const s = section.scale * (0.92 + o * 0.08);
      group.scale.setScalar(s);
    });
  });

  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[10, 14, 8]} intensity={1.85} color="#ffffff" />
      <directionalLight position={[-8, 6, -6]} intensity={0.85} color="#00ff88" />
      <pointLight position={[0, 6, 4]} intensity={1} color="#00d4ff" distance={30} />
      <hemisphereLight args={["#a8ffd8", "#1a2822", 0.65]} />

      {VISIBLE_MODEL_KEYS.map((modelKey) => {
        const section = modelConfig[modelKey];
        return (
          <group
            key={modelKey}
            ref={(el) => {
              groups.current[modelKey] = el;
            }}
            position={section.position}
          >
            <Center>
              <primitive object={scenesByKey[modelKey]} />
            </Center>
          </group>
        );
      })}
    </>
  );
}

function ScrollCanvas() {
  const width = typeof window !== "undefined" ? window.innerWidth : 1280;
  const maxDpr = getAdaptiveDpr(width);

  return (
    <Canvas
      camera={{ position: [8, 6, 10], fov: 42, near: 0.1, far: 300 }}
      gl={{ antialias: width >= 640, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, maxDpr]}
    >
      <Suspense fallback={null}>
        <SceneModels />
      </Suspense>
    </Canvas>
  );
}

export function ScrollBackground3D({ enabled }: { enabled: boolean }) {
  const [isHome, setIsHome] = useState(true);
  const [videoBlend, setVideoBlend] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      const home = sectionStateRef.activeIndex === 0;
      const w = sectionStateRef.weights;
      const blend = videoBlendFromWeights(w);
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
    if (!v || videoBlend <= 0.05) return;
    v.play().catch(() => undefined);
  }, [videoBlend]);

  if (!enabled) return null;

  return (
    <div
      className={`scroll-bg-3d ${isHome ? "scroll-bg-3d--home" : ""} ${videoBlend > 0.08 ? "scroll-bg-3d--video" : ""}`.trim()}
      aria-hidden
      style={{ "--section-video-opacity": videoBlend } as CSSProperties}
    >
      <video
        ref={videoRef}
        className="scroll-bg-3d__video"
        src={ASSETS.video}
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="scroll-bg-3d__canvas-wrap" style={{ opacity: 1 - videoBlend * 0.95 }}>
        <ScrollCanvas />
      </div>
      {isHome && videoBlend < 0.15 && <div className="scroll-bg-3d__lift" />}
      <div className="scroll-bg-3d__overlay" />
      <div className="scroll-bg-3d__vignette" />
    </div>
  );
}
