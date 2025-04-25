"use client";

import Assignment from "@/app/components/Assignment";

export default function AssignmentPage({ params }: { params: { id: string, assignmentId: string } }) {
  const masterAssignmentId = params.id;
  const assignmentId = params.assignmentId;
  return (
    <Assignment assignmentId={assignmentId} backUrl={`/TeacherDashboard/assignments/${masterAssignmentId}`} />
  );
}
