import { motion } from "framer-motion"
import ContestCard from "@/components/contests/ContestCard"
import type { Contest } from "@/types/contest"

interface ContestGridProps {
  contests: Contest[]
}

export default function ContestGrid({ contests }: ContestGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
    >
      {contests.map((contest) => (
        <ContestCard key={contest._id} contest={contest} />
      ))}
    </motion.div>
  )
}

