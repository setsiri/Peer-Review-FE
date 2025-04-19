'use client';

import { BellIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

export default function NotificationsPage() {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Assignment Available',
      message: 'A new solo assignment has been posted. Check it out!',
      date: '2024-03-25',
      type: 'info'
    },
    {
      id: '2',
      title: 'Review Reminder',
      message: 'Don\'t forget to submit your peer review for Assignment - Solo 1',
      date: '2024-03-24',
      type: 'warning'
    },
    {
      id: '3',
      title: 'Assignment Graded',
      message: 'Your submission for Project Group 1 has been graded',
      date: '2024-03-23',
      type: 'success'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#e0af68] to-[#f7768e] rounded-2xl flex items-center justify-center">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Notifications</h1>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-[#24283b] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#1a1b26]">
          <h2 className="text-[#a9b1d6] text-lg font-semibold">All Notifications</h2>
        </div>
        <div className="divide-y divide-[#1a1b26]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-6 hover:bg-[#3d427a] transition-colors bg-[#1a1b26]/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[#a9b1d6] font-medium flex items-center gap-2">
                    {notification.title}
                  </h3>
                  <p className="text-[#787c99] mt-1">{notification.message}</p>
                  <span className="text-[#787c99] text-sm mt-2 block">
                    {notification.date}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      notification.type === 'info'
                        ? 'bg-[#7aa2f7]/10 text-[#7aa2f7]'
                        : notification.type === 'warning'
                        ? 'bg-[#e0af68]/10 text-[#e0af68]'
                        : 'bg-[#9ece6a]/10 text-[#9ece6a]'
                    }`}
                >
                  {notification.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 