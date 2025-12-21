import React from "react";

function Button({
  size = "md",
  link = "",
  value = "",
  style = "",
  rounded = false,
  classes = "",
  bg = "",
  icon = null,
  iconPosition = "left",
  paddings = true,
  ...props
}) {
  const sizes = {
    sm: `${paddings ? "py-1.5 px-5" : ""} text-sm`,
    md: `${paddings ? "py-2 px-6" : ""} text-base`,
    lg: `${paddings ? "py-3 px-10" : ""} text-lg`,
  };
  const styles = {
    base: `rounded`,
    outline: `bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`,
    ghost: `bg-transparent text-blue-500 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`,
  };
  const bgs = {
    btn1: "bg-btn1 text-text hover:bg-hover-btn1 focus:outline-none focus:ring-2 focus:ring-btn1 focus:ring-opacity-75",
    btn2: "bg-btn2 text-text hover:bg-hover-btn2 focus:outline-none focus:ring-2 focus:ring-btn2 focus:ring-opacity-75",
  };
  return (
    <>
      {link ? (
        <a href={link} className={`cursor-pointer`}>
          <button
            className={`cursor-pointer flex ${bgs[bg]} justify-center ${
              styles[style]
            } ${classes} ${rounded ? "rounded-full" : ""} ${sizes[size]}`}
            {...props}
          >
            {icon && iconPosition === "left" && (
              <span className="mr-2">{icon}</span>
            )}
            {value}
            {icon && iconPosition === "right" && (
              <span className="ml-2">{icon}</span>
            )}
          </button>
        </a>
      ) : (
        <button
          className={`cursor-pointer ${bgs[bg]} flex justify-center ${
            styles[style]
          } ${classes} ${rounded ? "rounded-full" : ""} ${sizes[size]}`}
          {...props}
        >
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {value}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </button>
      )}
    </>
  );
}

export default Button;
