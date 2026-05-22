"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { generateFibonacciSphere, generateGeometry } from "@/app/lib/geometry";
import type { DustConfig, GeometryBuffers } from "@/app/lib/types";

function toBufferGeometry(buffers: GeometryBuffers) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
  geometry.setAttribute("aNormal", new THREE.BufferAttribute(buffers.normals, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(buffers.randoms, 1));
  return geometry;
}

export function useGeometry(config: DustConfig) {
  const [version, setVersion] = useState(0);
  const mainGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const backgroundGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const countRef = useRef(0);
  const buildTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!mainGeometryRef.current) {
    const buffers = generateGeometry(config.geometryType, config);
    mainGeometryRef.current = toBufferGeometry(buffers);
    countRef.current = buffers.count;
  }

  if (!backgroundGeometryRef.current) {
    backgroundGeometryRef.current = toBufferGeometry(generateFibonacciSphere(15000, 2.5));
  }

  useEffect(() => {
    if (buildTimerRef.current) {
      clearTimeout(buildTimerRef.current);
    }

    buildTimerRef.current = setTimeout(() => {
      const buffers = generateGeometry(config.geometryType, config);
      const nextGeometry = toBufferGeometry(buffers);
      const previous = mainGeometryRef.current;
      mainGeometryRef.current = nextGeometry;
      countRef.current = buffers.count;
      previous?.dispose();
      setVersion((current) => current + 1);
    }, 140);

    return () => {
      if (buildTimerRef.current) {
        clearTimeout(buildTimerRef.current);
      }
    };
  }, [config.depthRange, config.geometryType, config.layerCount, config.particleDensity]);

  useEffect(() => {
    return () => {
      mainGeometryRef.current?.dispose();
      backgroundGeometryRef.current?.dispose();
    };
  }, []);

  return {
    backgroundGeometry: backgroundGeometryRef.current,
    mainGeometry: mainGeometryRef.current,
    particleCount: countRef.current,
    version,
  };
}
