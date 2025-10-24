export interface Bookmark {
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  verifiedSeller: boolean;
  createdAt: string;
  updatedAt: string;
  year: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  location: string;
  make: string;
  model: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  isVerified: boolean;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ListingInput {
  title: string;
  description: string;
  price: number;
  images?: string[] | undefined;
  year: number;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  location: string;
  make: string;
  model: string;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: ('petrol' | 'diesel' | 'electric' | 'hybrid')[];
  transmission?: ('manual' | 'automatic')[];
  location?: string;
  make?: string;
  model?: string;
  sortBy?: 'price' | 'year' | 'mileage' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ListingUpdateInput {
  title?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  images?: string[] | undefined;
  verifiedSeller?: boolean | undefined;
  year?: number | undefined;
  mileage?: number | undefined;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | undefined;
  transmission?: 'manual' | 'automatic' | undefined;
  location?: string | undefined;
  make?: string | undefined;
  model?: string | undefined;
}
