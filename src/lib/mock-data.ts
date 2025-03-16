import type { Contest } from "@/types/contest";

// Generate dates relative to current time
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(now);
lastWeek.setDate(lastWeek.getDate() - 7);

export const mockContests: Contest[] = [
  {
    _id: "1",
    name: "Codeforces Round #850 (Div. 1 + Div. 2)",
    platform: "Codeforces",
    url: "https://codeforces.com/contests",
    startTime: tomorrow.toISOString(),
    duration: 150, // in minutes
    status: "upcoming",
    description:
      "Solve algorithmic problems and compete with coders around the world.",
  },
  {
    _id: "2",
    name: "LeetCode Weekly Contest 345",
    platform: "LeetCode",
    url: "https://leetcode.com/contest/",
    startTime: nextWeek.toISOString(),
    duration: 90,
    status: "upcoming",
    description:
      "Weekly coding contest with four problems of varying difficulty.",
  },
  {
    _id: "3",
    name: "CodeChef Starters 100",
    platform: "CodeChef",
    url: "https://www.codechef.com/contests",
    startTime: now.toISOString(),
    duration: 180,
    status: "ongoing",
    description:
      "Beginner-friendly contest with interesting algorithmic challenges.",
  },
  {
    _id: "4",
    name: "AtCoder Beginner Contest 320",
    platform: "AtCoder",
    url: "https://atcoder.jp/contests/",
    startTime: yesterday.toISOString(),
    duration: 100,
    status: "past",
    description:
      "Contest aimed at those who are new to competitive programming.",
  },
  {
    _id: "5",
    name: "HackerRank Week of Code 42",
    platform: "HackerRank",
    url: "https://www.hackerrank.com/contests",
    startTime: lastWeek.toISOString(),
    duration: 240,
    status: "past",
    description: "Week-long programming competition with daily challenges.",
  },
  {
    _id: "6",
    name: "TopCoder SRM 825",
    platform: "TopCoder",
    url: "https://www.topcoder.com/community/competitive-programming/",
    startTime: tomorrow.toISOString(),
    duration: 75,
    status: "upcoming",
    description:
      "Single Round Match with algorithmic problems to solve in a limited time.",
  },
  {
    _id: "7",
    name: "Codeforces Educational Round 152",
    platform: "Codeforces",
    url: "https://codeforces.com/contests",
    startTime: nextWeek.toISOString(),
    duration: 120,
    status: "upcoming",
    description:
      "Educational round with problems focused on specific algorithms and techniques.",
  },
  {
    _id: "8",
    name: "LeetCode Biweekly Contest 112",
    platform: "LeetCode",
    url: "https://leetcode.com/contest/",
    startTime: now.toISOString(),
    duration: 90,
    status: "ongoing",
    description:
      "Biweekly coding contest with four problems of varying difficulty.",
  },
  {
    _id: "9",
    name: "CodeChef Long Challenge October 2023",
    platform: "CodeChef",
    url: "https://www.codechef.com/contests",
    startTime: lastWeek.toISOString(),
    duration: 10080, // 7 days in minutes
    status: "past",
    description:
      "Long duration contest with challenging problems to solve over multiple days.",
  },
];
