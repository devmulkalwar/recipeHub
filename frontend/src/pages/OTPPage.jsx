import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuthContext';

const OTPPage = () => {
  const navigate = useNavigate();
  const { verifyEmail, user } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // Timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];

    // Limit to 1 character for individual input
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Focus on the next input field
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    // Move to previous input on backspace
    if (event.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < 6) {
        newOtp[idx] = digit;
        inputRefs.current[idx].value = digit; // Update input field directly
      }
    });
    setOtp(newOtp);

    const nextIndex = digits.length;
    if (nextIndex < 6) {
      inputRefs.current[nextIndex]?.focus(); // Focus on the next input if available
    } else {
      inputRefs.current[6]?.focus();
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']); // Clear OTP inputs
    setTimer(60); // Reset timer
    setIsTimerActive(true); // Restart timer
    inputRefs.current[0].focus(); // Focus on the first input
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true); // Add loading state
      const success = await verifyEmail(otpCode);
      if (success) {
        toast.success('Email verified successfully!');
        navigate(`/edit-profile/${user.id}`); // Redirect to profile completion
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsTimerActive(false); // Stop timer when it reaches 0
    }
  }, [isTimerActive, timer]);

  useEffect(() => {
    // Focus on the first input when the component mounts
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white shadow-2xl">
        <div className="card-body p-8">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter the verification code sent to your email
          </p>

          {/* OTP Input Section */}
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-semibold border rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            className="btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 mb-6"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Timer/Resend Section */}
          <div className="text-center">
            {isTimerActive ? (
              <p className="text-gray-600">
                Resend code in <span className="font-semibold text-orange-600">{timer}</span> seconds
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors duration-200"
              >
                Resend Verification Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
