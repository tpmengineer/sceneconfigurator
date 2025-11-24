import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { Reflector as ThreeReflector } from 'three/examples/jsm/objects/Reflector.js';
import { useCustomisation } from '@/contexts/customisation';

let metal = "#F4F4F4";

function Mirror({ width, depth, height, mode = 'full', exposure = 0.6 }) {
  const {
          wall_shadow,
          wall_shadows,
          setWallShadow,} = useCustomisation(); 

  // const return_width = 0.17
  const fullPlaneHeight = useMemo(() => height - 2 * 0.04, [height]);
  const currentPlaneHeight = useMemo(() => (mode === 'half' ? fullPlaneHeight * 0.5 : fullPlaneHeight), [mode, fullPlaneHeight]);
  const yOffset = useMemo(() => (mode === 'half' ? fullPlaneHeight * 0.25 : 0), [mode, fullPlaneHeight]); // top half
  const planeGeom = useMemo(() => new THREE.PlaneGeometry(width - 0.4, currentPlaneHeight), [width, currentPlaneHeight]);
  const reflector = useMemo(() => {
    const r = new ThreeReflector(planeGeom, {
      textureWidth: 1920,
      textureHeight: 1024,
      color: 0xffffff,
      clipBias: 0.003,
      multisample: 4,
    });
    // Brighten by pushing color above 1.0 and disabling tone mapping on the material
    const uniforms = r.material.uniforms;
    if (uniforms && uniforms.color) {
      uniforms.color.value = new THREE.Color(exposure, exposure, exposure);
    }
    r.material.toneMapped = false;
    return r;
  }, [planeGeom, exposure]);

  // Hide fixture meshes (keep actual lights for shading) and reveal mirror-only nodes
  useEffect(() => {
    if (!reflector) return;
    const originalOnBeforeRender = reflector.onBeforeRender;
    reflector.onBeforeRender = function (renderer, scene, camera, geom, mat, group) {
      const hidden = [];
      const revealed = [];
      const fixtureNameRx = /(^|\b)(bulb|fixture|lamp|led|strip|light[-_ ]?mesh|emitter)(\b|$)/i;
      scene.traverse((obj) => {
        const flagged = obj.userData && obj.userData.noMirror;
        const looksLikeFixture = !!(obj.name && fixtureNameRx.test(obj.name));
        const isMesh = obj.isMesh === true;
        // Reveal mirror-only assets for this reflection pass
        if (obj.userData && obj.userData.mirrorOnly && !obj.visible) {
          revealed.push(obj);
          obj.visible = true;
        }
        // Keep actual three.js lights so scene remains lit; hide only fixture meshes or explicitly flagged nodes
        if ((flagged || (isMesh && looksLikeFixture)) && obj.visible) {
          hidden.push(obj);
          obj.visible = false;
        }
      });
      try {
        originalOnBeforeRender && originalOnBeforeRender.call(this, renderer, scene, camera, geom, mat, group);
      } finally {
        for (const obj of hidden) obj.visible = true;
        for (const obj of revealed) obj.visible = false;
      }
    };
    return () => {
      if (reflector) reflector.onBeforeRender = originalOnBeforeRender;
    };
  }, [reflector]);

    return (
        <group>
            {/* Backing plate (frame/substrate) */}
            {/* <mesh>
              <boxGeometry args={[width - 0.4, height - 2 * 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={1} roughness={0.15} />
            </mesh> */}

            {/* Reflective surface: custom bright reflector; offset up when half mirror */}
            <primitive object={reflector} position={[0, yOffset, 0.011]} />
        </group>
    )
}

export default Mirror;