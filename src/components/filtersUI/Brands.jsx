import React from 'react'

function Brands({ brands, selectedBrands, setSelectedBrands }) {
    const handleBrandToggle = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">Brand</h3>
            <div className="space-y-2">
                {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{brand}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default Brands