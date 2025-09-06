# Store Management Application

## Admin Credentials
You can log in as the admin using the following credentials:

- **Email:** admin@storeapp.com
- **Password:** admin123



# 🛒 Store & User Management API

This project is a **Node.js + Express backend** application for managing users, stores, and ratings. It includes authentication, session management, request validations, and CRUD operations for stores and user ratings.

---

## 🔹 Features Implemented

1. **User Authentication**
   - Login, logout, and session check.
   - Password hashing with **bcryptjs** for security.
   - Session-based authentication using **express-session**.

2. **User Management**
   - User signup with validation.
   - Password update functionality.
   - Fetch user-specific ratings.
   - View all stores with average ratings and user's rating.
   - Search stores by name or address.
   - Validation rules for email, password, and address.


3. **Store Management**
   - Fetch stores with average ratings.
   - Filter stores by name or address.
   - Sort stores by any column.
   - Retrieve stores owned by the logged-in store owner.
   - Calculate average rating per store and total ratings.

4. **Ratings System**
   - Users can submit ratings (1–5) for stores.
   - Update existing rating if user has already rated.
   - Calculate average rating dynamically.
   - Fetch rating distribution (how many 5-star, 4-star, etc.).
   - Fetch ratings of a specific store along with user info.

5. **Request Validations**
   - Centralized middleware `validateRequest.js` handles validation errors.
   - Validates all inputs before database operations.

6. **Error Handling**
   - Proper HTTP status codes returned.
   - Descriptive error messages for better debugging.
   - Try/catch blocks in all controllers for server errors.

---

## 📂 Project Structure

