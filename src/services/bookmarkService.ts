import axios from "axios";
import type { Bookmark } from "@/types/bookmark";
// import { useAppSelector } from "@/hooks/userReduxStore";
// import { User } from "@/store/slice/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const bookmarks =
      JSON.parse(localStorage.getItem("bookmarks") || "[]") || [];
    console.log(bookmarks);
    let bookmarksData: Bookmark[] = [];
    for (let i = 0; i < bookmarks.length; i++) {
      const params = { contestId: bookmarks[i] };
      const response = await axios.get(`${API_URL}/contests/contestId`, {
        params,
      });

      bookmarksData.push(response.data.data);
    }
    return bookmarksData;

    // const token = localStorage.getItem("token")
    // const response = await axios.get(`${API_URL}/bookmarks`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    // return response.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch bookmarks");
  }
};

export const addBookmark = async (
  contestId: string,
  notes?: string
  // user: User,
): Promise<Bookmark> => {
  // const { user } = useAppSelector((state) => state.auth);
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/bookmarks`,
      { contest: contestId, notes },
      // { contest: contestId, notes, user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to add bookmark");
  }
};

export const updateBookmark = async (
  bookmarkId: string,
  notes: string
): Promise<Bookmark> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/bookmarks/${bookmarkId}`,
      { notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update bookmark");
  }
};

export const removeBookmark = async (Id: string): Promise<void> => {
  try {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    ) as string[];
    const updatedBookmarks = bookmarks.filter((e) => e !== Id); // Create a new array without the Id
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    console.log(JSON.parse(localStorage.getItem("bookmarks") || "[]"));
    // const token = localStorage.getItem("token");
    // await axios.delete(`${API_URL}/bookmarks/${bookmarkId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to remove bookmark");
  }
};
