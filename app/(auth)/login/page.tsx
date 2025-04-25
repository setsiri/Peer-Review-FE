"use client";

import { useState, useEffect } from "react";
import { mockUsers } from "@/app/data/mockUsers";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";
import OtpInput from "@/app/components/OtpInput";
import Loader from "@/app/components/Loader";
import { getProfile } from "@/app/lib/auth";
import { mapName } from "@/app/services/commonService";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [foundUser, setFoundUser] = useState(null as any);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    // Handle Github login redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setFoundUser(mockUsers[0]); //TODO: Replace with actual user data
      setIsOtpStage(true);
    }

    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      router.push("/subject");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status !== 201) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      const data = await response.json();
      await localStorage.setItem("accessToken", data.access_token);

      const profile = await getProfile();
      setFoundUser({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        name: mapName(profile),
      });
      setError("");
      setIsOtpStage(true);
    } catch (error) {
      console.error("Login error:", error);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (
    otp: string,
    setOtpErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (otp === "123456") {
      setUser(foundUser);
    } else {
      setOtpErrorMessage("รหัส OTP ไม่ถูกต้อง");
    }
  };

  const handleGithubLogin = () => {
    setLoading(true);
    const githubAuthUrl = `http://localhost:3000/auth/github`;
    window.location.href = githubAuthUrl;
  };

  function Header() {
    return (
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Peer Review</h1>
        <p className="text-[#787c99]">
          เข้าสู่ระบบเพื่อจัดการการเรียนรู้ของคุณ
        </p>
      </div>
    );
  }

  function TestCredentials() {
    return (
      <div className="mt-8 text-sm text-[#787c99] text-center">
        <p>ข้อมูลเข้าสู่ระบบสำหรับทดสอบ:</p>
        <p className="mt-2">อาจารย์: ajarn.somchai@monkup.com / teacher123</p>
        <p>นักเรียน: somying@student.monkup.com / student123</p>
      </div>
    );
  }

  return isOtpStage ? (
    <OtpInput onSubmit={handleOtpSubmit} otpRefCode="RF123456" />
  ) : (
    <>
      <Loader visible={isLoading} />
      <div className="bg-[#24283b] rounded-lg shadow-lg p-8">
        <Header />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleLogin={handleLogin}
          handleGithubLogin={handleGithubLogin}
        />
        {/* <TestCredentials /> */}
      </div>
    </>
  );
}
