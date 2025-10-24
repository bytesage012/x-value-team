import path from "path";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_JWT_SECRET = "changeme-in-production";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
  dataFilePath: process.env.DATA_FILE_PATH ?? path.resolve(process.cwd(), "data", "db.json"),
};

if (config.jwtSecret === DEFAULT_JWT_SECRET) {
  console.warn("[env] Falling back to default JWT secret. Provide JWT_SECRET in production.");
}
