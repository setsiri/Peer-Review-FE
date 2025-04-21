"use client";

import OtpInput from "@/app/components/OtpInput";
import { useUser } from "@/app/contexts/UserContext";
import { mockUsers } from "@/app/data/mockUsers";

export default function OtpPage() {
  const { setUser } = useUser();

  const handleOtpSubmit = (
    otp: string,
    setOtpErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    //TODO: Replace with actual OTP validation
    if (otp === "123456") {
      setUser(mockUsers[0]); // TODO: Replace with actual user data
    } else {
      setOtpErrorMessage("รหัส OTP ไม่ถูกต้อง");
    }
  };

  return <OtpInput onSubmit={handleOtpSubmit} otpRefCode="RF123456" />;
}
