"use client";

import { motion } from "framer-motion";
import {
  BookmarkPlus,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CountdownTimer from "@/components/contests/CountdownTimer";
import type { Contest } from "@/types/contest";
import { useState } from "react";

interface ContestListProps {
  contests: Contest[];
}

// Create a separate BookmarkButton component to handle bookmark state for each contest
function BookmarkButton({ contestId = "", initialIsBookmarked = false }) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmarkToggle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update local storage
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

      if (isBookmarked) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter(
          (id: string) => id !== contestId
        );
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
      } else {
        // Add bookmark
        if (!bookmarks.includes(contestId)) {
          bookmarks.push(contestId);
          localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        }
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          onClick={handleBookmarkToggle}
          className="text-muted-foreground hover:text-primary"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <BookmarkPlus className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isBookmarked ? "Remove bookmark" : "Add bookmark"}
      </TooltipContent>
    </Tooltip>
  );
}

export default function ContestList({ contests }: ContestListProps) {
  // Check if contests are bookmarked on initial render
  const checkInitialBookmarkState = (contestId: string) => {
    if (typeof window === "undefined") return false;

    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      return bookmarks.includes(contestId);
    } catch (error) {
      console.error("Error checking bookmark state:", error);
      return false;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "CodeChef":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "LeetCode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "ongoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "past":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMinutes} min`;
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {contests.map((contest) => {
          const initialIsBookmarked = checkInitialBookmarkState(contest._id);

          return (
            <motion.div
              key={contest._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      <a
                        href={`/contests/${contest._id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {contest.name}
                      </a>
                    </h3>
                    <div className="flex gap-1">
                      <Badge
                        className={`${getPlatformColor(contest.platform)}`}
                      >
                        {contest.platform}
                      </Badge>
                      <Badge className={`${getStatusColor(contest.status)}`}>
                        {contest.status?.charAt(0).toUpperCase() +
                          contest.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  {/* 
                  {contest.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {contest.description}
                    </p>
                  )} */}

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(contest.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDuration(contest.duration)}</span>
                    </div>
                  </div>
                </div>

                {contest.status === "upcoming" && (
                  <div className="w-full md:w-64 shrink-0">
                    <CountdownTimer targetDate={new Date(contest.startTime)} />
                  </div>
                )}

                <div className="flex md:flex-col justify-between items-center md:items-end gap-2">
                  <BookmarkButton
                    contestId={contest._id}
                    initialIsBookmarked={initialIsBookmarked}
                  />

                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
}
