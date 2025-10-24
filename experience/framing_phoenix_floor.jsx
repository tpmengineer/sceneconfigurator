import * as THREE from 'three';
let metal = "#F4F4F4"
function PhoenixFloorFrame({w, d, h}) {
    return (
        
        <group position={[0,-0.003,0]}>
            <mesh position={[0, -h/2+0.0015, 0]}> //P4.1
              <boxGeometry args={[w+0.04, 0.003, d+0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>
            <mesh position={[0, -(h/2+0.032/2), d/2+0.04/2-0.032/2]}> //P4.1
              <boxGeometry args={[w+2*0.02, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/2+0.032/2), -(d/2+0.04/2-0.032/2)]}> //P4.1
              <boxGeometry args={[w+2*0.02, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[w/2+0.004, -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/2+0.004), -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(w/6), -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(w/6), -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>
            <mesh position={[-(2*w/6), -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(2*w/6), -(h/2+0.032/2), 0]}> //P4.1
              <boxGeometry args={[0.032, 0.032, d-0.024]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(2*w/6), -(h/2+0.032/2), d/6]}> //P4.1
              <boxGeometry args={[2*w/6, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[(2*w/6), -(h/2+0.032/2), -d/6]}> //P4.1
              <boxGeometry args={[2*w/6, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(2*w/6), -(h/2+0.032/2), d/6]}> //P4.1
              <boxGeometry args={[2*w/6, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[-(2*w/6), -(h/2+0.032/2), -d/6]}> //P4.1
              <boxGeometry args={[2*w/6, 0.032, 0.032]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>


        </group>
    )
}

export default PhoenixFloorFrame;