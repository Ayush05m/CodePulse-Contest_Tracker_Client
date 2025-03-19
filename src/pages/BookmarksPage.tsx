"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Loader2,
  BookmarkIcon,
  Search,
  X,
  ExternalLink,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CountdownTimer from "@/components/contests/CountdownTimer";
import { useAppSelector, useAppDispatch } from "@/hooks/userReduxStore";
import {
  removeBookmarkThunk,
  updateBookmarkNotesThunk,
} from "@/store/slice/bookmarksSlice";
import type { BookmarkItem } from "@/store/slice/bookmarksSlice";
import { getSolutionsLinkByContestId } from "@/services/solutionService";
import { Solution } from "@/types/solution";

const BookmarksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkItem | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.items);
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const contestName = bookmark.contest.name?.toLowerCase();
    const contestPlatform = bookmark.contest.platform?.toLowerCase();
    const query = searchQuery.toLowerCase();
    return contestName?.includes(query) || contestPlatform?.includes(query);
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(filteredBookmarks);
  }, []);

  const handleEditClick = (bookmark: BookmarkItem) => {
    setSelectedBookmark(bookmark);
    setNotes(bookmark.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (bookmark: BookmarkItem) => {
    setSelectedBookmark(bookmark);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateNotes = async () => {
    if (!selectedBookmark) return;

    setIsUpdating(true);
    try {
      dispatch(
        updateBookmarkNotesThunk({
          id: selectedBookmark.contest.contestId,
          notes,
        })
      );

      toast("Notes updated", {
        description: "Your bookmark notes have been updated successfully.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Error", {
        description: "Failed to update notes. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBookmark = async () => {
    if (!selectedBookmark) return;

    setIsDeleting(true);
    try {
      dispatch(removeBookmarkThunk(selectedBookmark.contest.contestId));

      toast("Bookmark removed", {
        description: "The contest has been removed from your bookmarks.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast("Error", {
        description: "Failed to remove bookmark. Please try again.",
      });
    } finally {
      setIsDeleting(false);
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
    <div className="space-y-6 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Your Bookmarks</h1>
            <p className="text-muted-foreground">Manage your saved contests</p>
          </div>
          <BookmarkIcon className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks && filteredBookmarks.length > 0 ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {filteredBookmarks.map((bookmark) => (
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
                          className={`${getPlatformColor(
                            bookmark.contest.platform
                          )}`}
                        >
                          {bookmark.contest.platform}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(
                            bookmark.contest.status
                          )}`}
                        >
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
                            <span className="text-green-500 font-medium">
                              LIVE NOW
                            </span>
                          </div>
                          <div className="w-full">
                            <CountdownTimer
                              targetDate={
                                new Date(
                                  new Date(
                                    bookmark.contest.startTime
                                  ).getTime() +
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
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12">
          <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No bookmarks match your search. Try a different query."
              : "You haven't bookmarked any contests yet."}
          </p>
          <Button asChild>
            <Link to="/contests">Browse Contests</Link>
          </Button>
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="dark:text-white">
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Add or update notes for {selectedBookmark?.contest.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNotes} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Notes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this bookmark? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBookmark}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookmarksPage;
