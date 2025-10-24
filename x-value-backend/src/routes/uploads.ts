import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Resolve uploads directory robustly (matches app.ts behavior)
const resolveUploadsDir = () => {
  const candidate = path.resolve(__dirname, "../../data/uploads");
  const alt = path.resolve(process.cwd(), 'data', 'uploads');
  if (fs.existsSync(candidate)) return candidate;
  if (fs.existsSync(alt)) return alt;
  fs.mkdirSync(candidate, { recursive: true });
  return candidate;
};

const uploadDir = resolveUploadsDir();

// helper to write base64 to a file
const writeBase64 = (b64: string, dest: string) => {
  // strip data URI prefix if present
  const match = b64.match(/^data:(image\/[^;]+);base64,(.*)$/);
  const payload = match ? match[2] : b64 || '';
  const buffer = Buffer.from(String(payload), 'base64');
  fs.writeFileSync(dest, buffer);
};

router.options('/upload-base64', (_req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res.sendStatus(204);
});

router.post('/upload-base64', (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const images: string[] = req.body?.images || [];
  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ message: 'No images provided' });
  }

  const base = req.protocol + '://' + req.get('host');
  const saved: string[] = [];

  images.slice(0, 10).forEach((b64, idx) => {
    try {
      const extMatch = (b64 && b64.match(/^data:image\/(\w+);base64,/)) || [];
      const ext = extMatch[1] ? `.${extMatch[1]}` : '.jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
      const dest = path.join(uploadDir, filename);
      writeBase64(b64, dest);
      saved.push(`${base}/uploads/${filename}`);
    } catch (e) {
      // skip failed
    }
  });

  if (saved.length === 0) return res.status(500).json({ message: 'No images could be saved' });
  return res.status(201).json({ urls: saved });
});

export default router;
