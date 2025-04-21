'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AssignmentHeader from '../../../components/AssignmentHeader';
import CodeEditor from '../../../components/CodeEditor';
import { Assignment } from '../../../types/assignment';

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [code, setCode] = useState('// เขียนคำตอบของคุณที่นี่\n');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock assignment data - ในอนาคตควรดึงจาก API
  const assignment: Assignment = {
    id: params.id,
    title: 'Assignment - ชื่อ assignment',
    description: 'คำอธิบายโจทย์จะแสดงที่นี่...',
    type: 'solo',
    dueDate: new Date('2024-12-31'),
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Implement actual submission logic
      console.log('Submitting code:', code);
      
      // Mock submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to submission confirmation page
      router.push(`/TeacherDashboard/assignments/${params.id}/submitted`);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งคำตอบ กรุณาลองใหม่อีกครั้ง');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white p-6">
      <AssignmentHeader assignment={assignment} />

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
        
        <div className="flex justify-end mt-4">
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
    </div>
  );
} 