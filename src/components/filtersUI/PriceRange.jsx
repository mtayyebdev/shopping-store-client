import React from 'react'

function PriceRange({ priceRange, setPriceRange }) {
    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    placeholder="Min"
                    value={priceRange?.[0] ?? ''}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange?.[1] ?? 100000])}
                    className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <span className="text-gray-500">-</span>
                <input
                    type="number"
                    placeholder="Max"
                    value={priceRange?.[1] ?? ''}
                    onChange={(e) => setPriceRange([priceRange?.[0] ?? 1, Number(e.target.value)])}
                    className="w-full border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
            </div>
        </div>
    )
}

export default PriceRange