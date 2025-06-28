import{ useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

const URL = "http://localhost:3000/api/auth/login";

const Login = () => {
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const { storeTokenInLs } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        storeTokenInLs(data.token);
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(data.message || "Login successful!");
        setuser({ email: "", password: "" });
        navigate("/candidate-dashboard");
        // navigate("/hr-dashboard");
      } else {
        setError(data.message);
        alert(data.message || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          <NavLink
            to="/forgot-password"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Forgot Password?
          </NavLink>
        </p>
        <p className="text-center text-sm mt-2">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
