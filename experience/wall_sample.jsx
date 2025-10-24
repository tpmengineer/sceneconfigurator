import React from 'react'
import { useGLTF } from '@react-three/drei'

function SceneWall(props) {
  const { nodes, materials } = useGLTF('/models/wall_sample.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Plane.geometry}>
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
      </mesh>
      <mesh geometry={nodes.Cube001.geometry} material={nodes.Cube001.material} >
      
      <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
      </mesh>
      <mesh geometry={nodes.Cube002.geometry} material={nodes.Cube002.material} >
          <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
      
      </mesh>

      <mesh geometry={nodes.Big_Monstera_plant.geometry} material={nodes.Big_Monstera_plant.material} position={[0.375, 0, -1.286]} rotation={[Math.PI, -1.027, Math.PI]} scale={0.557}>
        <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
        <mesh geometry={nodes.plant.geometry} material={nodes.plant.material} position={[-0.167, 2.19, 0.052]} >
          <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
        </mesh>
      </mesh>

      <group position={[0.416, 0, 2.9]} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={nodes.Base001.geometry} material={nodes.Base001.material} position={[0, 0.172, -0.041]} >
          <meshStandardMaterial color={'#ffffff'} emissive={'#ffffff'} emissiveIntensity={0.1} roughness={1} />
          </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/models/wall_sample.glb')

export default SceneWall
