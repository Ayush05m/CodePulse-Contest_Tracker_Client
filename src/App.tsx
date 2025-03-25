import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ContestsPage from "./pages/ContestsPage";
import BookmarksPage from "./pages/BookmarksPage";
import SolutionsPage from "./pages/SolutionsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import { toast } from "sonner";
import { useEffect } from "react";
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    setTimeout(() => {
      toast.warning(
        "This site is hosted on Vercel and Render and may take a few seconds to load initially.",
        { duration: 9000 }
      );
    }, 100);
    setTimeout(() => {
      toast.info(
        "Please be patient, and try refreshing the page if it doesn't load.",
        {
          duration: 9000,
        }
      );
    }, 10000);
    setTimeout(() => {
      toast.success("Thanks for Understanding! 😊");
    }, 18000);
    setTimeout(() => {
      toast.info(
        "This site is still under development. Some features may not work as expected. Please report any issues you find."
      );
    }, 20000);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contests" element={<ContestsPage />} />
                {/* <Route
                    path="/contests/:id"
                    element={<ContestDetailsPage />}
                  /> */}
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
