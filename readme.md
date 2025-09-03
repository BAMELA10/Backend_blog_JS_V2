# Blog REST API V2

This project is a backend REST API for a blog application, providing endpoints for user authentication, blog posts, comments, and file uploads. It is designed with a focus on security, performance, and scalability.

## Features

- User authentication and authorization with JWT
- Complete error handling for all request types
- HTTPS protocol for secure communication
- Rate limiting to prevent abuse
- Logging for request and error tracking
- Pagination and caching for performance and scalability
- Filtering and sorting support on users, posts, and comments

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Multer for file uploads
- Memcached and Node-cache for caching
- Express-rate-limit for rate limiting
- dotenv for environment variable management
- HTTPS server with SSL certificates

## API Endpoints Overview

- `/BlogApi/v2/auth`
  - POST `/register` - Register a new user
  - POST `/login` - Login user
  - GET `/logout` - Logout user

- `/BlogApi/v2/user`
  - GET `/me` - Get current logged-in user
  - PUT `/me` - Update current user's password
  - GET `/search` - Filter users (admin only)
  - GET `/` - Get all users (admin only)
  - GET `/:id` - Get single user by ID (admin only)
  - PUT `/:id` - Update user by ID (admin only)

- `/BlogApi/v2/Blog`
  - GET `/` - Get all blogs for online user
  - POST `/` - Create a new blog
  - GET `/:id` - Get blog by ID
  - PUT `/:id` - Update blog by ID
  - DELETE `/:id` - Delete blog by ID
  - Nested routes:
    - `/BlogApi/v2/Blog/:id/Post` - Post routes

- `/BlogApi/v2/Blog/:id/Post`
  - GET `/` - Get all posts
  - POST `/` - Create new post
  - GET `/me` - Get posts for online author
  - GET `/search` - Filter posts (admin only)
  - GET `/:postid` - Get single post by ID
  - PUT `/:postid` - Update post by ID
  - DELETE `/:postid` - Delete post by ID
  - Nested routes:
    - `/BlogApi/v2/Blog/:id/Post/:postId/comment` - Comment routes

- `/BlogApi/v2/Blog/:id/Post/:postId/comment`
  - GET `/` - Get all comments
  - POST `/` - Create comment
  - GET `/:commentId` - Get single comment by ID
  - DELETE `/:commentId` - Delete comment by ID

- `/BlogApi/v2/upload` - File upload routes
- `/uploads` - Static route for uploaded files

## Usage

1. Clone the repository
    ```
    git clone https://github.com/BAMELA10/Backend_blog_JS_V2.git
    ``` 
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env.development` and `.env.production` files
4. Start the development server:
   ```
   npm run start:dev
   ```
5. Start the production server:
   ```
   npm run start:prod
   ```

## Launch with Docker

### Prerequisites

- Docker installed on your system
- Docker Compose installed

### Steps

1. Ensure Docker and Docker Compose are installed and running.
2. From the project root directory, run the following command to build and start the application along with MongoDB:
   ```
   docker-compose up
   ```
   This will start the app on port 3001 and MongoDB on port 27017.

## Query Parameters for Filtering, Sorting, and Pagination

The API supports query parameters for filtering, sorting, and pagination on various endpoints.

### Sorting
- Use `?sort=field` for ascending order
- Use `?sort=field&desc=field` for descending order
- Example: `?sort=name&desc=name` for descending by name

### Pagination
- Use `?page=number&limit=number` to paginate results
- Example: `?page=1&limit=10` for page 1 with 10 items per page

### Filtering
- Specific filters depend on the endpoint:
  - Users: `?email=value`, `?firstname=value`, `?role=value`, `?lastname=value`
  - Posts: `?title=value`, `?author=value`
  - Comments: `?userId=value`, `?postId=value`, `?id=value`

### Usable Fields for Sorting and Filtering

- **Users**:
  - Sorting: name, First name, Last name, Email, Role, DateOfJoined
  - Filtering: email, firstname, lastname, role

- **Posts**:
  - Sorting: title, DateOfCreation, LastUpdate
  - Filtering: title, author

- **Comments**:
  - Sorting: DateOfCreation
  - Filtering: userId, postId, id

- **Blogs**:
  - No sorting or filtering supported in current implementation

Examples:
- GetAllUser: `?sort=name&desc=name&page=1&limit=10`
- FilterUser: `?email=user@example.com&firstname=John&sort=name&page=1&limit=10`
- FilterComment: `?userId=123&postId=456&sort=DateOfCreation&desc=DateOfCreation&page=1&limit=10`
- GetAllComments: `?sort=DateOfCreation&page=1&limit=10`
- GetAllPost: `?sort=title&desc=title&page=1&limit=10`
- FilteringPost: `?title=My Post&author=John Doe&page=1&limit=10`

## Caching Usage

Caching is automatically applied to certain routes to improve performance and reduce database load. It uses Memcached and Node-cache to store frequently accessed data.

- Cached routes include GET requests for users, posts, comments, and blogs.
- Cache is invalidated on updates or deletions to ensure data consistency.
- No manual configuration is needed; caching is handled by middleware.

## Folder Structure

- `controller/` - Contains controller methods for each model (User, Post, Comment)
- `models/` - Data models for the API entities
- `routes/` - API route definitions
- `middleware/` - Middleware for authentication, error handling, and more
- `utils/` - Utility functions such as token creation and permission checks
- `db/` - Database connection setup
- `uploads/` - Directory for uploaded files
- `ssl/` - SSL certificates for HTTPS

## Author

BAMELA JORDAN

## Notes

- The API supports filtering, sorting, and pagination on users, posts, and comments using query parameters.
- Security is enforced with HTTPS, API key authentication, rate limiting, and logging.
- Performance optimizations include caching and pagination.
