import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User2, LayoutDashboard, FilePenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const isAuth = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const NavItem = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
          isActive
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300"
            : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {Icon && <Icon size={16} />}
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      } bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-300">
          <img src="/log.jpg" alt="Logo" className="h-9 w-9 rounded shadow" />
          SignFlow
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuth && (
            <>
              <NavItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
              <NavItem to="/request-sign" label="Request" icon={FilePenLine} />
            </>
          )}
          {!isAuth && <NavItem to="/login" label="Login" />}
          {!isAuth && (
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm"
            >
              Register
            </Link>
          )}
          {isAuth && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-6 pt-4 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            {isAuth ? (
              <>
                <NavItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
                <NavItem to="/request-sign" label="Request" icon={FilePenLine} />
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 w-full text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
