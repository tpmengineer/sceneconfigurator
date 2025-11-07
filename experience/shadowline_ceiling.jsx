import * as THREE from 'three';
import React from 'react';

import { useCustomisation } from "@/contexts/customisation";

function ShadowlineCeiling ({ width, height, cutoutWidth, cutoutHeight, position, rotation }) {
  
  const {
        ceiling_shadow,
        ceiling_shadows,
        setCeilingShadow,
      } = useCustomisation();

  const shape = React.useMemo(() => {
    const rectShape = new THREE.Shape();

    
    
    // Define outer rectangle
    rectShape.moveTo(-width / 2, height / 2);
    rectShape.lineTo(width / 2, height / 2);
    rectShape.lineTo(width / 2, -height / 2);
    rectShape.lineTo(-width / 2, -height / 2);
    rectShape.closePath();

    // Define cutout rectangle
    const cutout = new THREE.Path();
    const cutoutX = -cutoutWidth / 2;
    const cutoutY = -cutoutHeight / 2;
    
    cutout.moveTo(cutoutX, cutoutY);
    cutout.lineTo(cutoutX + cutoutWidth, cutoutY);
    cutout.lineTo(cutoutX + cutoutWidth, cutoutY + cutoutHeight);
    cutout.lineTo(cutoutX, cutoutY + cutoutHeight);
    cutout.closePath();

    // Subtract the cutout from the main shape
    rectShape.holes.push(cutout);

    return rectShape;
  }, [width, height, cutoutWidth, cutoutHeight]);

  const geometry = React.useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.00055,
      bevelEnabled: false, // No beveled edges
    });
  }, [shape]);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <meshStandardMaterial color={ceiling_shadow.color} />
    </mesh>
  );
}

export default ShadowlineCeiling;