import React from 'react'

function Sizes({ sizes, selectedSizes, setSelectedSizes }) {
    const handleSizeToggle = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">Size</h3>
            <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`border-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 uppercase ${selectedSizes.includes(size)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Sizes