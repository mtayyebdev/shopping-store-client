import React, { useState } from 'react'
import {
    LuMapPin,
    LuArrowLeft,
    LuPencil,
    LuTrash,
    LuTrash2
} from "react-icons/lu";
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/index.js';

function Address() {
    const { setIsSidebarOpen } = useOutletContext()
    const [addresses] = useState([
        {
            id: 1,
            type: "Home",
            fullName: "John Doe",
            phone: "+91 9876543210",
            address: "123 Main Street, Apartment 4B",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            isDefault: true
        },
        {
            id: 2,
            type: "Office",
            fullName: "John Doe",
            phone: "+91 9876543210",
            address: "456 Business Park, Floor 5",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400051",
            isDefault: false
        }
    ]);
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <LuArrowLeft size={24} onClick={() => setIsSidebarOpen(true)} className='lg:hidden' />
                    <h2 className="text-2xl font-bold text-text2">Address Book </h2>
                </div>
                <Button value='+ Add New Address' bg='btn2' style='base' size='md' />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="bg-primary rounded p-4"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-text2">{address.type}</h3>
                                {address.isDefault && (
                                    <span className="text-xs bg-secondary1 text-secondary2 px-2 py-0.5 rounded-full font-semibold">
                                        Default
                                    </span>
                                )}
                            </div>
                            <LuMapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-text2 font-medium mb-1">
                            {address.fullName} | {address.phone}
                        </p>
                        <p className="text-sm text-text1 mb-3">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <div className="flex gap-3">
                            <button className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-semibold">
                                <LuPencil size={18}/>
                            </button>
                            <button className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-semibold">
                                <LuTrash2 size={18}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Address