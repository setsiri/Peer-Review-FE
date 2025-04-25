import { authAxios } from "@/app/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AssignmentResponse,
  AssignmentSubmitRequest,
  MasterAssignment,
  ScoreAssignmentRequest
} from "@/app/types/assignmentResponse ";
import { CreateCommentRequest, CreateReviewRequest } from "../types/review";

const BASE_URL = "/assignment";

export const getAssignments = async () => {
  const response = await authAxios.get<AssignmentResponse[]>(BASE_URL);
  return response.data;
};

export const useAssignments = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => getAssignments()
  });
};

export const getAssignment = async (assignmentId: string) => {
  const response = await authAxios.get<AssignmentResponse>(`${BASE_URL}/${assignmentId}`);
  return response.data;
};

export const useAssignment = (assignmentId: string) => {
  return useQuery({
    enabled: !!assignmentId, // Only run when ID is available
    queryKey: ["assignments", assignmentId],
    queryFn: () => getAssignment(assignmentId)
  });
};

export const getAssignmentReviews = async (assignmentId: string) => {
  const response = await authAxios.get(`/review/assignment/${assignmentId}`);
  return response.data;
};

export const useAssignmentReviews = (assignmentId: string) => {
  return useQuery({
    queryKey: ["assignmentReviews", assignmentId],
    queryFn: () => getAssignmentReviews(assignmentId),
    enabled: !!assignmentId // Only run when ID is available
  });
};

export const createReview = async (reviewData: CreateReviewRequest) => {
  const response = await authAxios.post("/review", reviewData);
  return response.data;
};

// React Query mutation hook for creating a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: CreateReviewRequest) => createReview(reviewData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.assignmentId]
      });
    }
  });
};

export const submitAssignment = async (id: string, data: AssignmentSubmitRequest) => {
  const response = await authAxios.patch<AssignmentResponse>(`assignment/submit/${id}`, data);
  return response.data;
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignmentSubmitRequest }) =>
      submitAssignment(id, data),
    onSuccess: (_, data) => {
      // Invalidate queries to refresh assignment data
      queryClient.invalidateQueries({ queryKey: ["assignments", data.id] });
    }
  });
};

export const createComment = async (commentData: CreateCommentRequest) => {
  const response = await authAxios.post("/comment", commentData);
  return response.data;
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { commentData: CreateCommentRequest, assignmentId: string }) =>
      createComment(payload.commentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.assignmentId]
      });
    }
  });
};

export const scoreAssignment = async (
  assignmentId: string,
  data: ScoreAssignmentRequest
) => {
  const response = await authAxios.post<AssignmentResponse>(
    `/assignment/score/${assignmentId}`,
    data
  );
  return response.data;
};

// Hook for scoring assignments
export const useScoreAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, score, masterAssignmentId }: {
      assignmentId: string;
      score: number;
      masterAssignmentId?: string;
    }) => scoreAssignment(assignmentId, { score }),
    onSuccess: (data, variables) => {

      // Invalidate the assignments by master assignment query if provided
      if (variables.masterAssignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["assignmentsByMasterAssignment", variables.masterAssignmentId]
        });
      }
    }
  });
};

// Function to get assignments by master assignment ID
export const getAssignmentsByMasterAssignmentId = async (masterAssignmentId: string) => {
  const response = await authAxios.get<AssignmentResponse[]>(`/assignment/master-assignment/${masterAssignmentId}`);
  return response.data;
};

// React Query hook for getting assignments by master assignment ID
export const useAssignmentsByMasterAssignmentId = (masterAssignmentId: string) => {
  return useQuery({
    queryKey: ["assignmentsByMasterAssignment", masterAssignmentId],
    queryFn: () => getAssignmentsByMasterAssignmentId(masterAssignmentId),
    enabled: !!masterAssignmentId // Only run when ID is available
  });
};

// Function to get a master assignment by ID
export const getMasterAssignment = async (id: string) => {
  const response = await authAxios.get<MasterAssignment>(`/master-assignments/${id}`);
  return response.data;
};

// React Query hook for getting a master assignment
export const useMasterAssignment = (id: string) => {
  return useQuery({
    queryKey: ["masterAssignments", id],
    queryFn: () => getMasterAssignment(id),
    enabled: !!id // Only run when ID is available
  });
};
