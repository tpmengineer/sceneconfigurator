import { useCustomisation } from "../../contexts/customisation";
import Slider from '@/app/ui/slider'
import Slider2D from '@/app/ui/SliderAdvanced'

import ToggleButton from '@/app/ui/toggle_button'
import ToggleSwitch from "@/app/ui/toggle";

const ConfiguratorLeft = () => {

    const {
      floor_material,
      floor_materials,
      setFloorMaterial,

      ceiling_material,
      ceiling_materials,
      setCeilingMaterial,

      ceiling_shadow,
      ceiling_shadows,
      setCeilingShadow,

      wall_material,
      wall_materials,
      setWallMaterial,

      wall_shadow,
      wall_shadows,
      setWallShadow,

      light_color,
      setLightColor,

      handrail_model,
      setHandrailModel,

      handrail_colours,
      setHandrailColour,

      view_booleans,
      showCarOnly,
      setShowCarOnly,

      wallLighting,
      setWallLighting,

      hideReturns,
      setHideReturns,

      isDualEntry,
      setDualEntry,

      door_model,
      door_models,
      setDoorModel,

      door_colour,
      door_colours,
      setDoorColour,

      width,
      setWidth,

      depth,
      setDepth,

      travel,
      setTravel,

      maxWidth,
      maxDepth,
      minWidth,
      minDepth
    } = useCustomisation();

    // State for hex color
    // const [hexColor, setHexColor] = useState(light_color.color);

    // // Update light_color when hexColor changes
    // useEffect(() => {
    //     setLightColor({ color: hexColor, name: light_color.name });
    // }, [hexColor, light_color.name, setLightColor]);

    const toggleVisibility = () => {
      setHandrailModel(prev => (prev === 'Handrail_1' ? 'Handrail_2' : 'Handrail_1'));
    };

    const toggleCar = () => {
      setShowCarOnly(prev => (prev === false ? true : false));
    }

    const toggleWallLighting = () => {
      setWallLighting(prev => (prev === false ? true : false));
    }

    const toggleReturns = () => {x
      setHideReturns(prev => (prev === false ? true : false));
    }

    const toggleDualEntry = () => {
      setDualEntry(prev => (prev === false ? true : false));
    }

    const toggleDoors = () => {
      setDoorModel(prev => (prev === 'slide' ? 'swing' : 'slide'));
    }

    return (
        <div className="flex w-full flex-col relative">

                <div className="flex w-full pt-6">

                  <div className="flex flex-col w-7/12 justify-between">
                    <div className="">
                      <Slider label="Interior Width" value={width} min={minWidth} max={maxWidth} step={0.005} onChange={setWidth} />
                    </div>
                    <div className="">
                      <Slider label="Interior Depth" value={depth} min={minDepth} max={maxDepth} step={0.005} onChange={setDepth} />
                    </div>
                    <div className="">
                      <Slider label="Travel" value={travel} min={2.7} max={7.1} step={0.001} onChange={setTravel} />
                    </div>
                    
                    

                  </div>
                  <div className="w-5/12 h-full flex justify-center items-center"><Slider2D/></div>
                  
                </div>
            </div>

    )
} 

export default ConfiguratorLeft;