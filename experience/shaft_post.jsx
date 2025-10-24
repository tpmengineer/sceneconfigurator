import * as THREE from 'three';
import HollowRHS from '@/experience/hollowRHS';
let metal = "#F4F4F4"
function ShaftPost({height}) {
    return (
        
      <group position={[0, height/2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <HollowRHS width={0.066} height={0.066} length={height} position={[0, 0, -height/2]} rotation={[0, 0, 0]}/>
        <mesh position={[0.066/2+0.01, 0.066/2-0.0015, 0]}> //P4.1
          <boxGeometry args={[0.02, 0.003, height]} />
          <meshStandardMaterial color={metal} />
        </mesh>
        <mesh position={[-0.066/2+0.0015,-0.066/2-0.01, 0]}> //P4.1
          <boxGeometry args={[0.003, 0.02, height]} />
          <meshStandardMaterial color={metal} />
        </mesh>
        <mesh position={[-0.066/2-0.01, 0.066/2-0.0015, 0]}> //P4.1
          <boxGeometry args={[0.02, 0.003, height-0.09]} />
          <meshStandardMaterial color={metal} />
        </mesh>
        <mesh position={[-0.066/2+0.0015,0.066/2+0.01, 0]}> //P4.1
          <boxGeometry args={[0.003, 0.02, height-0.09]} />
          <meshStandardMaterial color={metal} />
        </mesh>
      </group>
    )
}

export default ShaftPost;