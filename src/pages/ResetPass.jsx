import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { Button, Input } from "../components/index.js";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }
    setIsSubmitted(true);

    // setIsLoading(true);

    // try {
    //   // Replace with your actual API endpoint
    //   const response = await fetch('YOUR_API_ENDPOINT/reset-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ 
    //       token,
    //       password 
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     setIsSubmitted(true);
    //     // Redirect to login after 3 seconds
    //     setTimeout(() => {
    //       navigate('/login');
    //     }, 3000);
    //   } else {
    //     setError(data.message || 'Something went wrong. Please try again.');
    //   }
    // } catch (err) {
    //   setError('Network error. Please check your connection and try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FCFAFF] dark:bg-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full animate-bounce">
              <LuCheck className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Password Reset Successful!
            </h2>

            <p className="text-gray-600 mb-8">
              Your password has been successfully reset. You can now login with your new password.
            </p>

            <Button
              value="Go to Login"
              style="base"
              size="md"
              link="/login"
              classes="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Shopping store
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Reset Password
            </h1>

            <p className="text-gray-600">
              Enter your new password below to reset your account password.
            </p>
          </div>

          {/* Form */}
          <div>
            {/* New Password Field */}
            <div className="mb-4 relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                name="password"
                labelText="New Password"
                label={true}
                size="xl"
                type="password"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-2 relative">
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                name="confirmPassword"
                labelText="Confirm Password"
                label={true}
                size="xl"
                type="password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 animate-shake">
                {error}
              </p>
            )}

            <Button
              value={"Reset Password"}
              style="base"
              size="md"
              onClick={handleSubmit}
              classes="rounded-lg w-full mt-4"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our{" "}
            <Link to="/support" className="text-blue-500 font-medium">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}