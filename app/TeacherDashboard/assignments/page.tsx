'use client';

import { useState } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Assignment {
  id: string;
  title: string;
  type: 'solo' | 'group' | 'review';
  target?: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Assignment - Solo 1',
      type: 'solo',
      dueDate: '2024-03-31',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Assignment - Project Group 1',
      type: 'group',
      dueDate: '2024-03-29',
      status: 'in_progress'
    },
    {
      id: '3',
      title: 'Assignment - Review Solo 1',
      type: 'review',
      target: 'Student A',
      dueDate: '2024-03-28',
      status: 'completed'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return assignment.status === 'in_progress' || assignment.status === 'pending';
    return assignment.status === filter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7aa2f7] to-[#a06bff] rounded-2xl flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Assignment Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">Pending Tasks</h3>
          <p className="text-[#f7768e] text-2xl font-bold mt-1">2</p>
        </div>
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">In Progress</h3>
          <p className="text-[#e0af68] text-2xl font-bold mt-1">1</p>
        </div>
        <div className="bg-[#24283b] p-6 rounded-lg">
          <h3 className="text-[#787c99] text-sm">Completed</h3>
          <p className="text-[#9ece6a] text-2xl font-bold mt-1">3</p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-[#24283b] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#1a1b26]">
          <div className="flex items-center gap-3">
            <span className="text-[#a9b1d6] text-sm font-medium">Show:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${filter === 'all'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${filter === 'in_progress'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                  ${filter === 'completed'
                    ? 'bg-[#456bd6] text-white'
                    : 'bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]'
                  }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#1a1b26]">
          {filteredAssignments.map((assignment) => (
            <Link
              key={assignment.id}
              href={`/TeacherDashboard/assignments/${assignment.id}`}
              className="block p-6 hover:bg-[#1a1b26] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#a9b1d6] font-medium">{assignment.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[#787c99] text-sm">Due: {assignment.dueDate}</span>
                    {assignment.target && (
                      <span className="text-[#787c99] text-sm">Review for: {assignment.target}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${assignment.type === 'solo' ? 'bg-[#9ece6a]/10 text-[#9ece6a]' :
                      assignment.type === 'group' ? 'bg-[#7aa2f7]/10 text-[#7aa2f7]' :
                      'bg-[#bb9af7]/10 text-[#bb9af7]'}`}
                  >
                    {assignment.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${assignment.status === 'completed' ? 'bg-[#9ece6a]/10 text-[#9ece6a]' :
                      assignment.status === 'in_progress' ? 'bg-[#e0af68]/10 text-[#e0af68]' :
                      'bg-[#f7768e]/10 text-[#f7768e]'}`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 