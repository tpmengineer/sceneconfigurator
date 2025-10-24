import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useMemo } from 'react'
import * as THREE from 'three'

function COP(props) {
  const { nodes, materials } = useGLTF('/models/cop.glb')

  const {
    handrail_colour} = useCustomisation(); 
  
  const handrailMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: handrail_colour.color, metalness: handrail_colour.metalness, roughness: handrail_colour.roughness }), [handrail_colour]);

  return (
    <group {...props} dispose={null} rotation = {[Math.PI / 2, 0, Math.PI/2]}>
      {/* <OrthographicCamera makeDefault={false} far={100} near={0.01} position={[2.772, 7.235, 0.308]} rotation={[-1.611, 0.384, 0.04]} /> */}
      <mesh geometry={nodes['COP_Part_B-1'].geometry} material={handrailMaterial} position={[0, 0.002, 0.72]} />
      <mesh geometry={nodes['COP_Part_C-1'].geometry} material={handrailMaterial} position={[0, 0.024, 0.36]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['COP_Part_A-1'].geometry} material={handrailMaterial}/>
      <mesh geometry={nodes['Aussie_Lifts_COP_Pard_D-9'].geometry} material={handrailMaterial} position={[-0.028, 0.014, 0.652]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['COP_Part_B-2'].geometry} material={handrailMaterial} position={[0, 0.002, 0]} rotation={[-Math.PI, 0, -Math.PI]} />
      <mesh geometry={nodes['Aussie_Lifts_COP_Pard_D-1'].geometry} material={handrailMaterial} position={[0, 0.014, 0.592]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['Aussie_Lifts_COP_Pard_D-3'].geometry} material={handrailMaterial} position={[0.028, 0.014, 0.652]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['Aussie_Lifts_COP_Pard_D-5'].geometry} material={handrailMaterial} position={[0, 0.014, 0.542]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['LED-1'].geometry} position={[0.087, 0.003, 0]}>
        <meshStandardMaterial color={'#0000FF'} emissive={'#0000FF'} emissiveIntensity={2} />
      </mesh>
      <mesh geometry={nodes['LED-2'].geometry} position={[-0.087, 0.003, 0]}>
        <meshStandardMaterial color={'#0000FF'} emissive={'#0000FF'} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/cop.glb')

export default COP
