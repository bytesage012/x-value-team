import { z } from "zod";
import { ListingInput, ListingUpdateInput, LoginInput, SignupInput } from "../types";

// Use Zod's built-in URL validation which accepts localhost, IPs, and standard URLs
const arrayOfUrls = z.array(z.string().trim().url("Expected a valid URL")).max(10).optional();

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .strict();

const listingCreateSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().nonnegative("Price must be zero or greater"),
    images: arrayOfUrls,
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    mileage: z.number().nonnegative("Mileage must be zero or greater"),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.enum(["manual", "automatic"]),
    location: z.string().min(1, "Location is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
  })
  .strict();

const listingUpdateSchema = listingCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided for update",
  },
);

export const validateSignup = (input: unknown): SignupInput => signupSchema.parse(input);

export const validateLogin = (input: unknown): LoginInput => loginSchema.parse(input);

export const validateListingCreate = (input: unknown): ListingInput => listingCreateSchema.parse(input);

export const validateListingUpdate = (input: unknown): ListingUpdateInput => listingUpdateSchema.parse(input);
