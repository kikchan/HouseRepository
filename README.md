# House Inventory

A simple full-stack house management web app built with React, Vite, TailwindCSS, Express, and Prisma.

## Features

- Session-based authentication
- CRUD for house listings
- Image upload support
- Filtering, search, and sorting
- Responsive design for desktop and mobile

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your database in `.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/house_inventory"
   SESSION_SECRET="super-secret-change-me"
   DEFAULT_USER="admin"
   DEFAULT_PASSWORD="password123"
   ```

3. Run Prisma migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Seed sample data (optional):
   ```bash
   npm run seed
   ```

5. Start development mode:
   ```bash
   npm run dev
   ```

6. Open the frontend at `http://localhost:5173`

## Login

Default user credentials:

- Username: `admin`
- Password: `password123`

## Scripts

- `npm run dev` - starts both server and client
- `npm run dev:server` - starts Express server only
- `npm run dev:client` - starts Vite client only
- `npm run build` - builds the frontend
- `npm run prisma:migrate` - runs Prisma migration
- `npm run prisma:generate` - generates Prisma client
- `npm run prisma:studio` - opens Prisma Studio
- `npm run seed` - seeds the database with sample houses

## Notes

- Uploaded images are stored in `uploads/houses/`
- All routes are protected behind login
- The app uses a default user created at startup if one does not exist
