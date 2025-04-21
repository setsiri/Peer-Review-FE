'use client';

import { teacherNotifications } from '@/app/data/mockNotification';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { BellIcon } from '@heroicons/react/24/outline';

export default function TeacherNotifications() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#edc41f] to-[#e68230] rounded-2xl flex items-center justify-center">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Notification Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {teacherNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-6 rounded-lg ${
              notification.isRead ? 'bg-[#24283b]/50' : 'bg-[#24283b]'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#7aa2f7] font-medium">{notification.title}</h3>
                <p className="text-[#a9b1d6] mt-2">{notification.message}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                notification.type === 'info' ? 'bg-[#1a1b26] text-[#7aa2f7]' :
                notification.type === 'warning' ? 'bg-[#1a1b26] text-[#e0af68]' :
                notification.type === 'success' ? 'bg-[#1a1b26] text-[#9ece6a]' :
                'bg-[#1a1b26] text-[#f7768e]'
              }`}>
                {notification.type}
              </span>
            </div>
            <p className="text-sm text-[#787c99] mt-3">
              {format(new Date(notification.timestamp), 'PPPp', { locale: th })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 