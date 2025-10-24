import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useMemo } from 'react'
import * as THREE from 'three'

function HandrailReturned(props) {

   const {
      handrail_colour,} = useCustomisation(); 
    
    const handrailMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: handrail_colour.color }), [handrail_colour]);

  const { nodes, materials } = useGLTF('/models/handrail_returns.glb')
  return (
    <group {...props} dispose={null} rotation={[Math.PI / 2, 0, -Math.PI/2]}>
      <mesh geometry={nodes.AL_Handrail_Returned.geometry} material={handrailMaterial} />
    </group>
  )
}

useGLTF.preload('/handrail_returns.glb')

export default HandrailReturned