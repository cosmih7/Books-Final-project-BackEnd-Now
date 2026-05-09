# Reading List API

A complete Express.js API for managing books, reviews, and users with authentication, authorization, text search, and aggregation.

## Features

- JWT authentication with sign-up / login
- Role-based authorization for book management
- Book CRUD with text search and unique ISBN enforcement
- Review CRUD with user ownership and book lookup
- Book average rating aggregation and review counts
- MongoDB indexes for email, ISBN, and text search
- Fully tested API routes with Jest + Supertest
- Postman collection included

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`.

3. Start a MongoDB instance:

- Local MongoDB: `mongodb://localhost:27017/reading-list`
- Atlas: use your own free tier cluster URI and set `MONGODB_URI`

4. Start the server:

```bash
npm run dev
```

5. Run tests:

```bash
npm test
```

## Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`

Use the returned JWT as `Authorization: Bearer <token>` for protected routes.

## Admin and User Roles

- Users can create and manage their own reviews.
- Admins can create, update, and delete books.

## Postman Collection

A saved Postman collection is available at `postman/ReadingList.postman_collection.json`.

## Environment Variables

- `PORT` - server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time (e.g. `12h`)

## Notes

If you want to use MongoDB Atlas, create a free cluster at https://www.mongodb.com/cloud/atlas, then add a database user and copy the connection string into `.env`.
