import './config/env.js';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import housesRouter from './routes/houses.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const frontEndOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: frontEndOrigin, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/auth', authRouter);
app.use('/houses', housesRouter);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send({ status: 'House Inventory API' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
