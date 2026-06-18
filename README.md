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

2. Create a `.env` file from the example if needed:
   ```bash
   copy .env.example .env
   ```

3. Start the app and database with Docker Compose:
   ```bash
   docker compose up --build
   ```

4. Open the frontend at `http://localhost:5173`

## Login

During first-run, visit the setup page to create the initial admin user.

If you run the app outside Docker, make sure MySQL is running locally on `localhost:3306` with credentials matching `.env`.

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

