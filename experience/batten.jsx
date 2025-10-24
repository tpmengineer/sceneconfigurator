import * as THREE from 'three';
import React from 'react';

function Batten({ width, depth, length, position, rotation }) {
  let metal = '#f4f4f4'
  const shape = React.useMemo(() => {
    const rectShape = new THREE.Shape();
    
    // Define outer rectangle
    rectShape.moveTo(-width / 2+0.04, depth / 2);
    rectShape.lineTo(width / 2-0.04, depth / 2);
    rectShape.lineTo(width / 2, -depth / 2);
    rectShape.lineTo(-width / 2, -depth / 2);
    rectShape.closePath();
    

    return rectShape;
  }, [width, depth]);

  const geometry = React.useMemo(() => {
    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: false,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [shape, length, depth]);

  return (
      <mesh geometry={geometry}>
        <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
      </mesh>
  );
}

export default Batten;