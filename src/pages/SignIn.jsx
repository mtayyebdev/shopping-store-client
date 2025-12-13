import React, { useState } from "react";
import { Button, Input } from "../components/index.js";
import { Link } from "react-router-dom";

function SignIn() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginHandler = (e) => {
    setError("");

    if (!data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }
    console.log("Login data:", data);
  };

  return (
    <>
      <div className="container-full bg-[#FCFAFF] dark:bg-gray-800 flex items-center justify-center flex-col w-full h-screen">
        <h2 className="text-3xl font-semibold mb-10">Shopping store</h2>
        <div className="max-w-md w-full bg-white dark:bg-gray-700 rounded-2xl py-6 pb-7 px-6 shadow-lg">
          <h2 className="text-2xl font-semibold">Login Your Account</h2>
          <Input
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your email"
            name="email"
            labelText="Email"
            label={true}
            size="xl"
            type="email"
            parentClass={"mt-3"}
          />
          <Input
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            name="password"
            labelText="Password"
            label={true}
            size="xl"
            type="password"
            parentClass={"mt-3"}
          />
          {error && (
            <p className="mb-2 mt-2 text-sm text-red-600 animate-shake">{error}</p>
          )}
          <p className="mt-1">
            <Link
              to="/forgot-password"
              className="text-blue-500 underline text-sm"
            >
              Forgot Password?
            </Link>
          </p>
          <div className="text-center mt-6">
            <Button
              size="md"
              value="SignIn"
              style="base"
              rounded
              classes="font-semibold w-[150px]"
              onClick={loginHandler}
            />
          </div>
        </div>
        <p className="mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </>
  );
}

export default SignIn;
