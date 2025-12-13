import React from "react";

function Button({
  size = "md",
  link = "",
  value = "",
  style = "simple",
  rounded = false,
  classes = "",
  ...props
}) {
  const sizes = {
    sm: "py-1.5 px-5 text-sm",
    md: "py-2 px-6 text-base",
    lg: "py-3 px-10 text-lg",
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
            className={`cursor-pointer ${styles[style]} ${classes} ${rounded ? "rounded-full" : ""} ${sizes[size]}`}
            {...props}
          >
            {value}
          </button>
        </a>
      ) : (
        <button
          className={`cursor-pointer ${styles[style]} ${classes} ${rounded ? "rounded-full" : ""} ${sizes[size]}`}
          {...props}
        >
          {value}
        </button>
      )}
    </div>
  );
}

export default Button;
