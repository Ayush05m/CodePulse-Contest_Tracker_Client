"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"

interface ContestFilterProps {
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  search: string
  platform: string
  status: string
}

const ContestFilter = ({ onFilterChange }: ContestFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    platform: "",
    status: "",
  })
  const [mobileFilters, setMobileFilters] = useState<FilterState>({
    search: "",
    platform: "",
    status: "",
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    onFilterChange({ ...filters, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
    onFilterChange({ ...filters, [name]: value })
  }

  // const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setMobileFilters((prev) => ({ ...prev, [name]: value }))
  // }

  const handleMobileSelectChange = (name: string, value: string) => {
    setMobileFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyMobileFilters = () => {
    setFilters(mobileFilters)
    onFilterChange(mobileFilters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const resetState = { search: "", platform: "", status: "" }
    setFilters(resetState)
    setMobileFilters(resetState)
    onFilterChange(resetState)
  }

  const resetMobileFilters = () => {
    setMobileFilters({ search: "", platform: "", status: "" })
  }

  return (
    <div className="mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            name="search"
            placeholder="Search contests..."
            value={filters.search}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        <Select value={filters.platform} onValueChange={(value) => handleSelectChange("platform", value)}>
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
        <Select value={filters.status} onValueChange={(value) => handleSelectChange("status", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
        {(filters.search || filters.platform || filters.status) && (
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
      <div className="flex md:hidden items-center gap-2">
        <div className="relative flex-grow text-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            name="search"
            placeholder="Search contests..."
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
              <SheetDescription>Filter contests by platform and status</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4 text-white">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={mobileFilters.platform}
                  onValueChange={(value) => handleMobileSelectChange("platform", value)}
                >
                  <SelectTrigger className="text-white tracking-wider">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent className="text-white">
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="CodeChef">CodeChef</SelectItem>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={mobileFilters.status}
                  onValueChange={(value) => handleMobileSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="flex flex-row justify-between sm:justify-between gap-2">
              <Button variant="outline" className="text-white" onClick={resetMobileFilters}>
                Reset
              </Button>
              <Button onClick={applyMobileFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {(filters.search || filters.platform || filters.status) && (
          <Button variant="ghost" size="icon" onClick={resetFilters} className="border">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ContestFilter

