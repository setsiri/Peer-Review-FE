"use client";

import { useState, useRef } from "react";

interface OtpInputProps {
  onSubmit: (
    otp: string,
    setOtpErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  otpRefCode: string; // Reference code to display
}

export default function OtpInput({ onSubmit, otpRefCode }: OtpInputProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, otp.length);
    if (!/^\d*$/.test(pastedData)) return; // Allow only digits

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    if (nextEmptyIndex !== -1) {
      inputsRef.current[nextEmptyIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    onSubmit(enteredOtp, setError);
  };

  return (
    <div className="bg-[#24283b] rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">ยืนยัน OTP</h1>
        <p className="text-[#787c99]">กรุณาใส่รหัส OTP เพื่อดำเนินการต่อ</p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el!;
              }}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center bg-[#1a1b26] border border-[#2a2e3f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7aa2f7] text-xl"
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <div className="text-[#f7768e] text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            otp.some((digit) => !digit) ? "primary-btn-disabled" : "primary-btn"
          }`}
          disabled={otp.some((digit) => !digit)}
        >
          ยืนยัน
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-[#787c99] text-sm">
          รหัสอ้างอิง:{" "}
          <span className="text-white font-medium">{otpRefCode}</span>
        </p>
      </div>
    </div>
  );
}
