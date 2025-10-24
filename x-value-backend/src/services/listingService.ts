import { database } from "../data/database";
import { FilterOptions, Listing, ListingInput, ListingUpdateInput, User } from "../types";
import { v4 as uuid } from "uuid";

export const createListing = async (input: ListingInput, seller: User): Promise<Listing> => {
  const now = new Date().toISOString();
  const listing: Listing = {
    id: uuid(),
    sellerId: seller.id,
    title: input.title,
    description: input.description,
    price: input.price,
    images: input.images ?? [],
    verifiedSeller: seller.isVerified,
    createdAt: now,
    updatedAt: now,
    year: input.year,
    mileage: input.mileage,
    fuelType: input.fuelType,
    transmission: input.transmission,
    location: input.location,
    make: input.make,
    model: input.model,
  };

  await database.addListing(listing);
  return listing;
};

export const getListings = (filters?: FilterOptions): Listing[] => database.getListings(filters);

export const getListingById = (id: string): Listing | undefined => database.findListingById(id);

export const updateListing = async (id: string, updates: ListingUpdateInput, requestingUser: User): Promise<Listing> => {
  const listing = database.findListingById(id);

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.sellerId !== requestingUser.id) {
    throw new Error("You do not have permission to update this listing");
  }

  const updated = await database.updateListing(id, {
    ...updates,
    verifiedSeller: requestingUser.isVerified,
  });

  if (!updated) {
    throw new Error("Listing not found");
  }

  return updated;
};
