import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!form.email) validationErrors.email = "Email is required.";
    if (!form.password) validationErrors.password = "Password is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      setFormError("Invalid email or password.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 transition-all duration-500 ease-in-out">

      {/* Branding / Left Panel */}
      <div className="hidden lg:flex items-center justify-center px-12 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-md text-center space-y-4 animate-fade-in">
          <img
            src="/log.jpg"
            alt="SignFlow Logo"
            className="w-20 h-20 mx-auto rounded-lg shadow-md"
          />
          <h1 className="text-4xl font-bold text-indigo-700">Welcome to SignFlow</h1>
          <p className="text-gray-600 text-base">
            Seamlessly sign, manage, and share documents — all in one secure space.
          </p>
          <img
            src="/sign.png"
            alt="Document signing"
            className="mt-8 w-full max-h-80 object-contain"
          />
        </div>
      </div>

      {/* Login Form */}
      <section className="flex items-center justify-center px-6 py-12 bg-white bg-opacity-30 backdrop-blur-xl">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md border border-white/40 shadow-2xl rounded-2xl px-8 py-10 bg-white/80 backdrop-blur-md transition duration-300 hover:shadow-indigo-200 space-y-6"
        >
          {/* Title */}
          <div className="text-center space-y-2">
            <img src="/log.jpg" alt="SignFlow Icon" className="w-12 mx-auto rounded-md" />
            <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
            <p className="text-gray-500 text-sm">Secure access to all your workflows</p>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="bg-red-100 border border-red-300 text-red-600 text-sm rounded p-3 text-center">
              {formError}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-indigo-400" size={18} />
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-indigo-400" size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 shadow-md"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register Prompt */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
