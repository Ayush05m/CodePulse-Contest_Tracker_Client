import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ContestCard from "@/components/contests/ContestCard";
import ContestFilter from "@/components/contests/ContestFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchContests } from "@/services/contestService";

interface FilterState {
  search: string;
  platforms: string[];
  status: string;
  sort: string;
}

const ContestsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platforms: [],
    status: "",
    sort: "",
  });
  const [page, setPage] = useState(1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contests", activeTab, filters, page],
    queryFn: () =>
      fetchContests({
        status: activeTab !== "all" ? activeTab : "",
        platform: filters.platforms,
        search: filters.search,
        page,
        limit: 12,
        sort: filters.sort,
      }),
    placeholderData: (previousData) => previousData,
  });

  // Ensure correct data access
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const renderSkeletons = () => {
    return Array(6)
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
        <h1 className="text-3xl font-bold mb-2">Programming Contests</h1>
        <p className="text-muted-foreground">
          Find and track upcoming programming contests from various platforms.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <ContestFilter onFilterChange={handleFilterChange} />

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeletons()}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">
                Error loading contests: {(error as Error).message}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No contests found.
              </p>
              {(filters.search || filters.platforms || filters.status) && (
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters.
                </p>
              )}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + filters.platforms + filters.status + page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {data?.data.map((contest) => (
                    <ContestCard key={contest.contestId} contest={contest} />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContestsPage;
