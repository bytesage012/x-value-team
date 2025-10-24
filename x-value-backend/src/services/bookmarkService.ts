import { User, Listing } from '../types';
import { database } from '../data/database';

export const toggleBookmark = async (listingId: string, user: User): Promise<boolean> => {
    try {
        // Check if already bookmarked
        const isCurrentlyBookmarked = database.isBookmarked(user.id, listingId);
        
        if (isCurrentlyBookmarked) {
            // Remove bookmark
            await database.removeBookmark(user.id, listingId);
            return false;
        } else {
            // Add bookmark
            try {
                const bookmark = await database.addBookmark(user.id, listingId);
                return bookmark !== undefined;
            } catch (error) {
                if (error instanceof Error && error.message === "Bookmark limit reached (max 100)") {
                    throw new Error("You can't bookmark more than 100 listings");
                }
                if (error instanceof Error && error.message === "Listing not found") {
                    throw new Error("This listing no longer exists");
                }
                throw error;
            }
        }
    } catch (error) {
        console.error('Error in toggleBookmark:', error);
        throw error;
    }
};

export const isBookmarked = async (listingId: string, user: User): Promise<boolean> => {
    try {
        return database.isBookmarked(user.id, listingId);
    } catch (error) {
        console.error('Error in isBookmarked:', error);
        throw error;
    }
};

export const getBookmarks = async (user: User): Promise<Listing[]> => {
    try {
        return database.getUserBookmarksWithListings(user.id);
    } catch (error) {
        console.error('Error in getBookmarks:', error);
        throw error;
    }
};