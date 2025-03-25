import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code,
  BookmarkIcon,
  Youtube,
  Clock,
  Calendar,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchContests } from "@/services/contestService";
import ContestCard from "@/components/contests/ContestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { toast } from "sonner";

const HomePage = () => {
  // Fetch upcoming contests for the featured section
  const { data: contestsData, isLoading } = useQuery({
    queryKey: ["contests", "upcoming", "featured"],
    queryFn: () => fetchContests({ status: "upcoming", limit: 3 }),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Track Contests",
      description:
        "Stay updated with upcoming programming contests from Codeforces, CodeChef, and LeetCode.",
    },
    {
      icon: <BookmarkIcon className="h-10 w-10 text-primary" />,
      title: "Bookmark Favorites",
      description:
        "Save contests you're interested in and get easy access to them later.",
    },
    {
      icon: <Youtube className="h-10 w-10 text-primary" />,
      title: "Access Solutions",
      description:
        "Find and share video solutions for contest problems to improve your skills.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Real-time Countdowns",
      description:
        "Never miss a contest with accurate countdowns to contest start times.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Track Programming <span className="text-primary">Contests</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with upcoming programming contests from popular
            platforms and never miss a chance to improve your skills.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" asChild>
            <Link to="/contests">
              Browse Contests <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/solutions">
              View Solutions <Youtube className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Featured Contests */}
      <section>
        <div className="text-center mb-8">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Upcoming Contests
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Don't miss these upcoming programming challenges
          </motion.p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
            ))}
          </div>
        ) : contestsData && contestsData?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-8xl">
            {contestsData.data.slice(0, 3).map((contest) => (
              <ContestCard key={contest.contestId} contest={contest} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming contests found.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/contests">
              View All Contests <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to excel in competitive programming
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <motion.div
          className="bg-primary/10 rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to ace your next contest?
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of competitive programmers and take your skills
            to the next level.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contests">
                Browse Contests <Code className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
