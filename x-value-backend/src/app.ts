import express from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import authRoutes from "./routes/auth";
import listingsRoutes from "./routes/listings";
import bookmarkRoutes from "./routes/bookmarks";
import usersRoutes from "./routes/users";
import uploadsRoutes from "./routes/uploads";

const app = express();

// Increase body size limits to allow base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Resolve uploads path robustly (handles running from compiled/dist or src)
const resolveUploadsPath = () => {
	const candidate = path.resolve(__dirname, '../../data/uploads');
	const alt = path.resolve(process.cwd(), 'data', 'uploads');
	// Prefer the uploads folder relative to this source file (works when running ts-node)
	if (fs.existsSync(candidate)) return candidate;
	// If not present, prefer a data/uploads under the current working directory
	if (fs.existsSync(alt)) return alt;
	// Otherwise create the candidate path and use it
	fs.mkdirSync(candidate, { recursive: true });
	return candidate;
};

// Serve uploaded files statically under /uploads
const uploadsPath = resolveUploadsPath();
app.use('/uploads', express.static(uploadsPath));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Debug route to inspect uploads directory used by the server
app.get('/debug-uploads', (_req, res) => {
  try {
    const fsLocal = fs;
    const files = fsLocal.existsSync(uploadsPath) ? fsLocal.readdirSync(uploadsPath) : [];
    return res.json({ uploadsPath, files });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

app.use(authRoutes);
app.use("/listings", listingsRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use(usersRoutes);
app.use(uploadsRoutes);

export default app;
