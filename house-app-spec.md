# House Management Web App – Copilot Specification

## 🎯 Goal
Build a simple full-stack web application to manage house listings for personal use. The app must be responsive (desktop + mobile) and allow multiple users with the same permissions to perform full CRUD operations on houses.

---

## 🧱 Tech Stack
- Frontend: React (Vite) + TailwindCSS (or Bootstrap)
- Backend: Node.js + Express
- Database: MySQL (Prisma preferred)
- Auth: Session-based login (all users equal permissions)
- File uploads: Multer (local storage `/uploads/houses/`)

---

## 🔐 Authentication
- Username + password login
- All users share same permissions
- bcrypt password hashing
- Protect all CRUD routes

---

## 🏠 House Entity

Fields:
- id (UUID or auto-increment)
- title
- link (external URL)
- imagePath (local file path)
- location
- type (apartment, house, villa, etc.)
- price
- rooms
- bathrooms
- ibiPrice
- communityFee (monthly)
- visited (boolean)
- description
- createdAt
- updatedAt

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

### Dashboard
- Grid of house cards
- Show image, price, location, rooms, bathrooms
- Visited badge
- Actions: view / edit / delete
- Filters: visited, type, price

### Detail Page
- Full house info
- Large image
- External link
- Edit / delete
- Toggle visited

### Create/Edit Form
- Shared form
- Image upload
- Validation required

---

## 🔧 API Endpoints

### Auth
- POST /auth/login
- POST /auth/logout
- GET /auth/me

### Houses
- GET /houses
- GET /houses/:id
- POST /houses
- PUT /houses/:id
- DELETE /houses/:id

---

## 🗄 Prisma Schema

```prisma
model House {
  id            String   @id @default(uuid())
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
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🎨 UI/UX
- Fully responsive
- Mobile-first design
- Clean card-based layout
- Fast interactions
- Optional dark mode

---

## 🔒 Security
- Protect all routes except login
- Validate inputs server-side
- Restrict file uploads to images only
- Limit file size (5MB)

---

## 🚀 Optional Features
- Search by location/title
- Sorting by price
- Grid/list toggle
- Visited statistics
