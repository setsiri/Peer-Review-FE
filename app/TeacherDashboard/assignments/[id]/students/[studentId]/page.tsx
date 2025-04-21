'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StudentWork {
  id: string;
  studentName: string;
  status: string;
  submittedAt?: string;
  lastUpdated?: string;
  code?: string;
  comments?: string[];
  assignmentType: 'solo' | 'group' | 'review';
}

export default function StudentWorkPage() {
  const router = useRouter();
  const params = useParams();
  const [studentWork, setStudentWork] = useState<StudentWork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - ในการใช้งานจริงควรดึงข้อมูลจาก API
    const mockStudentWork: StudentWork = {
      id: params.studentId as string,
      studentName: 'นักเรียน สมใจ เรียนดี',
      status: 'SUBMITTED',
      submittedAt: '2024-03-20 14:30:00',
      lastUpdated: '2024-03-20 14:30:00',
      code: '// โค้ดที่นักเรียนส่ง\nfunction hello() {\n  console.log("Hello, World!");\n}',
      comments: [
        'โค้ดเขียนได้ดี มีการเว้นวรรคที่เหมาะสม',
        'ควรเพิ่ม comments อธิบายการทำงานของฟังก์ชัน'
      ],
      assignmentType: 'review'
    };

    setStudentWork(mockStudentWork);
    setLoading(false);
  }, [params.studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b26] text-white p-6">
        <div className="animate-pulse">กำลังโหลด...</div>
      </div>
    );
  }

  if (!studentWork) {
    return (
      <div className="min-h-screen bg-[#1a1b26] text-white p-6">
        <div className="text-red-500">ไม่พบข้อมูลงานของนักเรียน</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white">
      {/* Back Button */}
      <div className="p-4 bg-[#1e2030]">
        <Link
          href={`/TeacherDashboard/assignments/${params.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7aa2f7] hover:bg-[#6a92e7] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          ย้อนกลับ
        </Link>
      </div>

      <div className="p-6">
        {/* Student Info */}
        <div className="bg-[#24283b] rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-4">{studentWork.studentName}</h1>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#a9b1d6]">สถานะ: </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white`}>
                {studentWork.status}
              </span>
            </div>
            <div>
              <span className="text-[#a9b1d6]">ส่งเมื่อ: </span>
              <span>{studentWork.submittedAt}</span>
            </div>
            <div>
              <span className="text-[#a9b1d6]">แก้ไขล่าสุด: </span>
              <span>{studentWork.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Student's Code */}
        <div className="bg-[#24283b] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">โค้ดที่ส่ง</h2>
          <pre className="bg-[#1a1b26] p-4 rounded-lg overflow-x-auto">
            <code className="text-[#a9b1d6]">{studentWork.code}</code>
          </pre>
        </div>

        {/* Comments - แสดงเฉพาะงานประเภท review */}
        {studentWork.assignmentType === 'review' && (
          <div className="bg-[#24283b] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ความคิดเห็น</h2>
            {studentWork.comments && studentWork.comments.length > 0 ? (
              <ul className="space-y-2">
                {studentWork.comments.map((comment, index) => (
                  <li key={index} className="bg-[#1a1b26] p-4 rounded-lg">
                    {comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#a9b1d6]">ยังไม่มีความคิดเห็น</p>
            )}
            
            {/* Add Comment Form */}
            <div className="mt-6">
              <textarea
                placeholder="เพิ่มความคิดเห็น..."
                className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
                rows={4}
              />
              <button className="mt-2 px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#6a92e7]">
                ส่งความคิดเห็น
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 