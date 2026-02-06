import React from 'react'

function Colors({ colors, selectedColors, setSelectedColors }) {
    const handleColorToggle = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">Color</h3>
            <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleColorToggle(color)}
                        className={`border-2 rounded-lg p-2 text-xs font-medium transition-all duration-300 capitalize ${selectedColors.includes(color)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {color}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Colors