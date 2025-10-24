import * as THREE from 'three';
let metal = "#F4F4F4"
function PhoenixSideRightFrame({w, d, h}) {
    return (
        
        <group position={[-(w/2+0.02/2),0,0]}>
            <mesh position={[0, 0, 0]}> //P1
              <boxGeometry args={[0.02, h-2*0.04, 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0, (d/2-0.04/2)]}> //P2.1
              <boxGeometry args={[0.02, h-2*0.04, 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0, -(d/2-0.04/2)]}> //P2.2
              <boxGeometry args={[0.02, h-2*0.04, 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0.06, ((d/2-0.04/2)/2)]}> //P3.1
              <boxGeometry args={[0.02, h/1.6, 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0.06, -((d/2-0.04/2)/2)]}> //P3.2
              <boxGeometry args={[0.02, h/1.6, 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/2-0.04/2), 0]}> //P4.1
              <boxGeometry args={[0.02, 0.04, d]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -(h/2-0.04/2), 0]}> //P4.2
              <boxGeometry args={[0.02, 0.04, d]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0, 1.5*((d/2-0.04/2)-(d/2-0.04/2)/2)]}> //P5.1
              <boxGeometry args={[0.02, 0.04, (d/2-0.04/2)-(d/2-0.04/2)/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, 0, -1.5*((d/2-0.04/2)-(d/2-0.04/2)/2)]}> //P5.2
              <boxGeometry args={[0.02, 0.04, (d/2-0.04/2)-(d/2-0.04/2)/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/1.6)/2+0.04/2+0.06, (d/2-0.04/2)/2]}> //P6.1
              <boxGeometry args={[0.02, 0.04, d/2-0.04/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, (h/1.6)/2+0.04/2+0.06, -(d/2-0.04/2)/2]}> //P6.2
              <boxGeometry args={[0.02, 0.04, d/2-0.04/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -((h/1.6)/2+0.04/2)+0.06, (d/2-0.04/2)/2]}> //P7.1
              <boxGeometry args={[0.02, 0.04, d/2-0.04/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -((h/1.6)/2+0.04/2)+0.06, -(d/2-0.04/2)/2]}> //P7.2
              <boxGeometry args={[0.02, 0.04, d/2-0.04/2-0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -h/2+0.04+((h/2-0.04/2)-(h/1.6/2))/2, d/6]}> //P8.1
              <boxGeometry args={[0.02, (h/2-0.04/2)-(h/1.6/2), 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -h/2+0.04+((h/2-0.04/2)-(h/1.6/2))/2, d/3]}> //P8.2
              <boxGeometry args={[0.02, (h/2-0.04/2)-(h/1.6/2), 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -h/2+0.04+((h/2-0.04/2)-(h/1.6/2))/2, -d/6]}> //P8.3
              <boxGeometry args={[0.02, (h/2-0.04/2)-(h/1.6/2), 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0, -h/2+0.04+((h/2-0.04/2)-(h/1.6/2))/2, -d/3]}> //P8.4
              <boxGeometry args={[0.02, (h/2-0.04/2)-(h/1.6/2), 0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

        </group>
    )
}

export default PhoenixSideRightFrame;