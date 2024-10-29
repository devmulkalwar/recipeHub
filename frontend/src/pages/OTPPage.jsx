import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography } from '@material-tailwind/react';

const OTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // Timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
      <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-2 m-2 w-full max-w-md">
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Enter OTP
        </Typography>
        <div className="w-full flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(e, index)} // Handle paste event
              maxLength={1}
              className="w-10 h-10 md:w-12 md:h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ))}
        </div>
        <Button 
          onClick={() => alert(`OTP entered: ${otp.join('')}`)} 
          color="orange" 
          className="w-full mt-6 py-2"
        >
          Verify OTP
        </Button>
        <div className=" text-center mt-4">
          {isTimerActive ? (
            <Typography variant="body1" className="text-gray-600">
              Resend OTP in {timer} seconds
            </Typography>
          ) : (
            <Button 
              onClick={handleResendOTP} 
              color="orange" 
              className="w-full mt-2 py-2"
            >
              Resend OTP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
