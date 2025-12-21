import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

const Signup = ({ isDark }) => {
  const navigate = useNavigate();

  // steps: 1 = name+email -> send OTP, 2 = OTP+password -> verify
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // STEP 1: call backend /signup to send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,          // backend ignores name now but safe to send
        email,
      });
      setMessage(res.data.message || 'OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: call backend /verify-signup to create the user
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/verify-signup', {
        name,
        email,
        otp,
        password,
      });

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please check your OTP and try again.'
      );
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
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-8 overflow-y-auto">
          <div
            className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: isDark
                ? 'rgba(31, 41, 55, 0.9)'
                : 'rgba(255, 255, 255, 0.95)',
              marginTop: '2rem',
              marginBottom: '2rem',
              animation:
                step === 1
                  ? 'fadeInUp 0.6s ease-out'
                  : 'scaleIn 0.5s ease-out',
            }}
          >
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: isDark ? '#FFFFFF' : '#111827' }}
              >
                {step === 1 ? 'Create Account' : 'Verify & Set Password'}
              </h2>
              <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                {step === 1 ? 'Join TaskMaster today' : `OTP sent to ${email}`}
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

            {message && (
              <div
                className="mb-4 p-3 rounded-lg text-sm text-center"
                style={{
                  backgroundColor: isDark
                    ? 'rgba(34, 197, 94, 0.1)'
                    : '#D1FAE5',
                  color: '#10B981',
                  border: '1px solid #10B981',
                }}
              >
                {message}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#F9FAFB',
                      color: isDark ? '#FFFFFF' : '#111827',
                      border: `2px solid ${
                        isDark ? '#4B5563' : '#E5E7EB'
                      }`,
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#F9FAFB',
                      color: isDark ? '#FFFFFF' : '#111827',
                      border: `2px solid ${
                        isDark ? '#4B5563' : '#E5E7EB'
                      }`,
                    }}
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: isDark ? '#818CF8' : '#4F46E5',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 text-center tracking-widest text-2xl"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#F9FAFB',
                      color: isDark ? '#FFFFFF' : '#111827',
                      border: `2px solid ${
                        isDark ? '#4B5563' : '#E5E7EB'
                      }`,
                    }}
                    placeholder="000000"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                  >
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: isDark ? '#374151' : '#F9FAFB',
                        color: isDark ? '#FFFFFF' : '#111827',
                        border: `2px solid ${
                          isDark ? '#4B5563' : '#E5E7EB'
                        }`,
                      }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: isDark ? '#E5E7EB' : '#374151' }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: isDark ? '#374151' : '#F9FAFB',
                      color: isDark ? '#FFFFFF' : '#111827',
                      border: `2px solid ${
                        isDark ? '#4B5563' : '#E5E7EB'
                      }`,
                    }}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: isDark ? '#818CF8' : '#4F46E5',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  {loading ? 'Verifying...' : 'Complete Registration'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm hover:underline"
                  style={{ color: isDark ? '#818CF8' : '#4F46E5' }}
                >
                  ← Change Email
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold hover:underline"
                  style={{ color: isDark ? '#818CF8' : '#4F46E5' }}
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 fixed right-0 top-0 bottom-0 pt-24">
          <div className="text-center">
            <AnimatedText
              text="Start Your Journey"
              isDark={isDark}
              delay={400}
            />

            <div style={{ animation: 'fadeIn 0.8s ease-out 0.8s both' }}>
              <p
                className="text-xl mb-4"
                style={{ color: isDark ? '#D1D5DB' : '#374151' }}
              >
                Join thousands of productive users
              </p>
              <p
                className="text-lg"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                Organize • Prioritize • Achieve
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
