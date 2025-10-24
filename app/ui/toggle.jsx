import { useState, useEffect } from 'react';

const ToggleSwitch = ({ option1, option2, status, toggle_function }) => {
    return (
  
      <div className="flex items-center space-x-2 text-xs w-full">
      <span className={!status ? "text-black font-bold" : "text-gray-400"}>{option1}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={status} onChange={toggle_function} className="sr-only peer" />
        <div className="w-12 h-6 bg-gray-300 peer-checked:bg-brand-green rounded-sm p-1 flex items-center transition-colors">
          <div className={`w-4 h-4 bg-white rounded-sm shadow-md flex items-center justify-center transform transition-transform ${status ? 'translate-x-6' : 'translate-x-0'}`}>
            {/* {status ? '💻' : '🎨'} */}
          </div>
        </div>
      </label>
      <span className={status ? "text-black font-bold" : "text-gray-400"}>{option2}</span>
    </div>
  
    );
  };

export default ToggleSwitch;