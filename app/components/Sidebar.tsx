'use client';

import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  IdentificationIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const assignmentPath = user?.role === 'student' 
    ? '/StudentDashboard/assignments' 
    : '/TeacherDashboard/assignments';

  const menuItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      href: user?.role === 'student' ? '/StudentDashboard' : '/TeacherDashboard'
    },
    {
      icon: ClipboardDocumentListIcon,
      label: 'Assignments',
      href: assignmentPath
    },
    {
      icon: UserGroupIcon,
      label: 'Group Manage',
      href: user?.role === 'student' ? '/StudentDashboard/groups' : '/TeacherDashboard/groups'
    },
    {
      icon: BellIcon,
      label: 'Notifications',
      href: user?.role === 'student' ? '/StudentDashboard/notifications' : '/TeacherDashboard/notifications'
    }
  ];

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="w-64 min-h-screen bg-[#24283b] flex flex-col shadow-xl">
      {/* Course Info */}
      <div className="bg-gradient-to-r from-[#04365c] to-[#cbd0d4] p-1"></div>
      <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] p-4">
        <h1 className="text-xl font-semibold text-white">Software Des. & Dev.</h1>
        <p className="text-lg text-white/90 mt-1">2110634</p>
        <p className="text-white/80 mt-1">Teacher name.</p>
      </div>
      <div className="bg-gradient-to-r from-[#04365c] to-[#cbd0d4] p-1"></div>

      {/* User Profile */}
      <div className="p-4 bg-[#1a1b26] mx-4 mt-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2a2c3e] ring-2 ring-[#7aa2f7]">
            <img 
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}&backgroundColor=2a2c3e`} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-[#787c99]">
              {user.role === 'teacher' ? 'Teacher' : 'Student'}
            </div>
            <div className="text-sm text-[#787c99] font-mono">
              ID: {user.userid}
            </div>
          </div>
        </div>
        {user.role === 'student' && user.studentId && (
          <div className="flex items-center gap-2 text-sm text-[#787c99] mt-3">
            <IdentificationIcon className="w-5 h-5" />
            <span className="font-mono">Student ID: {user.studentId}</span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 mt-8">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-[#a9b1d6] hover:bg-[#1a1b26] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#f7768e] hover:bg-[#1a1b26] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
} 