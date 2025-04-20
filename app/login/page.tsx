'use client';

import { useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      if (user.role === 'teacher') {
        router.push('/TeacherDashboard');
      } else {
        router.push('/StudentDashboard');
      }
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role === 'teacher') {
        router.push('/TeacherDashboard');
      } else {
        router.push('/StudentDashboard');
      }
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#24283b] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Peer Review</h1>
            <p className="text-[#787c99]">เข้าสู่ระบบเพื่อจัดการการเรียนรู้ของคุณ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a9b1d6] mb-2">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1b26] border border-[#2a2e3f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a9b1d6] mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1b26] border border-[#2a2e3f] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-[#f7768e] text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#7aa2f7] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7aa2f7]/90 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-8 text-sm text-[#787c99] text-center">
            <p>ข้อมูลเข้าสู่ระบบสำหรับทดสอบ:</p>
            <p className="mt-2">อาจารย์: ajarn.somchai@monkup.com / teacher123</p>
            <p>นักเรียน: somying@student.monkup.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
} 