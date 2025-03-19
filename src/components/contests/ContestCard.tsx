"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, BookmarkCheck, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CountdownTimer from "./CountdownTimer";
import type { Contest } from "@/types/contest";
import { getSolutionsLinkByContestId } from "@/services/solutionService";
import type { Solution } from "@/types/solution";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/hooks/userReduxStore";
import {
  addBookmarkThunk,
  removeBookmarkThunk,
} from "@/store/slice/bookmarksSlice";

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.items);
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.contest.contestId === contest.contestId
  );

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

  const handleBookmarkToggle = async () => {
    setIsLoading(true);
    try {
      if (isBookmarked) {
        dispatch(removeBookmarkThunk(contest.contestId));
        toast("Bookmark removed", {
          description: "Contest removed from your bookmarks.",
        });
      } else {
        dispatch(addBookmarkThunk({ contest }));
        toast("Bookmark added", {
          description: "Contest added to your bookmarks.",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  const getContestAndRedirect = async (id: string) => {
    try {
      const solution: Solution | null = await getSolutionsLinkByContestId(id);

      if (solution?.youtubeLinks?.length) {
        window.open(solution.youtubeLinks[0].url); // Redirects to YouTube video
      } else {
        toast.error("No solution link available.");
      }
    } catch (error) {
      console.error("Error fetching solution:", error);
      toast.error("Failed to fetch solution. Please try again later.");
    }
    // console.log(url)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`h-full overflow-hidden flex flex-col transition-shadow duration-300 ${
          isHovered ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between gap-4 items-start">
            <CardTitle className="text-lg line-clamp-2">
              <a
                href={`/contests/${contest.contestId}`}
                className={`transition-colors ${
                  isHovered ? "text-primary" : ""
                }`}
              >
                {contest.name}
              </a>
            </CardTitle>
            <div className="flex gap-1">
              <Badge className={`${getPlatformColor(contest.platform)}`}>
                {contest.platform}
              </Badge>
              <Badge className={`${getStatusColor(contest.status)}`}>
                {contest.status?.charAt(0).toUpperCase() +
                  contest.status?.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent
          // className={
          //   "flex-grow space-y-2 flex flex-col overflow-hidden justify-end"
          // }
          className={`flex-grow space-y-2 flex flex-col ${
            contest.status === "past" ? "justify-between" : "justify-end"
          }`}
        >
          <div className="">
            <div className="text-sm">
              <span className="font-medium">Start:</span>{" "}
              {new Date(contest.startTime).toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Duration:</span>{" "}
              {formatDuration(contest.duration)}
            </div>
          </div>
          {contest.status === "upcoming" ? (
            <div className="mt-4">
              <CountdownTimer targetDate={new Date(contest.startTime)} />
            </div>
          ) : contest.status === "ongoing" ? (
            <div className="mt-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-green-500 font-medium">LIVE NOW</span>
                </div>
                <div className="w-full">
                  <CountdownTimer
                    targetDate={
                      new Date(
                        new Date(contest.startTime).getTime() +
                          contest.duration * 60000
                      )
                    }
                    label="Ends in"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex text-2xl text-red-400 justify-center items-center">
              Contest has ended
            </div>
          )}
        </CardContent>
        <CardFooter
          className={`flex justify-between pt-2 border-t transition-colors duration-300 ${
            isHovered ? "bg-muted/30" : ""
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  onClick={handleBookmarkToggle}
                  className={`text-muted-foreground hover:text-primary ${
                    isHovered ? "opacity-100" : "opacity-80"
                  }`}
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
          </TooltipProvider>

          <div className="flex gap-1">
            {contest.status == "past" && (
              <Button
                variant={isHovered ? "default" : "ghost"}
                size="sm"
                className="gap-1 transition-all duration-300"
                asChild
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                  onClick={() => getContestAndRedirect(contest.contestId)}
                >
                  Solution
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant={isHovered ? "default" : "ghost"}
              size="sm"
              className="gap-1 transition-all duration-300"
              asChild
            >
              <a href={contest.url} target="_blank" rel="noopener noreferrer">
                Visit
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContestCard;
