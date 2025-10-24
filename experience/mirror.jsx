import * as THREE from 'three';
import { useCustomisation } from '@/contexts/customisation';

let metal = "#F4F4F4"

function Mirror({width, depth, height}) {
  const {
          wall_shadow,
          wall_shadows,
          setWallShadow,} = useCustomisation(); 

  // const return_width = 0.17
    return (
        <group>
            <mesh > //P1
              <boxGeometry args={[width-0.4, height-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={1} roughness={0.15}/>
            </mesh>
        </group>
    )
}

export default Mirror;