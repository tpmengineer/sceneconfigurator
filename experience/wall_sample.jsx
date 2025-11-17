import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'

function SceneWall(props) {
  const { nodes } = useGLTF('/models/wall_sample_lowres.glb')

  // Pull current selections
  const { wall_material, floor_material } = useCustomisation()


  const wallMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: wall_material?.color || '#dddddd',
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uCreamColor = { value: new THREE.Color('#FFFBEB') };

      shader.fragmentShader = `
        uniform vec3 uCreamColor;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>

        // Mix current wall color with a cream tone
        diffuseColor.rgb = mix(diffuseColor.rgb, uCreamColor, 0.75);
        
        // Make it a bit brighter overall
        diffuseColor.rgb *= 1.8;
        `
      );

      material.userData.shader = shader;
    };

    // This is needed to trigger the onBeforeCompile callback
    material.customProgramCacheKey = () => Math.random();

    return material;
  }, [wall_material])

  const blackMaterial = new THREE.MeshStandardMaterial({ color: '#000000' })
  // Prepare floor textures
  const floorTex = useTexture(
    floor_material?.texture
      ? { map: `/materials/floor/${floor_material.texture}.png` }
      : undefined
  )
  const floorMaterial = useMemo(() => {
    if (floorTex?.map) {
      floorTex.map.wrapS = floorTex.map.wrapT = THREE.MirroredRepeatWrapping
      // Light tiling for carpets vs others
      if (floor_material?.texture === 'grey_carpet') {
        floorTex.map.repeat.set(5, 2)
      } else {
        floorTex.map.repeat.set(1, 1)
      }
      floorTex.map.needsUpdate = true
      return new THREE.MeshStandardMaterial({ map: floorTex.map })
    }
    return new THREE.MeshStandardMaterial({ color: floor_material?.color || '#bfbfbf' })
  }, [floorTex, floor_material])

  return (
    <group {...props} dispose={null}>
      {/* Keep original GLTF materials for the plant to preserve baked textures */}
      <mesh geometry={nodes.Big_Monstera_plant.geometry} material={wallMaterial} position={[0.375, 0, -1.286]} rotation={[Math.PI, -1.027, Math.PI]} scale={0.557}>
        <mesh geometry={nodes.plant.geometry} material={wallMaterial} position={[-0.167, 2.19, 0.052]} />
      </mesh>
      {/* Walls/panels use current wall selection */}
      <mesh geometry={nodes.Plane.geometry} material={wallMaterial} />
      <mesh geometry={nodes.Plane.geometry} material={wallMaterial} />
      <mesh geometry={nodes.Cube001.geometry} material={wallMaterial} />
      <mesh geometry={nodes.Cube002.geometry} material={wallMaterial} />

      {/* Floor/base elements use current floor selection */}
      <mesh geometry={nodes.path1.geometry} material={blackMaterial} position={[0.017, 1.281, 4.203]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={-21.219} />
      <mesh geometry={nodes.Base001.geometry} material={wallMaterial} position={[0.375, 0.172, 2.9]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}

useGLTF.preload('/models/wall_sample_lowres.glb')

export default SceneWall
