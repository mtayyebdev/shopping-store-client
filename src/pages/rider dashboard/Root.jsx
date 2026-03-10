import React, { useState } from 'react'
import { Sidebar, Header } from './components/index.js'
import { Outlet } from 'react-router-dom';

function Root() {
    const [sidebarToggle, setSidebarToggle] = useState(false);
    return (
        <>
            {/* Page Wrapper Start */}
            <div className="flex h-screen overflow-hidden max-w-384 mx-auto">
                {/* Sidebar Start */}
                <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
                {/* Sidebar End  */}

                {/*  Content Area Start */}
                <div className='relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto'>
                    {/* Header Start */}
                    <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
                    {/* Header End  */}

                    {/* Main Content Start */}
                    <main className='p-5 bg-[#f0f4f7]'>
                        <Outlet />
                    </main>
                    {/* Main Content End  */}
                </div>
                {/* Content Area End  */}
            </div>
            {/* Page Wrapper End */}
        </>
    )
}

export default Root