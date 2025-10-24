import * as THREE from 'three';
import { useCustomisation } from '@/contexts/customisation';

let metal = "#F4F4F4"

function PhoenixReturnsFrame({w, d, h}) {
  const {
          wall_shadow,
          wall_shadows,
          setWallShadow,} = useCustomisation(); 

  const return_width = 0.1333 * w - 0.0167+0.02;
  // const return_width = 0.17
    return (
        <group>
        <group position={[w/2-return_width/2+0.02,0,(d/2+0.02/2)]}>
            <mesh position={[-return_width/2+0.04/2, 0, 0]}> //P1
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[return_width/2-0.04/2, 0, 0]}> //P2
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/2-0.04/2), 0]}> //P3.1
              <boxGeometry args={[return_width, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/2-0.04/2), 0]}> //P3.1
              <boxGeometry args={[return_width, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/4), 0]}> //P4.1
              <boxGeometry args={[return_width-0.04*2, 0.02, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/4), 0]}> //P4.2
              <boxGeometry args={[return_width-0.04*2, 0.02, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[-0.01, 0, -0.01]}> //P4.2
              <boxGeometry args={[return_width-0.02, h, 0.0055]} />
              <meshStandardMaterial color={wall_shadow.color} />
            </mesh>
        </group>

        <group position={[-(w/2-return_width/2+0.02),0,(d/2+0.02/2)]}>
            <mesh position={[-return_width/2+0.04/2, 0, 0]}> //P1
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[return_width/2-0.04/2, 0, 0]}> //P2
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/2-0.04/2), 0]}> //P3.1
              <boxGeometry args={[return_width, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/2-0.04/2), 0]}> //P3.1
              <boxGeometry args={[return_width, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/4), 0]}> //P4.1
              <boxGeometry args={[return_width-0.04*2, 0.02, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/4), 0]}> //P4.2
              <boxGeometry args={[return_width-0.04*2, 0.02, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0} roughness={0.4}/>
            </mesh>

            <mesh position={[0.01, 0, -0.01]}> //P4.2
              <boxGeometry args={[return_width-0.02, h, 0.0055]} />
              <meshStandardMaterial color={wall_shadow.color} />
            </mesh>

            {/* <mesh position={[-0.01, 0, 0]}> //P4.2
              <boxGeometry args={[return_width-0.01, h, 0.02]} />
              <meshStandardMaterial color={wall_shadow.color} />
            </mesh> */}
        </group>
        </group>
    )
}

export default PhoenixReturnsFrame;