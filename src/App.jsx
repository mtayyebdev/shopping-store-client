import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "./components/index.js";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
