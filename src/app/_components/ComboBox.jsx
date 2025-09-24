"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ComboBox = ({ 
  options = [], 
  value = "", 
  onChange, 
  placeholder = "Seleccionar...", 
  className = "",
  disabled = false,
  label = "",
  id = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-gray-700 text-sm mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      
      <button
        id={id}
        type="button"
        className={`
          w-full p-2 text-left bg-white border-black border-2 rounded-2xl text-gray-700 shadow-gray-200 shadow-md
          focus:outline-none focus:ring-2 focus:ring-black focus:border-black
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-600 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-black border-black' : ''}
          flex items-center justify-between
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute z-20 w-full mt-1 bg-white border-black border-2 rounded-2xl shadow-gray-200 shadow-md max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 
                  focus:outline-none transition-colors duration-150 text-gray-700
                  ${index === 0 ? 'rounded-t-2xl' : ''}
                  ${index === options.length - 1 ? 'rounded-b-2xl' : ''}
                  ${value === option.value ? 'bg-gray-100 text-black font-medium' : 'text-gray-700'}
                `}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComboBox;
