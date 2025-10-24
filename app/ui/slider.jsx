const Slider = ({ label, value, min, max, step, onChange }) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium flex w-full justify-between">
          <div>{label}:</div> 
          <div>{value.toFixed(3)}m</div>
          </label>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
          className="w-full cursor-pointer accent-brand-green" 
        />
      </div>
    );
  };

  export default Slider;