"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AssignmentHeader from "../../../components/AssignmentHeader";
import { Assignment } from "../../../types/assignment";

interface Student {
  id: string;
  name: string;
  status:
    | "ASSIGNED"
    | "SUBMITTED"
    | "READY_TO_REVIEW"
    | "IN_REVIEW"
    | "REVIEWED"
    | "COMPLETED";
}

type SortType = "asc" | "desc";

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data - ในการใช้งานจริงควรดึงข้อมูลจาก API
    const mockStudents: Student[] = [
      { id: "1", name: "student สมใจ เรียนดี", status: "ASSIGNED" },
      { id: "2", name: "student-2", status: "SUBMITTED" },
      { id: "3", name: "student-3", status: "READY_TO_REVIEW" },
      { id: "4", name: "student-4", status: "IN_REVIEW" },
      { id: "5", name: "student-5", status: "REVIEWED" },
      { id: "6", name: "student-6", status: "COMPLETED" },
    ];

    const mockAssignment: Assignment = {
      id: params.id as string,
      title: "Assignment - Review Solo 1",
      type: "solo",
      dueDate: new Date("2024-03-28"),
      description: "คำอธิบายโจทย์จะแสดงที่นี่...",
    };

    setAssignment(mockAssignment);
    setStudents(mockStudents);
  }, [params.id]);

  const filteredAndSortedStudents = students
    .filter((student) =>
      statusFilter === "all" ? true : student.status === statusFilter
    )
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortBy === "asc" ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    const colors = {
      ASSIGNED: "bg-blue-500",
      SUBMITTED: "bg-green-500",
      READY_TO_REVIEW: "bg-yellow-500",
      IN_REVIEW: "bg-purple-500",
      REVIEWED: "bg-indigo-500",
      COMPLETED: "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] text-white">
      {/* Back Button */}
      <div className="p-4 bg-[#1e2030]">
        <Link
          href="/TeacherDashboard/assignments"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#7aa2f7] hover:bg-[#6a92e7] rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          back
        </Link>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <AssignmentHeader assignment={assignment} />
        </div>

        {/* Controls */}
        <div className="bg-[#24283b] rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-[#a9b1d6] text-sm font-medium">
                  Sort:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("asc")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        sortBy === "asc"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Name (a-z)
                  </button>
                  <button
                    onClick={() => setSortBy("desc")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        sortBy === "desc"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Name (z-a)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#a9b1d6] text-sm font-medium">
                  Show:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        statusFilter === "all"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    All
                  </button>
                  {[
                    "ASSIGNED",
                    "SUBMITTED",
                    "READY_TO_REVIEW",
                    "IN_REVIEW",
                    "REVIEWED",
                    "COMPLETED",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                        ${
                          statusFilter === status
                            ? "bg-[#456bd6] text-white"
                            : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-[#24283b] rounded-lg overflow-hidden">
          <div className="divide-y divide-[#1a1b26]">
            {filteredAndSortedStudents.map((student) => (
              <div
                key={student.id}
                className="p-6 hover:bg-[#1a1b26] transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-[#a9b1d6] font-medium">{student.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      student.status
                    )} text-white`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
