import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!form.name.trim()) validationErrors.name = "Name is required.";
    if (!form.email.trim()) validationErrors.email = "Email is required.";
    if (!form.password.trim()) validationErrors.password = "Password is required.";
    if (form.password.length < 6)
      validationErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out">
      {/* Left Panel */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-100 px-10 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-md text-center animate-fade-in">
          <img
            src="/log.jpg"
            alt="SignFlow Logo"
            className="w-20 mx-auto mb-4 rounded-md shadow-md"
          />
          <h1 className="text-3xl font-bold text-red-700 dark:text-white mb-2">
            Welcome to SignFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Streamline document signing and collaboration securely.
          </p>
          <img
            src="/reg2.jpg "
            alt="Sign preview"
            className="mt-8 w-full max-h-80 object-contain rounded-full "
          />
        </div>
      </div>

      {/* Right Panel - Form */}
      <section className="flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-8 space-y-6 transform transition hover:shadow-xl"
          aria-labelledby="register-heading"
        >
          {/* Heading */}
          <div className="text-center space-y-2">
            <img src="/log.jpg" alt="SignFlow Icon" className="w-10 mx-auto rounded-md" />
            <h2 id="register-heading" className="text-2xl font-bold text-gray-800 dark:text-white">
              Create your account
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Start managing your documents today
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 transition dark:bg-gray-700 dark:text-white`}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 transition dark:bg-gray-700 dark:text-white`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 transition dark:bg-gray-700 dark:text-white`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
