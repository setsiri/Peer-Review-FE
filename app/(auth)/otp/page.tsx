"use client";

import OtpInput from "@/app/components/OtpInput";
import { useUser } from "@/app/contexts/UserContext";
import { mockUsers } from "@/app/data/mockUsers";
import { validateOtp } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OtpPage() {
  const [ref, setRef] = useState("");

  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      setRef(ref);
    }
  }, []);

  const handleOtpSubmit = async (
    otp: string,
    setOtpErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const res = await validateOtp(otp, ref);
      if (res) {
        localStorage.setItem("access_token", res.access_token);
        setUser(mockUsers[0]); //TODO: set user from API
        router.push("/TeacherDashboard"); //TODO: redirect to the correct page based on user role
      }
    } catch (error) {
      setOtpErrorMessage("รหัส OTP ไม่ถูกต้อง");
    }
  };

  return <OtpInput onSubmit={handleOtpSubmit} otpRefCode={ref} />;
}
