import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Youtube } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Solution } from "@/types/solution";
import { useVoteSolution } from "@/hooks/useSolutions";

interface SolutionCardProps {
  solution: Solution;
}

const SolutionCard = ({ solution }: SolutionCardProps) => {
  const { voteSolution, isLoading } = useVoteSolution(solution._id);
  const [isHovered, setIsHovered] = useState(false);

  isHovered;
  // Ensure we use the first video link safely
  const video = solution.youtubeLinks[0];

  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = video ? getYoutubeVideoId(video.url) : null;
  const thumbnailUrl =
    video?.thumbnail ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : "/placeholder.svg?height=180&width=320");

  const handleVote = (voteType: "upvote" | "downvote") => {
    voteSolution(voteType);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2">
              {video?.title || "Untitled Solution"}
            </CardTitle>
            {solution.contest_id && (
              <Badge variant="outline">{solution.contest_id.name}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {video?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}

          {video?.url && (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-md overflow-hidden group"
            >
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Youtube className="w-12 h-12 text-white" />
              </div>
            </a>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {solution.submittedBy?.name
                  ? getInitials(solution.submittedBy.name)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span>{solution.submittedBy?.name || "Unknown User"}</span>
            <span className="text-xs">
              • {new Date(solution.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleVote("upvote")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {solution.votes.upvotes}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upvote this solution</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleVote("downvote")}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {solution.votes.downvotes}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Downvote this solution</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {video?.url && (
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                Watch
                <Youtube className="h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SolutionCard;
