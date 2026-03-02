import React, { useState } from "react";
import { Button, Input } from "../components/index.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'
import { useDispatch } from "react-redux";
import { getUser } from "../store/publicSlices/UserSlice.jsx";
import { IoMdClose } from "react-icons/io";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

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

  const loginHandler = async (e) => {
    setError("");

    if (!data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signin`, {
        email: data.email,
        password: data.password,
      },
        {
          withCredentials: true
        }
      )

      if (res.status == 200) {
        toast.success("Login successfully.");
        dispatch(getUser())
        navigate("/")
      }
    } catch (error) {
      if (error.status === 500) {
        toast.error("Server error. Please try again later.")
      } else {
        setError(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <div className="container-full bg-secondary flex items-center justify-center flex-col w-full h-screen p-4">
        <h2 className="text-3xl font-semibold mb-10">Shopping</h2>
        <div className="relative max-w-md w-full bg-bg rounded-2xl py-6 pb-7 px-4 sm:px-6 shadow-lg">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 transition-all duration-200 cursor-pointer"
          >
            <IoMdClose />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold">Login Your Account</h2>
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
            <p className="mb-2 mt-2 text-sm text-secondary2 animate-shake">{error}</p>
          )}
          <p className="mt-1">
            <Link
              to="/forgot-password"
              className="text-secondary2 text-sm"
            >
              Forgot Password?
            </Link>
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              size="md"
              value="SignIn"
              style="base"
              bg="btn2"
              rounded
              classes="font-semibold w-[150px]"
              onClick={loginHandler}
            />
          </div>
        </div>
        <p className="mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-secondary2 hover:underline">
            SignUp
          </Link>
        </p>
      </div>
    </>
  );
}

export default SignIn;
