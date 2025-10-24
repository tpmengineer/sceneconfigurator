import * as THREE from 'three';
import HollowRHS from '@/experience/hollowRHS';
let metal = "#F4F4F4"
function Ring({width, depth}) {
    return (
        
      <group position={[0, 0, 0]}> //P4.1
                <HollowRHS width={0.04} height={0.04} length={depth} position={[width/2, 0, -depth/2]} rotation={[0, 0, 0]}/>
                <HollowRHS width={0.04} height={0.04} length={depth} position={[-width/2, 0, -depth/2]} rotation={[0, 0, 0]}/>
                
                <mesh position={[0, 0, depth/2-0.02]}> //P4.1
                  <boxGeometry args={[width-0.04, 0.04, 0.04]} />
                  <meshStandardMaterial color={metal} />
                </mesh>
      
                <mesh position={[0, 0, -depth/2+0.02]}> //P4.1
                  <boxGeometry args={[width-0.04, 0.04, 0.04]} />
                  <meshStandardMaterial color={metal} />
                </mesh>
            </group>
    )
}

export default Ring;