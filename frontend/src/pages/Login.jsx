import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginAPI, googleLogin as googleLoginAPI, forgotPassword, resetPassword } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';



// Animated Text Component
const AnimatedText = ({ text, delay = 0, isDark }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const chars = text.split('');

  return (
    <h1 className="text-5xl font-bold mb-6">
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.03}s`,
            color: isDark ? '#FFFFFF' : '#111827',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
};


// Inline Forgot Password modal
const ForgotPasswordModal = ({ isDark, onClose }) => {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message || 'OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await resetPassword(email, otp, newPassword);
      setMessage('Password reset successful! You can now login.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Blurred animated overlay */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-md"
        style={{
          background:
            isDark
              ? 'radial-gradient(circle at top, rgba(129,140,248,0.35), rgba(15,23,42,0.9))'
              : 'radial-gradient(circle at top, rgba(59,130,246,0.25), rgba(15,23,42,0.7))',
          animation: 'modalBackdropFade 0.4s ease-out',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ overflow: 'hidden' }}
        >
          {/* floating glow 1 */}
          <div
            className="absolute rounded-full blur-3xl opacity-40"
            style={{
              width: '320px',
              height: '320px',
              background: isDark ? '#4F46E5' : '#60A5FA',
              top: '-80px',
              left: '-60px',
              animation: 'modalFloat 12s ease-in-out infinite',
            }}
          />
          {/* floating glow 2 */}
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: '260px',
              height: '260px',
              background: isDark ? '#EC4899' : '#F97316',
              bottom: '-60px',
              right: '-40px',
              animation: 'modalFloat 14s ease-in-out infinite reverse',
            }}
          />
        </div>
      </div>

      {/* Modal card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md p-6 rounded-2xl shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: isDark
              ? 'rgba(15,23,42,0.95)'
              : 'rgba(255,255,255,0.98)',
            border: `1px solid ${
              isDark ? 'rgba(148,163,184,0.4)' : 'rgba(148,163,184,0.3)'
            }`,
            animation: 'modalScaleIn 0.35s ease-out',
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-xl font-semibold"
              style={{ color: isDark ? '#F9FAFB' : '#111827' }}
            >
              Forgot Password
            </h3>
            <button
              onClick={onClose}
              className="text-lg font-bold hover:scale-110 transition-transform"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            >
              ✕
            </button>
          </div>

          {message && (
            <div
              className="mb-3 p-2 rounded text-sm"
              style={{
                backgroundColor: isDark
                  ? 'rgba(34,197,94,0.1)'
                  : '#D1FAE5',
                color: '#10B981',
                border: '1px solid #10B981',
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className="mb-3 p-2 rounded text-sm"
              style={{
                backgroundColor: isDark
                  ? 'rgba(239,68,68,0.1)'
                  : '#FEE2E2',
                color: '#EF4444',
                border: '1px solid #EF4444',
              }}
            >
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#F9FAFB',
                    color: isDark ? '#FFFFFF' : '#111827',
                    border: `2px solid ${
                      isDark ? '#1F2937' : '#E5E7EB'
                    }`,
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: isDark ? '#818CF8' : '#4F46E5',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(79,70,229,0.35)',
                }}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                >
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  maxLength={6}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-center tracking-widest"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#F9FAFB',
                    color: isDark ? '#FFFFFF' : '#111827',
                    border: `2px solid ${
                      isDark ? '#1F2937' : '#E5E7EB'
                    }`,
                  }}
                  placeholder="000000"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: isDark ? '#020617' : '#F9FAFB',
                    color: isDark ? '#FFFFFF' : '#111827',
                    border: `2px solid ${
                      isDark ? '#1F2937' : '#E5E7EB'
                    }`,
                  }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: isDark ? '#818CF8' : '#4F46E5',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(79,70,229,0.35)',
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Modal-specific animations */}
      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modalFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>
    </>
  );
};





const Login = ({ isDark }) => {
  const navigate = useNavigate();
  const { login: loginContext, setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginAPI(email, password); // /login backend











      // Save token and user in localStorage (for AuthContext)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Context login expects to set user/token; call with full object if needed
      if (loginContext) {
        // Your AuthContext.login currently does axios; to avoid double call,
        // if you prefer, you can adjust AuthContext or simply set user there.
        // Here we just set user via loginContext if it accepts (email, password),
        // otherwise you can skip and rely on AuthContext useEffect reading localStorage.
        try {
          await loginContext(email, password);
        } catch {
          // if loginContext shape differs, dashboard will still work via localStorage
        }
      }

      // Go to dashboard after login
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 relative overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
          : 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 50%, #DDD6FE 100%)',
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: '500px',
            height: '500px',
            background: isDark ? '#818CF8' : '#4F46E5',
            top: '-200px',
            left: '-200px',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: '400px',
            height: '400px',
            background: isDark ? '#F472B6' : '#EC4899',
            bottom: '-150px',
            right: '-150px',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: '300px',
            height: '300px',
            background: isDark ? '#A78BFA' : '#8B5CF6',
            top: '50%',
            right: '10%',
            animation: 'float 18s ease-in-out infinite',
          }}
        />
      </div>

      <div className="flex min-h-screen pt-24 relative z-10">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 overflow-y-auto">
          <div
            className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: isDark
                ? 'rgba(31, 41, 55, 0.9)'
                : 'rgba(255, 255, 255, 0.95)',
              marginTop: '2rem',
              marginBottom: '2rem',
              animation: 'fadeInUp 0.6s ease-out',
            }}
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: isDark ? '#FFFFFF' : '#111827' }}
              >
                Welcome Back
              </h2>
              <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                Log in to continue to TaskMaster
              </p>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-sm text-center"
                style={{
                  backgroundColor: isDark
                    ? 'rgba(239, 68, 68, 0.1)'
                    : '#FEE2E2',
                  color: '#EF4444',
                  border: '1px solid #EF4444',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* ... existing fields ... */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2" style={{ backgroundColor: isDark ? '#374151' : '#F9FAFB', color: isDark ? '#FFFFFF' : '#111827', border: `2px solid ${isDark ? '#4B5563' : '#E5E7EB'}` }} placeholder="Enter your email" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: isDark ? '#E5E7EB' : '#374151' }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2" style={{ backgroundColor: isDark ? '#374151' : '#F9FAFB', color: isDark ? '#FFFFFF' : '#111827', border: `2px solid ${isDark ? '#4B5563' : '#E5E7EB'}` }} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4" />
                  <span style={{ color: isDark ? '#E5E7EB' : '#374151' }}>Remember me</span>
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm font-semibold hover:underline" style={{ color: isDark ? '#818CF8' : '#4F46E5' }}>Forgot Password?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50" style={{ backgroundColor: isDark ? '#818CF8' : '#4F46E5', color: '#FFFFFF', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' }}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400">Or</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            const res = await googleLoginAPI(credentialResponse.credential);
                            // Use setAuth to update context without triggering another API call
                            if (setAuth) {
                                setAuth(res.data.token, res.data.user);
                            }
                            navigate('/dashboard');
                        } catch (err) {
                            console.error("Google Login Failed", err);
                            setError("Google Login Failed: " + (err.response?.data?.message || err.message));
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                        setError("Google Login Failed");
                    }}
                    theme={isDark ? 'filled_black' : 'outline'}
                    shape="pill"
                  />
              </div>
            </form>

            <div className="mt-6 text-center">
              <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold hover:underline"
                  style={{ color: isDark ? '#818CF8' : '#4F46E5' }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 fixed right-0 top-0 bottom-0 pt-24">
          <div className="text-center">
            <AnimatedText
              text="Welcome Back!"
              isDark={isDark}
              delay={400}
            />

            <div style={{ animation: 'fadeIn 0.8s ease-out 0.8s both' }}>
              <p
                className="text-xl mb-4"
                style={{ color: isDark ? '#D1D5DB' : '#374151' }}
              >
                Continue your productivity journey with TaskMaster
              </p>
              <p
                className="text-lg"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                Track tasks • Set priorities • Achieve goals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>

      {/* Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal
          isDark={isDark}
          onClose={() => setShowForgot(false)}
        />
      )}
    </div>
  );
};

export default Login;
