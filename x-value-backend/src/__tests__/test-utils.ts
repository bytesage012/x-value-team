import path from 'path';
import { promises as fs } from 'fs';
import { database } from '../data/database';

export const TEST_DB_PATH = path.join(__dirname, '../__tests__/test.db.json');

export async function initTestDb() {
  try {
    await fs.unlink(TEST_DB_PATH);
  } catch (error) {
    // Ignore if file doesn't exist
  }
  
  const testDb = new (database as any).constructor(TEST_DB_PATH);
  await testDb.init();
  return testDb;
}