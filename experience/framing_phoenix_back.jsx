import * as THREE from 'three';
let metal = "#F4F4F4"
function PhoenixBackFrame({w, d, h}) {
    return (
        
        <group position={[0,0,-(d/2+0.02/2)]}>
            <mesh position={[0, 0, 0]}> //P1
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(w/2), 0, 0]}> //P2.1
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/2), 0, 0]}> //P2.1
              <boxGeometry args={[0.04, h-2*0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/2-0.04/2), 0]}> //P4.1
              <boxGeometry args={[w+2*0.02, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/2-0.04/2), 0]}> //P4.2
              <boxGeometry args={[w+2*0.02, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(w/4), 0, 0]}> //P5.1
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/4), 0, 0]}> //P5.2
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(w/4), (h/1.6)/2+0.04/2+0.06, 0]}> //P6.1
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/4), (h/1.6)/2+0.04/2+0.06, 0]}> //P6.2
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(w/4), -((h/1.6)/2+0.04/2)+0.06, 0]}> //P7.1
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/4), -((h/1.6)/2+0.04/2)+0.06, 0]}> //P7.2
              <boxGeometry args={[w/2-0.04, 0.04, 0.02]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>
        </group>
    )
}

export default PhoenixBackFrame;