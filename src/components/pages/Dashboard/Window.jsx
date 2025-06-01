import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Window = ({ isOpenWindow, closeWindow, showText , navTo}) => {
      const navigate = useNavigate();
    
  if (!isOpenWindow) return null;


const neviateTo =  ()=>{
      navigate(navTo);

}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-80 text-center">
        <button
          onClick={closeWindow}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">{showText}</h2>
        <button
          onClick={neviateTo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Complete
        </button>

        
      </div>
    </div>
  );
};

export default Window;
