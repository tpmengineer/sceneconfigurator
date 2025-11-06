import { useGLTF } from '@react-three/drei'
import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useCustomisation } from '@/contexts/customisation'
import {
  applyPowdercoatPreset,
  createPowdercoatMaterial,
  getPowdercoatPreset,
  isPowdercoatSelection,
} from './shaders/powdercoatShader'
import { applyMetalPreset, createMetalMaterial } from './shaders/metalShader'



// function PhoenixDoor(props) {

//   const {
//     door_colour,} = useCustomisation(); 
  
//   const doorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: door_colour.color, metalness: door_colour.metalness, roughness: door_colour.roughness, reflectivity: 0}), [door_colour]);

//   const { nodes, materials } = useGLTF('/models/phoenix_door.glb')
//   materials['color-1'].transparent = true
//   materials['color-1'].opacity = 0.9
//   return (
//     <group {...props} dispose={null}>
//       <group rotation={[-Math.PI / 2, 0, 0]}>
//         <mesh geometry={nodes.mesh_0.geometry} material={materials['color-1']} />
//         <mesh geometry={nodes.mesh_0_1.geometry} material={doorMaterial} />
//       </group>
//     </group>
//   )
// }

// useGLTF.preload('/models/phoenix_door.glb')

function PhoenixDoor(props) {
  const { door_colour } = useCustomisation();

  // Powdercoated white metal approximation used as the default swing door finish.
  const powderWhiteMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.0,
    roughness: 0.92,
    envMapIntensity: 0.35,
    clearcoat: 0.0,
    clearcoatRoughness: 1.0,
  }), [])

  // Stainless shader keeps consistency with Orion door detailing on shared hardware parts.
  const metalMaterial = useMemo(() => {
    const mat = createMetalMaterial();
    mat.name = 'PhoenixDoorMetalShader';
    applyMetalPreset(mat, '#c0c0c0');
    return mat;
  }, [])

  // Simple block red: solid red, non-metallic, fairly matte
  // eslint-disable-next-line no-unused-vars
  const blockRedMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff0000',
    metalness: 0.0,
    roughness: 0.9,
  }), [])

  // White emissive surface: appears self-lit; note this is not an actual Light source
  // eslint-disable-next-line no-unused-vars
  const emissiveWhiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.0,
    roughness: 0.2,
    emissive: new THREE.Color('#ffffff'),
    emissiveIntensity: 1.8,
  }), [])

  // Lightweight blue/white "glass": use StandardMaterial + alpha instead of Physical + transmission
  // Significantly cheaper while keeping a glassy feel via low roughness and partial opacity
  const blueWhiteGlassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#dceffc',
    metalness: 0.0,
    roughness: 0.12,
    envMapIntensity: 0.9,
    transparent: true,
    opacity: 0.9,
    // Avoid writing depth for cleaner layering of transparent surfaces
    depthWrite: false,
  }), [])

  // Powdercoat shader shared with the Orion door when the swing door is set to Powdercoat Black.
  const powdercoatMaterial = useMemo(() => {
    const mat = createPowdercoatMaterial();
    mat.name = 'PhoenixDoorPowdercoatShader';
    return mat;
  }, []);

  useEffect(() => {
    if (!door_colour?.color) return;

    const name = door_colour.name ?? '';

    if (isPowdercoatSelection(name)) {
      const preset = getPowdercoatPreset(name, door_colour.color);
      applyPowdercoatPreset(powdercoatMaterial, preset);
      return;
    }

    powderWhiteMaterial.color.set(door_colour.color);
    powderWhiteMaterial.metalness = door_colour.metalness ?? powderWhiteMaterial.metalness;
    powderWhiteMaterial.roughness = door_colour.roughness ?? powderWhiteMaterial.roughness;
    powderWhiteMaterial.needsUpdate = true;
  }, [door_colour, powdercoatMaterial, powderWhiteMaterial]);

  const doorPanelMaterial = useMemo(() => {
    const selectionName = door_colour?.name ?? '';
    return isPowdercoatSelection(selectionName) ? powdercoatMaterial : powderWhiteMaterial;
  }, [door_colour, powderWhiteMaterial, powdercoatMaterial]);

  const { nodes } = useGLTF('/models/phoenix_door.glb')

  return (
    <group {...props} dispose={null} rotation={[0,-Math.PI/2,0]}>
      <mesh geometry={nodes['GEN_3_1850_DOOR_D01-1001'].geometry} material={doorPanelMaterial} position={[-0.126, 1.865, 0.004]} rotation={[-Math.PI, Math.PI / 2, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_D01-2001'].geometry} material={doorPanelMaterial} position={[-0.126, 0.05, 0.004]} rotation={[0, 1.571, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_D02-1001'].geometry} material={doorPanelMaterial} position={[-0.126, 0.958, 0.447]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_D02-3001'].geometry} material={doorPanelMaterial} position={[-0.126, 0.958, -0.44]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_D03-1001'].geometry} material={doorPanelMaterial} position={[-0.126, 0.026, 0.004]} rotation={[0, 1.571, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_D04-1003'].geometry} material={blueWhiteGlassMaterial} position={[-0.123, 0.958, 0.004]} rotation={[0, 1.571, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_P01-1001'].geometry} material={doorPanelMaterial} position={[-0.128, 1.996, 0.004]} rotation={[0, 1.571, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_P02-1001'].geometry} material={doorPanelMaterial} position={[-0.128, 1.006, 0.579]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_P03-1001'].geometry} material={doorPanelMaterial} position={[-0.128, 1.006, -0.571]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} />
      <mesh geometry={nodes['GEN_3_1850_DOOR_P04-1001'].geometry} material={metalMaterial} position={[-0.128, 0.001, 0.004]} rotation={[0, 1.571, 0]} />
      <mesh geometry={nodes.Aussie_Lifts_Door_Cover001.geometry} material={doorPanelMaterial} position={[-0.08, 0.97, -0.521]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
      <mesh geometry={nodes['Aussie_Lifts_Door_Handle-1001'].geometry} material={metalMaterial} position={[-0.082, 0.985, -0.451]} rotation={[-Math.PI / 2, 0, 0]} />
      <group position={[-0.073, 0.987, -0.521]} rotation={[-0.754, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh_21001.geometry} material={blockRedMaterial} />
        <mesh geometry={nodes.Mesh_21001_1.geometry} material={blockRedMaterial} />
      </group>
      <group position={[-0.08, 0.97, -0.521]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh_18001.geometry} material={doorPanelMaterial} />
        <mesh geometry={nodes.Mesh_18001_1.geometry} material={metalMaterial} />
      </group>
      <group position={[-0.073, 1.015, -0.521]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh_19001.geometry} material={metalMaterial} />
        <mesh geometry={nodes.Mesh_19001_1.geometry} material={doorPanelMaterial} />
        <mesh geometry={nodes.Mesh_19001_2.geometry} material={emissiveWhiteMaterial} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/phoenix_door.glb')


export default PhoenixDoor