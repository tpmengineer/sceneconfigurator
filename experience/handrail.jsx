import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useMemo } from 'react'
import * as THREE from 'three'

function Handrail(props) {

  const {
    handrail_colour,
  handrail_model} = useCustomisation(); 
  
  const handrailMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: handrail_colour.color, metalness: handrail_colour.metalness, roughness: handrail_colour.roughness }), [handrail_colour]);

  const { nodes, materials } = useGLTF('/models/handrail.glb')
  return (
    <group {...props} dispose={null} rotation={[0, Math.PI/2, -Math.PI/2]}>
      <mesh geometry={nodes['AL_Handrail-1'].geometry} material={handrailMaterial} visible={handrail_model === 'Handrail_1'}/>
      <mesh geometry={nodes['AL_Handrail_Returned-2'].geometry} material={handrailMaterial} rotation={[Math.PI / 2, -Math.PI / 2, 0]} visible={handrail_model === 'Handrail_2'}/>
    </group>
  )
}

useGLTF.preload('/handrail.glb')

export default Handrail