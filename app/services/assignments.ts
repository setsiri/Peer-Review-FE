import { authAxios } from "@/app/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssignmentResponse, AssignmentSubmitRequest } from "@/app/types/assignmentResponse ";
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
