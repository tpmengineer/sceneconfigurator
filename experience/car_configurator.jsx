import { PresentationControls, Stage, Float } from "@react-three/drei";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

import { useCustomisation } from "@/contexts/customisation";
import { useGLTF, useTexture} from '@react-three/drei'
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import PhoenixSideRightFrame from '@/experience/framing_phoenix_side_right'
import PhoenixSideLeftFrame from '@/experience/framing_phoenix_side_left'
import PhoenixBackFrame from "@/experience/framing_phoenix_back";
import PhoenixReturnsFrame from "@/experience/framing_phoenix_return";
import PhoenixFloorFrame from "@/experience/framing_phoenix_floor";
import PhoenixRoofFrame from "@/experience/framing_phoenix_roof"

import LaminexPanel from "@/experience/laminex"
import LaminexPanelCeiling from "@/experience/laminex_ceiling";
import Shadowline from "@/experience/shadowline"
import FloorPanel from "@/experience/floor_panel"

import HollowRHS from "@/experience/hollowRHS"
import ShaftPost from "@/experience/shaft_post"
import Ring from "@/experience/ring";
import Batten from "@/experience/batten";

import PhoenixDoor from "@/experience/phoenix_door"
import Fermator from "@/experience/orion_door"
import COP from "@/experience/cop"
import Handrail from "@/experience/handrail"

import Mirror from "@/experience/mirror"

import SceneWall from "@/experience/wall_sample"

import gsap from "gsap";
import { useEffect, useRef } from "react";

function Model(props) {

  const {
    view_booleans,
      showCarOnly,
      wallLighting,
      hideReturns,
      isDualEntry,
      door_model,
      showDoor,
      width,
      depth,
      travel,
    } = useCustomisation(); 

  const shaftRef = useRef();
  const doorRef = useRef();

  // GSAP animation effect
  useEffect(() => {
    if (showCarOnly && shaftRef.current) {
      gsap.to(shaftRef.current.position, {
        y: 50,
        duration: 2,
        ease: "power2.inOut",
      });
    } else if (!showCarOnly && shaftRef.current) {
      gsap.to(shaftRef.current.position, {
        y: 0,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  }, [showCarOnly]);

  // Toggle entire door group's visibility (no material transparency changes)
  useEffect(() => {
    if (!doorRef.current) return;
    doorRef.current.visible = !!showDoor;
  }, [showDoor]);

  

  let height = 2.1
  let ground = -height/2-0.1
  let shaft_width = width + 0.5
  let shaft_depth = depth + 0.5
  let shaft_height = travel+2.350+ground+0.1


  // Generate batten positions every 0.6 units up to travel
  const lateralBattenPositions = [];
  const longitudinalBattenPositions = [];
  const frontInfillBattenPositions = [];
  const rearInfillBattenPositions = [];

  let yPos = 0.6; // First batten position
  let yPosInfill = 0.4;

  // Define multiple restricted ranges as an array of [min, max] values
  let frontRestrictedRanges = [];
  {!isDualEntry && (
    frontRestrictedRanges = [
    [0.1, 2.2],   // First restricted range
    [travel+0.1, travel+0.1+2.2],   // Second restricted range
  ])}
  {isDualEntry && (
    frontRestrictedRanges = [
    [0.1, 2.2],   // First restricted range
  ])}

  const rearRestrictedRanges = [
  // First restricted range
    [travel+0.1, travel+0.1+2.2],   // Second restricted range
  ];

  // Function to check if yPos falls in any restricted range
  const isRestrictedFront = (y) => {
    return frontRestrictedRanges.some(([min, max]) => y >= min && y <= max);
  };
  const isRestrictedRear = (y) => {
    return rearRestrictedRanges.some(([min, max]) => y >= min && y <= max);
  };


  // Generate batten positions, skipping restricted ranges
  while (yPos <= shaft_height-ground-0.1) {
    
    longitudinalBattenPositions.push(yPos);
    lateralBattenPositions.push(yPos);
    yPos += 0.6;
    
  }

  while (yPosInfill <= shaft_height-ground-0.1) {
    
    if (!isRestrictedFront(yPosInfill)) {
      frontInfillBattenPositions.push(yPosInfill);
    }
    if (!isRestrictedRear(yPosInfill)) {
      rearInfillBattenPositions.push(yPosInfill);
    }
    yPosInfill += 0.4;
    
  }
  
  
  return (
    <group {...props} dispose={null}>

      <mesh position={[0, -height/2, depth/2*1.1]} rotation={[0, -Math.PI/2, 0]}>
        <SceneWall/>
      </mesh>

      <group position={[0, 0, -0.03]}>
        <mesh position={[width/2-0.016,0.5,depth/2-0.4]}><COP/></mesh>
        <mesh position={[-width/2+0.02,-height/2+0.9,0]}><Handrail/></mesh>
        <PhoenixSideLeftFrame w={width} d={depth} h={height}/>
        <PhoenixSideRightFrame w={width} d={depth} h={height}/>
        
        {!hideReturns && (<PhoenixReturnsFrame w={width} d={depth} h={height}/>)}
        <PhoenixFloorFrame w={width} d={depth} h={height}/>
        <PhoenixRoofFrame w={width} d={depth} h={height}/>
        <FloorPanel w={width} d={depth} h={height}/>
        {!isDualEntry && (<LaminexPanel width={width} height={height-0.05} position={[0, 0, -depth/2+0.00055]} rotation={[0, 0, 0]}/>)}
        {!isDualEntry && (<PhoenixBackFrame w={width} d={depth} h={height}/>)}
        {!isDualEntry && (<Shadowline width={width} height={height} cutoutWidth={width-0.15} cutoutHeight={height-0.15} position={[0, 0, -depth/2]} rotation={[0, 0, 0]}/>)}
        {isDualEntry && (<mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          {!hideReturns && (<PhoenixReturnsFrame w={width} d={depth} h={height}/>)}
        </mesh>)}
        <LaminexPanel width={depth} height={height-0.05} position={[width/2-0.00055, 0, 0]} rotation={[0, -Math.PI/2, 0]} lighting={wallLighting}/>
        <LaminexPanel width={depth} height={height-0.05} position={[-width/2+0.00055, 0, 0]} rotation={[0, Math.PI/2, 0]} lighting={wallLighting}/>
        {/* Ceiling panel */}
        <LaminexPanelCeiling width={width} height={depth-0.05} position={[0, height/2-0.00055, 0]} rotation={[Math.PI/2, 0, 0]} lighting={true}/>
        {/* <mesh  position={[0, 0, -depth/2+0.02]}>
        <Mirror width={depth} height={height}/>
          </mesh> */}
        
        <Shadowline width={depth} height={height} cutoutWidth={depth-0.15} cutoutHeight={height-0.15} position={[-width/2, 0, 0]} rotation={[0, Math.PI/2, 0]}/>
        <Shadowline width={depth} height={height} cutoutWidth={depth-0.15} cutoutHeight={height-0.15} position={[width/2, 0, 0]} rotation={[0, -Math.PI/2, 0]}/>
        <Shadowline width={width} height={depth} cutoutWidth={width-0.15} cutoutHeight={depth-0.15} position={[0, height/2, 0]} rotation={[Math.PI/2, 0, 0]}/>
      </group>

      <group ref={shaftRef} position={[0,0,0]}> //shaft
        {/* <group position={[0, ground, 0]}>
          <Ring width={shaft_width} depth={shaft_depth} />
        </group>
        <group position={[0, shaft_height-0.02, 0]}>
          <Ring width={shaft_width} depth={shaft_depth} />
        </group>
        <group position={[-shaft_width/2+0.053, ground, shaft_depth/2-0.073]} rotation={[0,0,0]}>
          <ShaftPost height={shaft_height-ground} />
        </group>
        <group position={[shaft_width/2-0.053, ground, shaft_depth/2-0.073]} rotation={[0,Math.PI/2,0]}>
          <ShaftPost height={shaft_height-ground} />
        </group>
        <group position={[shaft_width/2-0.053, ground, -shaft_depth/2+0.073]} rotation={[0,2*Math.PI/2,0]}>
          <ShaftPost height={shaft_height-ground} />
        </group>
        <group position={[-shaft_width/2+0.053, ground, -shaft_depth/2+0.073]} rotation={[0,3*Math.PI/2,0]}>
          <ShaftPost height={shaft_height-ground} />
        </group>

        {frontInfillBattenPositions.map((y, index) => (
          <group position={[0, ground, 0]} key={index}>
            <group position={[0, y, shaft_depth / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
            </group>
          </group>
        ))}
        {rearInfillBattenPositions.map((y, index) => (
          <group position={[0, ground, 0]} key={index}>
              {isDualEntry && (
                <group position={[0, y, -shaft_depth / 2 + 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
              </group>)}
          </group>
        ))}

        {longitudinalBattenPositions.map((y, index) => (
          <group position={[0, ground, 0]}>
            <group key={index} position={[-shaft_width/2, y, 0]} rotation={[Math.PI / 2, 0, Math.PI/2]}>
              <Batten width={shaft_depth - 0.1} depth={0.04} length={0.04} />
            </group>
            <group key={index} position={[shaft_width/2, y, 0]} rotation={[Math.PI / 2, 0, -Math.PI/2]}>
              <Batten width={shaft_depth - 0.1} depth={0.04} length={0.04} />
            </group>
            {!isDualEntry && (
              <group position={[0, y-0.04, -shaft_depth / 2 + 0.02]} rotation={[-Math.PI / 2, 0, 0]}> 
                <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
              </group>
            )}
          </group>
        ))} */}

        

        //1st floor doors
        {/* {!isDualEntry && (
          <group position={[0,ground+0.1+travel,shaft_depth/2]}>
          {(door_model === "slide" ? <Fermator/> : <PhoenixDoor/>)}
          <mesh position={[0, -0.008, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh>
          <mesh position={[0, -0.008+2.185, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh>
        </group>)} */}

        {/* {isDualEntry && (
          <group position={[0,ground+0.1+travel,-shaft_depth/2]} rotation={[0,Math.PI,0]}>
          {(door_model === "slide" ? <Fermator/> : <PhoenixDoor/>)}
          <mesh position={[0, -0.008, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh>
          <mesh position={[0, -0.008+2.185, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh>
        </group>)} */}

      </group>

    <group ref={doorRef} position={[0,ground+0.1,shaft_depth/2-0.2]}>
          {(door_model === "slide" ? <Fermator/> : <PhoenixDoor/>)}
          {/* <mesh position={[0, -0.008, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh>
          <mesh position={[0, -0.008+2.185, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <Batten width={shaft_width - 0.075} depth={0.04} length={0.04} />
          </mesh> */}
        </group>
    
    </group>
  );
}



const AdvancedConfigurator = () => {
  const cameraRef = useRef();

  const {
    view_booleans,
    showCarOnly,
    wallLighting,
    travel,
    setShowCarOnly,
    setDoorModel,

  } = useCustomisation(); 

  // let wallLighting = view_booleans[3].value
  // let showCarOnly = view_booleans[0].value

  // Leva controls for showCarOnly
  // const { showCarOnly, wallLighting } = useControls({
  //   showCarOnly: { value: false, label: "Show Car Only" },
  //   wallLighting: { value: true, label: "LED Wall lighting" },
  // });

  useEffect(() => {
    setDoorModel[1];
    setDoorModel[0];
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    if (cameraRef.current) {
      setShowCarOnly(true);
      clearInterval(interval); // Stop checking once it's available
    }
  }, 100); // Check every 100ms

  return () => clearInterval(interval); // Cleanup on unmount
}, []);

  // Camera animation effect
  // useEffect(() => {
  //   if (cameraRef.current) {
  //     gsap.to(cameraRef.current.position, {
  //       x: showCarOnly ? 0 : 0,
  //       y: showCarOnly ? -1 : 0.7+travel/3, // Move camera higher to focus on car
  //       z: showCarOnly ? 3 : 7+travel/4, // Move camera closer
  //       duration: 1.5,
  //       ease: "power2.inOut",
  //     });
  //   }
  // }, [showCarOnly, travel]);
  useEffect(() => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 0.5, // Move camera higher to focus on car
        z: 5, // Move camera closer
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  }, [showCarOnly, travel]);

  // Scene navigation events: zoom in/out/reset handled via DOM CustomEvents
  useEffect(() => {
    const defaultCam = { x: 0, y: 0.3, z: 5 };
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onZoomIn = () => {
      if (!cameraRef.current) return;
      const z = clamp(cameraRef.current.position.z - 0.5, 2.5, 12);
      gsap.to(cameraRef.current.position, { z, duration: 0.3, ease: "power2.out" });
    };
    const onZoomOut = () => {
      if (!cameraRef.current) return;
      const z = clamp(cameraRef.current.position.z + 0.5, 2.5, 12);
      gsap.to(cameraRef.current.position, { z, duration: 0.3, ease: "power2.out" });
    };
    const onReset = () => {
      if (!cameraRef.current) return;
      gsap.to(cameraRef.current.position, { ...defaultCam, duration: 0.6, ease: "power2.inOut" });
    };

    window.addEventListener("scene-zoom-in", onZoomIn);
    window.addEventListener("scene-zoom-out", onZoomOut);
    window.addEventListener("scene-reset", onReset);

    return () => {
      window.removeEventListener("scene-zoom-in", onZoomIn);
      window.removeEventListener("scene-zoom-out", onZoomOut);
      window.removeEventListener("scene-reset", onReset);
    };
  }, []);

  let lightingIntensity = 0.5
  { wallLighting && (lightingIntensity = 0.71) }

  return (
    <>
      <Canvas
        
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 8], fov: 50 }}
        gl={{antialias: true}}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={2} luminanceSmoothing={0.2} />
        </EffectComposer>
        <ambientLight intensity={1} />
        <pointLight position={[2, 5, 5]} intensity={1} color="#ffffff" distance={10} decay={0} />
        {/* <pointLight position={[2, 5, 100]} intensity={0.5} color="#ffffff" distance={1000} decay={0} /> */}
        {/* <hemisphereLight intensity={0.7} /> */}
        {/* <directionalLight position={[5, 5, 5]}/> */}
        {/* <pointLight position={[0, -1, 0]} intensity={lightingIntensity} color="#ffffff" distance={2} decay={0} /> */}
        {/* <directionalLight
          ref={(light) => light && light.target.position.set(0, 1, 0)}
          position={[0, -1, 0]}
          intensity={lightingIntensity}
          color="#DBE9F4"
        /> */}

        {/* <directionalLight
          ref={(light) => light && light.target.position.set(0, 0, -1)}
          position={[0, 5, 5]}
          intensity={2}
          color="#DBE9F4"
        /> */}
        <pointLight position={[0, 0.5, 0.1]} intensity={7.5} color="#898989" distance={1.8} decay={0} />
        
        {/* <OrbitControls enableZoom={true} />
        <Model/> */}
        
        <PresentationControls
          speed={1.5}
          global
          zoom={1.1}
          polar={[-Math.PI / 12, Math.PI / 6]}
          azimuth={[-Math.PI / 6, Math.PI / 6]}
        >
          {/* <Stage adjustCamera={false} shadows={false}>
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.1} floatingRange={[-0.05, 0.05]}>
              <Model />
            </Float>
          </Stage> */}
          <Model />
        </PresentationControls>
      </Canvas>
    </>
  );
};

export default AdvancedConfigurator;
