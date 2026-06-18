# House Inventory

A simple full-stack house management web app built with React, Vite, TailwindCSS, and Express with file-based storage.

## Features

- Session-based authentication
- CRUD for house listings
- Image upload support
- Filtering, search, and sorting
- Responsive design for desktop and mobile
- MySQL-backed persistence with optional local or external database

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example if needed:
   ```bash
   copy .env.example .env
   ```

3. Configure the MySQL connection in `.env` to match your existing database.

4. Start the app:
   ```bash
   npm run dev:server
   ```

5. Open the frontend at `http://localhost:5173`

## Login

During first-run, visit the setup page to create the initial admin user.

If you run the app outside Docker, make sure MySQL is running and the connection settings in `.env` are correct.

To use Docker Compose with your own database host, set `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` in `.env` and remove any local MySQL service configuration.

## Scripts

- `npm run dev` - starts both server and client
- `npm run dev:server` - starts Express server only
- `npm run dev:client` - starts Vite client only
- `npm run build` - builds the frontend
- `npm run seed` - seeds with sample data (optional)

## Storage

Data is stored in MySQL. Uploaded images are stored in `uploads/houses/`.

## Notes

- The app uses MySQL for persistent storage.
- Use `.env` to point to your existing database.
- The first user must be created via the setup page when the database is empty.

