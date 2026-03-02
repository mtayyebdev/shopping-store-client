import React from 'react'
import { LuTrendingDown, LuTrendingUp } from 'react-icons/lu';

function SimpleCard({ title, total, percentage, currency, isActive }) {
    return (
        <div className='w-full bg-white flex items-center justify-between'>
            <div>
                <div className="flex items-center gap-2">
                    <span className='w-3 h-3 rounded-full' style={{ backgroundColor: isActive ? "rgb(35,119,252)" : "rgb(211,228,254)" }}></span>
                    <h4 className='text-sm'>{title}</h4>
                </div>
                <h2 className='text-2xl font-bold'>{currency}{total}</h2>
            </div>
            <div className="flex items-center gap-3">
                {percentage < 0 ? <LuTrendingDown size={20} className='text-red-600' /> : <LuTrendingUp size={20} className='text-green-600' />}
                <p className='font-semibold'>{percentage}%</p>
            </div>
        </div>
    )
}

export default SimpleCard