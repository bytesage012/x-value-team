import { promises as fs } from "fs";
import path from "path";
import { Bookmark, FilterOptions, Listing, ListingUpdateInput, User } from "../types";
import { config } from "../config/env";

interface DatabaseShape {
  users: User[];
  listings: Listing[];
  bookmarks: Bookmark[];
}

const DEFAULT_DATA: DatabaseShape = {
  users: [],
  listings: [],
  bookmarks: [],
};

export class JsonDatabase {
  private isInitialized = false;
  private data: DatabaseShape = { ...DEFAULT_DATA };
  private readonly filePath: string;

  constructor(filePath: string = config.dataFilePath) {
    this.filePath = filePath;
  }

  async init() {
    if (this.isInitialized) {
      return;
    }

    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, "utf-8");

    try {
      const parsed = JSON.parse(raw) as Partial<DatabaseShape>;
      this.data = {
        users: parsed.users ?? [],
        listings: parsed.listings ?? [],
        bookmarks: parsed.bookmarks ?? [],
      };
    } catch (error) {
      console.warn("[database] Could not parse database file. Re-initializing.");
      this.data = { ...DEFAULT_DATA };
      await this.persist();
    }

    this.isInitialized = true;
  }

  private async ensureFile() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch (error) {
      await fs.writeFile(this.filePath, JSON.stringify(DEFAULT_DATA, null, 2));
    }
  }

  private assertInitialized() {
    if (!this.isInitialized) {
      throw new Error("Database not initialized. Call init() before using the database.");
    }
  }

  private async persist() {
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }

  getUsers() {
    this.assertInitialized();
    return [...this.data.users];
  }

  findUserByEmail(email: string) {
    this.assertInitialized();
    return this.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    this.assertInitialized();
    return this.data.users.find((user) => user.id === id);
  }

  async addUser(user: User) {
    this.assertInitialized();
    this.data.users.push(user);
    await this.persist();
    return user;
  }

  getListings(filters?: FilterOptions) {
    this.assertInitialized();
    let listings = [...this.data.listings];

    if (filters) {
      listings = listings.filter(listing => {
        if (filters.minPrice !== undefined && listing.price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && listing.price > filters.maxPrice) return false;
        if (filters.minYear !== undefined && listing.year < filters.minYear) return false;
        if (filters.maxYear !== undefined && listing.year > filters.maxYear) return false;
        if (filters.minMileage !== undefined && listing.mileage < filters.minMileage) return false;
        if (filters.maxMileage !== undefined && listing.mileage > filters.maxMileage) return false;
        if (filters.fuelType?.length && !filters.fuelType.includes(listing.fuelType)) return false;
        if (filters.transmission?.length && !filters.transmission.includes(listing.transmission)) return false;
        if (filters.location && listing.location.toLowerCase() !== filters.location.toLowerCase()) return false;
        if (filters.make && listing.make.toLowerCase() !== filters.make.toLowerCase()) return false;
        if (filters.model && listing.model.toLowerCase() !== filters.model.toLowerCase()) return false;
        return true;
      });

      if (filters.sortBy) {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        listings.sort((a, b) => {
        if (filters.sortBy === 'price') {
          return (a.price - b.price) * order;
        } else if (filters.sortBy === 'year') {
          return (a.year - b.year) * order;
        } else if (filters.sortBy === 'mileage') {
          return (a.mileage - b.mileage) * order;
        } else {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
        }
      });
      }
    }

    return listings;
  }

  findListingById(id: string) {
    this.assertInitialized();
    return this.data.listings.find((listing) => listing.id === id);
  }

  async addListing(listing: Listing) {
    this.assertInitialized();
    this.data.listings.push(listing);
    await this.persist();
    return listing;
  }

  async updateListing(id: string, updates: ListingUpdateInput) {
    this.assertInitialized();
    const index = this.data.listings.findIndex((listing) => listing.id === id);

    if (index === -1) {
      return undefined;
    }

    const existing = this.data.listings[index];

    if (!existing) {
      return undefined;
    }

    const updated: Listing = {
      ...existing,
      title: updates.title ?? existing.title,
      description: updates.description ?? existing.description,
      price: updates.price ?? existing.price,
      images: updates.images ?? existing.images,
      verifiedSeller: updates.verifiedSeller ?? existing.verifiedSeller,
      year: updates.year ?? existing.year,
      mileage: updates.mileage ?? existing.mileage,
      fuelType: updates.fuelType ?? existing.fuelType,
      transmission: updates.transmission ?? existing.transmission,
      location: updates.location ?? existing.location,
      make: updates.make ?? existing.make,
      model: updates.model ?? existing.model,
      updatedAt: new Date().toISOString(),
    };

    this.data.listings[index] = updated;
    await this.persist();
    return updated;
  }

  // Bookmark methods with error handling and validation
  async addBookmark(userId: string, listingId: string): Promise<Bookmark | undefined> {
    this.assertInitialized();

    // Validate listing exists
    const listing = this.findListingById(listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    // Check bookmark limit (e.g., 100 bookmarks per user)
    const userBookmarks = this.data.bookmarks.filter(b => b.userId === userId);
    if (userBookmarks.length >= 100) {
      throw new Error("Bookmark limit reached (max 100)");
    }

    // Check if already bookmarked
    const existing = this.data.bookmarks.find(
      b => b.userId === userId && b.listingId === listingId
    );
    if (existing) {
      return undefined;
    }

    // Add bookmark
    const bookmark: Bookmark = {
      userId,
      listingId,
      createdAt: new Date().toISOString(),
    };

    this.data.bookmarks.push(bookmark);
    await this.persist();
    return bookmark;
  }

  async removeBookmark(userId: string, listingId: string): Promise<boolean> {
    this.assertInitialized();
    
    const index = this.data.bookmarks.findIndex(
      b => b.userId === userId && b.listingId === listingId
    );

    if (index === -1) {
      return false;
    }

    this.data.bookmarks.splice(index, 1);
    await this.persist();
    return true;
  }

  isBookmarked(userId: string, listingId: string): boolean {
    this.assertInitialized();
    return this.data.bookmarks.some(
      b => b.userId === userId && b.listingId === listingId
    );
  }

  getUserBookmarks(userId: string): string[] {
    this.assertInitialized();
    return this.data.bookmarks
      .filter(b => b.userId === userId)
      .map(b => b.listingId);
  }

  getUserBookmarksWithListings(userId: string): Listing[] {
    this.assertInitialized();
    const bookmarkedIds = new Set(this.getUserBookmarks(userId));
    return this.data.listings.filter(listing => bookmarkedIds.has(listing.id));
  }
}

export const database = new JsonDatabase();
