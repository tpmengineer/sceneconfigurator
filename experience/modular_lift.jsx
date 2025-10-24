'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Canvas, useFrame, useThree } from "@react-three/fiber";

let count = 0

function Model(props) {
    const { nodes, materials } = useGLTF('/models/OrionLift.glb')
    return (
        <group {...props} dispose={null}>
        <mesh geometry={nodes.CarFrame.geometry} material={materials.Material} />
        <mesh geometry={nodes.CarExtWalls.geometry} material={materials.Material} />
        <mesh geometry={nodes.CarWheelAssemblies.geometry} material={materials.Material} />
        <mesh geometry={nodes.CarCylinderMount.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder001.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder002.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder003.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder004.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder005.geometry} material={materials.Material} />
        <mesh geometry={nodes.Cylinder006.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane001.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane002.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane003.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane004.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane005.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane006.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane007.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane008.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane009.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane010.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane011.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane012.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane013.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane014.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane015.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane016.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane017.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane018.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane019.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane020.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane021.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane022.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane023.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane024.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane025.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane026.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane027.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane028.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane029.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane030.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane031.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane032.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane033.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane034.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane035.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane036.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane037.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane038.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane039.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane040.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane041.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane042.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane043.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane044.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane045.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane046.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane047.geometry} material={materials.Material} />
        <mesh geometry={nodes.Plane048.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Plane049.geometry} material={materials['Material.001']} />
      </group>
    )
  }
  
  useGLTF.preload('/models/OrionLift.glb')

const Experience = () => {

  return (
    <>
      <Canvas camera={{ position: [2, 3.5, 12], rotation: [-0.1,0.2, 0.02], fov: 50 }}>
        <ambientLight intensity="1" color="#FFFFFF" />

        <Model />
        <pointLight
          position={[-10, 10, 10]}
          intensity="2"
          color={"#ffffff"}
          distance={20}
          decay={0}
        />
      </Canvas>
    </>
  );
};

export default Experience;