"use client";

import Assignment from "@/app/components/Assignment";

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const assignmentId = params.id;
  return (
    <Assignment assignmentId={assignmentId} backUrl={"/StudentDashboard/assignments"} />
  );
}
