"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getContestSolutions,
  addSolution as addSolutionService,
  voteSolution as voteSolutionService,
} from "@/services/solutionService";

export const useSolutions = (contestId: string) => {
  return useQuery({
    queryKey: ["solutions", contestId],
    queryFn: () => getContestSolutions(contestId),
    enabled: !!contestId,
  });
};

export const useAddSolution = (contestId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (solutionData: any) => {
      // if (!user) throw new Error("You must be logged in to add a solution");
      return addSolutionService(contestId, solutionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions", contestId] });
      toast("Solution added", {
        description: "Your solution has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast("Error", {
        description: error.message || "Failed to add solution",
      });
    },
  });

  return {
    addSolution: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export const useVoteSolution = (solutionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (voteType: "upvote" | "downvote") => {
      // if (!user) throw new Error("You must be logged in to vote");
      return voteSolutionService(solutionId, voteType);
    },
    onSuccess: (data) => {
      // Find all queries that include solutions and invalidate them
      data;
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      toast("Vote recorded", {
        description: "Your vote has been recorded.",
      });
    },
    onError: (error: any) => {
      toast("Error", {
        description: error.message || "Failed to record vote",
      });
    },
  });

  return {
    voteSolution: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
