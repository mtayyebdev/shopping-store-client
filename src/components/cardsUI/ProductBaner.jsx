import React from "react";
import { Button } from "../index.js";

function ProductBaner({ title = "", expiresIn = "", image = "", link = "" }) {
  const expiryDate = new Date(expiresIn);
  const currentDate = new Date(Date.now());

  const diffMs = expiryDate - currentDate;

const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
const seconds = Math.floor((diffMs / 1000) % 60);

  return (
    <div className="w-full bg-btn p-5 md:p-10 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="left w-full lg:w-1/3">
        <p className="text-btn1 text-lg font-semibold mb-5 sm:mb-10">
          Categories
        </p>
        <h2 className="text-primary text-3xl sm:text-5xl md:text-4xl lg:text-5xl mb-5 sm:mb-8 font-bold">
          {title}
        </h2>
        <div className="flex items-center text-sm gap-2 mb-5 sm:mb-10">
          <div className="bg-primary flex items-center justify-center flex-col w-16 h-16 rounded-full">
            <span className="text-base font-semibold">{hours}</span>
            <p>Hours</p>
          </div>
          <div className="bg-primary flex items-center justify-center flex-col w-16 h-16 rounded-full">
            <span className="text-base font-semibold">{days}</span>
            <p>Days</p>
          </div>
          <div className="bg-primary flex items-center justify-center flex-col w-16 h-16 rounded-full">
            <span className="text-base font-semibold">{minutes}</span>
            <p>Minutes</p>
          </div>
          <div className="bg-primary w-16 h-16 hidden sm:flex rounded-full items-center justify-center flex-col">
            <span className="text-base font-semibold">{seconds}</span>
            <p>Seconds</p>
          </div>
        </div>
        <Button value="Buy Now" bg="btn1" link={link} size="md" style="base" />
      </div>
      <div className="right w-full relative sm:w-[70%] md:w-full lg:w-[45%] lg:me-16">
        <div className="bg-white/15 w-full h-full blur-2xl rounded-full absolute top-0 left-0"></div>
        <img
          src={image}
          style={{ transform: "scaleX(-1)" }}
          className="w-full"
          alt={image}
        />
      </div>
    </div>
  );
}

export default ProductBaner;
