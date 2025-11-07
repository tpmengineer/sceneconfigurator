import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createStainlessMaterial, applyStainlessPreset } from './shaders/stainlessShader'
import { createPowdercoatMaterial, applyPowdercoatPreset, getPowdercoatPreset, isPowdercoatSelection } from './shaders/powdercoatShader'
import { createMetalMaterial, applyMetalPreset } from './shaders/metalShader'
import { createAluminiumMaterial, applyAluminiumPreset } from './shaders/aluminiumShader'

function COP(props) {
  const { nodes, materials } = useGLTF('/models/cop.glb')

  const { cop_colour } = useCustomisation();

  const emissiveWhiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.2,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 1.8,
    }), [])

  // Prepare shader materials once
  const stainlessMaterial = useMemo(() => {
    const mat = createStainlessMaterial();
    mat.name = 'COP_StainlessShader';
    return mat;
  }, []);

  const powdercoatMaterial = useMemo(() => {
    const mat = createPowdercoatMaterial();
    mat.name = 'COP_PowdercoatShader';
    return mat;
  }, []);

  const metalMaterial = useMemo(() => {
    const mat = createMetalMaterial();
    mat.name = 'COP_MetalShader';
    return mat;
  }, []);

  const aluminiumMaterial = useMemo(() => {
    const mat = createAluminiumMaterial();
    mat.name = 'COP_AluminiumShader';
    return mat;
  }, []);

  // Drive uniforms from selection
  useEffect(() => {
    if (!cop_colour) return;
    const name = cop_colour.name?.toLowerCase?.() || '';

    if (name === 'stainless steel') {
      applyStainlessPreset(stainlessMaterial, cop_colour.color);
      return;
    }

    if (isPowdercoatSelection(name)) {
      const preset = getPowdercoatPreset(name, cop_colour.color);
      applyPowdercoatPreset(powdercoatMaterial, preset);
      return;
    }

    if (name.includes('aluminium') || name.includes('aluminum')) {
      applyAluminiumPreset(aluminiumMaterial, cop_colour.color);
      return;
    }

    // Fallback: generic metal shader tinted to selection color
    applyMetalPreset(metalMaterial, cop_colour.color);
  }, [cop_colour, stainlessMaterial, powdercoatMaterial, metalMaterial]);

  const copActiveMaterial = useMemo(() => {
    const name = cop_colour?.name || '';
    const lower = name.toLowerCase();
    if (lower === 'stainless steel') return stainlessMaterial;
    if (isPowdercoatSelection(lower)) return powdercoatMaterial;
    if (lower.includes('aluminium') || lower.includes('aluminum')) return aluminiumMaterial;
    return metalMaterial;
  }, [cop_colour, stainlessMaterial, powdercoatMaterial, aluminiumMaterial, metalMaterial]);

  return (
    <group {...props} dispose={null} >
      <mesh geometry={nodes.STOP002.geometry} material={emissiveWhiteMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes.G002.geometry} material={emissiveWhiteMaterial} position={[-0.938, 1.113, -0.014]} />
      <mesh geometry={nodes.Braille_Stop002.geometry} material={metalMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes.Braille_G002.geometry} material={metalMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes.Braille_Bell002.geometry} material={metalMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes.Braille_1002.geometry} material={metalMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes.Bell002.geometry} material={materials['Button Light Yellow']} position={[-0.938, 1.113, -0.014]} />
      <mesh geometry={nodes['ALFT-010-104_COP_LED_Strip-2006'].geometry} position={[-0.938, 1.114, -0.014]} >
                <meshStandardMaterial color={'#0000FF'} emissive={'#0000FF'} emissiveIntensity={2} />
        </mesh>
      <mesh geometry={nodes['ALFT-010-104_COP_LED_Strip-1006'].geometry} position={[-0.938, 1.114, -0.014]} >
        <meshStandardMaterial color={'#0000FF'} emissive={'#0000FF'} emissiveIntensity={2} />
        </mesh>
      <group position={[-0.938, 1.114, -0.014]}>
        <mesh geometry={nodes.Mesh_50007.geometry} material={copActiveMaterial} />
        <mesh geometry={nodes.Mesh_50007_1.geometry} material={materials.RedLight} />
      </group>
      <mesh geometry={nodes['ALFT-010-102_COP_Part_C-2006'].geometry} material={copActiveMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes['ALFT-010-102_COP_Part_C-1006'].geometry} material={copActiveMaterial} position={[-0.938, 1.114, -0.014]} />
      <mesh geometry={nodes['ALFT-010-101_COP_Part_B-1006'].geometry} material={copActiveMaterial} position={[-0.938, 1.114, -0.014]} />
      <group position={[-0.938, 1.114, -0.014]}>
        <mesh geometry={nodes.Mesh_54019.geometry} material={copActiveMaterial} />
        <mesh geometry={nodes.Mesh_54019_1.geometry} material={emissiveWhiteMaterial} />
      </group>
      <group position={[-0.938, 1.114, -0.014]}>
        <mesh geometry={nodes.Mesh_54018.geometry} material={copActiveMaterial} />
        <mesh geometry={nodes.Mesh_54018_1.geometry} material={emissiveWhiteMaterial} />
      </group>
      <group position={[-0.938, 1.114, -0.014]}>
        <mesh geometry={nodes.Mesh_54017.geometry} material={copActiveMaterial} />
        <mesh geometry={nodes.Mesh_54017_1.geometry} material={emissiveWhiteMaterial} />
      </group>
      <group position={[-0.938, 1.114, -0.014]}>
        <mesh geometry={nodes.Mesh_54016.geometry} material={copActiveMaterial} />
        <mesh geometry={nodes.Mesh_54016_1.geometry} material={emissiveWhiteMaterial} />
      </group>
      <mesh geometry={nodes['1002'].geometry} material={emissiveWhiteMaterial} position={[-0.938, 1.113, -0.014]} />
    </group>
  )
}

useGLTF.preload('/models/cop.glb')

export default COP
