import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "./components/index.js";

function App() {
  return (
    <>
      <div className="w-full bg-[#F5F5F5]">
        <Header />
        <div className="max-w-384 mx-auto px-5">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
