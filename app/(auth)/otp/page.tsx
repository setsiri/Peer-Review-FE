"use client";

import OtpInput from "@/app/components/OtpInput";
import { useUser } from "@/app/contexts/UserContext";
import { mockUsers } from "@/app/data/mockUsers";
import { validateOtp, getProfile } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";

export default function OtpPage() {
  const [ref, setRef] = useState("");
  const [isLoading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await validateOtp(otp, ref);
      if (res) {
        const accessToken = res.access_token;
        await localStorage.setItem("accessToken", accessToken);
        const profile = await getProfile();
        setUser({
          // id: profile.id, //TODO: Add this field in BE
          email: profile.email,
          role: profile.role,
          name: `${profile.firstName}${
            profile.lastName ? " " + profile.lastName : ""
          }`,
        });
        setLoading(false);

        //TODO: deduplicate with dashboard url
        if (res.role === "TEACHER") {
          router.push("/TeacherDashboard");
        } else {
          router.push("/StudentDashboard");
        }
      }
    } catch (error) {
      setLoading(false);
      setOtpErrorMessage("รหัส OTP ไม่ถูกต้อง");
    }
  };

  return (
    <>
      <Loader visible={isLoading} />
      <OtpInput onSubmit={handleOtpSubmit} otpRefCode={ref} />
    </>
  );
}
