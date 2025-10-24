import React from 'react';

const MaterialSelector = ({ title, materials, onSelectMaterial }) => {
  return (
    <div>
      <div className="font-medium text-xs py-4">{title}</div>
      <div className="grid grid-cols-5 gap-4">
        {materials.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              onClick={() => onSelectMaterial(item)}
              className="relative group cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    height: '36px',
                    width: '36px',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '36px',
                    width: '36px',
                    backgroundColor: item.color,
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialSelector;
