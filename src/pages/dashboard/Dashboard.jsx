import React, { useState } from 'react'
import { Sidebar, Header } from './components/index.js'
import {
  AiOutlineShoppingCart,
} from "react-icons/ai";

function Dashboard() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    <>
      {/* Page Wrapper Start */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Start */}
        <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
        {/* Sidebar End  */}

        {/*  Content Area Start */}
        <div className='relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto'>
          {/* Header Start */}
          <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
          {/* Header End  */}

          {/* Main Content Start */}
          <main>
            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
              <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-7"></div>
                <div className="col-span-12 xl:col-span-5"></div>
                <div className="col-span-12"></div>
                <div className="col-span-12 xl:col-span-5"></div>
                <div className="col-span-12 xl:col-span-7"></div>
              </div>
            </div>
          </main>
          {/* Main Content End  */}
        </div>
        {/* Content Area End  */}
      </div>
      {/* Page Wrapper End */}
    </>
  )
}

export default Dashboard