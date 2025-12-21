import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/api';

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle sending the OTP (Step 1)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
      setStep(2); // Move to next step
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle resetting the password (Step 2)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await resetPassword(email, otp, newPassword);
      setMessage('Password reset successful! You can now login.');
      
      // Optional: Close modal after 2 seconds
      setTimeout(() => {
        onClose(); 
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

        {step === 1 ? (
          // STEP 1 FORM: EMAIL ONLY
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          // STEP 2 FORM: OTP + NEW PASSWORD
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="text-sm text-gray-600 mb-2">
              OTP sent to: <strong>{email}</strong>
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-green-300"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-500 hover:underline text-center"
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;