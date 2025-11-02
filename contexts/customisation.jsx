'use client';
import { createContext, useContext, useState } from "react";

const floor_materials = [
  {
    color: "", //lightest
    name: "Natural Springfield",
    texture: "natural_springfield",
    image: 'materials/floor/natural_springfield.png'
  },
  {
    color: "",
    name: "Natural Lord",
    texture: "natural_lord",
    image: 'materials/floor/natural_lord.png'
  },
  {
    color: "",
    name: "Rustic Walnut",
    texture: "rustic_walnut",
    image: 'materials/floor/rustic_walnut.png'
  },
  {
    color: "",
    name: "Urban Blacktech",
    texture: "urban_blacktech",
    image: 'materials/floor/urban_blacktech.png',
  },
  {
    color: "",
    name: "Grey Carpet",
    texture: "grey_carpet",
    image: 'materials/floor/grey_carpet.png'
  },];

  // Ceiling will use the same panel materials and shadowline options as walls

  const wall_materials = [
    {
      color: "",
      name: "Polar White Flint",
      texture: "polar_white_flint",
      image: "materials/walls/polar_white_flint.jpg"
    },
    {
      color: "",
      name: "Ghostgum Flint",
      texture: "ghostgum_flint",
      image: "materials/walls/ghostgum_flint.jpg"
    },
    {
      color: "",
      name: "Oyster Grey Flint",
      texture: "oyster_grey_flint",
      image: "materials/walls/oyster_grey_flint.jpg"
    },
    {
      color: "",
      name: "Alaskan Natural",
      texture: "alaskan_natural",
      image: "materials/walls/alaskan_natural.jpg"
    },
    {
      color: "",
      name: "Natural Walnut Chalk",
      texture: "natural_walnut_chalk",
      image: "materials/walls/natural_walnut_chalk.jpg"
    },
    {
      color: "",
      name: "Elegant Oak Chalk",
      texture: "elegant_oak_chalk",
      image: "materials/walls/elegant_oak_chalk.jpg"
    },
    {
      color: "",
      name: "Fox Teakwood Natural",
      texture: "fox_teakwood_natural",
      image: "materials/walls/fox_teakwood_natural.jpg"
    },
    {
      color: "",
      name: "Rural Oak Natural",
      texture: "rural_oak_natural",
      image: "materials/walls/rural_oak_natural.jpg"
    },
    {
      color: "",
      name: "Classic Oak Natural",
      texture: "classic_oak_natural",
      image: "materials/walls/classic_oak_natural.jpg"
    },
    {
      color: "",
      name: "Burnished Wood Natural",
      texture: "burnished_wood_natural",
      image: "materials/walls/burnished_wood_natural.jpg"
    },
    {
      color: "",
      name: "Parchment Flint",
      texture: "parchment_flint",
      image: "materials/walls/parchment_flint.jpg"
    },
    {
      color: "",
      name: "White Flint",
      texture: "white_flint",
      image: "materials/walls/white_flint.jpg"
    },
    {
      color: "",
      name: "Rock Maple Flint",
      texture: "rock_maple_flint",
      image: "materials/walls/rock_maple_flint.jpg"
    }
      
    ];

  const wall_shadows = [
      {
        color: "#f9f9f9",
        name: "Sign White",
      },
      {
        color: "#b1b7b3",
        name: "Shale Grey",
      },
      {
        color: "#838776",
        name: "Pale Eucalypt",
      },
      {
        color: "#605f5b",
        name: "Woodland Grey",
      },
      {
        color: "#665c52",
        name: "Jasper",
      },
      {
        color: "#010101",
        name: "Night Sky",
      },
      
      
      ];

  // Alias ceiling options to use the same choices as walls
  const ceiling_materials = wall_materials;
  const ceiling_shadows = wall_shadows;

  const handrail_models = [
    {
      model: "Shaft and Post",
    },
    {
      model: "Returned",
    },];

    const handrail_colours = [
    {
      name: "Powdercoat White",
      color: "#f9f9f9",
      metalness: 0,
      roughness: 1,
    },
    {
      name: "Stainless Steel",
      color: "#f4f4f4",
      metalness: 0.9,
        roughness: 0.2,
    },
    {
      name: "Powdercoat Black",
      color: "#424245",
      metalness: 0,
      roughness: 1,
    },];

    const view_booleans = [
      {
        name: "Car Only",
        value: false,
      },
      {
        name: "Dual Entry",
        value: false,
      },
      {
        name: "Hide Returns",
        value: true,
      },
      {
        name: "Wall Lighting",
        value: true,
      }
    ]

    const door_models = [
      {
        model: "swing",
      },
      {
        model: "slide",
      },];
  
      const door_colours = [
      {
        name: "Powdercoat White",
        color: "#f9f9f9",
        metalness: 0,
        roughness: 1,
      },
      {
        name: "Stainless Steel",
        color: "#f4f4f4",
        metalness: 0.9,
        roughness: 0.2,
      },
      {
        name: "Powdercoat Black",
        color: "#424245",
        metalness: 0,
        roughness: 1,
      },];

const CustomisationContext = createContext({});

export const CustomisationProvider = (props) => {
    const [floor_material, setFloorMaterial] = useState(floor_materials[3]);
  const [ceiling_material, setCeilingMaterial] = useState(ceiling_materials[8]);
    const [wall_material, setWallMaterial] = useState(wall_materials[8]);

  const [ceiling_shadow, setCeilingShadow] = useState(ceiling_shadows[1]);
    const [wall_shadow, setWallShadow] = useState(wall_shadows[2]);

    const [handrail_model, setHandrailModel] = useState(handrail_models[0].model)
    const [handrail_colour, setHandrailColour] = useState(handrail_colours[2])

    const [showCarOnly, setShowCarOnly] = useState(view_booleans[0].value);
    const [wallLighting, setWallLighting] = useState(view_booleans[3].value);
    const [hideReturns, setHideReturns] = useState(view_booleans[2].value); 
    const [isDualEntry, setDualEntry] = useState(view_booleans[1].value);

    const [door_model, setDoorModel] = useState(door_models[0].model)
    const [door_colour, setDoorColour] = useState(door_colours[0])
  const [cop_colour, setCopColour] = useState(door_colours[1])
  const [showDoor, setShowDoor] = useState(true)

    const [width, setWidth] = useState(1.1);
    const [depth, setDepth] = useState(1.4);
    const [travel, setTravel] = useState(2.8);

  // Scene view state for UI highlights and workflow
  const [activeView, setActiveView] = useState("default");

    const [maxWidth, setMaxWidth] = useState(1.1);
    const [maxDepth, setMaxDepth] = useState(1.4);
    const [minWidth, setMinWidth] = useState(0.9);
    const [minDepth, setMinDepth] = useState(1.3);

    return (
        <CustomisationContext.Provider
        value={{
          floor_material,
          floor_materials,
          setFloorMaterial,

          ceiling_material,
          ceiling_materials,
          setCeilingMaterial,


          wall_material,
          wall_materials,
          setWallMaterial,

          ceiling_shadow,
          ceiling_shadows,
          setCeilingShadow,
          wall_shadow,
          wall_shadows,
          setWallShadow,

          handrail_model,
          handrail_models,
          setHandrailModel,

          handrail_colour,
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

          cop_colour,
          setCopColour,

          showDoor,
          setShowDoor,

          width,
          setWidth,

          depth,
          setDepth,

          travel,
          setTravel,

          maxDepth,
          setMaxDepth,
          maxWidth,
          setMaxWidth,

          minDepth,
          setMinDepth,
          minWidth,
          setMinWidth,

          // Scene view tracking
          activeView,
          setActiveView
        }}
        >
        {props.children}
        </CustomisationContext.Provider>
    );
    };

export const useCustomisation = () => {
  const context = useContext(CustomisationContext);
  return context;
};