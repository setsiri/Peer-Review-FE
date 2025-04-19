'use client';

import { useUser } from '../../contexts/UserContext';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentAssignmentPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'student') {
      router.push('/dashboard/teacherassignment');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return null;
  }

  return <StudentDashboard />;
} 