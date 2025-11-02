import * as THREE from 'three';
import React from 'react';

import { useCustomisation } from "@/contexts/customisation";
import { useTexture } from '@react-three/drei';

function LaminexPanelCeiling({width, height, position, rotation, lighting}) {

  const {
      ceiling_material,
      ceiling_materials,
      setCeilingMaterial,} = useCustomisation(); 

      const ceilingMaterials = [
        "polar_white_flint",
        "ghostgum_flint",
        "oyster_grey_flint",
        "alaskan_natural",
        "natural_walnut_chalk",
        "elegant_oak_chalk",
        "fox_teakwood_natural",
        "rural_oak_natural",
        "classic_oak_natural",
        "burnished_wood_natural",
        "parchment_flint",
        "white_flint",
        "rock_maple_flint"
      ];
      
      const generateCeilingMaterialProps = (materialList) => {
        const ceilingTextures = {};
        
        materialList.forEach((material) => {
          ceilingTextures[material] = useTexture({
            map: `/materials/walls/${material}.jpg`,
          });
      
          const wallTextureProps = ceilingTextures[material];
          
          // textureProps.map.repeat.set(1, 1);
          wallTextureProps.map.repeat.set(1, 0.5)
          {material === 'natural_walnut_seam' ? wallTextureProps.map.repeat.set(1,0.5) : ""}
          wallTextureProps.map.wrapS = wallTextureProps.map.wrapT = THREE.MirroredRepeatWrapping;
          // wallTextureProps.map.minFilter = THREE.NearestFilter;
          // wallTextureProps.map.magFilter = THREE.NearestFilter;
          wallTextureProps.map.offset.set(0.5, 0.5); // Moves the origin to the center

          wallTextureProps.map.needsUpdate = true;
        });
      
        return ceilingTextures;
      };
      
      const ceilingMaterialProps = generateCeilingMaterialProps(ceilingMaterials);
  // Use Leva to control width, height, radius, and depth
  const radius = 0.1
  
  // Create the shape with beveled corners
  const shape = React.useMemo(() => {
    const rectShape = new THREE.Shape();
    rectShape.moveTo(-width / 2 + radius, height / 2);
    rectShape.lineTo((width-0.05) / 2 - radius, height / 2);
    rectShape.quadraticCurveTo((width-0.05) / 2, height / 2, (width-0.05) / 2, height / 2 - radius);
    rectShape.lineTo((width-0.05) / 2, -height / 2 + radius);
    rectShape.quadraticCurveTo((width-0.05) / 2, -height / 2, (width-0.05) / 2 - radius, -height / 2);
    rectShape.lineTo(-(width-0.05) / 2 + radius, -height / 2);
    rectShape.quadraticCurveTo(-(width-0.05) / 2, -height / 2, -(width-0.05) / 2, -height / 2 + radius);
    rectShape.lineTo(-(width-0.05) / 2, height / 2 - radius);
    rectShape.quadraticCurveTo(-(width-0.05) / 2, height / 2, -(width-0.05) / 2 + radius, height / 2);
    return rectShape;
  }, [width, height, radius]);

  const LEDBase = React.useMemo(() => {
    const LEDBaseShape = new THREE.Shape();
    LEDBaseShape.moveTo(-(width-0.07) / 2 + radius, (height-0.02) / 2);
    LEDBaseShape.lineTo((width-0.07) / 2 - radius, (height-0.02) / 2);
    LEDBaseShape.quadraticCurveTo((width-0.07) / 2, (height-0.02) / 2, (width-0.07) / 2, (height-0.02) / 2 - radius);
    LEDBaseShape.lineTo((width-0.07) / 2, -(height-0.02) / 2 + radius);
    LEDBaseShape.quadraticCurveTo((width-0.07) / 2, -(height-0.02) / 2, (width-0.07) / 2 - radius, -(height-0.02) / 2);
    LEDBaseShape.lineTo(-(width-0.07) / 2 + radius, -(height-0.02) / 2);
    LEDBaseShape.quadraticCurveTo(-(width-0.07) / 2, -(height-0.02) / 2, -(width-0.07) / 2, -(height-0.02) / 2 + radius);
    LEDBaseShape.lineTo(-(width-0.07) / 2, (height-0.02) / 2 - radius);
    LEDBaseShape.quadraticCurveTo(-(width-0.07) / 2, (height-0.02) / 2, -(width-0.07) / 2 + radius, (height-0.02) / 2);
    
    const LEDCutout = new THREE.Path();
        
    LEDCutout.moveTo(-(width-0.08) / 2 + radius, (height-0.03) / 2);
    LEDCutout.lineTo((width-0.08) / 2 - radius, (height-0.03) / 2);
    LEDCutout.quadraticCurveTo((width-0.08) / 2, (height-0.03) / 2, (width-0.08) / 2, (height-0.03) / 2 - radius);
    LEDCutout.lineTo((width-0.08) / 2, -(height-0.03) / 2 + radius);
    LEDCutout.quadraticCurveTo((width-0.08) / 2, -(height-0.03) / 2, (width-0.08) / 2 - radius, -(height-0.03) / 2);
    LEDCutout.lineTo(-(width-0.08) / 2 + radius, -(height-0.03) / 2);
    LEDCutout.quadraticCurveTo(-(width-0.08) / 2, -(height-0.03) / 2, -(width-0.08) / 2, -(height-0.03) / 2 + radius);
    LEDCutout.lineTo(-(width-0.08) / 2, (height-0.03) / 2 - radius);
    LEDCutout.quadraticCurveTo(-(width-0.08) / 2, (height-0.03) / 2, -(width-0.08) / 2 + radius, (height-0.03) / 2);
    LEDCutout.closePath();
    
    // Subtract the cutout from the main shape
    LEDBaseShape.holes.push(LEDCutout);

    return LEDBaseShape;
  }, [width, height, radius]);

  // Extrude the shape into 3D
  const geometry = React.useMemo(() => {
    const thickness = 0.009
    return new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: false, // Disable 3D beveling; we only want 2D corners beveled
    });
  });

  const backingGeometry = React.useMemo(() => {
    const thickness = 0.009
    return new THREE.ExtrudeGeometry(LEDBase, {
      depth: thickness,
      bevelEnabled: false, // Disable 3D beveling; we only want 2D corners beveled
    });
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} position={[0,0,0.009]}>
      {ceilingMaterialProps[ceiling_material.texture] ? (
        <meshStandardMaterial {...ceilingMaterialProps[ceiling_material.texture]} />
      ) : (
        <meshStandardMaterial color={ceiling_material.color} />
      )}
    </mesh>
      { lighting && (<mesh geometry={backingGeometry} position={[0,0,0]}>
      <meshStandardMaterial color={'#FFF3DA'} emissive={'#FFF3DA'} emissiveIntensity={2} />
      </mesh>)}
    </group>
  );
}

export default LaminexPanelCeiling;