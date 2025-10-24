import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

function Model(props) {

  useFrame(() => {
    console.log('Model re-rendered');
  });
  const { nodes } = useGLTF('/models/homepage1.glb');

  const carRef = useRef();

  useEffect(() => {
    // Animate the car from y = 10 to y = 0 using GSAP
    gsap.to(carRef.current.position, {
      y: -0.5,
      duration: 6,
      ease: 'power2.out',
      onUpdate: () => {
        // Invalidate frame to trigger re-render only when the animation is updating
        props.invalidate();
      },
    });
  }, [props]);

  const roomTexture = useTexture('/textures/bake.png');
  roomTexture.flipY = false;
  const roomMaterial = new THREE.MeshPhysicalMaterial({
    // color: 0xffffff,
    map: roomTexture,
  });

  const plantTexture = useTexture('/textures/plant_bake.png');
  plantTexture.flipY = false;
  const plantMaterial = new THREE.MeshPhysicalMaterial({
    // color: 0xffffff,
    map: plantTexture,
  });

  const skirtingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
  });

  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x424757,
  });

  const carMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.5,
    opacity: 0.6,
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0,
    reflectivity: 0.5,
    ior: 1.5,
    side: THREE.DoubleSide,
    envMapIntensity: 1,
  });

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.room.geometry} material={roomMaterial} position={[0, 0, 0.517]} />
      <mesh geometry={nodes.architrave.geometry} material={frameMaterial} position={[0.287, 0, 0.517]} scale={[2.675, 2.675, 5.09]} />
      <mesh geometry={nodes.doorframe.geometry} material={frameMaterial} position={[-3.085, 1.888, -2.218]} scale={[2.675, 2.675, 5.09]} />
      <mesh geometry={nodes.glass.geometry} material={glassMaterial} position={[-3.085, 1.888, -2.216]} scale={[1.164, 2.675, 5.09]} />
      <mesh ref={carRef} geometry={nodes.OrionCar.geometry} material={carMaterial} position={[3.72, 10, -2.014]} />
      <mesh geometry={nodes.door_handle.geometry} material={nodes.door_handle.material} position={[-2.938, 1.928, -1.239]} scale={[0.04, 0.518, 0.04]} />
      <mesh geometry={nodes.skirting.geometry} material={roomMaterial}/>

      <mesh geometry={nodes.plant040.geometry} material={plantMaterial} position={[-1.438, 1.517, 0.005]} rotation={[Math.PI, -1.198, Math.PI]} />

    </group>
  );
}

useGLTF.preload('/models/homepage1.glb');

const ExperienceHomepage = () => {
  const [invalidate, setInvalidate] = useState(() => () => {});

  const setCanvasRef = (state) => {
    if (state) setInvalidate(() => state.invalidate);
  };

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [5, 2, 1.5], rotation: [0, Math.PI / 2, 0], fov: 50 }}
        gl={{ antialias: true }}
        onCreated={setCanvasRef}
        frameloop="demand" // Only render on demand
      >
        <ambientLight intensity={0.5} />

        <pointLight position={[5, 5, -2]} intensity={2} color="#ffffff" distance={20} decay={0} />

        <Model invalidate={invalidate} />
      </Canvas>
    </>
  );
};

export default ExperienceHomepage;
