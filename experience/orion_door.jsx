import { useGLTF } from '@react-three/drei'
import { useCustomisation } from '@/contexts/customisation'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import {
  applyPowdercoatPreset,
  createPowdercoatMaterial,
  getPowdercoatPreset,
  isPowdercoatSelection,
} from './shaders/powdercoatShader'
import { applyStainlessPreset, createStainlessMaterial } from './shaders/stainlessShader'
import { localBounds, SLIDE_TWEEN, useCallButton } from './door_motion'

// The four leaves of the two-speed centre-opening door. Which run each one
// belongs to, and how far it travels, is worked out from its own bounds at
// load — this list only needs to name them and place them.
const PANELS = [
  { node: 'DOORstp-1', position: [-0.218, 0.001, -0.69] },
  { node: 'DOORstp-2', position: [-0.216, 0, -0.69] },
  { node: 'DOORstp-3', position: [-0.216, 0, -0.694] },
  { node: 'DOORstp-4', position: [-0.218, 0.001, -0.695] },
]

function Fermator(props) {

  const {door_colour,} = useCustomisation(); 

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

  // Easter egg: the call button on the jamb is live — press it and the door
  // runs open. The frame, sill and call station stay put; only the leaves move.
  const [open, callButtonProps] = useCallButton()
  const panelRefs = useRef([])
  const [travel, setTravel] = useState(() => PANELS.map(() => 0))

  useLayoutEffect(() => {
    const bounds = panelRefs.current.map((group) => localBounds(group))
    if (bounds.length !== PANELS.length || bounds.some((box) => box.isEmpty())) return

    const min = Math.min(...bounds.map((box) => box.min.z))
    const max = Math.max(...bounds.map((box) => box.max.z))
    const centre = (min + max) / 2
    const halfOpening = (max - min) / 2

    // Two-speed: every leaf starts and stops together, so the one nearest the
    // centre has the whole half-opening to clear and each leaf behind it a
    // proportional share of it. That is what nests them at the jamb instead of
    // trailing them out in a line.
    const next = PANELS.map(() => 0)
    for (const side of [-1, 1]) {
      const run = bounds
        .map((box, index) => ({ index, offset: (box.min.z + box.max.z) / 2 - centre }))
        .filter((leaf) => Math.sign(leaf.offset) === side)
        .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset))
      run.forEach((leaf, place) => {
        next[leaf.index] = (side * halfOpening * (run.length - place)) / run.length
      })
    }
    setTravel(next)
  }, [])

  useLayoutEffect(() => {
    panelRefs.current.forEach((group, index) => {
      if (group) gsap.to(group.position, { z: open ? travel[index] : 0, ...SLIDE_TWEEN })
    })
  }, [open, travel])

  return (
    <group {...props} dispose={null} rotation={[0,-Math.PI/2,0]}>
      <mesh geometry={nodes['DOOR_FRAME_UPRIGHTstp-1'].geometry} material={activeMaterial} position={[-0.218, 0.001, -0.691]} />
      <mesh geometry={nodes['DOOR_FRAME_UPRIGHTstp-2'].geometry} material={activeMaterial} position={[-0.218, 0.001, -0.691]} />
      <mesh geometry={nodes['DOOR_SILL_PROFILE_UPDATEDstp-1'].geometry} material={stainlessMaterial} position={[-0.218, 0.001, -0.691]} />
      {/* Apply active selection to the four door leaf parts */}
      {PANELS.map((panel, index) => (
        <group key={panel.node} ref={(group) => { panelRefs.current[index] = group }}>
          <mesh geometry={nodes[panel.node].geometry} material={activeMaterial} position={panel.position} />
        </group>
      ))}
      <mesh geometry={nodes['TOPstp-1'].geometry} material={activeMaterial} position={[-0.218, 0.001, -0.691]} />
      <group position={[-0.067, 0.979, -0.507]} rotation={[-0.754, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh_21002.geometry} material={blockRedMaterial} />
        <mesh geometry={nodes.Mesh_21002_1.geometry} material={activeMaterial} />
      </group>
      <group position={[-0.075, 0.962, -0.507]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh_18003.geometry} material={activeMaterial} />
        <mesh geometry={nodes.Mesh_18003_1.geometry} material={activeMaterial} />
      </group>
      <group position={[-0.067, 1.007, -0.507]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} {...callButtonProps}>
        <mesh geometry={nodes.Mesh_19002.geometry} material={activeMaterial} />
        <mesh geometry={nodes.Mesh_19002_1.geometry} material={activeMaterial} />
        <mesh geometry={nodes.Mesh_19002_2.geometry} material={emissiveWhiteMaterial} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/orion_door.glb')

export default Fermator
