import React, { useState } from 'react'
import {
  LuArrowLeft
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'

function Returns() {
  const { setIsSidebarOpen } = useOutletContext()
    const [returns] = useState([
        {
            id: "RET123456",
            orderId: "ORD123450",
            date: "2024-01-12",
            productName: "Bluetooth Speaker",
            reason: "Product not as described",
            status: "Processing",
            refundAmount: 1499
        }
    ]);
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                    <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden'/>
                    <h2 className="text-2xl font-bold text-gray-900">My Returns </h2>
                  </div>
            <div className="space-y-4">
                {returns.map((returnItem) => (
                    <div
                        key={returnItem.id}
                        className="bg-white rounded-lg shadow-md p-4 md:p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Return ID: <span className="font-semibold text-gray-900">{returnItem.id}</span></p>
                                <p className="text-sm text-gray-600">Order ID: <span className="font-semibold text-gray-900">{returnItem.orderId}</span></p>
                                <p className="text-sm text-gray-600">Initiated on: {returnItem.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${returnItem.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    returnItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {returnItem.status}
                            </span>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {returnItem.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">Reason:</span> {returnItem.reason}
                            </p>
                            <p className="text-sm text-gray-900">
                                <span className="font-semibold">Refund Amount:</span> ₹{returnItem.refundAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Returns