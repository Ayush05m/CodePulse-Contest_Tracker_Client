import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Solution } from "@/types/solution";
import { getSolutionsLinkByContestId } from "@/services/solutionService";
import { BookmarkItem } from "@/store/slice/bookmarksSlice";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./contests/CountdownTimer";
import { Button } from "./ui/button";
import { ExternalLink, Pencil, Trash } from "lucide-react";

export const BookmarkCard = ({
  bookmark,
  setSelectedBookmark,
  setNotes,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
}: {
  bookmark: BookmarkItem;
  setSelectedBookmark: (bookmark: BookmarkItem) => void;
  setNotes: (bookmark: any) => void;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setIsEditDialogOpen: (value: boolean) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleEditClick = (bookmark: BookmarkItem) => {
    setSelectedBookmark(bookmark);
    setNotes(bookmark.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (bookmark: BookmarkItem) => {
    setSelectedBookmark(bookmark);
    setIsDeleteDialogOpen(true);
  };

  return (
    <motion.div
      key={bookmark.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      className=""
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col w-full max-w-[475px]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2">
              <Link
                to={`/contests/${bookmark.contest.contestId}`}
                className="hover:text-primary transition-colors"
              >
                {bookmark.contest.name}
              </Link>
            </CardTitle>
            <div className="flex gap-1">
              <Badge
                className={`${getPlatformColor(bookmark.contest.platform)}`}
              >
                {bookmark.contest.platform}
              </Badge>
              <Badge className={`${getStatusColor(bookmark.contest.status)}`}>
                {bookmark.contest.status.charAt(0).toUpperCase() +
                  bookmark.contest.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent
          // className={
          //   "flex-grow space-y-2 flex flex-col overflow-hidden justify-end"
          // }
          className={`flex-grow space-y-2 flex flex-col ${
            bookmark.contest.status === "past"
              ? "justify-between"
              : "justify-end"
          }`}
        >
          <div className="">
            <div className="text-sm">
              <span className="font-medium">Start:</span>{" "}
              {new Date(bookmark.contest.startTime).toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Duration:</span>{" "}
              {formatDuration(bookmark.contest.duration)}
            </div>
          </div>
          {bookmark.contest.status === "upcoming" ? (
            <div className="mt-4">
              <CountdownTimer
                targetDate={new Date(bookmark.contest.startTime)}
              />
            </div>
          ) : bookmark.contest.status === "ongoing" ? (
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
                        new Date(bookmark.contest.startTime).getTime() +
                          bookmark.contest.duration * 60000
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
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => handleEditClick(bookmark)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Notes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteClick(bookmark)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
          <div className="flex gap-1">
            {bookmark.contest.status == "past" && (
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
                  onClick={() =>
                    getContestAndRedirect(bookmark.contest.contestId)
                  }
                >
                  Solution
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant={isHovered ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              asChild
            >
              <a
                href={bookmark.contest.url}
                target="_blank"
                rel="noopener noreferrer"
              >
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
