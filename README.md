# House Inventory

A simple full-stack house management web app built with React, Vite, TailwindCSS, and Express with file-based storage.

## Features

- Session-based authentication
- CRUD for house listings
- Image upload support
- Filtering, search, and sorting
- Responsive design for desktop and mobile
- File-based storage (JSON files) - no database required

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your settings in `.env` (optional):
   ```env
   SESSION_SECRET="super-secret-change-me"
   DEFAULT_USER="admin"
   DEFAULT_PASSWORD="password123"
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

4. Open the frontend at `http://localhost:5173`

## Login

Default user credentials:

- Username: `admin`
- Password: `password123`

## Scripts

- `npm run dev` - starts both server and client
- `npm run dev:server` - starts Express server only
- `npm run dev:client` - starts Vite client only
- `npm run build` - builds the frontend
- `npm run seed` - seeds with sample data (optional)

## Storage

Data is stored in JSON files:
- Users: `server/data/users.json`
- Houses: `server/data/houses.json`

Uploaded images are stored in `uploads/houses/`

## Notes

- No database setup required
- All data persists in JSON files in the `server/data/` directory
- The app uses a default user created automatically at startup if one does not exist

