"use client";

import { useState } from "react";
import Link from "next/link";
import AssignmentHeader from "../../../components/AssignmentHeader";
import {
  useAssignmentsByMasterAssignmentId,
  useMasterAssignment,
  useScoreAssignment
} from "@/app/services/assignments";
import { getFullName } from "@/app/utils/userUtils";
import { getAssignmentStatus } from "@/app/utils/assignmentUtils";
import { Rating } from "@mui/material";
import { AssignmentResponse, AssignmentStatus, AssignmentType } from "@/app/types/assignmentResponse ";

type SortType = "asc" | "desc";

export default function AssignmentPage({ params }: { params: { id: string } }) {
  const masterAssignmentId = params.id;
  const [sortBy, setSortBy] = useState<SortType>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: masterAssignment } = useMasterAssignment(masterAssignmentId);
  const { data: assignments } = useAssignmentsByMasterAssignmentId(masterAssignmentId);
  const { mutateAsync: scoreAssignment, isPending: isPendingScoreAssignment } = useScoreAssignment();

  const filteredAndSortedAssignments = assignments?.filter((assignment) =>
    statusFilter === "all" ? true : assignment.status === statusFilter
  )
    .sort((a, b) => {
      const comparison = getFullName(a.user).localeCompare(getFullName(b.user));
      return sortBy === "asc" ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    const colors = {
      ASSIGNED: "bg-blue-500",
      SUBMITTED: "bg-green-500",
      READY_TO_REVIEW: "bg-yellow-500",
      IN_REVIEW: "bg-purple-500",
      REVIEWED: "bg-indigo-500",
      COMPLETED: "bg-gray-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeColor = (type: AssignmentType) => {
    const colors = {
      [AssignmentType.SUBMISSION]: "bg-cyan-500",
      [AssignmentType.REVIEW]: "bg-fuchsia-500"
      // Add other types as needed
    };
    return colors[type] || "bg-gray-500";
  };

  const getAssignmentTypeDisplay = (type: AssignmentType) => {
    const types = {
      [AssignmentType.SUBMISSION]: "Submission",
      [AssignmentType.REVIEW]: "Review"
      // Add other types as needed
    };
    return types[type] || "Unknown";
  };

  const handleScoreChange = async (assignment: AssignmentResponse, newValue: number | null) => {
    try {
      if (newValue === null || !assignment?.id) return;

      await scoreAssignment({
        assignmentId: assignment.id,
        score: newValue,
        masterAssignmentId
      });

      // You could add a success notification here if needed
    } catch (error) {
      console.error("Error updating assignment score:", error);
      // You could add an error notification here if needed
    }
  };

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
          <AssignmentHeader masterAssignment={masterAssignment} />
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
                    "COMPLETED"
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
            {filteredAndSortedAssignments?.map((assignment) => (
              <div
                key={assignment.id}
                className="p-6 hover:bg-[#1a1b26] transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-[#a9b1d6] font-medium">{getFullName(assignment.user)}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {assignment.type == AssignmentType.SUBMISSION && (
                    <Rating
                      value={assignment.score || 0}
                      disabled={assignment.status !== AssignmentStatus.REVIEWED}
                      onChange={(_, value) => handleScoreChange(assignment, value)}
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#f59e0b" // Amber/gold color for filled stars
                        },
                        "& .MuiRating-iconEmpty": {
                          color: "rgba(255, 255, 255, 0.3)" // Lighter color for empty stars
                        },
                        "&.Mui-disabled": {
                          opacity: 0.5 // Better visibility for disabled state
                        }
                      }}
                    />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)} text-white`}>
                    {getAssignmentTypeDisplay(assignment.type)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      assignment.status
                    )} text-white`}
                  >
                    {getAssignmentStatus(assignment.status)}
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
