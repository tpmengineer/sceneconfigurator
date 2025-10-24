import React, { useRef } from 'react'
import { useGLTF, useTexture, useHelper} from '@react-three/drei'

import * as THREE from "three";
import { useCustomisation } from "../contexts/customisation";

const Phoenix = (props) => {
  const { nodes, materials } = useGLTF('/models/phoenix_config.glb')

  const pointLight = useRef()
  useHelper(pointLight, THREE.PointLightHelper, 0.5, 'hotpink')

  const {
    floor_material,
    floor_materials,
    setFloorMaterial,

    ceiling_material,
    ceiling_materials,
    setCeilingMaterial,

    ceiling_shadow,
    ceiling_shadows,
    setCeilingShadow,

    wall_material,
    wall_materials,
    setWallMaterial,

    wall_shadow,
    wall_shadows,
    setWallShadow,

    light_color,

    handrail_model,
  } = useCustomisation();

  const woodProps = useTexture({
    map: '/materials/wood_floor/Wood_Floor_009_basecolor.jpg',
    normalMap: '/materials/wood_floor/Wood_Floor_009_normal.jpg',
    roughnessMap: '/materials/wood_floor/Wood_Floor_009_roughness.jpg',
    aoMap: '/materials/wood_floor/Wood_Floor_009_ambientOcclusion.jpg',
  })

  const nullProps = {
    map: null,
    normalMap: null,
    roughnessMap: null,
    aoMap: null,
  }


  woodProps.map.repeat.set(1, 1);
  woodProps.normalMap.repeat.set(1, 1);
  woodProps.roughnessMap.repeat.set(1, 1);
  woodProps.aoMap.repeat.set(1, 1);
  woodProps.map.wrapS = woodProps.map.wrapT =
    THREE.MirroredRepeatWrapping;
  woodProps.normalMap.wrapS = woodProps.normalMap.wrapT =
    THREE.MirroredRepeatWrapping;
  woodProps.roughnessMap.wrapS =
    woodProps.roughnessMap.wrapT = THREE.MirroredRepeatWrapping;
  woodProps.aoMap.wrapS = woodProps.aoMap.wrapT =
    THREE.RepeatWrapping;

  return (
    <group {...props} dispose={null}>
      
      <mesh geometry={nodes.CeilingShadow.geometry} position={[0, 2, 0]}>
        <meshStandardMaterial color={ceiling_shadow.color}/>
      </mesh>
      
      <mesh geometry={nodes.WallShadow.geometry} position={[0, 1, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={wall_shadow.color}/>
      </mesh>

      <mesh geometry={nodes.Floor.geometry}>
      {floor_material.texture === 'woodProps' ? (
        <meshStandardMaterial {...woodProps} />
      ) : (
        <meshStandardMaterial color={floor_material.color} />)}
      </mesh>
      
      <mesh geometry={nodes.Shell.geometry} position={[0, 2, 0]}>
        <meshStandardMaterial color='#E0E5E5'/>
        </mesh>

      <mesh geometry={nodes.HandRail.geometry} position={[-0.408, 0.834, 0.002]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} visible={handrail_model === 'Handrail_1'}>
      <meshPhysicalMaterial color='#E0E5E5' roughness='0.4' metalness='1'/>
      </mesh>

      <mesh geometry={nodes.Handrail_2.geometry} visible={handrail_model === 'Handrail_2'}>
      <meshPhysicalMaterial color='#E0E5E5' roughness='0.4' metalness='1'/>
      </mesh>

      <mesh geometry={nodes.COP.geometry} position={[0.417, 0.952, -0.002]}>
      <meshStandardMaterial color='#E0E5E5' roughness='0.4' metalness='1'/>
      </mesh>

      <mesh geometry={nodes.RoofPanel.geometry} material={nodes.RoofPanel.material} position={[0, 1.981, -0.011]} rotation={[Math.PI / 2, Math.PI / 2, 0]} >
        <meshStandardMaterial color={ceiling_material.color}/>
      </mesh>
      
      <mesh geometry={nodes.WallPanel.geometry} position={[0, 0.984, -0.635]} rotation={[0, Math.PI / 2, 0]} >
        <meshStandardMaterial color={wall_material.color}/>
      </mesh>
    
      
      <mesh geometry={nodes.Light.geometry} position={[0, 1.981, -0.011]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
        <meshStandardMaterial color={light_color.color} emissive={light_color.color} emissiveIntensity={1}/>
      </mesh>

      <pointLight
        ref={pointLight}
        position={[0, 1, 0]} // Adjust the position to fit inside the model
        intensity={5} // Adjust the intensity as needed
        color={light_color.color} // Light color
        distance={5} // How far the light reaches
        decay={2} // How the light dims with distance
      />
    </group>
  )
}

useGLTF.preload('/models/phoenix_config.glb')

export default Phoenix;