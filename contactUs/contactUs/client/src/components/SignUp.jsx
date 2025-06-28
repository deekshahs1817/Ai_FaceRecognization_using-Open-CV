import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const URL = "http://localhost:3000/api/auth/register";

const SignUp = () => {
  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { storeTokenInLs } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword((prev) => !prev);
    if (field === "confirmPassword") setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Confirm password validation
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      alert("Passwords do not match");
      setLoading(false);
      return; // Stop form submission
    }

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(user),
        body: JSON.stringify({ name:user.name, email: user.email, password: user.password }),
      });

      const data = await response.json();
      if (response.ok && data) {
        storeTokenInLs(data.token);
        alert(data.message);
        setuser({ name: "", email: "", password: "", confirmPassword: "" });
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
        alert(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
              value={user.name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your password"
                value={user.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
