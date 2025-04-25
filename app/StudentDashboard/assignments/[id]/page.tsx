"use client";

import { useEffect, useState } from "react";
import CodeEditor from "../../../components/CodeEditor";
import ReviewsSection from "../../../components/ReviewsSection";
import Link from "next/link";
import { useAssignment, useSubmitAssignment } from "@/app/services/assignments";
import { getAssignmentStatus, getAssignmentType } from "@/app/utils/assignmentUtils";
import { AssignmentStatus, AssignmentType } from "@/app/types/assignmentResponse ";
import { getFullName } from "@/app/utils/userUtils";

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const assignmentId = params.id;
  const [code, setCode] = useState("// เขียนคำตอบของคุณที่นี่\n");
  const [error, setError] = useState<string | null>(null);
  const { data: assignment } = useAssignment(assignmentId);
  const previousAssignmentId = assignment?.previousAssignmentId || "";
  const { data: reviewAssignment } = useAssignment(previousAssignmentId);
  const { mutateAsync: submitAssignment, isPending: isPendingSubmitAssignment } = useSubmitAssignment();
  const isShowSubmitButton = assignment?.type === AssignmentType.SUBMISSION;

  useEffect(() => {
    if (assignment?.type === AssignmentType.SUBMISSION) {
      setCode(assignment?.content || "// เขียนคำตอบของคุณที่นี่\n");
    } else if (assignment?.type === AssignmentType.REVIEW) {
      setCode(reviewAssignment?.content || "// เขียนคำตอบของคุณที่นี่\n");
    }
  }, [assignment, reviewAssignment]);

  const handleSubmit = async () => {
    try {
      setError(null);
      await submitAssignment({ id: assignmentId, data: { content: code } });
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งคำตอบ กรุณาลองใหม่อีกครั้ง");
      console.error("Submission error:", err);
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          back
        </Link>
      </div>

      {/* Assignment Header */}
      <div className="p-6">
        <div className="bg-[#24283b] p-6 mb-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">{assignment?.masterAssignment.title}</h1>
          <div className="flex items-center gap-6 text-base">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Assignment type:</span>
              <span
                className="px-2 py-1 rounded-full bg-[#7c5cff]/20 text-[#b845ff]">{getAssignmentType(assignment)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded-full ${
                assignment?.status === AssignmentStatus.SUBMITTED ? "bg-blue-500/20 text-blue-300" :
                  assignment?.status === AssignmentStatus.ASSIGNED ? "bg-yellow-500/20 text-yellow-300" :
                    assignment?.status === AssignmentStatus.REVIEWED ? "bg-purple-500/20 text-purple-300" :
                      assignment?.status === AssignmentStatus.COMPLETED ? "bg-green-500/20 text-green-300" :
                        "bg-gray-500/20 text-gray-300"
              }`}>
                {getAssignmentStatus(assignment?.status)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Created:</span>
              <span
                className="text-white font-medium">{new Date(assignment?.createdAt || "")?.toLocaleDateString("th-TH")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Due:</span>
              <span
                className="text-white font-medium">{new Date(assignment?.masterAssignment?.dueDate || "")?.toLocaleDateString("th-TH")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Assigned to:</span>
              <span className="text-white font-medium">{getFullName(assignment?.user)}</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-[#24283b] p-6 mb-1">
          <h2 className="text-xl font-medium mb-4 text-[#7c5cff]">Problem</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#a9b1d6]">{assignment?.masterAssignment.detail}</p>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="bg-[#24283b] rounded-b-lg p-6">
          <h2 className="text-xl font-medium mb-4 text-[#7c5cff]">Answer</h2>
          <CodeEditor
            code={code}
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
              {assignment?.updatedAt && `Last submitted: ${new Date(assignment.updatedAt).toLocaleString("th-TH")}`}
            </div>
            {isShowSubmitButton && <button
              onClick={handleSubmit}
              disabled={isPendingSubmitAssignment}
              className={`px-6 py-2.5 bg-[#7c5cff] text-white rounded-lg transition-colors ${
                isPendingSubmitAssignment ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6f51e6]"
              }`}
            >
              {isPendingSubmitAssignment ? "กำลังส่ง..." : "Submit Answer"}
            </button>}
          </div>
        </div>

        {/* Reviews Section */}

        <div className="p-6">
          <ReviewsSection assignment={assignment} />
        </div>
      </div>
    </div>
  );
}
