import React from 'react'
import { getPaginationPages } from '../../custom methods'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

function Pagination({ totalPages, page, setpage, limit, NumberOfItems,title }) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{(page - 1) * limit}</span> to <span className="font-semibold text-gray-900">{page * limit}</span> of <span className="font-semibold text-gray-900">{NumberOfItems}</span> {title}
            </p>
            <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={page == 1} onClick={() => setpage(page - 1)}>
                    <MdOutlineKeyboardArrowLeft className="inline" size={18} /> Previous
                </button>
                {
                    getPaginationPages(page, totalPages).map((item, index) => (
                        <button
                            key={index}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg ${item === page ? "bg-blue-600 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-600"} text-sm font-semibold shadow-sm`}
                            onClick={() => typeof item === "number" && setpage(item)}
                            disabled={item === "..."}
                        >
                            {item}
                        </button>
                    ))
                }
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={totalPages == page} onClick={() => setpage(page + 1)}>
                    Next <MdOutlineKeyboardArrowRight className="inline" size={18} />
                </button>
            </div>
        </div>
    )
}

export default Pagination