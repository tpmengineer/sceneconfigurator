import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createStainlessMaterial, applyStainlessPreset } from './shaders/stainlessShader'
import { createPowdercoatMaterial, applyPowdercoatPreset, getPowdercoatPreset, isPowdercoatSelection } from './shaders/powdercoatShader'
import { createMetalMaterial, applyMetalPreset } from './shaders/metalShader'
import { createAluminiumMaterial, applyAluminiumPreset } from './shaders/aluminiumShader'

function Handrail(props) {

  const {
    handrail_colour,
  handrail_model} = useCustomisation(); 
  
  const stainlessMaterial = useMemo(() => {
      const mat = createStainlessMaterial();
      mat.name = 'Handrail_StainlessShader';
      return mat;
    }, []);
  
    const powdercoatMaterial = useMemo(() => {
      const mat = createPowdercoatMaterial();
      mat.name = 'Handrail_PowdercoatShader';
      return mat;
    }, []);
  
    const metalMaterial = useMemo(() => {
      const mat = createMetalMaterial();
      mat.name = 'Handrail_MetalShader';
      return mat;
    }, []);

    const aluminiumMaterial = useMemo(() => {
      const mat = createAluminiumMaterial();
      mat.name = 'handrail_AluminiumShader';
      return mat;
    }, []);
  
    // Drive uniforms from selection
    useEffect(() => {
      if (!handrail_colour) return;
      const name = handrail_colour.name?.toLowerCase?.() || '';
  
      if (name === 'stainless steel') {
        applyStainlessPreset(stainlessMaterial, handrail_colour.color);
        return;
      }
  
      if (isPowdercoatSelection(name)) {
        const preset = getPowdercoatPreset(name, handrail_colour.color);
        applyPowdercoatPreset(powdercoatMaterial, preset);
        return;
      }

      if (name.includes('aluminium') || name.includes('aluminum')) {
        applyAluminiumPreset(aluminiumMaterial, handrail_colour.color);
        return;
      }
  
      // Fallback: generic metal shader tinted to selection color
      applyMetalPreset(metalMaterial, handrail_colour.color);
    }, [handrail_colour, stainlessMaterial, powdercoatMaterial, metalMaterial]);
  
    const handrailMaterial = useMemo(() => {
      const name = handrail_colour?.name || '';
      const lower = name.toLowerCase();
      if (lower === 'stainless steel') return stainlessMaterial;
      if (isPowdercoatSelection(lower)) return powdercoatMaterial;
      if (lower.includes('aluminium') || lower.includes('aluminum')) return aluminiumMaterial;
      return metalMaterial;
    }, [handrail_colour, stainlessMaterial, powdercoatMaterial, aluminiumMaterial, metalMaterial]);

  const { nodes, materials } = useGLTF('/models/handrail.glb')
  return (
    <group {...props} dispose={null} rotation={[0, -Math.PI/2, Math.PI/2]}>
      <mesh geometry={nodes['AL_Handrail-1'].geometry} material={handrailMaterial} visible={handrail_model === 'Shaft and Post'}/>
      <mesh geometry={nodes['AL_Handrail_Returned-2'].geometry} material={handrailMaterial} rotation={[Math.PI / 2, Math.PI / 2, 0]} visible={handrail_model === 'Returned'}/>
    </group>
  )
}

useGLTF.preload('/models/handrail.glb')

export default Handrail