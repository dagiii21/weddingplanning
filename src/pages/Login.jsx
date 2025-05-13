import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaHome } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/ui/Button";
import useLogin from "../hooks/useLogin";

/**
 * Login page component
 * @returns {JSX.Element} Login page
 */
const Login = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    isLoading,
    loginError,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Toast Container */}
      <ToastContainer />

      {/* Left Side - Image with Quote */}
      <div className="hidden md:flex md:w-1/2 relative bg-purple-100">
        {/* Home Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate("/")}
            className="bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Go to home page"
          >
            <FaHome className="text-purple-600 text-xl" />
          </button>
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("/image/venue/5f1889814db54c54ce84efff_weddings.jpg")',
            filter: "brightness(0.7)",
          }}
        />

        {/* Quote Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-3xl font-[Playwrite US Trad] text-purple-800 mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-700 italic">
              "A successful marriage requires falling in love many times, always
              with the same person."
            </p>
            <p className="mt-2 text-gray-600 font-semibold">
              — Mignon McLaughlin
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
            <p className="text-gray-600 mt-2">
              Welcome back to your wedding journey
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Authentication Error</span>
              </div>
              <p className="mt-2 text-sm">{loginError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500
                          ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500
                          ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                text={isLoading ? "Signing In..." : "Sign In"}
                disabled={isLoading}
                className="w-full py-2.5 text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
              />
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
