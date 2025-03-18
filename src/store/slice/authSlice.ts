import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

interface AuthState {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

const getInitialState = (): AuthState => {
  const defaultState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  if (typeof window === "undefined") return defaultState;

  try {
    const token = localStorage.getItem("token");
    if (!token) return defaultState;

    const decoded = jwtDecode<User & { exp: number }>(token);
    if (
      decoded.exp * 1000 < Date.now() ||
      !decoded.id ||
      !decoded.name ||
      !decoded.email
    ) {
      localStorage.removeItem("token");
      return defaultState;
    }

    return {
      user: { id: decoded.id, name: decoded.name, email: decoded.email },
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  } catch (error) {
    localStorage.removeItem("token");
    return defaultState;
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log(response);

      if (!response) {
        let errorMessage = "Login failed";
        // try {
        //   const errorData = await response.json();
        //   errorMessage = errorData.message || errorMessage;
        // } catch (e) {
        //   errorMessage = response.statusText || errorMessage;
        // }
        return rejectWithValue(errorMessage);
      }

      const data = response.data;
      const token = data.token;

      // Validate token before saving
      console.log(token);
      const decoded = jwtDecode<User & { exp: number }>(token);
      console.log(decoded);
      if (decoded.exp * 1000 < Date.now() || !decoded.id) {
        return rejectWithValue("Invalid token received");
      }

      localStorage.setItem("token", token);
      return {
        token,
        user: { id: decoded.id, name: decoded.name, email: decoded.email },
      };
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      if (!response) {
        let errorMessage = "Registration failed";
        // try {
        //   const errorData = response;
        //   errorMessage = errorData.message || errorMessage;
        // } catch (e) {
        //   errorMessage = response.statusText || errorMessage;
        // }
        return rejectWithValue(errorMessage);
      }

      console.log(response);

      const data = response.data;
      const token = data.token;

      // Validate token before saving
      console.log(token);
      const decoded = jwtDecode<User & { exp: number }>(token);
      console.log(decoded);
      if (decoded.exp * 1000 < Date.now() || !decoded.id) {
        return rejectWithValue("Invalid token received");
      }

      localStorage.setItem("token", token);
      return {
        token,
        user: { id: decoded.id, name: decoded.name, email: decoded.email },
      };
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  return {};
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const decoded = jwtDecode<User & { exp: number }>(token);
    if (
      decoded.exp * 1000 < Date.now() ||
      !decoded.id ||
      !decoded.name ||
      !decoded.email
    ) {
      localStorage.removeItem("token");
      throw new Error("Invalid or expired token");
    }

    return {
      user: { id: decoded.id, name: decoded.name, email: decoded.email },
      token,
      isAuthenticated: true,
    };
  } catch (error) {
    localStorage.removeItem("token");
    return { user: null, token: null, isAuthenticated: false };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      });
  },
});

export default authSlice.reducer;
