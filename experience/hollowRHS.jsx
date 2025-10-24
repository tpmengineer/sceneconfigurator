import * as THREE from 'three';
import React from 'react';

function HollowRHS({ width, height, length, position, rotation }) {

  const shape = React.useMemo(() => {
    const rectShape = new THREE.Shape();
    let cutoutWidth = width-0.006
    let cutoutHeight = height-0.006
    
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
  }, [width, height, length]);

  const geometry = React.useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: false, // No beveled edges
    });
  }, [shape]);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <meshStandardMaterial color={'#f4f4f4'} metalness={0.2} roughness={0.4}/>
    </mesh>
  );
}

export default HollowRHS;