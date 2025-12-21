import { useState } from "react";
import {LuCheck } from "react-icons/lu";
import { Button, Input } from "../components/index.js";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-bg rounded-2xl shadow-lg py-6 px-4 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-btn1/20 rounded-full animate-bounce">
              <LuCheck className="w-10 h-10 text-btn1" />
            </div>

            <h2 className="text-2xl font-bold text-text2 mb-3">
              Check Your Email
            </h2>

            <p className="text-text1 mb-2">
              We've sent a password reset link to
            </p>

            <p className="text-secondary2 font-semibold mb-6">{email}</p>

            <p className="text-sm text-text1 mb-8">
              Click the link in the email to reset your password. If you don't
              see it, check your spam folder.
            </p>

            <Button 
            value="Back to Login"
            style="base" 
            size="md" 
            bg="btn2"
            link="/login"
            classes="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
       <h2 className="text-3xl font-semibold mb-10 text-center">Shopping</h2>
        <div className="bg-bg rounded-2xl shadow-lg py-6 px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-text2 mb-2">
              Forgot Password?
            </h1>

            <p className="text-text1">
              No worries! Enter your email and we'll send you reset
              instructions.
            </p>
          </div>

          {/* Form */}
          <div>
            <div className="mb-4">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                name="email"
                labelText="Email Address"
                label={true}
                size="xl"
                type="email"
              />

              {error && (
                <p className="mt-2 text-sm text-secondary2 animate-shake">
                  {error}
                </p>
              )}
            </div>
            <Button value="Send Reset Link" style="base" bg="btn2" size="md" onClick={handleSubmit} classes="rounded-lg w-full"/>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text1">
              Remember your password?{" "}
              <Link to="/login" className="text-secondary2">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text1">
            Need help? Contact our{" "}
            <Link
              to="/support"
              className="text-secondary2 font-medium"
            >
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
