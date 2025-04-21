'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { mockGroups, Group } from '../../data/mockGroups';
import { mockUsers } from '../../data/mockUsers';

export default function StudentGroupsPage() {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);

  // Load initial data and filter groups where student is a member
  useEffect(() => {
    if (user) {
      console.log('Current user:', user);
      // ค้นหา userid จาก mockUsers
      const currentUser = mockUsers.find(u => u.id === user.id);
      if (currentUser) {
        const studentGroups = mockGroups.filter(group => 
          group.members.includes(currentUser.userid)
        );
        console.log('Filtered groups:', studentGroups);
        setGroups(studentGroups);
      }
    }
  }, [user]);

  const getStudentName = (studentId: string) => {
    const student = mockUsers.find(user => user.userid === studentId);
    return student ? student.name : studentId;
  };

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
            <h1 className="text-3xl font-semibold text-white translate-y-2">Groups Dashboard</h1>
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center text-[#a9b1d6] py-8">
          <p>คุณยังไม่ได้อยู่ในกลุ่มใดๆ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-[#24283b] rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-[#7aa2f7] text-xl font-medium">{group.name}</h2>
                <div className="h-[2px] bg-gradient-to-r from-[#7aa2f7] to-transparent mt-2"></div>
              </div>
              
              <div>
                <h3 className="text-[#a9b1d6] text-sm font-medium mb-2">สมาชิก</h3>
                <ul className="space-y-2">
                  {group.members.map((memberId) => (
                    <li key={memberId} className="text-[#a9b1d6] bg-gradient-to-r from-[#2b3540] to-transparent px-3 py-2 rounded-lg">
                      {getStudentName(memberId)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
