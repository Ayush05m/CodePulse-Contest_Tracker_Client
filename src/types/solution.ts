import type { Contest } from "./contest";

export interface Solution {
  _id: string;
  contest_id: Contest;
  youtubeLinks: {
    url: string;
    title: string;
    description?: string;
    thumbnail: string;
  }[];
  submittedBy: {
    _id: string;
    name: string;
  };
  votes: {
    upvotes: number;
    downvotes: number;
  };
  createdAt: string;
  updatedAt: string;
}
