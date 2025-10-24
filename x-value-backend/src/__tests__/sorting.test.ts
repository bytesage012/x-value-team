import { Listing } from '../types';
import { initTestDb } from './test-utils';
import { JsonDatabase } from '../data/database';
import { describe, beforeAll, it, expect } from '@jest/globals';

describe('Listing Sorting', () => {
  let testDb: JsonDatabase;

  const testListings: Listing[] = [
    {
      id: '1',
      sellerId: 'seller1',
      title: 'Car 1',
      description: 'Test car 1',
      price: 20000,
      year: 2020,
      mileage: 50000,
      images: [],
      verifiedSeller: true,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      fuelType: 'petrol',
      transmission: 'manual',
      location: 'Test Location',
      make: 'Test Make',
      model: 'Test Model'
    },
    {
      id: '2',
      sellerId: 'seller1',
      title: 'Car 2',
      description: 'Test car 2',
      price: 15000,
      year: 2018,
      mileage: 80000,
      images: [],
      verifiedSeller: true,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      fuelType: 'diesel',
      transmission: 'automatic',
      location: 'Test Location',
      make: 'Test Make',
      model: 'Test Model'
    },
    {
      id: '3',
      sellerId: 'seller1',
      title: 'Car 3',
      description: 'Test car 3',
      price: 25000,
      year: 2022,
      mileage: 20000,
      images: [],
      verifiedSeller: true,
      createdAt: '2023-01-03T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
      fuelType: 'hybrid',
      transmission: 'automatic',
      location: 'Test Location',
      make: 'Test Make',
      model: 'Test Model'
    }
  ];

  beforeAll(async () => {
    testDb = await initTestDb();
    (testDb as any).data.listings = testListings;
  });

  it('should sort by price ascending', () => {
    const sorted = testDb.getListings({ sortBy: 'price', sortOrder: 'asc' });
    expect(sorted.map((l: Listing) => l.price)).toEqual([15000, 20000, 25000]);
  });

  it('should sort by price descending', () => {
    const sorted = testDb.getListings({ sortBy: 'price', sortOrder: 'desc' });
    expect(sorted.map((l: Listing) => l.price)).toEqual([25000, 20000, 15000]);
  });

  it('should sort by year ascending', () => {
    const sorted = testDb.getListings({ sortBy: 'year', sortOrder: 'asc' });
    expect(sorted.map((l: Listing) => l.year)).toEqual([2018, 2020, 2022]);
  });

  it('should sort by year descending', () => {
    const sorted = testDb.getListings({ sortBy: 'year', sortOrder: 'desc' });
    expect(sorted.map((l: Listing) => l.year)).toEqual([2022, 2020, 2018]);
  });

  it('should sort by mileage ascending', () => {
    const sorted = testDb.getListings({ sortBy: 'mileage', sortOrder: 'asc' });
    expect(sorted.map((l: Listing) => l.mileage)).toEqual([20000, 50000, 80000]);
  });

  it('should sort by mileage descending', () => {
    const sorted = testDb.getListings({ sortBy: 'mileage', sortOrder: 'desc' });
    expect(sorted.map((l: Listing) => l.mileage)).toEqual([80000, 50000, 20000]);
  });

  it('should sort by creation date ascending', () => {
    const sorted = testDb.getListings({ sortBy: 'createdAt', sortOrder: 'asc' });
    expect(sorted.map((l: Listing) => l.id)).toEqual(['1', '2', '3']);
  });

  it('should sort by creation date descending', () => {
    const sorted = testDb.getListings({ sortBy: 'createdAt', sortOrder: 'desc' });
    expect(sorted.map((l: Listing) => l.id)).toEqual(['3', '2', '1']);
  });
});