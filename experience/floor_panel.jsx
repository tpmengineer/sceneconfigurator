import * as THREE from 'three';
import { useCustomisation } from "@/contexts/customisation";
import { useTexture} from '@react-three/drei'


function FloorPanel({w, d, h}) {
    const {
        floor_material,
        floor_materials,
        setFloorMaterial,
    } = useCustomisation();

const materials = ['natural_springfield', 'natural_lord', 'rustic_walnut', 'grey_carpet', 'urban_blacktech'];

const generateMaterialProps = (materialList) => {
  const textures = {};
  
  materialList.forEach((material) => {
    textures[material] = useTexture({
      map: `/materials/floor/${material}.png`,
    });

    const textureProps = textures[material];
    
    // textureProps.map.repeat.set(1, 1);
    {material === 'grey_carpet' ? textureProps.map.repeat.set(5, 2) : textureProps.map.repeat.set(1, 1)}
    textureProps.map.wrapS = textureProps.map.wrapT = THREE.MirroredRepeatWrapping;
    textureProps.map.minFilter = THREE.NearestFilter;
    textureProps.map.magFilter = THREE.NearestFilter;
    textureProps.map.needsUpdate = true;
  });

  return textures;
};

const materialProps = generateMaterialProps(materials);

    // const natural_springfieldProps = useTexture({
    //     map: '/materials/natural_springfield.png',
    //   })

    //   natural_springfieldProps.map.repeat.set(1, 1);
    //   natural_springfieldProps.map.wrapS = natural_springfieldProps.map.wrapT = THREE.MirroredRepeatWrapping;
    //   natural_springfieldProps.map.minFilter = THREE.NearestFilter;
    //   natural_springfieldProps.map.magFilter = THREE.NearestFilter;
    //   natural_springfieldProps.map.needsUpdate = true;

      

    // woodProps.map.repeat.set(1, 1);
    //   woodProps.normalMap.repeat.set(1, 1);
    //   woodProps.roughnessMap.repeat.set(1, 1);
    //   woodProps.aoMap.repeat.set(1, 1);
    //   woodProps.map.wrapS = woodProps.map.wrapT =
    //     THREE.MirroredRepeatWrapping;
    //   woodProps.normalMap.wrapS = woodProps.normalMap.wrapT =
    //     THREE.MirroredRepeatWrapping;
    //   woodProps.roughnessMap.wrapS =
    //     woodProps.roughnessMap.wrapT = THREE.MirroredRepeatWrapping;
    //   woodProps.aoMap.wrapS = woodProps.aoMap.wrapT =
    //     THREE.RepeatWrapping;

    return (
        
      <mesh position={[0, -h / 2 + 0.001, 0]}>
      <boxGeometry args={[w, 0.002, d]} />
      {materialProps[floor_material.texture] ? (
        <meshStandardMaterial {...materialProps[floor_material.texture]} />
      ) : (
        <meshStandardMaterial color={floor_material.color} />
      )}
    </mesh>
      )
  }

export default FloorPanel;