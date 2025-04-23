'use client';

import DashboardLayout from '../components/DashboardLayout';

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 