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

2. Create a `.env` 

3. Start a MongoDB instance:

- Local MongoDB: `mongodb://localhost:27017/reading-list`
- Atlas: use your own free tier cluster URI and set `MONGODB_URI`

4. Start the server:

```bash
npm run dev
```

5. Open the front-end in your browser:

- Visit: `http://localhost:4000/`

6. Run tests:

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

# Reading List API
Q1.
A complete Express.js API for managing books, reviews, and users with authentication, authorization, text search, and aggregation.

Q2.
This Api will help with managing the basics of a book store or a individual collection of books with a search function and information related to the books..

## Features

- JWT authentication with sign-up / login
- Role-based authorization for book management
- Book CRUD with text search and unique ISBN enforcement
- Review CRUD with user ownership and book lookup
- Book average rating aggregation and review counts
- MongoDB indexes for email, ISBN, and text search
- Fully tested API routes with Jest + Supertest
- Postman collection included

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
Q3.

## Technical Components of the Reading List API Project

### Overview
This is a RESTful API built with Node.js and Express.js for managing a reading list application. It includes user authentication, book management, and review functionality. The application uses MongoDB as its database and implements JWT-based authentication.

### Routes

The API is organized into three main route modules, all prefixed with `/api`:

#### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile (requires authentication)

#### Book Routes (`/api/books`)
- `GET /` - List books with optional filtering (search, genre) and pagination
- `GET /:id` - Get a specific book with review statistics
- `POST /` - Create a new book (admin only)
- `PUT /:id` - Update a book (admin only)
- `DELETE /:id` - Delete a book (admin only)

#### Review Routes (`/api/reviews`)
- `GET /` - List reviews with optional filtering by book or user
- `POST /` - Create a new review (authenticated users)
- `PUT /:id` - Update a review (review owner or admin)
- `DELETE /:id` - Delete a review (review owner or admin)

### Data Models

The application uses three main Mongoose models:

#### User Model
- `name` (String, required) - User's full name
- `email` (String, required, unique) - User's email address
- `password` (String, required) - Hashed password
- `role` (String, enum: 'user'/'admin', default: 'user') - User role
- Timestamps (createdAt, updatedAt)

#### Book Model
- `title` (String, required) - Book title
- `author` (String, required) - Book author
- `isbn` (String, required, unique) - ISBN number
- `genre` (String, optional) - Book genre
- `publishedYear` (Number, optional) - Publication year
- Timestamps (createdAt, updatedAt)
- Text index on title, author, and genre for search functionality

#### Review Model
- `book` (ObjectId, ref: 'Book', required) - Reference to the book being reviewed
- `user` (ObjectId, ref: 'User', required) - Reference to the user who wrote the review
- `rating` (Number, required, 1-5) - Star rating
- `comment` (String, optional) - Review text
- Timestamps (createdAt, updatedAt)
- Unique compound index on book and user (one review per user per book)

### External Data Sources

- **MongoDB Database**: The primary data store using Mongoose ODM. Connection configured via `MONGODB_URI` environment variable, defaults to local MongoDB instance.
- No external APIs are integrated; all data is stored and managed internally.

### Additional Technical Components

- **Authentication**: JWT tokens with configurable expiration (default 12 hours)
- **Security**: Password hashing with bcrypt, Helmet for security headers, CORS support
- **Middleware**: Custom authentication and authorization middleware, error handling
- **Testing**: Jest with Supertest for API testing, MongoDB Memory Server for test database
- **Development**: Nodemon for hot reloading, Morgan for request logging
**Configuration**: Environment-based config for database, JWT secrets, and port (default 4000)


Q4. 

## Authentication & Security Requirements
- **JWT-based authentication**: Implemented with `jsonwebtoken` library, including signup/login endpoints and token validation middleware
- **Password hashing**: Uses `bcrypt` for secure password storage
- **Protected routes**: All sensitive endpoints require `Authorization: Bearer <token>` header
- **Security headers**: `helmet` middleware for basic security protections
- **CORS support**: `cors` middleware for cross-origin requests

## Authorization & Role Management
- **Role-based access control**: Users have roles (`user` or `admin`), enforced via middleware
- **Admin privileges**: Only admins can create/update/delete books
- **User ownership**: Users can only manage their own reviews
- **Proper HTTP status codes**: 403 for forbidden actions, 401 for unauthorized

## Database & Data Modeling
- **MongoDB integration**: Uses Mongoose ODM for schema definition and validation
- **Data relationships**: Books have embedded review stats, reviews reference users and books
- **Unique constraints**: ISBN uniqueness enforced at database level
- **Indexes**: Optimized queries with indexes on email, ISBN, and text search fields
- **Aggregation**: Book details include computed review counts and average ratings

## API Design & CRUD Operations
- **RESTful endpoints**: Standard HTTP methods for all resources
- **Complete CRUD**: Create, Read, Update, Delete for books and reviews
- **Text search**: Full-text search capability on book titles/authors
- **Pagination/filtering**: Query parameters for search and filtering
- **Proper response formats**: Consistent JSON responses with appropriate status codes

## Error Handling & Middleware
- **Global error handling**: Centralized error middleware catches and formats errors
- **Async error support**: `express-async-errors` for clean async route handling
- **Input validation**: Mongoose schemas validate data types and required fields
- **Logging**: `morgan` middleware for request logging

## Testing & Quality Assurance
- **Comprehensive test suite**: Jest + Supertest for API endpoint testing
- **Test coverage**: Coverage reports generated with detailed metrics
- **In-memory database**: `mongodb-memory-server` for isolated test runs
- **Test organization**: Separate test files for auth, books, and reviews
- **CI-ready**: `npm test` script with coverage reporting

## Development & Deployment
- **Environment configuration**: .env file support with `dotenv`
- **Development server**: `nodemon` for auto-restart during development
- **Production scripts**: Separate `npm start` and `npm run dev` commands
- **Dependency management**: Proper separation of dependencies and devDependencies
- **Documentation**: README with setup instructions and API overview

## Code Quality & Architecture
- **Modular structure**: Organized into controllers, models, routes, and middleware
- **Separation of concerns**: Each module has a single responsibility
- **Consistent naming**: RESTful route naming and camelCase variables
- **Error-first callbacks**: Proper async/await usage throughout
- **Postman collection**: Included for API testing and documentation

