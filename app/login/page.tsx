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
    // Handle Github login redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setFoundUser(mockUsers[0]); //TODO: Replace with actual user data
      setIsOtpStage(true);
    }

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

  const handleGithubLogin = () => {
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
        <button
          type="button"
          onClick={() => handleGithubLogin()}
          className="w-full bg-[#24292e] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#24292e]/90 transition-colors flex items-center justify-center space-x-2 border border-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.774.42-1.305.763-1.605-2.665-.3-5.467-1.333-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.403c1.02.005 2.045.137 3.003.403 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.241 2.873.118 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.48 5.92.432.372.816 1.102.816 2.222v3.293c0 .32.192.694.8.576C20.565 21.797 24 17.297 24 12c0-6.63-5.37-12-12-12z"
              clipRule="evenodd"
            />
          </svg>
          <span>เข้าสู่ระบบด้วย GitHub</span>
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
    <OtpInput onSubmit={handleOtpSubmit} otpRefCode="RF123456" />
  ) : (
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
  );
}
