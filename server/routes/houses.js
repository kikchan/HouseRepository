import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads', 'houses');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads allowed'), false);
    }
    cb(null, true);
  },
});

function mapHouse(house) {
  return {
    ...house,
    imagePath: house.imagePath || '/placeholder.png',
  };
}

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { visited, type, minPrice, maxPrice, search } = req.query;
  const where = {};

  if (visited === 'true' || visited === 'false') {
    where.visited = visited === 'true';
  }
  if (type) {
    where.type = type;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  const houses = await prisma.house.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(houses.map(mapHouse));
});

router.get('/:id', async (req, res) => {
  const house = await prisma.house.findUnique({ where: { id: req.params.id } });
  if (!house) return res.status(404).json({ error: 'House not found' });
  res.json(mapHouse(house));
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, link, location, type, price, rooms, bathrooms, ibiPrice, communityFee, visited, description } = req.body;
  if (!title || !location || !type || !price || !rooms || !bathrooms) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const imagePath = req.file ? `/uploads/houses/${req.file.filename}` : null;
  const house = await prisma.house.create({
    data: {
      title,
      link: link || null,
      imagePath,
      location,
      type,
      price: Number(price),
      rooms: Number(rooms),
      bathrooms: Number(bathrooms),
      ibiPrice: parseFloat(ibiPrice) || 0,
      communityFee: parseFloat(communityFee) || 0,
      visited: visited === 'true' || visited === true,
      description: description || null,
    },
  });

  res.status(201).json(mapHouse(house));
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const existing = await prisma.house.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: 'House not found' });

  const { title, link, location, type, price, rooms, bathrooms, ibiPrice, communityFee, visited, description } = req.body;
  const imagePath = req.file ? `/uploads/houses/${req.file.filename}` : existing.imagePath;

  const house = await prisma.house.update({
    where: { id: req.params.id },
    data: {
      title: title || existing.title,
      link: link || existing.link,
      imagePath,
      location: location || existing.location,
      type: type || existing.type,
      price: price ? Number(price) : existing.price,
      rooms: rooms ? Number(rooms) : existing.rooms,
      bathrooms: bathrooms ? Number(bathrooms) : existing.bathrooms,
      ibiPrice: ibiPrice ? parseFloat(ibiPrice) : existing.ibiPrice,
      communityFee: communityFee ? parseFloat(communityFee) : existing.communityFee,
      visited: visited === 'true' || visited === true || existing.visited,
      description: description || existing.description,
    },
  });

  res.json(mapHouse(house));
});

router.delete('/:id', async (req, res) => {
  const house = await prisma.house.delete({ where: { id: req.params.id } });
  res.json({ ok: true, house });
});

export default router;
