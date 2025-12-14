import React, { useState, useRef } from "react";
import { Input, Button } from "../components/index.js";
import { Link } from "react-router-dom";

function SignUp() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isVerified, setisVerified] = useState(false);
  const [popup, setpopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if digit is entered
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const registerHanlder = () => {
    setError("");

    if (!data.username || !data.email || !data.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isVerified) {
      setpopup(true);
    } else {
      alert("Registered Successfully!");
      setisVerified(false);
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setisVerified(true);
    setpopup(false);
  };

  return (
    <>
      <div className="container-full py-10 bg-[#FCFAFF] dark:bg-gray-800 flex items-center justify-center flex-col w-full min-h-screen p-4">
        <h2 className="text-3xl font-semibold mb-6">Shopping</h2>
        <div className="max-w-md w-full bg-white dark:bg-gray-700 rounded-2xl py-6 pb-7 px-4 sm:px-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold">Create Account</h2>
          <Input
            value={data.username}
            onChange={handleChange}
            placeholder="Enter your name"
            name="username"
            labelText="Full Name"
            label={true}
            size="xl"
            type="text"
            parentClass={"mt-4"}
          />
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
            <p className="mb-2 mt-2 text-sm text-red-600 animate-shake">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-center">
            <Button
              size="md"
              value="SignUp"
              style="base"
              rounded
              classes="font-semibold w-[150px]"
              onClick={registerHanlder}
            />
          </div>
        </div>
        <p className="mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
      {popup && (
        <div className="popup w-full h-full fixed top-0 left-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-[350px] dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-1">Email Verification</h2>
            <p>We send 6 digits OTP to your email for confirmation.</p>
            <div className="mt-7">
              <h3>Enter 6 digits OTP:</h3>
              <div className="flex space-x-2 mt-1">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ))}
              </div>
              {error && (
                <p className="mb-2 mt-2 text-sm text-red-600 animate-shake">
                  {error}
                </p>
              )}
              <div className="mt-6 flex justify-center">
                <Button
                  size="md"
                  value="Verify"
                  style="base"
                  rounded
                  classes="font-semibold w-[150px]"
                  onClick={handleVerifyOtp}
                />
              </div>
              <p className="mt-5 text-center text-sm font-semibold">
                Expires in 10 minutes
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;
