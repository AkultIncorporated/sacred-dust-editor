"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { dustFragmentShader, dustVertexShader } from "@/app/lib/shaders";
import { useDustEngine } from "@/app/hooks/useDustEngine";
import { useGeometry } from "@/app/hooks/useGeometry";
import type { DustConfig } from "@/app/lib/types";

type Props = {
  config: DustConfig;
  onParticleCount: (count: number) => void;
};

function Composer({ config }: { config: DustConfig }) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      config.bloomStrength,
      config.bloomRadius,
      config.bloomThreshold,
    );
    composer.addPass(bloom);
    composerRef.current = composer;
    bloomRef.current = bloom;
    return () => {
      composer.dispose();
      bloom.dispose();
      composerRef.current = null;
      bloomRef.current = null;
    };
  }, [camera, gl, scene, size.height, size.width]);

  useEffect(() => {
    composerRef.current?.setSize(size.width, size.height);
    bloomRef.current?.setSize(size.width, size.height);
  }, [size.height, size.width]);

  useFrame(() => {
    if (bloomRef.current) {
      bloomRef.current.strength = config.bloomStrength;
      bloomRef.current.radius = config.bloomRadius;
      bloomRef.current.threshold = config.bloomThreshold;
    }
    composerRef.current?.render();
  }, 1);

  return null;
}

export function DustScene({ config, onParticleCount }: Props) {
  const { camera, gl, pointer, size } = useThree();
  const { mainUniforms, backgroundUniforms, mouseDownRef } = useDustEngine(config);
  const { backgroundGeometry, mainGeometry, particleCount, version } = useGeometry(config);
  const mainMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const backgroundMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const backgroundPointsRef = useRef<THREE.Points>(null);

  if (!mainMaterialRef.current) {
    mainMaterialRef.current = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: mainUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  if (!backgroundMaterialRef.current) {
    backgroundMaterialRef.current = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: backgroundUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  useEffect(() => {
    onParticleCount(particleCount);
  }, [onParticleCount, particleCount, version]);

  useEffect(() => {
    camera.position.set(0, 0, config.cameraZ);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = config.cameraFOV;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
  }, [camera, config.cameraFOV, config.cameraZ]);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.setClearColor(new THREE.Color("#0a0a0a"), 1);
  }, [gl]);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleDown = () => {
      mouseDownRef.current = true;
    };
    const handleUp = () => {
      mouseDownRef.current = false;
    };
    canvas.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    return () => {
      canvas.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [gl.domElement, mouseDownRef]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 10;
    const active = Number(Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1);
    for (const uniforms of [mainUniforms, backgroundUniforms]) {
      uniforms.uTime.value = t;
      uniforms.uResolution.value.set(size.width, size.height);
      uniforms.uMouse.value.set(pointer.x, pointer.y);
      uniforms.uMouseActive.value = active;
      uniforms.uMouseDown.value = mouseDownRef.current ? 1 : 0;
    }
    if (backgroundPointsRef.current) {
      backgroundPointsRef.current.rotation.y = -Math.PI * 0.1 * ((clock.elapsedTime % 10) / 10);
    }
  });

  useEffect(() => {
    return () => {
      mainMaterialRef.current?.dispose();
      backgroundMaterialRef.current?.dispose();
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <points ref={backgroundPointsRef} geometry={backgroundGeometry}>
        <primitive attach="material" object={backgroundMaterialRef.current} />
      </points>
      <points key={version} geometry={mainGeometry}>
        <primitive attach="material" object={mainMaterialRef.current} />
      </points>
      <Composer config={config} />
    </>
  );
}
