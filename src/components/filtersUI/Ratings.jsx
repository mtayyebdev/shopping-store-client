import React from 'react'
import { LuStar} from "react-icons/lu";

function Ratings({ selectedRating, setSelectedRating }) {
    return (
        <div className="mb-6">
            <h3 className="font-bold text-text2 mb-3">Rating</h3>
            <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                    <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors duration-300 ${selectedRating === rating
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, i) => (
                                <LuStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm font-medium">& Up</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Ratings