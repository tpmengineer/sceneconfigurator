import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  applyPowdercoatPreset,
  createPowdercoatMaterial,
  getPowdercoatPreset,
  isPowdercoatSelection,
} from './shaders/powdercoatShader'
import { applyStainlessPreset, createStainlessMaterial } from './shaders/stainlessShader'

function Fermator(props) {

  const {door_colour,} = useCustomisation(); 

  // Stainless steel shader mimics soft brushed reflections without env maps.
  const stainlessMaterial = useMemo(() => {
    const mat = createStainlessMaterial();
    mat.name = 'OrionDoorStainlessShader';
    return mat;
  }, []);

  // Powdercoat shader keeps a matte, noisy finish with subtle rim lighting.
  const powdercoatMaterial = useMemo(() => {
    const mat = createPowdercoatMaterial();
    mat.name = 'OrionDoorPowdercoatShader';
    return mat;
  }, []);

  const defaultMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f2f2f2'),
      metalness: 0.2,
      roughness: 0.7,
    });
    mat.name = 'OrionDoorDefaultMaterial';
    return mat;
  }, []);

  useEffect(() => {
    if (!door_colour?.color) return;

    const name = door_colour.name ?? '';
    const lowerName = name.toLowerCase();

    if (lowerName === 'stainless steel') {
      applyStainlessPreset(stainlessMaterial, door_colour.color);
      return;
    }

    if (isPowdercoatSelection(name)) {
      const preset = getPowdercoatPreset(name, door_colour.color);
      applyPowdercoatPreset(powdercoatMaterial, preset);
      return;
    }

    defaultMaterial.color.set(door_colour.color);
    defaultMaterial.metalness = door_colour.metalness ?? 0;
    defaultMaterial.roughness = door_colour.roughness ?? 1;
    defaultMaterial.needsUpdate = true;
  }, [door_colour, stainlessMaterial, powdercoatMaterial, defaultMaterial]);

  const activeMaterial = useMemo(() => {
  const selectionName = door_colour?.name ?? '';
  const lowerName = selectionName.toLowerCase();
  if (lowerName === 'stainless steel') return stainlessMaterial;
  if (isPowdercoatSelection(selectionName)) return powdercoatMaterial;
    return defaultMaterial;
  }, [door_colour, stainlessMaterial, powdercoatMaterial, defaultMaterial]);
  
  const { nodes } = useGLTF('/models/orion_door.glb')
  return (
    <group {...props} dispose={null} rotation={[-Math.PI/2,0,Math.PI]} position={[0.7,0,-0.14]}>
      <mesh geometry={nodes.mesh_0.geometry} material={activeMaterial} />
      <mesh geometry={nodes.mesh_0_1.geometry} material={activeMaterial} />
    </group>
  )
}

useGLTF.preload('/models/orion_door.glb')

export default Fermator
