'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useCustomisation } from '@/contexts/customisation';


// UI Components
import Configurator from '@/app/ui/configurator';
import AdvancedConfigurator from '@/experience/car_configurator';
import AussieLiftsLogoInline from '@/app/ui/AussieLiftsLogoInline';
import DownloadableButton from '@/app/components/save_button';

// --- Data moved from Filter.js ---

const products = [
  { id: 1, name: 'Phoenix', use: ['Residential'], site: ['Indoor', 'Outdoor'], height: 8.4, capacity: 630, width: [0.9, 1.1], depth: [1.3, 1.4], door:'swing' },
  { id: 2, name: 'Mariner', use: ['Commercial'], site: ['Indoor', 'Outdoor'], height: 8.4, capacity: 630, width: [1.0, 1.1], depth: [1.3, 1.4] ,  door:'swing'},
  { id: 3, name: 'Orion', use: ['Commercial', 'Disabled Access'], site: ['Indoor', 'Outdoor'], height: 8.4, capacity: 630,width: [1.0, 1.4], depth: [1.4, 2.0], door:'slide' },
  { id: 6, name: 'Gemini', use: ['Residential', 'Disabled Access'], site: ['Outdoor'], height: 4, capacity: 350, width: [0.9, 1.1], depth: [1.3, 1.4], door:'swing' },
  { id: 9, name: 'Pioneer', use: ['Goods Only'], site: ['Indoor', 'Outdoor'], height: 8.4, capacity: 630, width: [0.9, 1.6], depth: [1.4, 2.0], door:'swing'},
];

const filterOptions = {
  Use: ['Residential', 'Commercial', 'Goods Only', 'Disabled Access'],
  Site: ['Indoor', 'Outdoor'],
};

// --- Helper components moved from Filter.js ---

const Dropdown = ({ name, options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if(isOpen) onToggle(name);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isOpen, name, onToggle]);

  return (
    <div className="relative text-left mr-2 mb-2" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="flex justify-center items-center w-full border border-gray-300 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => onToggle(name)}
        >
          {selected || name}
          <ChevronDown className={`-mr-1 ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 shadow-sm bg-white border border-gray-300 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a href="#" onClick={(e) => { e.preventDefault(); onSelect(name, null); onToggle(name); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              All
            </a>
            {options.map((option) => (
              <a
                href="#"
                key={option}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(name, option);
                  onToggle(name);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SpaceInput = ({ label, name, value, onChange }) => (
    <div className="relative mr-2 mb-2">
        <label htmlFor={label} className="absolute -top-2 left-2 inline-block bg-brand-white px-1 text-xs font-medium text-gray-500">
            {label}
        </label>
        <input
            type="text"
            name={name}
            id={label}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 p-1.5 text-xs text-gray-900 focus:outline-none"
            placeholder="e.g. 1200"
        />
    </div>
);

const ActiveFilterTag = ({ filterKey, value, onRemove }) => (
  <div className="flex items-center border border-brand-grey text-gray-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">
    <span>{filterKey}:</span>
    <span className="font-semibold ml-1">{value}</span>
    <button onClick={() => onRemove(filterKey, null)} className="ml-2">
      <X size={14} className="text-gray-500 hover:text-gray-900"/>
    </button>
  </div>
);


export default function Filter() {
  const [viewportHeight, setViewportHeight] = useState('100vh');
  
  // --- State and handlers for filtering ---
  const [activeFilters, setActiveFilters] = useState({});
  const [spaceFilter, setSpaceFilter] = useState({ width: '', depth: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
      setMaxWidth,
      setMaxDepth,
      setMinWidth,
      setMinDepth,
      width,
      depth,
      setWidth,
      setDepth,
      setDoorModel,
    } = useCustomisation();

  const handleProductSelect = (product) => {
  setSelectedProduct(product);

  const newMaxDepth = product.depth[1];
  const newMaxWidth = product.width[1];

  setMaxDepth(newMaxDepth);
  setMaxWidth(newMaxWidth);

  if (depth > newMaxDepth) {
    setDepth(newMaxDepth);
  }

  if (width > newMaxWidth) {
    setWidth(newMaxWidth);
  }

  setDoorModel(product.door)
};

  const handleDropdownToggle = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === null) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const handleSpaceChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
        setSpaceFilter(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };

  const removeAllFilters = () => {
    setActiveFilters({});
    setSpaceFilter({ width: '', depth: '' });
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const dropdownFilterMatch = Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        const filterValueNum = parseFloat(value);
        switch (key) {
          case 'Use': return product.use.includes(value);
          case 'Site': return product.site.includes(value);
          case 'Height Travelled': return product.height >= filterValueNum;
          case 'Lifting Capacity': return product.capacity >= filterValueNum;
          default: return true;
        }
      });

      const widthMatch = spaceFilter.width ? product.width <= parseFloat(spaceFilter.width) : true;
      const depthMatch = spaceFilter.depth ? product.depth <= parseFloat(spaceFilter.depth) : true;
      
      return dropdownFilterMatch && widthMatch && depthMatch;
    });
  }, [activeFilters, spaceFilter]);

  const hasActiveDropdownFilters = Object.keys(activeFilters).length > 0;
  const hasActiveSpaceFilters = spaceFilter.width || spaceFilter.depth;
  const hasActiveFilters = hasActiveDropdownFilters || hasActiveSpaceFilters;

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center bg-brand-white w-full">
      <div className='flex flex-col lg:flex-row w-full items-center text-brand-grey'>
        <div className='flex flex-col w-full'>
          {/* --- Integrated Filter UI --- */}
          <div className="">
            <div className="flex flex-wrap items-center">
                {Object.entries(filterOptions).map(([key, options]) => (
                    <Dropdown
                        key={key}
                        name={key}
                        options={options}
                        selected={activeFilters[key]}
                        onSelect={handleFilterChange}
                        isOpen={openDropdown === key}
                        onToggle={handleDropdownToggle}
                    />
                ))}
                {/* <SpaceInput label="Width (mm)" name="width" value={spaceFilter.width} onChange={handleSpaceChange} />
                <SpaceInput label="Depth (mm)" name="depth" value={spaceFilter.depth} onChange={handleSpaceChange} /> */}
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap items-center">
                  {Object.entries(activeFilters).map(([key, value]) => (
                      <ActiveFilterTag key={key} filterKey={key} value={value} onRemove={handleFilterChange} />
                  ))}
                  {/* {spaceFilter.width && (
                      <ActiveFilterTag filterKey="Max Width" value={`${spaceFilter.width}mm`} onRemove={() => setSpaceFilter(p => ({...p, width: ''}))} />
                  )}
                  {spaceFilter.depth && (
                      <ActiveFilterTag filterKey="Max Depth" value={`${spaceFilter.depth}mm`} onRemove={() => setSpaceFilter(p => ({...p, depth: ''}))} />
                  )} */}
                  <button onClick={removeAllFilters} className="text-xs tracking-wide text-gray-500 hover:text-brand-green underline ml-2">
                      Remove All
                  </button>
              </div>
            )}
          </div>
          <div className='pt-4'>
            <h2 className='text-md font-bold text-brand-grey'>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Lift Matches' : 'Lifts Match'} Your Criteria
            </h2>
            <div className='flex flex-wrap pt-2'>
                {filteredProducts.map(product => (
                    <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className={`
                            text-xs font-semibold mr-2 mb-2 px-3 py-1.5 border
                            ${selectedProduct && selectedProduct.id === product.id 
                                ? 'bg-brand-green text-white border-brand-green' 
                                : 'bg-transparent text-brand-grey border-gray-300 hover:bg-gray-100 hover:border-brand-grey'
                            }
                            transition-colors duration-200 focus:outline-none
                        `}
                    >
                        {product.name}
                    </button>
                ))}
            </div>
            {/* You can optionally show the selected product's name below the buttons */}
            {/* {selectedProduct && (
                <div className="mt-2 text-xs text-gray-500">
                    Now configuring: <span className="font-bold text-brand-grey">{selectedProduct.name}</span>
                </div>
            )} */}
        </div>
        </div>
      </div>
    </main>
  );
}