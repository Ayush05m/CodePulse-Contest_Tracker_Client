import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Contest } from "@/types/contest";

// Add this at the top of the file, outside the slice
export const getContestStatus = (
  startTime: string,
  duration: number
): "upcoming" | "ongoing" | "past" => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = start + duration * 60 * 1000; // Convert minutes to milliseconds

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "ongoing";
  } else {
    return "past";
  }
};

export interface BookmarkItem {
  id: string;
  contest: Contest;
  notes?: string;
  createdAt: string;
}

interface BookmarksState {
  items: BookmarkItem[];
}

const initialState: BookmarksState = {
  items: [],
};

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (
      state,
      action: PayloadAction<{ contest: Contest; notes?: string }>
    ) => {
      const { contest, notes } = action.payload;
      // Check if bookmark already exists
      const exists = state.items.some(
        (item) => item.contest.contestId === contest.contestId
      );

      if (!exists) {
        const updatedContest = {
          ...contest,
          status: getContestStatus(
            contest.startTime.toString(),
            contest.duration
          ),
        };

        state.items.push({
          id: Date.now().toString(), // Generate a unique ID
          contest: updatedContest,
          notes,
          createdAt: new Date().toISOString(),
        });
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      const contestId = action.payload;
      state.items = state.items.filter(
        (item) => item.contest.contestId !== contestId
      );
    },
    updateBookmarkNotes: (
      state,
      action: PayloadAction<{ contestId: string; notes: string }>
    ) => {
      const { contestId, notes } = action.payload;
      const bookmark = state.items.find(
        (item) => item.contest.contestId === contestId
      );
      if (bookmark) {
        bookmark.notes = notes;
      }
    },
  },
});

export const { addBookmark, removeBookmark, updateBookmarkNotes } =
  bookmarksSlice.actions;

export default bookmarksSlice.reducer;
