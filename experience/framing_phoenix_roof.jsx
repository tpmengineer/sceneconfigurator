import * as THREE from 'three';
let metal = "#F4F4F4"
function PhoenixRoofFrame({w, d, h}) {
    return (
        
        <group position={[0,h/2,0]}>
            {/* <mesh position={[0,0.0015, 0]}>
              <boxGeometry args={[w+0.04, 0.003, d+0.04]} />
              <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh> */}
            <group position={[w/2-0.0115,0.0315,0]} rotation={[0,Math.PI/2,0]}>
              <mesh position={[0,0,0]}>
                <boxGeometry args={[d+0.04, 0.063, 0.063]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0, 0.066/2,-0.0085]}>
                <boxGeometry args={[d+0.04, 0.003, 0.086]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0,-0.0115,0.066/2]}>
                <boxGeometry args={[d+0.04, 0.086, 0.003]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
            </group>

            <group position={[-w/2+0.0115,0.0315,0]} rotation={[0,-Math.PI/2,0]}>
              <mesh position={[0,0,0]}>
                <boxGeometry args={[d+0.04, 0.063, 0.063]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0, 0.066/2,-0.0085]}>
                <boxGeometry args={[d+0.04, 0.003, 0.086]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0,-0.0115,0.066/2]}>
                <boxGeometry args={[d+0.04, 0.086, 0.003]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
            </group>

            <group position={[0,0.0315,d/2]} rotation={[0,0,0]}>
              <mesh position={[0,0,-0.0115]}>
                <boxGeometry args={[w-0.086, 0.063, 0.063]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0, 0.066/2,-0.023]}>
                <boxGeometry args={[w-0.086, 0.003, 0.086]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0,0.0115,0.0215]}>
                <boxGeometry args={[w+0.046, 0.086, 0.003]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
            </group>

            <group position={[0,0.0315,-d/2]} rotation={[0,Math.PI,0]}>
              <mesh position={[0,0,-0.0115]}>
                <boxGeometry args={[w-0.086, 0.063, 0.063]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0, 0.066/2,-0.023]}>
                <boxGeometry args={[w-0.086, 0.003, 0.086]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
              <mesh position={[0,-0.0115+0.0015,0.0215]}>
                <boxGeometry args={[w+0.046, 0.089, 0.003]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
              </mesh>
            </group>

            <mesh position={[0,0.01,0]}>
                <boxGeometry args={[0.04, 0.02, d-0.086]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0,0.01,d/3]}>
                <boxGeometry args={[w-0.086, 0.02, 0.02]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>
            <mesh position={[0,0.01,-d/3]}>
                <boxGeometry args={[w-0.086, 0.02, 0.02]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            <mesh position={[0,0.036,-d/8]}>
                <boxGeometry args={[w-0.086, 0.032, 0.032]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>
            <mesh position={[0,0.036,d/8]}>
                <boxGeometry args={[w-0.086, 0.032, 0.032]} />
                <meshStandardMaterial color={metal} metalness={0.2} roughness={0.4}/>
            </mesh>

            {/* <mesh position={[0,0.076,0-0.0015]}>
                <boxGeometry args={[w+0.046, 0.020, d+0.046-0.003]} />
                <meshStandardMaterial color={'#964B00'} />
            </mesh> */}



        </group>
    )
}

export default PhoenixRoofFrame;