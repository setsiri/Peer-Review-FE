'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { mockGroups, Group } from '../../data/mockGroups';
import { mockUsers } from '../../data/mockUsers';

export default function TeacherGroupsPage() {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    setGroups(mockGroups);
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setGroupName('');
    setSelectedStudents([]);
    setShowModal(true);
  };

  const handleOpenEditModal = (group: Group) => {
    setModalMode('edit');
    setEditingGroup(group);
    setGroupName(group.name);
    setSelectedStudents(group.members);
    setShowModal(true);
  };

  const handleSaveGroup = async () => {
    if (groupName && selectedStudents.length > 0) {
      try {
        if (modalMode === 'create') {
          const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'create',
              data: {
                name: groupName,
                members: selectedStudents,
                teacherId: user?.id || ''
              }
            }),
          });

          const result = await response.json();
          if (result.success) {
            setGroups(result.groups);
          }
        } else if (modalMode === 'edit' && editingGroup) {
          const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'update',
              data: {
                id: editingGroup.id,
                name: groupName,
                members: selectedStudents
              }
            }),
          });

          const result = await response.json();
          if (result.success) {
            setGroups(result.groups);
          }
        }

        setShowModal(false);
        setGroupName('');
        setSelectedStudents([]);
        setEditingGroup(null);
      } catch (error) {
        console.error('Error saving group:', error);
        // You might want to show an error message to the user
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          data: { id: groupId }
        }),
      });

      const result = await response.json();
      if (result.success) {
        setGroups(result.groups);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      // You might want to show an error message to the user
    }
  };

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

      <div className="flex justify-end mb-6">
        <button 
          onClick={handleOpenCreateModal}
          className="bg-[#1a1b26] text-[#7aa2f7] px-6 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span> สร้างกลุ่มใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-[#24283b] rounded-lg p-6 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-[#7aa2f7] text-xl font-medium">{group.name}</h2>
              <div className="h-[2px] bg-gradient-to-r from-[#7aa2f7] to-transparent mt-2"></div>
            </div>
            
            <div className="flex-grow mb-4">
              <h3 className="text-[#a9b1d6] text-sm font-medium mb-2">สมาชิก</h3>
              <ul className="space-y-2">
                {group.members.map((memberId) => (
                  <li key={memberId} className="text-[#a9b1d6] bg-gradient-to-r from-[#2b3540] to-transparent px-3 py-2 rounded-lg">
                    {getStudentName(memberId)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => handleOpenEditModal(group)}
                className="flex-1 bg-[#1a1b26] text-[#7aa2f7] px-3 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors flex items-center justify-center gap-2"
              >
                แก้ไข
              </button>
              <button 
                onClick={() => handleDeleteGroup(group.id)}
                className="flex-1 bg-[#1a1b26] text-[#f7768e] px-3 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors flex items-center justify-center gap-2"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#24283b] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#7aa2f7] mb-4">
              {modalMode === 'create' ? 'สร้างกลุ่มใหม่' : 'แก้ไขกลุ่ม'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-[#a9b1d6] mb-2">ชื่อกลุ่ม</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-[#1a1b26] text-[#a9b1d6] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7aa2f7]"
                placeholder="กรอกชื่อกลุ่ม"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#a9b1d6] mb-2">เลือกสมาชิก</label>
              <div className="max-h-48 overflow-y-auto bg-[#1a1b26] rounded-lg p-3">
                {mockUsers
                  .filter(user => user.role === 'student')
                  .map(student => (
                    <div key={student.userid} className="flex items-center mb-2 hover:bg-[#2a2e3b] p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.userid)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.userid]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.userid));
                          }
                        }}
                        className="mr-3 w-4 h-4 accent-[#7aa2f7]"
                      />
                      <span className="text-[#a9b1d6]">{student.name}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setGroupName('');
                  setSelectedStudents([]);
                  setEditingGroup(null);
                }}
                className="bg-[#1a1b26] text-[#a9b1d6] px-4 py-2 rounded-lg hover:bg-[#2a2e3b] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveGroup}
                className="bg-[#7aa2f7] text-white px-4 py-2 rounded-lg hover:bg-[#5d84d7] transition-colors"
              >
                {modalMode === 'create' ? 'สร้าง' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 