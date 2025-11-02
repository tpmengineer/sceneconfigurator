import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useMemo } from 'react'
import * as THREE from 'three'



function PhoenixDoor(props) {

  const {
    door_colour,} = useCustomisation(); 
  
  const doorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: door_colour.color, metalness: door_colour.metalness, roughness: door_colour.roughness, reflectivity: 0}), [door_colour]);

  const { nodes, materials } = useGLTF('/models/phoenix_door.glb')
  materials['color-1'].transparent = true
  materials['color-1'].opacity = 0.9
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.mesh_0.geometry} material={materials['color-1']} />
        <mesh geometry={nodes.mesh_0_1.geometry} material={doorMaterial} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/phoenix_door.glb')

export default PhoenixDoor