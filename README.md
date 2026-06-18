# House Inventory

A simple full-stack house management web app built with React, Vite, TailwindCSS, and Express using MySQL persistence.

## Features

- Session-based authentication
- First-run admin setup
- User management for admins
- CRUD for house listings
- Image upload support
- Filtering, search, and sorting
- Display created/modified timestamps and pros/cons
- Responsive design for desktop and mobile

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example if needed:
   ```bash
   copy .env.example .env
   ```

3. Configure the MySQL connection in `.env` so it points to your existing database.

4. Start the backend server:
   ```bash
   npm run dev:server
   ```

5. Start the frontend in another shell:
   ```bash
   npm run dev:client
   ```

6. Open the frontend at `http://localhost:5173`

## Admin Setup

If the database contains zero users, the app will automatically route to the setup page. Create the first admin user there.

## Docker

If you want to use Docker, set your database credentials in `.env` and then run:

```bash
docker compose up --build
```

The app will use the `MYSQL_*` values from `.env`.

## Scripts

- `npm run dev` - starts both server and client
- `npm run dev:server` - starts Express server only
- `npm run dev:client` - starts Vite client only
- `npm run build` - builds the frontend
- `npm run seed` - seeds with sample data (optional)

## Storage

Data is stored in MySQL. Uploaded images are stored in `uploads/houses/`.

## Notes

- The app is configured for MySQL persistence.
- You can connect to your existing MySQL instance via `.env`.
- No migration is required for an empty database.
- The first admin user is created through the setup page.

