import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

const DEFAULT_USER = {
  username: process.env.DEFAULT_USER || 'admin',
  password: process.env.DEFAULT_PASSWORD || 'password123',
};

async function ensureDefaultUser() {
  const existing = await prisma.user.findUnique({ where: { username: DEFAULT_USER.username } });
  if (!existing) {
    const hashed = await bcrypt.hash(DEFAULT_USER.password, 10);
    await prisma.user.create({ data: { username: DEFAULT_USER.username, password: hashed } });
    console.log(`Default user created: ${DEFAULT_USER.username}`);
  }
}
ensureDefaultUser().catch((error) => {
  console.error('Failed to ensure default user:', error);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ user: { id: user.id, username: user.username } });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ user: { id: req.session.userId, username: req.session.username } });
  }
  res.status(401).json({ user: null });
});

export default router;
