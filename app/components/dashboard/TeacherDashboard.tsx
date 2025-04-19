'use client';

import { useState } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  type: 'solo' | 'group' | 'review';
  totalSubmissions: number;
  pendingReviews: number;
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'All' | 'Solo' | 'Group'>('All');
  const [assignments] = useState<Assignment[]>([
    { 
      id: '1', 
      name: 'Assignment - Solo 1', 
      dueDate: '2024-03-31',
      type: 'solo',
      totalSubmissions: 25,
      pendingReviews: 10
    },
    { 
      id: '2', 
      name: 'Assignment - Project Group 1', 
      dueDate: '2024-03-29',
      type: 'group',
      totalSubmissions: 8,
      pendingReviews: 3
    },
    { 
      id: '3', 
      name: 'Assignment - Review Solo 1', 
      dueDate: '2024-03-28',
      type: 'review',
      totalSubmissions: 30,
      pendingReviews: 15
    }
  ]);

  const getTypeCount = (type: Assignment['type']) => 
    assignments.filter(a => a.type === type).length;

  const getTotalSubmissions = () => 
    assignments.reduce((acc, curr) => acc + curr.totalSubmissions, 0);

  const getTotalPendingReviews = () => 
    assignments.reduce((acc, curr) => acc + curr.pendingReviews, 0);

  const filteredAssignments = activeTab === 'All' 
    ? assignments 
    : assignments.filter(a => a.type.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7aa2f7] to-[#bb9af7] rounded-2xl flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Assignment Management</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">Total Assignments</h3>
          <p className="text-[#7aa2f7] text-2xl font-bold mt-1">{assignments.length}</p>
        </div>
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">Total Submissions</h3>
          <p className="text-[#bb9af7] text-2xl font-bold mt-1">{getTotalSubmissions()}</p>
        </div>
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">Pending Reviews</h3>
          <p className="text-[#f7768e] text-2xl font-bold mt-1">{getTotalPendingReviews()}</p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-[#24283b] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#1a1b26]">
          <div className="flex items-center gap-3">
            <span className="text-[#a9b1d6] text-sm font-medium">Show:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('All')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${activeTab === 'All'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('Solo')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${activeTab === 'Solo'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                Solo
              </button>
              <button
                onClick={() => setActiveTab('Group')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${activeTab === 'Group'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                Group
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#1a1b26]">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-6 hover:bg-[#1a1b26] transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#a9b1d6] font-medium">{assignment.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[#787c99] text-sm">Due: {assignment.dueDate}</span>
                    <span className="text-[#787c99] text-sm">Submissions: {assignment.totalSubmissions}</span>
                    <span className="text-[#787c99] text-sm">Pending Reviews: {assignment.pendingReviews}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.type === 'solo'
                      ? 'bg-[#9ece6a]/10 text-[#9ece6a]'
                      : assignment.type === 'group'
                      ? 'bg-[#7aa2f7]/10 text-[#7aa2f7]'
                      : 'bg-[#bb9af7]/10 text-[#bb9af7]'
                  }`}>
                    {assignment.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${assignment.pendingReviews > 0 
                      ? 'bg-[#f7768e]/10 text-[#f7768e]'
                      : 'bg-[#9ece6a]/10 text-[#9ece6a]'
                    }`}>
                    {assignment.pendingReviews > 0 ? 'Needs Review' : 'All Reviewed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 