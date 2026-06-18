import express from 'express';
import bcrypt from 'bcrypt';
import { countUsers, createUser, findUserByUsername, getAllUsers } from '../data/store.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...clean } = user;
  return {
    ...clean,
    isAdmin: Boolean(clean.isAdmin),
  };
}

router.get('/first-run', async (req, res) => {
  try {
    const totalUsers = await countUsers();
    res.json({ firstRun: totalUsers === 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check setup status' });
  }
});

router.post('/setup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const totalUsers = await countUsers();
  if (totalUsers > 0) {
    return res.status(400).json({ error: 'Admin account already exists' });
  }

  try {
    const user = await createUser(username, password, true);
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = Boolean(user.isAdmin);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unable to create admin user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const totalUsers = await countUsers();
  if (totalUsers === 0) {
    return res.status(400).json({ error: 'Setup required: create the first admin user' });
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.isAdmin = Boolean(user.isAdmin);
  res.json({ user: sanitizeUser(user) });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      user: {
        id: req.session.userId,
        username: req.session.username,
        isAdmin: Boolean(req.session.isAdmin),
      },
    });
  }

  res.json({ user: null });
});

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ error: 'Unable to load users' });
  }
});

router.post('/users', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, isAdmin } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await createUser(username, password, Boolean(isAdmin));
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create user' });
  }
});

export default router;
