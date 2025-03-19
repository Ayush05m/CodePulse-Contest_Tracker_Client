import type { Contest } from "./contest"

export interface Bookmark {
  _id: string
  user?: string
  contest: Contest
  notes?: string
  createdAt?: string
  updatedAt?: string
}

