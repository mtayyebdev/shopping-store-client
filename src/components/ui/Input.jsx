import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

function Input({
  type = "text",
  label = false,
  name = "",
  labelText = "",
  value,
  onchange,
  classes,
  size = "sm",
  placeholder = "",
}) {
  const [openEye, setOpenEye] = useState(false);
  const sizes = {
    sm: "text-sm p-1 rounded-md",
    lg: "text-base p-1 rounded-lg",
    xl: "text-base p-2 rounded-xl",
    full: "text-base px-2 py-1 rounded-full",
  };
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm text-gray-950" htmlFor={name}>
          {labelText}
        </label>
      )}
      <div className="input flex items-center relative">
        <input
          type={type=="password"?openEye?"text":"password":type}
          name={name}
          id={name}
          className={`outline-none border border-gray-500 w-full focus:border-blue-500 focus:border-2 ${sizes[size]} ${classes}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onchange(e.target)}
        />
        {type == "password" ? (
          <span className="absolute right-3 text-xl hover:text-blue-500 cursor-pointer">
            {openEye?<LuEyeOff onClick={()=>setOpenEye(false)}/>:<LuEye onClick={()=>setOpenEye(true)}/>}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Input;
