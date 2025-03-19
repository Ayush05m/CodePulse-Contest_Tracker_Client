import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Contest } from "@/types/contest";
import type { RootState } from "@/store";
// import { toast } from "sonner";
// import { addBookmark } from "@/services/bookmarkService";
// const API_URL = import.meta.env.VITE_API_URL;

export const getContestStatus = (
  startTime: string,
  duration: number
): "upcoming" | "ongoing" | "past" => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = start + duration * 1000; // Convert minutes to milliseconds

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
    setBookmarks: (state, action: PayloadAction<BookmarkItem[]>) => {
      state.items = action.payload;
    },
    addBookmark: (state, action: PayloadAction<BookmarkItem>) => {
      const bookmark = action.payload;
      // Check if bookmark exists by ID or contest ID
      const exists = state.items.some(
        (item) =>
          item.id === bookmark.id ||
          item.contest.contestId === bookmark.contest.contestId
      );
      if (!exists) {
        const updatedContest = {
          ...bookmark.contest,
          status: getContestStatus(
            bookmark.contest.startTime.toString(),
            bookmark.contest.duration
          ),
        };
        state.items.push({
          ...bookmark,
          contest: updatedContest,
        });
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      const bookmarkId = action.payload;
      state.items = state.items.filter((item) => item.id !== bookmarkId);
    },
    updateBookmarkNotes: (
      state,
      action: PayloadAction<{ id: string; notes: string }>
    ) => {
      const { id, notes } = action.payload;
      const bookmark = state.items.find((item) => item.id === id);
      if (bookmark) {
        bookmark.notes = notes;
      }
    },
  },
});

// Thunks
export const initializeBookmarks = createAsyncThunk(
  "bookmarks/initialize",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (isAuthenticated) {
      try {
        const response = await fetch("/api/bookmarks", {
          headers: { Authorization: `Bearer ${state.auth.token}` },
        });
        const data = await response.json();
        const bookmarks = data.data.map((serverBookmark: any) => ({
          id: serverBookmark._id,
          contest: {
            contestId: serverBookmark.contest.contestId,
            name: serverBookmark.contest.name,
            platform: serverBookmark.contest.platform,
            startTime: serverBookmark.contest.startTime,
            duration: serverBookmark.contest.duration,
          },
          notes: serverBookmark.notes,
          createdAt: serverBookmark.createdAt,
        }));
        dispatch(setBookmarks(bookmarks));
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    } else {
      const localBookmarks = localStorage.getItem("bookmarks");
      if (localBookmarks) {
        const parsedBookmarks = JSON.parse(localBookmarks);
        const processedBookmarks = parsedBookmarks.map((bm: BookmarkItem) => ({
          ...bm,
          contest: {
            ...bm.contest,
            status: getContestStatus(
              bm.contest.startTime.toString(),
              bm.contest.duration
            ),
          },
        }));
        dispatch(setBookmarks(processedBookmarks));
      }
    }
  }
);

export const addBookmarkThunk = createAsyncThunk(
  "bookmarks/add",
  async (
    { contest, notes }: { contest: Contest; notes?: string },
    { getState, dispatch }
  ) => {
    // const state = getState() as RootState;
    // const { user, isAuthenticated } = state.auth;

    // if (isAuthenticated) {
    //   try {
    //     // const response = await fetch(`${API_URL}/api/bookmarks`, {
    //     //   method: "POST",
    //     //   headers: {
    //     //     "Content-Type": "application/json",
    //     //     Authorization: `Bearer ${state.auth.token}`,
    //     //   },
    //     //   body: JSON.stringify({ contest: contest.contestId, notes }),
    //     // });
    //     // const data = await response.json();
    //     // const serverBookmark = await addBookmark(
    //     //   contest.contestId,
    //     //   user,
    //     //   notes
    //     // );
    //     // dispatch(
    //     //   bookmarksSlice.actions.addBookmark({
    //     //     id: serverBookmark._id,
    //     //     contest: serverBookmark.contest,
    //     //     notes: serverBookmark.notes,
    //     //     createdAt: serverBookmark.createdAt || new Date().toISOString(),
    //     //   })
    //     // );
    //   } catch (error) {
    //     toast.error("Failed to add bookmark");
    //   }
    // } else {
    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      contest,
      notes,
      createdAt: new Date().toISOString(),
    };
    dispatch(bookmarksSlice.actions.addBookmark(newBookmark));
    const currentState = (getState() as RootState).bookmarks.items;
    localStorage.setItem("bookmarks", JSON.stringify(currentState));
  }
  // }
);

export const removeBookmarkThunk = createAsyncThunk(
  "bookmarks/remove",
  async (bookmarkId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (isAuthenticated) {
      await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${state.auth.token}` },
      });
    }
    dispatch(bookmarksSlice.actions.removeBookmark(bookmarkId));
    if (!isAuthenticated) {
      const currentState = (getState() as RootState).bookmarks.items;
      localStorage.setItem("bookmarks", JSON.stringify(currentState));
    }
  }
);

export const updateBookmarkNotesThunk = createAsyncThunk(
  "bookmarks/updateNotes",
  async (
    { id, notes }: { id: string; notes: string },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (isAuthenticated) {
      await fetch(`/api/bookmarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.auth.token}`,
        },
        body: JSON.stringify({ notes }),
      });
    }
    dispatch(bookmarksSlice.actions.updateBookmarkNotes({ id, notes }));
    if (!isAuthenticated) {
      const currentState = (getState() as RootState).bookmarks.items;
      localStorage.setItem("bookmarks", JSON.stringify(currentState));
    }
  }
);

export const { setBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
