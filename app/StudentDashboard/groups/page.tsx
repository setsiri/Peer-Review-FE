'use client';

import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface Group {
  id: string;
  name: string;
  members: string[];
  status: 'active' | 'inactive';
}

export default function StudentGroupsPage() {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Group A',
      members: ['Student 1', 'Student 2', 'Student 3'],
      status: 'active'
    }
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#39cf34] to-[#188f54] rounded-2xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Group Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-[#24283b] rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[#7aa2f7] text-xl font-medium">{group.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm ${
                group.status === 'active' ? 'bg-[#1a1b26] text-[#9ece6a]' : 'bg-[#1a1b26] text-[#f7768e]'
              }`}>
                {group.status}
              </span>
            </div>
            
            <div className="mb-4">
              <h3 className="text-[#a9b1d6] text-sm font-medium mb-2">สมาชิก</h3>
              <ul className="space-y-1">
                {group.members.map((member, index) => (
                  <li key={index} className="text-[#a9b1d6]">{member}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-[#1a1b26] text-[#7aa2f7] px-3 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 