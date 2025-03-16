import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformFilterProps {
  selectedPlatforms: string[]
  onToggle: (platform: string) => void
}

const platforms = [
  {
    id: "Codeforces",
    name: "Codeforces",
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800",
  },
  {
    id: "CodeChef",
    name: "CodeChef",
    color:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800",
  },
  {
    id: "LeetCode",
    name: "LeetCode",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800",
  },
  {
    id: "HackerRank",
    name: "HackerRank",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800",
  },
  {
    id: "AtCoder",
    name: "AtCoder",
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800",
  },
  {
    id: "TopCoder",
    name: "TopCoder",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:border-purple-800",
  },
]

export default function PlatformFilter({ selectedPlatforms, onToggle }: PlatformFilterProps) {
  return (
    <div className="space-y-2">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onToggle(platform.id)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border transition-colors",
            selectedPlatforms.includes(platform.id) ? platform.color : "bg-background hover:bg-muted",
          )}
        >
          <span>{platform.name}</span>
          {selectedPlatforms.includes(platform.id) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center rounded-full"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          )}
        </button>
      ))}
    </div>
  )
}

