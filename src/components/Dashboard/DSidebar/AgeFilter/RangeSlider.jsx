import React, { useEffect, useState } from "react";
import "./rangeSlider.css"; // Include your CSS styles

const RangeSlider = ({setRangeText, rangeText}) => {
  const [minValue, setMinValue] = useState(18);
  const [maxValue, setMaxValue] = useState(23);

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value < maxValue) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > minValue) {
      setMaxValue(value);
    }
  };

  const minPercent = ((minValue - 18) / (50 - 18)) * 100;
  const maxPercent = ((maxValue - 18) / (50 - 18)) * 100;
useEffect(() => {
  setRangeText(`${minValue}-${maxValue}`); 

  return () => {
    
  }
}, [maxPercent,minPercent])

// Format the range as "18-25"

  return (
    <div className="slider-container">
      <label>Age</label>
      <div className="slider-values">
        <span>{rangeText} yrs</span> 
      </div>
      <div className="range-slider">
      
        <input
          type="range"
          min="18"
          max="50"
          value={minValue}
          onChange={handleMinChange}
          className="range-input"
        />
        <input
          type="range"
          min="18"
          max="50"
          value={maxValue}
          onChange={handleMaxChange}
          className="range-input"
        />
        <div className="range-track"></div>
        <div
          className="range-highlight"
          style={{
            left: `${minPercent +1.4}%`,
            right: `${100 - maxPercent +1.4}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RangeSlider;
