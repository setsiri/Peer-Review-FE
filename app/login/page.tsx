"use client";

import { useState, useEffect } from "react";
import { mockUsers } from "../data/mockUsers";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import OtpInput from "@/app/components/OtpInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [foundUser, setFoundUser] = useState(null as any);

  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      if (user.role === "teacher") {
        router.push("/TeacherDashboard");
      } else {
        router.push("/StudentDashboard");
      }
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setFoundUser(foundUser);
      setIsOtpStage(true);
      setError("");
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleOtpSubmit = (
    otp: string,
    setOtpErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (otp === "123456") {
      setUser(foundUser); // TODO: Replace with actual user data
    } else {
      setOtpErrorMessage("รหัส OTP ไม่ถูกต้อง");
    }
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

  function LoginForm({
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
  }: {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    handleLogin: (e: React.FormEvent) => void;
  }) {
    return (
      <form onSubmit={handleLogin} className="space-y-6">
        <InputField
          id="email"
          label="อีเมล"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        <InputField
          id="password"
          label="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          className="w-full bg-[#7aa2f7] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7aa2f7]/90 transition-colors"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    );
  }

  function InputField({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
  }: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#a9b1d6] mb-2"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 bg-[#1a1b26] border border-[#2a2e3f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
          placeholder={placeholder}
          required
        />
      </div>
    );
  }

  function ErrorMessage({ message }: { message: string }) {
    return <div className="text-[#f7768e] text-sm text-center">{message}</div>;
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
    <OtpInput
      onSubmit={handleOtpSubmit}
      otpRefCode="RF123456"
      errorMessage={error}
    />
  ) : (
    <div className="min-h-screen bg-[#1a1b26] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#24283b] rounded-lg shadow-lg p-8">
          <Header />
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            handleLogin={handleLogin}
          />
          <TestCredentials />
        </div>
      </div>
    </div>
  );
}
