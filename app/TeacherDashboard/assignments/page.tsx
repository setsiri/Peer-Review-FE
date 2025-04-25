"use client";

import { useState, useEffect } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Loader from "@/app/components/Loader";

interface Assignment {
  id: string;
  title: string;
  type: "solo" | "group" | "review";
  dueDate: string;
  createdAt: string;
  description?: string;
}

interface MasterAssignment {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  subjectId: string;
  isGroupAssignment: boolean;
  dueDate: string;
  subject: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface SubmittedWork {
  assigneeId: string;
  id: string;
  name: string;
  status?: string;
}

type ShowType = "all" | "solo" | "group" | "review";
type SortType = "name" | "dueDate" | "createdAt";
type AssignmentType = "solo" | "group" | "review";
type ReviewerMethod = "random" | "circle" | "manual";
type CreateAssignmentStep = 1 | 2;

interface CreateAssignmentFormData {
  title: string;
  description: string;
  dueDate: string;
  reviewerMethod: ReviewerMethod;
  targetAssignment: string;
  targetSubmission: string;
  targetReviewer: string;
}

interface AvailableReviewers {
  groups: any[];
  users: any[];
}

// --- API Fetching Functions ---
async function fetchMasterAssignments(
  token: string
): Promise<MasterAssignment[]> {
  const response = await fetch("http://localhost:3000/master-assignments", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch master assignments");
  }
  return response.json();
}

async function fetchSubmissionsForAssignment(
  assignmentId: string,
  token: string
): Promise<any[]> {
  const response = await fetch(
    `http://localhost:3000/assignment/submitted-assignments/${assignmentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    console.error(`Failed to fetch submissions for assignment ${assignmentId}`);
    return [];
  }
  return response.json();
}

async function fetchAllStudents(token: string): Promise<any[]> {
  const response = await fetch("http://localhost:3000/users/students", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    console.error("Failed to fetch students");
    return [];
  }
  return response.json();
}

async function fetchAllGroups(token: string): Promise<any[]> {
  const response = await fetch("http://localhost:3000/group", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    console.error("Failed to fetch groups");
    return [];
  }
  return response.json();
}

async function createMasterAssignmentAPI(
  data: any,
  token: string
): Promise<boolean> {
  const response = await fetch("http://localhost:3000/master-assignments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create master assignment");
  }
  return true;
}

async function createReviewAssignmentAPI(
  submissionId: string,
  payload: any,
  token: string
): Promise<boolean> {
  const response = await fetch(
    `http://localhost:3000/assignment/assign-reviewers/${submissionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create review assignment");
  }
  return true;
}

async function fetchAvailableReviewers(
  token: string,
  assignmentId: string
): Promise<AvailableReviewers> {
  const response = await fetch(
    `http://localhost:3000/assignment/available-reviewers/${assignmentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    console.error("Failed to fetch reviewers");
    throw new Error("Failed to fetch reviewers");
  }
  return response.json();
}

export default function AssignmentsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>("dueDate");
  const [showType, setShowType] = useState<ShowType>("all");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [step, setStep] = useState<CreateAssignmentStep>(1);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("solo");
  const [formData, setFormData] = useState<CreateAssignmentFormData>({
    title: "",
    description: "",
    dueDate: "",
    reviewerMethod: "random",
    targetAssignment: "",
    targetSubmission: "",
    targetReviewer: "",
  });
  const [availableAssignments, setAvailableAssignments] = useState<
    Assignment[]
  >([]);
  const [submittedWork, setSubmittedWork] = useState<SubmittedWork[]>([]);
  const [isReviewAssignmentGroup, setReviewAssignmentGroup] = useState(false);
  const [availableReviewers, setAvailableReviewers] =
    useState<AvailableReviewers>({
      groups: [],
      users: [],
    });
  const [isAssignGroupReviewer, setIsAssignGroupReviewer] = useState(false);

  // --- Fetch and Process Assignments ---
  const fetchAssignmentsData = async (token: string) => {
    const masters = await fetchMasterAssignments(token);

    const allAssignments: Assignment[] = masters.map((m) => ({
      id: m.id,
      title: m.title,
      type: (m.isGroupAssignment ? "group" : "solo") as Assignment["type"],
      dueDate: new Date(m.dueDate).toLocaleDateString(),
      createdAt: new Date(m.createdAt).toLocaleDateString(),
      description: m.detail,
    }));

    const validAssignments: Assignment[] = [];
    for (const m of masters) {
      const submissions = await fetchSubmissionsForAssignment(m.id, token);
      if (submissions.length > 0) {
        validAssignments.push({
          id: m.id,
          title: m.title,
          type: m.isGroupAssignment ? "group" : "solo",
          dueDate: new Date(m.dueDate).toISOString().split("T")[0],
          createdAt: new Date(m.createdAt).toISOString().split("T")[0],
          description: m.detail,
        } as Assignment);
      }
    }

    return { allAssignments, validAssignments };
  };

  useEffect(() => {
    const loadAssignments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }
        const { allAssignments, validAssignments } = await fetchAssignmentsData(
          token
        );
        setAssignments(allAssignments);
        setAvailableAssignments(validAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, [toggleRefresh, formData.targetSubmission]);

  // --- Event Handlers ---
  const handleTypeSelect = (type: AssignmentType) => {
    setAssignmentType(type);
    setStep(2);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      reviewerMethod: "random",
      targetAssignment: "",
      targetSubmission: "",
      targetReviewer: "",
    });
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Fetch available reviewers when targetSubmission is updated
    if (name === "targetSubmission" && value) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }

        const { groups, users } = await fetchAvailableReviewers(token, value);
        setAvailableReviewers({ groups, users });
      } catch (error) {
        console.error("Error fetching available reviewers:", error);
      }
    }

    // Set reviewer type based on selection
    if (name === "targetReviewer") {
      const isGroupReviewer = availableReviewers.groups.some(
        (group) => group.id === value
      );
      setIsAssignGroupReviewer(isGroupReviewer);
    }
  };

  const handleCreateAssignment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      if (assignmentType !== "review") {
        const masterAssignmentPayload = {
          title: formData.title,
          detail: formData.description,
          subjectId: localStorage.getItem("subjectId"),
          isGroupAssignment: assignmentType === "group",
          dueDate: `${formData.dueDate}T23:59:59+07:00`,
        };
        await createMasterAssignmentAPI(masterAssignmentPayload, token);
      } else {
        const reviewAssignmentPayload = {
          groupId: isAssignGroupReviewer ? formData.targetReviewer : "",
          userId: !isAssignGroupReviewer ? formData.targetReviewer : "",
          isGroupAssignment: isAssignGroupReviewer,
        };
        await createReviewAssignmentAPI(
          formData.targetSubmission,
          reviewAssignmentPayload,
          token
        );
      }

      setIsCreateModalOpen(false);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      console.error("Error creating assignment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAssignmentToReview = async (selectedId: string) => {
    if (!selectedId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const [submittedAssignments, allStudents, allGroups] = await Promise.all([
        fetchSubmissionsForAssignment(selectedId, token),
        fetchAllStudents(token),
        fetchAllGroups(token),
      ]);

      const studentMap = new Map(
        allStudents.map((s: any) => [s.id, `${s.firstName} ${s.lastName}`])
      );
      const groupMap = new Map(allGroups.map((g: any) => [g.id, g.name]));

      const firstSubmission = submittedAssignments[0];
      setReviewAssignmentGroup(!!firstSubmission?.groupId);

      const enrichedSubmissions: SubmittedWork[] = submittedAssignments.map(
        (a: any) => ({
          id: a.id,
          name: a.userId ? studentMap.get(a.userId) : groupMap.get(a.groupId),
          assigneeId: a.userId ? a.userId : a.groupId,
        })
      );
      setSubmittedWork(enrichedSubmissions);
    } catch (error) {
      console.error("Error fetching review assignment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Rendering Logic ---
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
            onClick={() => handleTypeSelect(type as AssignmentType)}
            className={`p-4 rounded-lg border-2 transition-colors ${
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

  const renderGroupForm = () => (
    <div className="space-y-6">{renderSoloForm()}</div>
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
          onChange={(e) => {
            handleChange(e);
            handleSelectAssignmentToReview(e.target.value);
          }}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
        >
          <option value="">- Select master assignment -</option>
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
              Select Submission Assignee
            </label>
            <select
              name="targetSubmission"
              value={formData.targetSubmission}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
            >
              <option value="">- Select submission assignee -</option>
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
              <option value="manual">Manual</option>
              <option value="circle">Circle (วนวงแหวน)</option>
            </select>
          </div>
          {formData.reviewerMethod === "manual" && (
            <div>
              <label className="block text-[#a9b1d6] font-medium mb-2">
                Select Reviewers
              </label>
              <select
                name="targetReviewer"
                value={formData.targetReviewer}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#1a1b26] border border-[#2a2e3f] text-white"
              >
                <option value="">- Select reviewer -</option>
                {availableReviewers.groups.map((group) => {
                  return (
                    <option key={group.id} value={group.id}>
                      {`[ Group ]: ${group.name}`}
                    </option>
                  );
                })}
                {availableReviewers.users.map((user) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {`${user.firstName} ${user.lastName}`}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1e2030] to-[#95a6ba] rounded-full h-[72px] overflow-hidden relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10" />
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
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      sortBy === "name"
                        ? "bg-[#456bd6] text-white"
                        : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                    }`}
                  >
                    Name (a-z)
                  </button>
                  <button
                    onClick={() => setSortBy("dueDate")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      sortBy === "dueDate"
                        ? "bg-[#456bd6] text-white"
                        : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                    }`}
                  >
                    Due Date
                  </button>
                  <button
                    onClick={() => setSortBy("createdAt")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
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
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      showType === "all"
                        ? "bg-[#456bd6] text-white"
                        : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setShowType("solo")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      showType === "solo"
                        ? "bg-[#9ece6a] text-white"
                        : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                    }`}
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => setShowType("group")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      showType === "group"
                        ? "bg-[#7aa2f7] text-white"
                        : "bg-[#1a1b26] text-[#a9b1d6] hover:bg-[#2a2e3f]"
                    }`}
                  >
                    Group
                  </button>
                  <button
                    onClick={() => setShowType("review")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    onClick={handleCreateAssignment}
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
      <Loader visible={isLoading} />
    </div>
  );
}
