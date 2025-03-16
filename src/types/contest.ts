export interface Contest {
  contestId: string;
  _id: string;
  name: string;
  platform: string;
  url?: string;
  startTime: string | Date;
  endTime?: string | Date;
  duration: number;
  status: "upcoming" | "ongoing" | "past";
  solutionsLink?: string[];
  bookmarksCount?: number;
}
