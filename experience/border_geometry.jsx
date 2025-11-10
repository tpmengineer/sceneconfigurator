import * as THREE from 'three';
import { useCustomisation } from '@/contexts/customisation';

// Border at the ceiling level should follow the ceiling shadowline colour from context

function BorderGeometry({w, d, h}) {
  let { ceiling_shadow, wall_shadow } = useCustomisation();
  // ceiling_shadow = {color: '#dddddd'};
    return (
        
        <group position={[0,h/2+0.015,0]}>

          <mesh position={[0,0.005,0]}>
            <boxGeometry args={[w+0.06, 0.04, d]} />
            <meshStandardMaterial color={ceiling_shadow?.color || '#cccccc'}/>
          </mesh>

          <mesh position={[w/2+0.015,-h/2-0.03,0]}>
            <boxGeometry args={[0.03, h+0.03, d]} />
            <meshStandardMaterial color={wall_shadow?.color || '#cccccc'}/>
          </mesh>

          <mesh position={[-w/2-0.015,-h/2-0.03,0]}>
            <boxGeometry args={[0.03, h+0.03, d]} />
            <meshStandardMaterial color={wall_shadow?.color || '#cccccc'}/>
          </mesh>

          <mesh position={[0,-h-0.03,0]}>
            <boxGeometry args={[w+0.06, 0.03, d]} />
            <meshStandardMaterial color={wall_shadow?.color || '#cccccc'}/>
          </mesh>



        </group>
    )
}

export default BorderGeometry;