import { useState } from "react";

const ToggleButton = ({ option1, option2, status, toggle_function }) => {

    const [isOn, setIsOn] = useState(true);

    const toggleSwitch = (value) => {
        if (isOn !== value) {
          setIsOn(value);
          toggle_function();
        }
      };

    return (
        <div className="flex items-center space-x-2">
        <div className="inline-flex border border-brand-green rounded-[4px] overflow-hidden">
            <button 
            className={`px-4 py-2 text-xxs font-semibold transition-colors ${isOn ? 'bg-brand-green text-white' : 'bg-white text-brand-green'}`} 
            onClick={() => toggleSwitch(true)}
            >
            {option1}
            </button>
            <button 
            className={`px-4 py-2 text-xxs font-semibold transition-colors ${!isOn ? 'bg-brand-green text-white' : 'bg-white text-brand-green'}`} 
            onClick={() => toggleSwitch(false)}
            >
            {option2}
            </button>
        </div>
        </div>
    );
}

export default ToggleButton;