import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth.js';
import { getAllHouses, getHouseById, createHouse, updateHouse, deleteHouse, filterHouses } from '../data/store.js';

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
  const filters = { visited, type, minPrice, maxPrice, search };
  const houses = await filterHouses(filters);
  res.json(houses.map(mapHouse));
});

router.get('/:id', async (req, res) => {
  const house = await getHouseById(req.params.id);
  if (!house) return res.status(404).json({ error: 'House not found' });
  res.json(mapHouse(house));
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, link, location, type, price, rooms, bathrooms, ibiPrice, communityFee, visited, description, pros, cons, agentName, agentPhone } = req.body;
  if (!title || !location || !type || !price || !rooms || !bathrooms) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const imagePath = req.file ? `/uploads/houses/${req.file.filename}` : null;
  const house = await createHouse({
    title,
    link: link || null,
    imagePath,
    location,
    type,
    price,
    rooms,
    bathrooms,
    ibiPrice,
    communityFee,
    visited,
    description: description || null,
    pros: pros || null,
    cons: cons || null,
    agentName: agentName || null,
    agentPhone: agentPhone || null,
  });

  res.status(201).json(mapHouse(house));
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const existing = await getHouseById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'House not found' });

  const { title, link, location, type, price, rooms, bathrooms, ibiPrice, communityFee, visited, description, pros, cons, agentName, agentPhone } = req.body;
  const imagePath = req.file ? `/uploads/houses/${req.file.filename}` : existing.imagePath;

  const house = await updateHouse(req.params.id, {
    title,
    link,
    imagePath,
    location,
    type,
    price,
    rooms,
    bathrooms,
    ibiPrice,
    communityFee,
    visited,
    description,
    pros,
    cons,
    agentName,
    agentPhone,
  });

  res.json(mapHouse(house));
});

router.delete('/:id', async (req, res) => {
  const house = await deleteHouse(req.params.id);
  if (!house) return res.status(404).json({ error: 'House not found' });
  res.json({ ok: true, house });
});

export default router;
