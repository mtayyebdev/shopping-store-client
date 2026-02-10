import React from 'react'

function Spiner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
            </div>
        </div>
    )
}

export default Spiner