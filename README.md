ER Diagram   

![image](https://github.com/user-attachments/assets/bd492aa1-9459-4c65-9dc0-e62000f6e675)



# Book Review API Documentation

This document provides details for all available API endpoints for the Book Review application.
The example URLs assume the server is running on `http://localhost:3000`. This base URL might change depending on your `PORT` environment variable or deployment. Placeholders like `{bookId}`, `{reviewId}`, or `{searchTerm}` in the URLs should be replaced with actual values.

## 📦 Tech Stack
- Node.js + Express (^5.1.0)
- MongoDB + Mongoose (^8.15.0)
- JWT (jsonwebtoken ^9.0.2) for Authentication
- bcryptjs (^3.0.2) for password hashing
- cors (^2.8.5)
- dotenv (^16.5.0)
- morgan (^1.10.0)

## 🔧 Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Anisha2123/BillEasy
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    npm i nodemon
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and update the following variables with your actual credentials:
    ```
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_super_secret_jwt_key_here
    PORT=3000 # Optional: Change if you want to use a different port
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start, typically on `http://localhost:3000` (or the port you specified).

## Base API URL
All API endpoints are prefixed with `/api`.
**Example Base:** `http://localhost:3000/api`

## Authentication
Endpoints marked with "🔒 **Auth Required**" require a JSON Web Token (JWT) to be passed in the `Authorization` header as a Bearer token.
**Header Format:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## Authentication API (`/api/auth`)

Endpoints for user registration and login.

### 1. User Signup
  - **Method:** `POST`
  - **Path:** `/auth/signup`
  - **Full URL:** `http://localhost:3000/api/auth/signup`
  - **Description:** Registers a new user in the system.
  - **Request Body:**
    ```json
    {
      "username": "newuser",
      "password": "password123"
    }
    ```
    *Constraints: `username` must be unique.*
  - **Success Response (201 Created):**
    ```json
    {
      "message": "User registered"
    }
    ```
  - **Error Response (e.g., 400 Bad Request if username is taken):**
    ```json
    {
      "error": "E11000 duplicate key error collection: <db_name>.users index: username_1 dup key: { username: \"newuser\" }"
    }
    ```
  - **Authentication:** Not required.

### 2. User Login
  - **Method:** `POST`
  - **Path:** `/auth/login`
  - **Full URL:** `http://localhost:3000/api/auth/login`
  - **Description:** Authenticates an existing user and returns a JWT for accessing protected routes.
  - **Request Body:**
    ```json
    {
      "username": "newuser",
      "password": "password123"
    }
    ```
  - **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTdlOTBhYzNiNGQ1ZTZmN2E4YjljMSIsImlhdCI6MTcyMjI1NzQwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
    ```
  - **Error Response (401 Unauthorized):**
    ```json
    {
      "msg": "Invalid credentials"
    }
    ```
  - **Authentication:** Not required.

---

## Books API (`/api/books`)

Endpoints for retrieving book information.

---

### 1. Add a New Book (Create Book)
  - **Method:** `POST`
  - **Path:** `/books/`
  - **Full URL:** `http://localhost:3000/api/books/`
  - **Description:** Creates a new book entry in the system. The book will be associated with the authenticated user who created it.
  - **Headers:**
    - `Authorization: Bearer <YOUR_JWT_TOKEN>` (🔒 **Auth Required**)
    - `Content-Type: application/json`
  - **Request Body:**
    ```json
    {
      "title": "The Hitchhiker's Guide to the Galaxy",
      "author": "Douglas Adams",
      "genre": "Science Fiction Comedy"
    }
    ```
    *Required fields: `title`, `author`, `genre`.*
  - **Success Response (201 Created):**
    Returns the newly created book object.
    ```json
    {
      "_id": "66a8f4c123abc123def45678",
      "title": "The Hitchhiker's Guide to the Galaxy",
      "author": "Douglas Adams",
      "genre": "Science Fiction Comedy",
      "reviews": [],
      "createdBy": "66a7e90ac3b4d5e6f7a8b9c1", // ID of the user who created the book
      "__v": 0 // Mongoose version key
      // createdAt and updatedAt fields will also be present if timestamps: true is in your schema
    }
    ```
  - **Error Response (400 Bad Request):**
    If required fields are missing.
    ```json
    {
      "msg": "Please provide title, author, and genre"
    }
    ```
    Or for more detailed Mongoose validation errors (if implemented):
    ```json
    {
      "msg": "Validation Error",
      "errors": {
        "title": {
          "message": "Path `title` is required.",
          "name": "ValidatorError"
        }
      }
    }
    ```
  - **Error Response (401 Unauthorized):**
    If no token is provided or the token is malformed.
    ```json
    {
      "msg": "No token provided"
    }
    ```
  - **Error Response (403 Forbidden):**
    If the token is invalid or expired.
    ```json
    {
      "msg": "Invalid token"
    }
    ```
  - **Error Response (500 Internal Server Error):**
    For unexpected server issues during book creation.
    ```json
    {
      "error": "Server error while creating book"
    }
    ```
  - **Authentication:** 🔒 **Auth Required**.

---
### 2. Search Books
  - **Method:** `GET`
  - **Path:** `/books/search`
  - **Full URL Example:** `http://localhost:3000/api/books/search?query={searchTerm}`
  - **Description:** Searches for books by title or author using a case-insensitive regex match.
  - **Query Parameters:**
    - `query` (string, **required**): The search term to look for in book titles or authors. (e.g., `query=Paulo`)
  - **Example Request:** `GET http://localhost:3000/api/books?author=Paulo&genre=Fiction&page=1&limit=3`
  - **Success Response (200 OK):**
    Returns an array of matching book objects.
    ```json
    {
    "total": 6,
    "page": 1,
    "limit": 3,
    "books": [
        {
            "_id": "682bf73db53c21718e1a7533",
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "genre": "Fiction",
            "reviews": [],
            "createdBy": "682be322e9524221d2715f7b",
            "__v": 0
        },
        {
            "reviews": [],
            "_id": "682c3888db0dd1d5ebead308",
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "genre": "Fiction"
        },
        {
            "reviews": [],
            "_id": "682c38c7db0dd1d5ebead328",
            "title": "The Alchemist",
            "author": "Paulo Coelho",
            "genre": "Fiction"
        }
    ]
}
    ```
    If no books match, an empty array `[]` is returned.
  - **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Missing search query"
    }
    ```
  - **Error Response (500 Internal Server Error):**
    ```json
    {
      "error": "Server error"
    }
    ```
  - **Authentication:** Not required.

### 3. List All Books (with Pagination and Filtering)
  - **Method:** `GET`
  - **Path:** `/books/`
  - **Full URL Example:** `http://localhost:3000/api/books/`
  - **Description:** Retrieves a paginated list of all books. Supports filtering by author and genre (case-insensitive). Populates associated reviews for each book and provides a total count of matching books.
  - **Query Parameters:**
    - `page` (number, optional, default: `1`): The page number for pagination.
    - `limit` (number, optional, default: `10`): The number of books to return per page.
    - `author` (string, optional): Filter books by author name (case-insensitive regex match).
    - `genre` (string, optional): Filter books by genre (case-insensitive regex match).
  - **Example Request:** `GET http://localhost:3000/api/books?page=1&limit=5&author=Sagan&genre=Science`
  - **Success Response (200 OK):**
    ```json
    {
      "total": 1,
      "page": 1,
      "limit": 5,
      "books": [
        {
          "_id": "66a7e8f1c3b4d5e6f7a8b9c0",
          "title": "Cosmos",
          "author": "Carl Sagan",
          "genre": "Science",
          "reviews": [ /* Populated reviews */ ],
          "createdBy": "66a7e90ac3b4d5e6f7a8b9c1"
        }
      ]
    }
    ```
  - **Error Response (500 Internal Server Error):**
    ```json
    {
      "error": "Server error"
    }
    ```
  - **Authentication:** Not required.

### 4. Get Book by ID (with Paginated Reviews and Average Rating)
  - **Method:** `GET`
  - **Path:** `/books/{bookId}`
  - **Full URL Example:** `http://localhost:3000/api/books/{bookId}`
  - **Description:** Retrieves details for a specific book by its ID. Also includes paginated reviews for the book and calculates its average rating.
  - **Path Parameters:**
    - `{bookId}` (string, **required**): The MongoDB ObjectId of the book.
  - **Query Parameters (for review pagination):**
    - `page` (number, optional, default: `1`): The page number for the list of reviews.
    - `limit` (number, optional, default: `5`): The number of reviews to return per page.
  - **Example Request:** `GET http://localhost:3000/api/books/66a7e8f1c3b4d5e6f7a8b9c0?page=1&limit=2`
  - **Success Response (200 OK):**
    ```json
    {
      "_id": "66a7e8f1c3b4d5e6f7a8b9c0",
      "title": "Cosmos",
      "author": "Carl Sagan",
      "genre": "Science",
      "createdBy": "66a7e90ac3b4d5e6f7a8b9c1",
      "averageRating": "4.8",
      "reviews": [ /* Paginated list of reviews */ ]
    }
    ```
  - **Error Response (404 Not Found):**
    ```json
    {
      "message": "Book not found"
    }
    ```
  - **Error Response (500 Internal Server Error):**
    ```json
    {
      "error": "Server error"
    }
    ```
  - **Authentication:** Not required.

### 4. Test Route (Internal/Development)
  - **Method:** `GET`
  - **Path:** `/books/test`
  - **Full URL:** `http://localhost:3000/api/books/test`
  - **Description:** A simple test endpoint to check if the books route is responsive.
  - **Success Response (200 OK):**
    Content-Type: `text/html; charset=utf-8`
    Body: `Test OK`
  - **Authentication:** Not required.

---

## Reviews API (`/api/reviews`)

Endpoints for creating, updating, and deleting book reviews. All review modification endpoints require authentication.

### 1. Add a Review to a Book
  - **Method:** `POST`
  - **Path:** `/reviews/book/{bookId}`
  - **Full URL Example:** `http://localhost:3000/api/reviews/book/{bookId}`
  - **Description:** Adds a new review for a specific book. A user can only submit one review per book.
  - **Path Parameters:**
    - `{bookId}` (string, **required**): The MongoDB ObjectId of the book to review.
  - **Headers:**
    - `Authorization: Bearer <YOUR_JWT_TOKEN>` (🔒 **Auth Required**)
  - **Request Body:**
    ```json
    {
      "rating": 5,
      "comment": "This book was amazing and insightful!"
    }
    ```
  - **Success Response (201 Created):**
    Returns the newly created review object.
    ```json
    {
      "_id": "66a7e91fc3b4d5e6f7a8b9c2",
      "book": "{bookId}",
      "user": "{userIdFromToken}",
      "rating": 5,
      "comment": "This book was amazing and insightful!",
      "createdAt": "2024-07-29T10:00:00.000Z",
      "updatedAt": "2024-07-29T10:00:00.000Z"
    }
    ```
  - **Error Response (400 Bad Request):**
    ```json
    {
      "msg": "You already reviewed this book"
    }
    ```
  - **Error Response (401 Unauthorized):**
    ```json
    {
      "msg": "No token provided"
    }
    ```
  - **Error Response (403 Forbidden):**
    ```json
    {
      "msg": "Invalid token"
    }
    ```
  - **Authentication:** 🔒 **Auth Required**.

### 2. Update a Review
  - **Method:** `PUT`
  - **Path:** `/reviews/{reviewId}`
  - **Full URL Example:** `http://localhost:3000/api/reviews/{reviewId}`
  - **Description:** Updates an existing review. Users can only update reviews they have created.
  - **Path Parameters:**
    - `{reviewId}` (string, **required**): The MongoDB ObjectId of the review to update.
  - **Headers:**
    - `Authorization: Bearer <YOUR_JWT_TOKEN>` (🔒 **Auth Required**)
  - **Request Body:** (Provide fields to update)
    ```json
    {
      "rating": 4,
      "comment": "Updated thoughts: Still great, but with a few minor criticisms."
    }
    ```
  - **Success Response (200 OK):**
    Returns the updated review object.
    ```json
    {
      "_id": "{reviewId}",
      "book": "{bookId}",
      "user": "{userIdFromToken}",
      "rating": 4,
      "comment": "Updated thoughts: Still great, but with a few minor criticisms.",
      "createdAt": "2024-07-29T10:00:00.000Z",
      "updatedAt": "2024-07-29T10:05:00.000Z"
    }
    ```
  - **Error Response (404 Not Found):**
    ```json
    {
      "msg": "Review not found"
    }
    ```
  - **Authentication:** 🔒 **Auth Required**.

### 3. Delete a Review
  - **Method:** `DELETE`
  - **Path:** `/reviews/{reviewId}`
  - **Full URL Example:** `http://localhost:3000/api/reviews/{reviewId}`
  - **Description:** Deletes an existing review. Users can only delete reviews they have created.
  - **Path Parameters:**
    - `{reviewId}` (string, **required**): The MongoDB ObjectId of the review to delete.
  - **Headers:**
    - `Authorization: Bearer <YOUR_JWT_TOKEN>` (🔒 **Auth Required**)
  - **Success Response (200 OK):**
    ```json
    {
      "msg": "Review deleted"
    }
    ```
  - **Error Response (404 Not Found):**
    ```json
    {
      "msg": "Review not found or unauthorized"
    }
    ```
  - **Authentication:** 🔒 **Auth Required**.
