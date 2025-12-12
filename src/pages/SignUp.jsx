import React, { useState } from "react";
import { Input } from "../components/index.js";

function SignUp() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.name]: e.value });
  };

  return (
    <div className="container-full bg-white dark:bg-gray-800 flex items-center justify-center flex-col w-full h-screen">
      <h2>Shopping store</h2>
      <div className="max-w-lg w-[400px] border border-gray-600 rounded-2xl">
        <Input
          value={data.username}
          onchange={handleChange}
          placeholder="Enter your name"
          name="username"
          labelText="Full Name"
          label={true}
          size="lg"
          type="text"
        />
        <Input
          value={data.email}
          onchange={handleChange}
          placeholder="Enter your email"
          name="email"
          labelText="Email"
          label={true}
          size="lg"
          type="email"
        />
        <Input
          value={data.password}
          onchange={handleChange}
          placeholder="Enter your password"
          name="password"
          labelText="Password"
          label={true}
          size="lg"
          type="password"
        />
      </div>
    </div>
  );
}

export default SignUp;
