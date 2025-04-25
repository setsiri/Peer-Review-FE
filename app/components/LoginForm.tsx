import React from "react";
import InputField from "@/app/components/InputField";

const LoginForm = ({
                     email,
                     setEmail,
                     password,
                     setPassword,
                     error,
                     handleLogin,
                     handleGithubLogin
                   }: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  handleLogin: (e: React.FormEvent) => void;
  handleGithubLogin: () => void;
}) => {

  const ErrorMessage = ({ message }: { message: string }) => {
    return <div className="text-[#f7768e] text-sm text-center">{message}</div>;
  };

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
};

export default LoginForm;
