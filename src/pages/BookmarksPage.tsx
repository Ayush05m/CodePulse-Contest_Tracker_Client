import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, BookmarkIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppSelector, useAppDispatch } from "@/hooks/userReduxStore";
import {
  removeBookmark,
  // removeBookmarkThunk,
  updateBookmarkNotesThunk,
} from "@/store/slice/bookmarksSlice";
import type { BookmarkItem } from "@/store/slice/bookmarksSlice";
import { BookmarkCard } from "@/components/bookmarkCard";

const BookmarksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkItem | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector((state) => state.bookmarks.items);
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const contestName = bookmark.contest.name?.toLowerCase();
    const contestPlatform = bookmark.contest.platform?.toLowerCase();
    const query = searchQuery.toLowerCase();
    return contestName?.includes(query) || contestPlatform?.includes(query);
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(filteredBookmarks);
  }, []);

  const handleUpdateNotes = async () => {
    if (!selectedBookmark) return;

    setIsUpdating(true);
    try {
      dispatch(
        updateBookmarkNotesThunk({
          id: selectedBookmark.contest.contestId,
          notes,
        })
      );

      toast("Notes updated", {
        description: "Your bookmark notes have been updated successfully.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast("Error", {
        description: "Failed to update notes. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBookmark = async () => {
    if (!selectedBookmark) return;

    setIsDeleting(true);
    try {
      dispatch(removeBookmark(selectedBookmark.contest.contestId));

      toast("Bookmark removed", {
        description: "The contest has been removed from your bookmarks.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast("Error", {
        description: "Failed to remove bookmark. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Your Bookmarks</h1>
            <p className="text-muted-foreground">Manage your saved contests</p>
          </div>
          <BookmarkIcon className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks && filteredBookmarks.length > 0 ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                bookmark={bookmark}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                setNotes={setNotes}
                setSelectedBookmark={setSelectedBookmark}
                setIsEditDialogOpen={setIsEditDialogOpen}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12">
          <BookmarkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No bookmarks match your search. Try a different query."
              : "You haven't bookmarked any contests yet."}
          </p>
          <Button asChild>
            <Link to="/contests">Browse Contests</Link>
          </Button>
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="dark:text-white">
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Add or update notes for {selectedBookmark?.contest.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNotes} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Notes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this bookmark? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBookmark}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookmarksPage;
