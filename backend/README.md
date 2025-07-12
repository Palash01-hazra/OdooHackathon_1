# StackIt Backend API

A Node.js backend API for the StackIt Q&A platform with MongoDB integration.

## Features

- 🔐 **Authentication & Authorization**

  - User registration and login
  - JWT token-based authentication
  - Password hashing with bcrypt
  - User profile management

- ❓ **Questions Management**

  - Create, read, update questions
  - Question voting system
  - Question filtering and search
  - Tag-based categorization
  - View tracking

- 💬 **Answers Management**

  - Create answers for questions
  - Answer voting system
  - Accept answers (by question author)

- 👥 **User System**
  - User profiles with reputation
  - User roles (user, moderator, admin)
  - User statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stackit_db
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB**
   Make sure your MongoDB instance is running.

4. **Run the application**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description              | Access  |
| ------ | ----------- | ------------------------ | ------- |
| POST   | `/register` | Register new user        | Public  |
| POST   | `/login`    | User login               | Public  |
| GET    | `/profile`  | Get current user profile | Private |
| PUT    | `/profile`  | Update user profile      | Private |

### Question Routes (`/api/questions`)

| Method | Endpoint    | Description         | Access  |
| ------ | ----------- | ------------------- | ------- |
| GET    | `/`         | Get all questions   | Public  |
| GET    | `/:id`      | Get question by ID  | Public  |
| POST   | `/`         | Create new question | Private |
| POST   | `/:id/vote` | Vote on question    | Private |

### Answer Routes (`/api/answers`)

| Method | Endpoint               | Description    | Access  |
| ------ | ---------------------- | -------------- | ------- |
| POST   | `/:questionId/answers` | Create answer  | Private |
| POST   | `/:id/vote`            | Vote on answer | Private |
| POST   | `/:id/accept`          | Accept answer  | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description    | Access |
| ------ | -------- | -------------- | ------ |
| GET    | `/:id`   | Get user by ID | Public |
| GET    | `/`      | Get all users  | Admin  |

## Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Create Question

```bash
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to implement authentication in React?",
  "description": "I need help implementing authentication...",
  "tags": ["react", "authentication", "javascript"]
}
```

### Vote on Question

```bash
POST /api/questions/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "up"  // or "down"
}
```

## Database Schema

### User Model

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  bio: String,
  reputation: Number,
  isVerified: Boolean,
  role: String // 'user', 'moderator', 'admin'
}
```

### Question Model

```javascript
{
  title: String,
  description: String,
  tags: [String],
  author: ObjectId,
  votes: {
    upvotes: [ObjectId],
    downvotes: [ObjectId]
  },
  answers: [ObjectId],
  views: Number,
  isAnswered: Boolean,
  acceptedAnswer: ObjectId
}
```

### Answer Model

```javascript
{
  content: String,
  author: ObjectId,
  question: ObjectId,
  votes: {
    upvotes: [ObjectId],
    downvotes: [ObjectId]
  },
  isAccepted: Boolean
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express validator
- **Password Hashing**: bcrypt with salt
- **JWT Authentication**: Secure token-based auth

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed validation errors"]
}
```

## Development

### File Structure

```
src/
├── controllers/        # Request handlers
├── models/            # MongoDB schemas
├── routes/            # API routes
├── middleware/        # Custom middleware
├── utils/             # Utility functions
└── app.js            # Main application file
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
