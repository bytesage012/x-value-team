import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { FilterOptions } from "../types";
import { createListing, getListings, updateListing, getListingById } from "../services/listingService";
import { validateListingCreate, validateListingUpdate } from "../utils/validation";

const router = Router();

router.get("/", (req, res) => {
  const filters: FilterOptions = {};
  
  // Extract filter parameters from query
  if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
  if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);
  if (req.query.minYear) filters.minYear = Number(req.query.minYear);
  if (req.query.maxYear) filters.maxYear = Number(req.query.maxYear);
  if (req.query.minMileage) filters.minMileage = Number(req.query.minMileage);
  if (req.query.maxMileage) filters.maxMileage = Number(req.query.maxMileage);
  if (req.query.fuelType) filters.fuelType = (Array.isArray(req.query.fuelType) ? req.query.fuelType : [req.query.fuelType]) as ('petrol' | 'diesel' | 'electric' | 'hybrid')[];
  if (req.query.transmission) filters.transmission = (Array.isArray(req.query.transmission) ? req.query.transmission : [req.query.transmission]) as ('manual' | 'automatic')[];
  if (req.query.location) filters.location = String(req.query.location);
  if (req.query.make) filters.make = String(req.query.make);
  if (req.query.model) filters.model = String(req.query.model);
  if (req.query.sortBy) filters.sortBy = String(req.query.sortBy) as 'price' | 'year' | 'mileage' | 'createdAt';
  if (req.query.sortOrder) filters.sortOrder = String(req.query.sortOrder) as 'asc' | 'desc';

  const listings = getListings(filters);
  return res.status(200).json({ listings });
});

router.get("/:id", (_req, res) => {
  const { id } = _req.params;
  const listing = getListingById(id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  return res.status(200).json({ listing });
});

router.post("/", authenticate, async (req, res) => {
  try {
    const payload = validateListingCreate(req.body);
    const listing = await createListing(payload, req.user!);

    return res.status(201).json({ listing });
  } catch (error) {
    // If this is a ZodError, return the issues array for client display
    if (error && typeof error === 'object' && 'issues' in (error as any)) {
      return res.status(400).json({ message: 'Validation failed', issues: (error as any).issues });
    }

    const message = error instanceof Error ? error.message : "Unable to create listing";
    return res.status(400).json({ message });
  }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const payload = validateListingUpdate(req.body);
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Listing id is required" });
    }

    const listing = await updateListing(id, payload, req.user!);

    return res.status(200).json({ listing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update listing";
    const status = message.toLowerCase().includes("permission") ? 403 : 400;
    return res.status(status).json({ message });
  }
});

export default router;
