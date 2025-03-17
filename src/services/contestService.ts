import axios from "axios"
import type { Contest } from "@/types/contest"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

interface ContestResponse {
  success: boolean
  data: Contest[]
  count: number
  pagination: {
    next?: { page: number; limit: number }
    prev?: { page: number; limit: number }
  }
}

interface ContestParams {
  platform?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}

export const fetchContests = async (params: ContestParams = {}): Promise<ContestResponse> => {
  try {
    console.log(API_URL)
    const response = await axios.get(`${API_URL}/contests`, { params })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch contests")
  }
}

export const fetchContest = async (id: string): Promise<Contest> => {
  try {
    const response = await axios.get(`${API_URL}/contests/${id}`)
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch contest")
  }
}

export const createContest = async (contestData: Partial<Contest>): Promise<Contest> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${API_URL}/contests`, contestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to create contest")
  }
}

export const updateContest = async (id: string, contestData: Partial<Contest>): Promise<Contest> => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.put(`${API_URL}/contests/${id}`, contestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update contest")
  }
}

export const deleteContest = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token")
    await axios.delete(`${API_URL}/contests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete contest")
  }
}

export const refreshContestData = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token")
    await axios.post(
      `${API_URL}/contests/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to refresh contest data")
  }
}

