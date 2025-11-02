import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useMemo } from 'react'
import * as THREE from 'three'

function Fermator(props) {

  const {door_colour,} = useCustomisation(); 
    
    const doorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: door_colour.color, metalness: door_colour.metalness, roughness: door_colour.roughness}), [door_colour]);
  
  const { nodes, materials } = useGLTF('/models/orion_door.glb')
  return (
    <group {...props} dispose={null} rotation={[-Math.PI/2,0,Math.PI]} position={[0.7,0,-0.14]}>
      <mesh geometry={nodes.mesh_0.geometry} material={doorMaterial} />
      <mesh geometry={nodes.mesh_0_1.geometry} material={doorMaterial} />
    </group>
  )
}

useGLTF.preload('/models/orion_door.glb')

export default Fermator
