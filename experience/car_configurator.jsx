import { PresentationControls, Stage, Float } from "@react-three/drei";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';

import { useCustomisation } from "@/contexts/customisation";
import { useGLTF, useTexture} from '@react-three/drei'
import { Environment, Lightformer } from '@react-three/drei'
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
import ShadowlineCeiling from "@/experience/shadowline_ceiling"
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
import { useEffect, useRef, useState } from "react";


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

      <group position={[0, 0, -0.1]}>
        <mesh position={[0,-height/2,depth/2*1.2]} rotation={[0, -Math.PI/2,0]} scale={0.98}><COP/></mesh>
        <mesh position={[width/2-0.02,-height/2+0.9,0]}><Handrail/></mesh>
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
        <ShadowlineCeiling width={width} height={depth} cutoutWidth={width-0.15} cutoutHeight={depth-0.15} position={[0, height/2, 0]} rotation={[Math.PI/2, 0, 0]}/>
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

    <group ref={doorRef} position={[0,ground+0.1,shaft_depth/2-0.15]}>
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
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const [isDefaultView, setIsDefaultView] = useState(true);
  // Rotation for PresentationControls (Euler [x, y, z])
  const [pcRotation, setPcRotation] = useState([0, 0, 0]);
  // Canvas readiness for event listeners
  const [canvasReady, setCanvasReady] = useState(false);
  // Debug toggle to visualize environment content and reflections
  const [envDebug, setEnvDebug] = useState(false);
  // Utility: clamp a value to a min/max range
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Initialize envDebug from query string (?env=1 or ?envDebug=true)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const qs = new URLSearchParams(window.location.search);
    const val = qs.get('env') ?? qs.get('envdebug') ?? qs.get('debugenv');
    if (val) {
      const on = val === '1' || val?.toLowerCase?.() === 'true' || val?.toLowerCase?.() === 'on';
      setEnvDebug(on);
    }
  }, []);

  const {
    view_booleans,
    showCarOnly,
    wallLighting,
    travel,
    setShowCarOnly,
    setDoorModel,
    setShowDoor,
    activeView,
    setActiveView,

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
        onUpdate: () => {
          cameraRef.current.lookAt(targetRef.current);
        }
      });
    }
  }, [showCarOnly, travel]);

  // Scene navigation events: zoom in/out/reset handled via DOM CustomEvents
  useEffect(() => {
    const defaultCam = { x: 0, y: 0.5, z: 5 };
    const defaultTarget = { x: 0, y: 0, z: 0 };
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onZoomIn = () => {
      if (!cameraRef.current) return;
      const z = clamp(cameraRef.current.position.z - 0.5, 2.5, 12);
      gsap.to(cameraRef.current.position, { z, duration: 0.3, ease: "power2.out", onUpdate: () => cameraRef.current.lookAt(targetRef.current) });
    };
    const onZoomOut = () => {
      if (!cameraRef.current) return;
      const z = clamp(cameraRef.current.position.z + 0.5, 2.5, 12);
      gsap.to(cameraRef.current.position, { z, duration: 0.3, ease: "power2.out", onUpdate: () => cameraRef.current.lookAt(targetRef.current) });
    };
    const onReset = () => {
      if (!cameraRef.current) return;
      gsap.to(cameraRef.current.position, { ...defaultCam, duration: 0.6, ease: "power2.inOut", onUpdate: () => cameraRef.current.lookAt(targetRef.current) });
      gsap.to(targetRef.current, { ...defaultTarget, duration: 0.6, ease: "power2.inOut", onUpdate: () => cameraRef.current && cameraRef.current.lookAt(targetRef.current) });
      // Re-enable interactive range when resetting to default
      setIsDefaultView(true);
      setActiveView && setActiveView("default");
      // Reset PresentationControls rotation to default orientation
      setPcRotation([0, 0, 0]);
    };

    // New: preset camera views (position + focus target)
    const onSetView = (e) => {
      const name = (e && e.detail) || "default";
      // Map preset names to PresentationControls rotation (Euler [x, y, z])
      // Keep within your existing polar/azimuth limits: polar [-15°, +30°], azimuth [-30°, +30°]
      const rotations = {
        default:  [0.0,  0.0, 0.0],            // centered
        walls:    [0.12, -0.22, 0.0],          // slight pitch up, azimuth right
        ceiling:  [-0.25,  0.0,  0.0],          // look a bit more from above
        door:     [0.15,  0.0,  0.0],          // slight pitch towards front
        floor:    [-0.12, 0.08, 0.0],          // slight pitch down, small azimuth
        // swapped: make COP use former handrail view, and handrail use former COP view
        cop:      [0.18, -0.28, 0.0],          // yaw right to bring COP into view
        handrail: [0.10,  0.28, 0.0],          // yaw left to bring handrail into view
      };
      // Also set camera's z position (same variable modified by zoom in/out)
      const zByView = {
        default: 5.0,
        walls:   5.0,
        ceiling: 4.2,
        door:    3.2,
        floor:   3.0,
        // distances are the same, so no change needed; listed for clarity
        cop:     3.2,
        handrail:3.2,
      };
      const rot = rotations[name] || rotations.default;
      // Lock/unlock controls depending on view
      const isDef = name === "default";
      setIsDefaultView(isDef);
      setActiveView && setActiveView(name);
      // If a focus view (non-default) is selected, hide the car door
      if (!isDef) {
        setShowDoor && setShowDoor(false);
      }
      // Update PresentationControls rotation (spring will interpolate)
      setPcRotation(rot);
      // Animate camera z to preset value using same clamped range as zoom in/out
      if (cameraRef.current) {
        const zTarget = clamp(zByView[name] ?? zByView.default, 2.5, 12);
        gsap.to(cameraRef.current.position, {
          z: zTarget,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => cameraRef.current && cameraRef.current.lookAt(targetRef.current),
        });
      }
    };

    window.addEventListener("scene-zoom-in", onZoomIn);
    window.addEventListener("scene-zoom-out", onZoomOut);
    window.addEventListener("scene-reset", onReset);
    window.addEventListener("scene-set-view", onSetView);

    return () => {
      window.removeEventListener("scene-zoom-in", onZoomIn);
      window.removeEventListener("scene-zoom-out", onZoomOut);
      window.removeEventListener("scene-reset", onReset);
      window.removeEventListener("scene-set-view", onSetView);
    };
  }, []);

  // Wall light is controlled by the wallLighting toggle; main light is always on

  // Interactive ranges for PresentationControls
  const polarRange = [-Math.PI / 12, Math.PI / 6] ;
  // const polarRange = isDefaultView ? [-Math.PI / 12, Math.PI / 6] : [0, 0];

  const azimuthRange = [-Math.PI / 6, Math.PI / 6] ;
  // const azimuthRange = isDefaultView ? [-Math.PI / 6, Math.PI / 6] : [0, 0];

  const snapEnabled = !isDefaultView; // enable spring snapping to 0 in locked views
  const springConfig = { mass: 1, tension: 100, friction: 26 };

  // Detect user rotation attempts at the canvas level (not via PresentationControls)
  const canvasElRef = useRef(null);
  useEffect(() => {
    if (!canvasReady) return;
    const el = canvasElRef.current;
    if (!el) return;
    let dragging = false;
    let unlockedThisDrag = false;
    let startX = 0, startY = 0;
    const threshold = 4; // pixels

    const onPointerDown = (e) => {
      dragging = true;
      unlockedThisDrag = false;
      startX = e.clientX;
      startY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!dragging || unlockedThisDrag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > threshold) {
        // Consider this a rotate attempt; if in focus view, unlock it
        if (!isDefaultView) {
          setIsDefaultView(true);
          setActiveView && setActiveView("default");
        }
        unlockedThisDrag = true;
      }
    };
    const onPointerUp = () => {
      dragging = false;
      unlockedThisDrag = false;
    };

    // Wheel zoom handler (same z logic as zoom in/out buttons)
    const onWheel = (e) => {
      if (!cameraRef.current) return;
      // prevent page scroll while zooming the 3D view
      e.preventDefault();
      const step = 0.5;
      const dir = Math.sign(e.deltaY) || 0; // >0 scroll down -> zoom out
      if (dir === 0) return;
      const targetZ = clamp(cameraRef.current.position.z + dir * step, 2.5, 12);
      gsap.to(cameraRef.current.position, {
        z: targetZ,
        duration: 0.2,
        ease: "power2.out",
        onUpdate: () => cameraRef.current && cameraRef.current.lookAt(targetRef.current),
      });
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [isDefaultView, canvasReady]);

  // Keyboard: press "E" to toggle environment debug helpers
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key || '').toLowerCase() === 'e') setEnvDebug((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Canvas
        
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 8], fov: 50 }}
        gl={{ antialias: true }}
        onCreated={({ camera, gl }) => {
          cameraRef.current = camera;
          canvasElRef.current = gl.domElement;

          setCanvasReady(true);
        }}
      >
        {/* Custom reflective environment: soft emissive planes + textured cards for richer metal reflections */}
        {/* <Environment background={false} resolution={192}>
          <Lightformer form="rect" intensity={0.20} color="#eaeaea" position={[0, 0, 10]} scale={[12, 8]} />
          <Lightformer form="rect" intensity={0.12} color="#ffffff" position={[6, 1.5, 0]} rotation={[0, Math.PI / 2.5, 0]} scale={[6, 6]} />

        </Environment> */}
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={2} luminanceSmoothing={0.2} />
        </EffectComposer>
        <ambientLight intensity={1} />
        <pointLight position={[2, 5, 5]} intensity={0.5} color="#ffffff" distance={10} decay={0} />

        {/* Wall Light (conditional) */}
        {wallLighting && (
          <pointLight position={[0, -1, 0]} intensity={0.71} color="#ffffff" distance={2} decay={0} />
        )}
        
        {/* Main Light */}
        <pointLight position={[0, 0.5, 0.1]} intensity={7.5} color="#898989" distance={1.8} decay={0} />
        
        {/* <OrbitControls enableZoom={true} />
        <Model/> */}
        
        <PresentationControls
          speed={1.5}
          global
          zoom={1.1}
          rotation={pcRotation}
          polar={polarRange}
          azimuth={azimuthRange}
          snap={snapEnabled}
          config={springConfig}
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
