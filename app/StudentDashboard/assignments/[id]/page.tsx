'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CodeEditor from '../../../components/CodeEditor';
import Review from '../../../components/Review';
import { Assignment } from '../../../types/assignment';
import Link from 'next/link';

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [code, setCode] = useState('// เขียนคำตอบของคุณที่นี่\n');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'submitted' | 'assigned' | 'reviewed' | 'completed'>('assigned');
  const [lastSubmittedTime, setLastSubmittedTime] = useState<Date | null>(null);

  // Mock assignment data - ในอนาคตควรดึงจาก API
  const assignment: Assignment = {
    id: params.id,
    title: 'Assignment - ชื่อ assignment',
    description: 'คำอธิบายโจทย์จะแสดงที่นี่...',
    type: 'solo',
    status: status,
    createdAt: new Date('2024-01-01'),
    dueDate: new Date('2024-12-31'),
    assignedTo: 'ชื่อนักเรียน'
  };

  // Mock review data
  const mockReviews = [
    {
      id: '1',
      content: 'โค้ดมีการจัดรูปแบบที่ดี และใช้ชื่อตัวแปรที่สื่อความหมาย',
      author: 'อาจารย์ A',
      createdAt: new Date('2024-03-15'),
      comments: [
        {
          id: '1',
          content: 'ควรเพิ่ม comment อธิบายการทำงานของฟังก์ชันด้วย',
          author: 'นักศึกษา B',
          createdAt: new Date('2024-03-16'),
        },
        {
          id: '2',
          content: 'เห็นด้วยครับ จะปรับปรุงให้ดีขึ้น',
          author: 'นักศึกษา A',
          createdAt: new Date('2024-03-16'),
        },
      ],
    },
    {
      id: '2',
      content: 'การแก้ปัญหายังไม่มีประสิทธิภาพเท่าที่ควร ควรพิจารณาใช้อัลกอริทึมที่ดีกว่านี้',
      author: 'อาจารย์ B',
      createdAt: new Date('2024-03-17'),
      comments: [
        {
          id: '3',
          content: 'รบกวนแนะนำแนวทางการปรับปรุงเพิ่มเติมด้วยครับ',
          author: 'นักศึกษา A',
          createdAt: new Date('2024-03-17'),
        },
      ],
    },
  ];

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Implement actual submission logic
      console.log('Submitting code:', code);
      
      // Mock submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('submitted');
      setLastSubmittedTime(new Date());
      
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งคำตอบ กรุณาลองใหม่อีกครั้ง');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white">
      {/* Back Button */}
      <div className="p-4 bg-[#1e2030]">
        <Link 
          href="/StudentDashboard/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7aa2f7] hover:bg-[#6a92e7] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          back
        </Link>
      </div>

      {/* Assignment Header */}
      <div className="p-6">
        <div className="bg-[#24283b] p-6 mb-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
              <div className="flex items-center gap-6 text-base">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Assignment type:</span>
                  <span className="px-2 py-1 rounded-full bg-[#7c5cff]/20 text-[#b845ff]">{assignment.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded-full ${
                    status === 'submitted' ? 'bg-blue-500/20 text-blue-300' :
                    status === 'assigned' ? 'bg-yellow-500/20 text-yellow-300' :
                    status === 'reviewed' ? 'bg-purple-500/20 text-purple-300' :
                    status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white font-medium">{assignment.createdAt?.toLocaleDateString('th-TH')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Due:</span>
                  <span className="text-white font-medium">{assignment.dueDate?.toLocaleDateString('th-TH')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Assigned to:</span>
                  <span className="text-white font-medium">{assignment.assignedTo}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1b26] rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-gray-400">Point:</span>
              <span className="text-2xl font-bold text-[#7aa2f7]">8</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">10</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-[#24283b] p-6 mb-1">
          <h2 className="text-xl font-medium mb-4 text-[#7c5cff]">Problem</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#a9b1d6]">{assignment.description}</p>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="bg-[#24283b] rounded-b-lg p-6">
          <h2 className="text-xl font-medium mb-4 text-[#7c5cff]">Answer</h2>
          <CodeEditor
            initialCode={code}
            onChange={setCode}
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}
          
          <div className="flex justify-end items-center gap-4 mt-4">
            <div className="text-sm text-gray-400">
              {lastSubmittedTime && `Last submitted: ${lastSubmittedTime.toLocaleString('th-TH')}`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#7c5cff] text-white rounded-lg transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6f51e6]'
              }`}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'Submit Answer'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6">
          <Review reviews={mockReviews} />
        </div>
      </div>
    </div>
  );
} 