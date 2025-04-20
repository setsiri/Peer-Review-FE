'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { notes, materials } from '../data/TeacherNotesAndFiles';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const assignmentPath = user.role === 'student' 
    ? '/dashboard/studentassignment' 
    : '/dashboard/teacherassignment';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7eeddc] to-[#6594f7] rounded-2xl flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">Course Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher's Notes */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26]">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">Teacher's Notes</h2>
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {notes.map((note) => (
              <div key={note.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#7aa2f7] font-medium">{note.title}</h3>
                  <span className="text-[#787c99] text-sm">{note.date}</span>
                </div>
                <p className="text-[#a9b1d6] text-sm whitespace-pre-line">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Slides */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#1a1b26]">
            <h2 className="text-[#a9b1d6] text-lg font-semibold">Course Slides & Documents</h2>
          </div>
          <div className="divide-y divide-[#1a1b26]">
            {materials.map((material) => (
              <div key={material.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#7aa2f7] font-medium">{material.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[#787c99] text-sm">
                        {material.type.toUpperCase()} • {material.size}
                      </span>
                      <span className="text-[#787c99] text-sm">
                        Uploaded: {material.uploadDate}
                      </span>
                    </div>
                  </div>
                  <a
                    href={material.downloadUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1b26] text-[#73daca] rounded hover:bg-[#2a2e3b] transition-colors text-sm"
                    download
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 