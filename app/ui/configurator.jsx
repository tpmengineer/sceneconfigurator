import { useCustomisation } from "../../contexts/customisation";

import MaterialSelector from '@/app/ui/material_selector'
import ToggleSwitch from "@/app/ui/toggle";

const Configurator = () => {
    const {
      floor_material,
      floor_materials,
      setFloorMaterial,

      wall_material,
      wall_materials,
      setWallMaterial,

      wall_shadow,
      wall_shadows,
      setWallShadow,

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
  door_colours_current,
      setDoorColour,
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

    const toggleReturns = () => {
      setHideReturns(prev => (prev === false ? true : false));
    }

    const toggleDualEntry = () => {
      setDualEntry(prev => (prev === false ? true : false));
    }

    const toggleDoors = () => {
      setDoorModel(prev => (prev === 'slide' ? 'swing' : 'slide'));
    }

    return (
        <div className="flex w-full flex-col relative z-20">
              {/* <div className='font-medium'>Phoenix</div>
                <div className="flex flex-row justify-between text-xs">
                  <div>Maximum travel 7.2m - 3 Floors</div>
                  <div>Capacity up to 500kg</div>
                </div> */}
                <div className="flex flex-col justify-around w-full h-full">

                  <MaterialSelector
                  title="Floor"
                  materials={floor_materials}
                  onSelectMaterial={setFloorMaterial}
                  />

                  <MaterialSelector
                  title="Wall and Ceiling Panels"
                  materials={wall_materials}
                  onSelectMaterial={setWallMaterial}
                  />

                  <div className="pt-5">
                    <ToggleSwitch option1=" " option2="Wall Lighting" status={wallLighting} toggle_function={toggleWallLighting}/>
                  </div>


                  <MaterialSelector
                  title="Shadowline"
                  materials={wall_shadows}
                  onSelectMaterial={setWallShadow}
                  />

                  <MaterialSelector
                    title="Accessory Finish"
                    materials={handrail_colours}
                    onSelectMaterial={setHandrailColour}
                    />
                  {/* <ToggleButton option1={'Returned Handrail'} option2={'Shaft and Post Handrail'} status={handrail_model} toggle_function={toggleVisibility}/> */}

                  <MaterialSelector
                  title="Door Finish"
                  materials={door_colours_current}
                  onSelectMaterial={setDoorColour}
                  />
                

                </div>
            </div>

    )
} 

export default Configurator;