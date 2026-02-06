import React from 'react'

function Btn({ values, selectedValues, setSelectedValues, name }) {
    const handleValueToggle = (value) => {
        setSelectedValues(prev => {
            const currentValues = prev[name] || [];

            return {
                ...prev,
                [name]: currentValues?.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
            }
        }
        );
    };

    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">{name}</h3>
            <div className="grid grid-cols-3 gap-2">
                {values.map((value) => {
                    const isSelected = selectedValues[name]?.includes(value)
                    return (<button
                        key={value}
                        onClick={() => handleValueToggle(value)}
                        className={`border-2 rounded-lg py-2 text-sm font-medium transition-all duration-300 uppercase ${isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {value}
                    </button>)
                })}
            </div>
        </div>
    )
}

export default Btn