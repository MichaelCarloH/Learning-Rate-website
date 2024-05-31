import React, { useState, useCallback } from 'react';

interface LayerPopup {
  xPos: number;
  yPos: number;
  onConfirm: (inpWidth: number, outWidth: number) => void;
}

// Popup that allows you to select input and output width of the layer
const LayerSelectionPopup: React.FC<LayerPopup> = ({ xPos, yPos, onConfirm }) => {
  const [inputWidth, setInputWidth] = useState('1');
  const [outputWidth, setOutputWidth] = useState('1');

  const handleConfirm = useCallback(() => {
    onConfirm(parseInt(inputWidth), parseInt(outputWidth));
  }, [inputWidth, outputWidth, onConfirm]);

  return (
    <div
      className="absolute bg-white p-4 border border-black rounded-md shadow-md"
      style={{ top: `${yPos}px`, left: `${xPos}px`, width: '200px' }}
    >
      <label htmlFor = "Input Width:" className="block mb-1">Input Width:</label>
      <input
        id = 'Input Width:'
        type="number"
        value={inputWidth}
        onChange={(e) => setInputWidth(e.target.value)}
        className="border border-gray-300 rounded-md py-1 px-2 mb-2 w-full"
      />

      <label htmlFor = "Output Width:" className="block mb-1">Output Width:</label>
      <input
        id = "Output Width:"
        type="number"
        value={outputWidth}
        onChange={(e) => setOutputWidth(e.target.value)}
        className="border border-gray-300 rounded-md py-1 px-2 mb-2 w-full"
      />

      <button onClick={handleConfirm} className="bg-blue-500 text-white py-1 px-4 rounded-md">
        Confirm
      </button>
    </div>
  );
};

export default LayerSelectionPopup;
