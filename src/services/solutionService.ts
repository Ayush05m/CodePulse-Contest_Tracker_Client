import axios from "axios"
import type { Solution } from "@/types/solution"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

interface SolutionResponse {
  success: boolean
  data: Solution[]
  count: number
  pagination: {
    next?: { page: number; limit: number }
    prev?: { page: number; limit: number }
  }
}

interface SolutionParams {
  search?: string
  platform?: string
  sort?: string
  page?: number
  limit?: number
}

export const getAllSolutions = async (params: SolutionParams = {}): Promise<SolutionResponse> => {
  try {
    const response = await axios.get(`${API_URL}/solutions`, { params })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch solutions")
  }
}

export const getSolutionsLinkByContestId = async (contestId: string): Promise<Solution> => {
  try {
    const response = await axios.get(`${API_URL}/solutions/contestId/${contestId}`)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch solutions")
  }
}

export const getContestSolutions = async (contestId: string): Promise<Solution[]> => {
  try {
    const response = await axios.get(`${API_URL}/contests/${contestId}/solutions`)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch solutions")
  }
}

export const getSolution = async (solutionId: string): Promise<Solution> => {
  try {
    const response = await axios.get(`${API_URL}/solutions/${solutionId}`)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch solution")
  }
}

export const addSolution = async (contestId: string, solutionData: any): Promise<Solution> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${API_URL}/contests/${contestId}/solutions`, solutionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to add solution")
  }
}

export const updateSolution = async (solutionId: string, solutionData: any): Promise<Solution> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.put(`${API_URL}/solutions/${solutionId}`, solutionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update solution")
  }
}

export const deleteSolution = async (solutionId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token")
    await axios.delete(`${API_URL}/solutions/${solutionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete solution")
  }
}

export const voteSolution = async (solutionId: string, voteType: "upvote" | "downvote"): Promise<Solution> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.put(
      `${API_URL}/solutions/${solutionId}/vote`,
      { voteType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to vote on solution")
  }
}

