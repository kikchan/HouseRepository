# House Management Web App – Copilot Specification

## 🎯 Goal
Build a simple full-stack web application to manage house listings for personal use. The app must be responsive (desktop + mobile) and allow authorized users to perform full CRUD operations on houses.

---

## 🧱 Tech Stack
- Frontend: React (Vite) + TailwindCSS
- Backend: Node.js + Express
- Database: MySQL
- Auth: Session-based login with first-run admin setup
- File uploads: Multer (local storage `/uploads/houses/`)

---

## 🔐 Authentication
- Username + password login
- First-run setup page creates the initial admin user when no users exist
- Admins can create additional users
- bcrypt password hashing
- Protect all CRUD routes

---

## 🏠 House Entity

Fields:
- id (auto-increment integer)
- title
- link (external URL)
- imagePath (local file path)
- location
- type (apartment, house, villa, studio, etc.)
- price
- rooms
- bathrooms
- ibiPrice
- communityFee (monthly)
- visited (boolean)
- description
- pros
- cons
- createdAt
- updatedAt

Notes:
- No migration path is required for an empty database.
- Schema can be created automatically by the backend on startup.

---

## 📸 Image Handling
- Upload via form
- Store in `/uploads/houses/`
- Save relative path in DB
- Default placeholder if missing

---

## 🧭 UI Pages

### Login
- Username + password
- Redirect to dashboard
- If no users exist, redirect to setup page

### Setup
- Create the first admin user
- Only shown when the database has zero users

### Dashboard
- Grid of house cards
- Show image, price, location, rooms, bathrooms
- Visited badge
- Actions: view / edit / delete
- Filters: visited, type, price
- Admin user management panel for creating new users

### Detail Page
- Full house info
- Large image
- External link
- Edit / delete
- Toggle visited
- Display date added and date modified
- Display pros and cons sections

### Create/Edit Form
- Shared form
- Image upload
- Pros and cons fields
- Validation required

---

## 🔧 API Endpoints

### Auth
- POST /auth/setup
- POST /auth/login
- POST /auth/logout
- GET /auth/me
- GET /auth/first-run
- GET /auth/users
- POST /auth/users

### Houses
- GET /houses
- GET /houses/:id
- POST /houses
- PUT /houses/:id
- DELETE /houses/:id

---

## 🗄 Data Model

```prisma
model House {
  id            Int      @id @default(autoincrement())
  title         String
  link          String?
  imagePath     String?
  location      String
  type          String
  price         Float
  rooms         Int
  bathrooms     Int
  ibiPrice      Float
  communityFee  Float
  visited       Boolean  @default(false)
  description   String?
  pros          String?
  cons          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
  isAdmin  Boolean @default(false)
  createdAt DateTime @default(now())
}
```

---

## 🎨 UI/UX
- Fully responsive
- Mobile-first design
- Clean card-based layout
- Fast interactions
- Clear admin and user workflows

---

## 🔒 Security
- Protect all routes except login/setup
- Validate inputs server-side
- Restrict file uploads to images only
- Limit file size (5MB)

---

## 🚀 Optional Features
- Search by location/title
- Sorting by price
- Grid/list toggle
- Visited statistics


## June 2026 Changes
- Added house size field.
- Added separate Users page and navigation menu.
- Added added, modified and visitedDate datetime fields.
