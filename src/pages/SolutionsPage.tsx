import type React from "react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, Youtube, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import SolutionCard from "@/components/solutions/SolutionCard";
import { getAllSolutions } from "@/services/solutionService";

interface FilterState {
  search: string;
  platform: string;
  sortBy: string;
}

const SolutionsPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    sortBy: "newest",
  });
  const [mobileFilters, setMobileFilters] = useState<FilterState>({
    search: "",
    platform: "all",
    sortBy: "newest",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["solutions", filters, page],
    queryFn: () =>
      getAllSolutions({
        search: filters.search,
        platform: filters.platform !== "all" ? filters.platform : undefined,
        sort: getSortValue(filters.sortBy),
        page,
        limit: 10,
      }),
    placeholderData: (previousData) => previousData,
  });

  const getSortValue = (sortBy: string) => {
    switch (sortBy) {
      case "newest":
        return "-createdAt";
      case "oldest":
        return "createdAt";
      case "mostUpvoted":
        return "-votes.upvotes";
      case "mostDownvoted":
        return "-votes.downvotes";
      default:
        return "-createdAt";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setMobileFilters((prev) => ({ ...prev, [name]: value }));
  // };

  const handleMobileSelectChange = (name: string, value: string) => {
    setMobileFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyMobileFilters = () => {
    setFilters(mobileFilters);
    setIsOpen(false);
    setPage(1);
  };

  const resetFilters = () => {
    const resetState = { search: "", platform: "all", sortBy: "newest" };
    setFilters(resetState);
    setMobileFilters(resetState);
    setPage(1);
  };

  const resetMobileFilters = () => {
    setMobileFilters({ search: "", platform: "all", sortBy: "newest" });
  };

  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div key={index}>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Solutions</h1>
            <p className="text-muted-foreground">
              Browse video solutions for programming contests
            </p>
          </div>
          <Youtube className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            name="search"
            placeholder="Search solutions..."
            value={filters.search}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.platform}
          onValueChange={(value) => handleSelectChange("platform", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Codeforces">Codeforces</SelectItem>
            <SelectItem value="CodeChef">CodeChef</SelectItem>
            <SelectItem value="LeetCode">LeetCode</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleSelectChange("sortBy", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="mostUpvoted">Most Upvoted</SelectItem>
            <SelectItem value="mostDownvoted">Most Downvoted</SelectItem>
          </SelectContent>
        </Select>
        {(filters.search ||
          filters.platform !== "all" ||
          filters.sortBy !== "newest") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button variant="ghost" size="icon" onClick={resetFilters}>
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Mobile Filters */}
      <div className="flex md:hidden items-center gap-2 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            name="search"
            placeholder="Search solutions..."
            value={filters.search}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Filter and sort solutions</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={mobileFilters.platform}
                  onValueChange={(value) =>
                    handleMobileSelectChange("platform", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="CodeChef">CodeChef</SelectItem>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="HackerRank">HackerRank</SelectItem>
                    <SelectItem value="AtCoder">AtCoder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={mobileFilters.sortBy}
                  onValueChange={(value) =>
                    handleMobileSelectChange("sortBy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="mostUpvoted">Most Upvoted</SelectItem>
                    <SelectItem value="mostDownvoted">
                      Most Downvoted
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="flex flex-row justify-between sm:justify-between gap-2">
              <Button variant="outline" onClick={resetMobileFilters}>
                Reset
              </Button>
              <Button onClick={applyMobileFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {(filters.search ||
          filters.platform !== "all" ||
          filters.sortBy !== "newest") && (
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Solutions List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderSkeletons()}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive">
            Error loading solutions: {(error as Error).message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No solutions found</h3>
          <p className="text-muted-foreground mb-6">
            {filters.search || filters.platform !== "all"
              ? "No solutions match your search criteria. Try adjusting your filters."
              : "There are no solutions available yet."}
          </p>
          <Button asChild>
            <Link to="/contests">Browse Contests</Link>
          </Button>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={filters.platform + filters.sortBy + page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {data?.data?.map((solution) => (
                <SolutionCard key={solution._id} solution={solution} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {data?.pagination && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!data.pagination.prev || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!data.pagination.next || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SolutionsPage;
