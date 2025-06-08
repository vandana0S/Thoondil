# Fish Delivery Platform - Backend API

A comprehensive backend API for a fish delivery marketplace platform built with Node.js, Express.js, and MongoDB.

## 🚀 Phase 1 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Customer, Vendor, Delivery Partner, Admin)
  - Secure password hashing with bcrypt
  - User registration and login

- **User Management**

  - User profile management
  - Multiple address management
  - Profile picture upload support
  - Account deactivation

- **Security Features**
  - Rate limiting
  - CORS protection
  - Helmet for security headers
  - Input validation and sanitization
  - Comprehensive error handling

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
fish-delivery-backend/
├── config/
│   └── database.js          # MongoDB connection config
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User management logic
├── middlewares/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation
├── models/
│   └── User.js             # User data model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── users.js            # User management routes
├── utils/
│   └── response.js         # Response utilities
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
└── server.js              # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fish-delivery-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fish-delivery
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890",
  "role": "customer"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### User Management Endpoints

#### Get User Profile

```http
GET /users/me/profile
Authorization: Bearer <jwt-token>
```

#### Update Profile

```http
PUT /users/me/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567891"
}
```

#### Get Addresses

```http
GET /users/me/addresses
Authorization: Bearer <jwt-token>
```

#### Add Address

```http
POST /users/me/addresses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "location": {
    "coordinates": [-74.006, 40.7128]
  }
}
```

## 🔒 Security Features

- **JWT Authentication**: Stateless authentication with secure token generation
- **Password Security**: Bcrypt hashing with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error responses that don't leak sensitive information

## 📊 User Roles

1. **Customer**: Browse products, place orders, manage profile
2. **Vendor**: Manage products, process orders (coming in Phase 2)
3. **Delivery Partner**: Accept and deliver orders (coming in Phase 3)
4. **Admin**: Platform management and oversight (coming in Phase 4)

## 🧪 Testing

The API includes comprehensive validation and error handling. You can test endpoints using tools like Postman or curl.

### Health Check

```http
GET /health
```

Returns server status and timestamp.

## 📈 Next Phases

- **Phase 2**: Product catalog, vendor management
- **Phase 3**: Cart functionality, order management
- **Phase 4**: Payment integration, real-time tracking

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update documentation for new features

## 📄 License

This project is licensed under the MIT License.
