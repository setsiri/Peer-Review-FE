import { AssignmentResponse, AssignmentStatus, AssignmentType } from "@/app/types/assignmentResponse ";

export const getAssignmentType = (assignment?: AssignmentResponse) => {
  if (!assignment) return "";

  if (assignment.type === AssignmentType.REVIEW) {
    return "Review";
  } else if (assignment.masterAssignment?.isGroupAssignment &&
    assignment.type === AssignmentType.SUBMISSION) {
    return "Group";
  } else if (!assignment.masterAssignment?.isGroupAssignment &&
    !assignment.previousAssignmentId) {
    return "Solo";
  }

  return "";
};

export const getAssignmentStatus = (status?: AssignmentStatus) => {
  if (!status) return "";

  if (status === "ASSIGNED") {
    return "Assigned";
  } else if (status === "SUBMITTED") {
    return "Submitted";
  } else if (status === "READY_TO_REVIEW") {
    return "Ready to review";
  } else if (status === "IN_REVIEW") {
    return "In review";
  } else if (status === "REVIEWED") {
    return "Reviewed";
  } else if (status === "COMPLETED") {
    return "Completed";
  }

  return "";
};
