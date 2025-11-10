import * as THREE from 'three';
import { useCustomisation } from '@/contexts/customisation';

// Border at the ceiling level should follow the ceiling shadowline colour from context

function BorderRoof({w, d, h}) {
  const { ceiling_shadow } = useCustomisation();
    return (
        
        <group position={[0,h/2+0.015,0]}>

          <mesh position={[0,0,0]}>
                <boxGeometry args={[w+0.06, 0.03, d]} />
        <meshStandardMaterial color={ceiling_shadow?.color || '#cccccc'} metalness={0.2} roughness={0.4}/>
          </mesh>
        </group>
    )
}

export default BorderRoof;