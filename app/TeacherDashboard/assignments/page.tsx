"use client";

import { useState, useEffect } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  title: string;
  type: "solo" | "group" | "review";
  target?: string;
  dueDate: string;
  createdAt: string;
  description?: string;
  starterCode?: string;
  reviewerMethod?: string;
  status?:
    | "ASSIGNED"
    | "SUBMITTED"
    | "READY_TO_REVIEW"
    | "IN_REVIEW"
    | "REVIEWED"
    | "COMPLETED";
  assignTo: "all" | "selected";
  selectedIds?: string[];
}

interface MasterAssignment {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  subjectId: string;
  subject: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

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

interface Group {
  id: string;
  name: string;
  members: Student[];
  status?:
    | "ASSIGNED"
    | "SUBMITTED"
    | "READY_TO_REVIEW"
    | "IN_REVIEW"
    | "REVIEWED"
    | "COMPLETED";
}

type ShowType = "all" | "solo" | "group" | "review";
type SortType = "name" | "dueDate" | "createdAt";

export default function AssignmentsPage() {
  const [sortBy, setSortBy] = useState<SortType>("dueDate");
  const [showType, setShowType] = useState<ShowType>("all");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [assignmentType, setAssignmentType] = useState<
    "solo" | "group" | "review"
  >("solo");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starterCode: "",
    dueDate: "",
    assignTo: "all",
    selectedIds: [] as string[],
    reviewerMethod: "random" as "random" | "circle" | "manual",
    targetAssignment: "",
    targetSubmission: "",
  });
  const [availableAssignments, setAvailableAssignments] = useState<
    Assignment[]
  >([]);
  const [submittedWork, setSubmittedWork] = useState<
    Array<{ id: string; name: string; status: string }>
  >([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          "http://localhost:3000/master-assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }

        const data: MasterAssignment[] = await response.json();
        const fetchedAssignments = data.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          type: "solo", // Default to 'solo' as no type is provided in the response
          dueDate: "", // No dueDate in the response, so leave blank
          createdAt: new Date(assignment.createdAt).toLocaleDateString(),
          description: assignment.detail,
          assignTo: "all", // Default to 'all'
        }));
        setAssignments(fetchedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    }

    fetchAssignments();

    // Mock data สำหรับ assignments ที่มีสถานะ SUBMITTED
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Assignment - Solo 1",
        type: "solo",
        dueDate: "2024-03-28",
        description: "โจทย์ที่ 1",
        status: "SUBMITTED",
        createdAt: "2024-03-01",
        assignTo: "all",
      },
      {
        id: "2",
        title: "Assignment - Solo 2",
        type: "solo",
        dueDate: "2024-03-29",
        description: "โจทย์ที่ 2",
        status: "SUBMITTED",
        createdAt: "2024-03-01",
        assignTo: "all",
      },
    ];

    // Mock data สำหรับนักเรียนที่ส่งงานแล้ว
    const mockStudents: Student[] = [
      { id: "1", name: "นักเรียน 1", status: "ASSIGNED" },
      { id: "2", name: "นักเรียน 2", status: "ASSIGNED" },
      { id: "3", name: "นักเรียน 3", status: "ASSIGNED" },
    ];

    setAvailableAssignments(mockAssignments);
    setStudents(mockStudents);

    // Mock groups
    setGroups([
      {
        id: "g1",
        name: "กลุ่ม 1",
        members: [{ id: "1", name: "นักเรียน 1", status: "ASSIGNED" }],
        status: "ASSIGNED",
      },
      {
        id: "g2",
        name: "กลุ่ม 2",
        members: [{ id: "2", name: "นักเรียน 2", status: "ASSIGNED" }],
        status: "ASSIGNED",
      },
    ]);

    setAvailableAssignments([
      {
        id: "a1",
        title: "Assignment 1",
        type: "solo",
        dueDate: "2024-03-28",
        createdAt: "2024-03-01",
        assignTo: "all",
        description: "โจทย์ที่ 1",
      },
    ]);
  }, []);

  useEffect(() => {
    if (formData.targetAssignment) {
      // Mock submitted work data based on selected assignment
      setSubmittedWork([
        { id: "s1", name: "นักเรียน 1", status: "SUBMITTED" },
        { id: "s2", name: "นักเรียน 2", status: "SUBMITTED" },
      ]);
    }
  }, [formData.targetAssignment]);

  const handleTypeSelect = (type: "solo" | "group" | "review") => {
    setAssignmentType(type);
    setStep(2);
    // Reset form data when changing type
    setFormData({
      title: "",
      description: "",
      starterCode: "",
      dueDate: "",
      assignTo: "all",
      selectedIds: [],
      reviewerMethod: "random",
      targetAssignment: "",
      targetSubmission: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((selectedId) => selectedId !== id)
        : [...prev.selectedIds, id],
    }));
  };

  const filteredAndSortedAssignments = [...assignments]
    .filter((assignment) =>
      showType === "all" ? true : assignment.type === showType
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "createdAt":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        เลือกประเภท Assignment
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {["solo", "group", "review"].map((type) => (
          <button
            key={type}
            onClick={() =>
              handleTypeSelect(type as "solo" | "group" | "review")
            }
            className={`p-4 rounded-lg border-2 transition-colors
              ${
                assignmentType === type
                  ? "border-[#7aa2f7] bg-[#7aa2f7]/10"
                  : "border-[#2a2e3f] hover:border-[#7aa2f7]/50"
              }`}
          >
            <div className="text-lg font-medium text-white capitalize">
              {type}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSoloForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Assignment Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Starter Code
        </label>
        <textarea
          name="starterCode"
          value={formData.starterCode}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white font-mono"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Assign To
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assignTo"
              value="all"
              checked={formData.assignTo === "all"}
              onChange={handleChange}
            />
            <span className="text-white">All Students</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assignTo"
              value="selected"
              checked={formData.assignTo === "selected"}
              onChange={handleChange}
            />
            <span className="text-white">Selected Students</span>
          </label>
        </div>
        {formData.assignTo === "selected" && (
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {students.map((student) => (
              <label key={student.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.selectedIds.includes(student.id)}
                  onChange={() => handleCheckboxChange(student.id)}
                />
                <span className="text-white">{student.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderGroupForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Assignment Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Starter Code
        </label>
        <textarea
          name="starterCode"
          value={formData.starterCode}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white font-mono"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Assign To
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assignTo"
              value="all"
              checked={formData.assignTo === "all"}
              onChange={handleChange}
            />
            <span className="text-white">All Groups</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="assignTo"
              value="selected"
              checked={formData.assignTo === "selected"}
              onChange={handleChange}
            />
            <span className="text-white">Selected Groups</span>
          </label>
        </div>
        {formData.assignTo === "selected" && (
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {groups.map((group) => (
              <label key={group.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.selectedIds.includes(group.id)}
                  onChange={() => handleCheckboxChange(group.id)}
                />
                <span className="text-white">{group.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Select Assignment to Review
        </label>
        <select
          name="targetAssignment"
          value={formData.targetAssignment}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        >
          <option value="">เลือก Assignment</option>
          {availableAssignments
            .filter((a) => a.type !== "review")
            .map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
        </select>
      </div>

      {formData.targetAssignment && (
        <>
          <div>
            <label className="block text-[#a9b1d6] font-medium mb-2">
              Select Submission to Review
            </label>
            <select
              name="targetSubmission"
              value={formData.targetSubmission}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
            >
              <option value="">เลือกงานที่ส่งแล้ว</option>
              {submittedWork.map((work) => (
                <option key={work.id} value={work.id}>
                  {work.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#a9b1d6] font-medium mb-2">
              Reviewer Assignment Method
            </label>
            <select
              name="reviewerMethod"
              value={formData.reviewerMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
            >
              <option value="random">Random</option>
              <option value="circle">Circle (วนวงแหวน)</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {formData.reviewerMethod === "manual" && (
            <div>
              <label className="block text-[#a9b1d6] font-medium mb-2">
                Select Reviewers
              </label>
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {students.map((student) => (
                  <label key={student.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedIds.includes(student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                    />
                    <span className="text-white">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div>
        <label className="block text-[#a9b1d6] font-medium mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
          <div className="flex items-center gap-4 px-6 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7aa2f7] to-[#a06bff] rounded-2xl flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white translate-y-2">
              Assignment Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-[#24283b] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#1a1b26]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-[#a9b1d6] text-sm font-medium">
                  Sort by:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("name")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        sortBy === "name"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Name (a-z)
                  </button>
                  <button
                    onClick={() => setSortBy("dueDate")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        sortBy === "dueDate"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Due Date
                  </button>
                  <button
                    onClick={() => setSortBy("createdAt")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        sortBy === "createdAt"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Created Date
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#a9b1d6] text-sm font-medium">
                  Show:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowType("all")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        showType === "all"
                          ? "bg-[#456bd6] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setShowType("solo")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        showType === "solo"
                          ? "bg-[#9ece6a] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => setShowType("group")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        showType === "group"
                          ? "bg-[#7aa2f7] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Group
                  </button>
                  <button
                    onClick={() => setShowType("review")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors
                      ${
                        showType === "review"
                          ? "bg-[#bb9af7] text-white"
                          : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                      }`}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 primary-btn rounded-lg text-sm font-medium transition-colors"
            >
              Create Assignment
            </button>
          </div>
        </div>
        <div className="divide-y divide-[#1a1b26]">
          {filteredAndSortedAssignments.map((assignment) => (
            <Link
              key={assignment.id}
              href={`/TeacherDashboard/assignments/${assignment.id}`}
              className="block p-6 hover:bg-[#1a1b26] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#a9b1d6] font-medium">
                    {assignment.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[#787c99] text-sm">
                      Due: {assignment.dueDate || "N/A"}
                    </span>
                    <span className="text-[#787c99] text-sm">
                      Created: {assignment.createdAt || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      assignment.type === "solo"
                        ? "bg-[#9ece6a]/10 text-[#9ece6a]"
                        : assignment.type === "group"
                        ? "bg-[#7aa2f7]/10 text-[#7aa2f7]"
                        : "bg-[#bb9af7]/10 text-[#bb9af7]"
                    }`}
                  >
                    {assignment.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#24283b] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Create New Assignment
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#a9b1d6] hover:text-white"
              >
                ✕
              </button>
            </div>

            {step === 1 ? (
              renderTypeSelection()
            ) : (
              <div className="space-y-6">
                {assignmentType === "solo" && renderSoloForm()}
                {assignmentType === "group" && renderGroupForm()}
                {assignmentType === "review" && renderReviewForm()}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-[#a9b1d6] hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      /* handle submit */
                    }}
                    className="px-6 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#6a92e7]"
                  >
                    Create Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
