import React from "react";

function Button({
  size = "md",
  link = "",
  value = "",
  style = "",
  rounded = false,
  classes = "",
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
    base: `bg-blue-500 border border-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`,
    outline: `bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`,
    ghost: `bg-transparent text-blue-500 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`,
  };
  return (
    <div>
      {link ? (
        <a href={link} className={`cursor-pointer`}>
          <button
            className={`cursor-pointer flex justify-center ${styles[style]} ${classes} ${
              rounded ? "rounded-full" : ""
            } ${sizes[size]}`}
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
          className={`cursor-pointer flex justify-center ${styles[style]} ${classes} ${
            rounded ? "rounded-full" : ""
          } ${sizes[size]}`}
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
    </div>
  );
}

export default Button;
