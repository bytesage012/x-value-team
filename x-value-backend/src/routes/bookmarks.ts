import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { toggleBookmark, isBookmarked, getBookmarks } from "../services/bookmarkService";

const router = Router();

// Get all bookmarks for the authenticated user
router.get("/", authenticate, async (req, res) => {
    try {
        const bookmarkedListings = await getBookmarks(req.user!);
        return res.status(200).json({ bookmarks: bookmarkedListings });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to fetch bookmarks";
        return res.status(400).json({ message });
    }
});

// Check if a listing is bookmarked
router.get("/:listingId", authenticate, async (req, res) => {
    try {
        const { listingId } = req.params;
        if (!listingId) {
            return res.status(400).json({ message: "Listing ID is required" });
        }
        const bookmarked = await isBookmarked(listingId, req.user!);
        return res.status(200).json({ isBookmarked: bookmarked });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to check bookmark status";
        return res.status(400).json({ message });
    }
});

// Toggle bookmark status
router.post("/:listingId", authenticate, async (req, res) => {
    try {
        const { listingId } = req.params;
        if (!listingId) {
            return res.status(400).json({ message: "Listing ID is required" });
        }
        const isNowBookmarked = await toggleBookmark(listingId, req.user!);
        return res.status(200).json({ isBookmarked: isNowBookmarked });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to toggle bookmark";
        return res.status(400).json({ message });
    }
});

export default router;