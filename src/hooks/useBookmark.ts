"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "./userReduxStore";
import {
  addBookmark,
  removeBookmark,
  updateBookmarkNotes,
} from "@/store/slice/bookmarksSlice";
import type { Contest } from "@/types/contest";
import { getContestStatus } from "@/store/slice/bookmarksSlice";

export const useBookmarkRedux = (contestId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.items);
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.contest.contestId === contestId
  );
  const bookmarkItem = bookmarks.find(
    (bookmark) => bookmark.contest.contestId === contestId
  );

  const addBookmarkWithNotes = async (contest: Contest, notes?: string) => {
    setIsLoading(true);
    try {
      dispatch(addBookmark({ contest, notes }));
      toast("Contest bookmarked", {
        description: "The contest has been added to your bookmarks.",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to bookmark contest",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmarkById = async () => {
    setIsLoading(true);
    try {
      dispatch(removeBookmark(contestId));
      toast("Bookmark removed", {
        description: "The contest has been removed from your bookmarks.",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to remove bookmark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = async (notes: string) => {
    setIsLoading(true);
    try {
      dispatch(updateBookmarkNotes({ contestId, notes }));
      toast("Notes updated", {
        description: "Your bookmark notes have been updated successfully.",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Failed to update notes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBookmarkStatuses = () => {
    const allBookmarks = bookmarks;

    allBookmarks.forEach((bookmark) => {
      const currentStatus = getContestStatus(
        bookmark.contest.startTime.toString(),
        bookmark.contest.duration
      );

      // If status has changed, update it
      if (currentStatus !== bookmark.contest.status) {
        const updatedContest = {
          ...bookmark.contest,
          status: currentStatus,
        };

        // Remove and re-add with updated status
        dispatch(removeBookmark(bookmark.contest.contestId));
        dispatch(
          addBookmark({ contest: updatedContest, notes: bookmark.notes })
        );
      }
    });
  };

  useEffect(() => {
    // Refresh statuses on mount
    refreshBookmarkStatuses();

    // Set up interval to refresh every minute
    const intervalId = setInterval(refreshBookmarkStatuses, 60000);

    return () => clearInterval(intervalId);
  }, [bookmarks.length]);

  return {
    isBookmarked,
    bookmarkItem,
    addBookmark: addBookmarkWithNotes,
    removeBookmark: removeBookmarkById,
    updateNotes,
    refreshBookmarkStatuses,
    isLoading,
  };
};
