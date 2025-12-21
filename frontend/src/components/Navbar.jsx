import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ isDark, setIsDark }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const baseLinkStyle = (active) => ({
    color: isDark ? '#D1D5DB' : '#374151',
    transform: active ? 'translateY(-1px)' : 'translateY(0)',
    borderBottom: active
      ? `2px solid ${isDark ? '#818CF8' : '#4F46E5'}`
      : '2px solid transparent',
    transition: 'all 0.25s ease',
  });

  return (
    <nav
      className="fixed top-0 left-0 right-0 shadow-md z-50 backdrop-blur-sm"
      style={{
        backgroundColor: isDark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.9)',
      }}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight transition-transform duration-300 hover:scale-105"
            style={{ color: isDark ? '#818CF8' : '#4F46E5' }}
          >
            TaskMaster
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Main nav links – visible on landing and after login */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/about"
                className="px-1 pb-0.5 hover:scale-105"
                style={baseLinkStyle(isActive('/about'))}
              >
                About
              </Link>

              <Link
                to="/contact"
                className="px-1 pb-0.5 hover:scale-105"
                style={baseLinkStyle(isActive('/contact'))}
              >
                Contact
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className="px-1 pb-0.5 hover:scale-105"
                  style={baseLinkStyle(isActive('/dashboard'))}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* User pill with icon */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border text-sm md:text-base">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
                      color: isDark ? '#E5E7EB' : '#1F2937',
                    }}
                  >
                    {/* simple user icon initials */}
                    {(user.name || user.email || '?')
                      .toString()
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span
                    className="max-w-32.5 truncate"
                    style={{ color: isDark ? '#E5E7EB' : '#111827' }}
                  >
                    {user.name || user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    border: `1px solid ${isDark ? '#FCA5A5' : '#EF4444'}`,
                    color: isDark ? '#FCA5A5' : '#B91C1C',
                    backgroundColor: isDark ? 'transparent' : '#FEF2F2',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login: blue border only */}
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{
                    border: `2px solid ${isDark ? '#818CF8' : '#2563EB'}`,
                    color: isDark ? '#E5E7EB' : '#1D4ED8',
                    backgroundColor: isActive('/login')
                      ? (isDark ? 'rgba(37,99,235,0.15)' : 'rgba(219,234,254,1)')
                      : 'transparent',
                  }}
                >
                  Login
                </Link>

                {/* Signup: filled blue box */}
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{
                    backgroundColor: isDark ? '#4F46E5' : '#2563EB',
                    color: '#FFFFFF',
                    border: `2px solid ${isDark ? '#6366F1' : '#1D4ED8'}`,
                    boxShadow: isActive('/signup')
                      ? '0 10px 25px rgba(37,99,235,0.35)'
                      : 'none',
                    transform: isActive('/signup')
                      ? 'translateY(-1px) scale(1.02)'
                      : 'translateY(0) scale(1)',
                  }}
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="relative w-14 h-7 rounded-full p-1 transition-all duration-300 hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: isDark ? '#4B5563' : '#D1D5DB' }}
            >
              <div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-xs transition-all duration-300"
                style={{ left: isDark ? '28px' : '4px' }}
              >
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
