import React from 'react'

function Checkbox({ values, selectedValues, setSelectedValues, name }) {
    const handleValueToggle = (value) => {
        setSelectedValues(prev => {
            const currentValues = prev[name] || [];

            return {
                ...prev,
                [name]: currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
            }
        }
        );
    };

    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">{name}</h3>
            <div className="space-y-2">
                {values.map((value) => {
                    const isSelected = selectedValues[name]?.includes(value);
                    return (
                        <label key={value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleValueToggle(value)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{value}</span>
                        </label>)
                })}
            </div>
        </div>
    )
}

export default Checkbox