import React from "react";
import "../styles/Toolbar.css";

const Toolbar = ({ brushColor, setBrushColor, brushSize, setBrushSize, clearCanvas }) => {
  return (
    <div className="toolbar">
      <div className="color-picker-container">
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="color-picker"
        />
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="brush-slider"
        />
        <span className="brush-size">{brushSize}px</span>
      </div>
      <button onClick={clearCanvas} className="clear-button">
        Clear Canvas
      </button>
    </div>
  );
};

export default Toolbar;
