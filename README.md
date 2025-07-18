# OAuth JWT Authentication System

A complete, production-ready authentication system built with Node.js, Express, JWT, and Google OAuth. This system provides secure user registration, login, token refresh, and Google OAuth integration that can be easily integrated into any full-stack application.

## 🚀 Features

- **JWT Authentication**: Secure access and refresh token implementation
- **Google OAuth**: One-click login with Google accounts
- **Password Security**: Bcrypt hashing for secure password storage
- **Token Refresh**: Automatic token refresh mechanism
- **HTTP-Only Cookies**: Secure refresh token storage
- **React Demo**: Complete frontend demonstration
- **MongoDB Integration**: User data persistence
- **Ready to Use**: Drop-in solution for any full-stack project

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google Cloud Console project (for OAuth)
- React (for frontend demo)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd oauth-jwt-auth
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

## 🔧 Google OAuth Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

4. **Copy credentials to your `.env` file**

## 🚀 Usage

### Starting the Application

1. **Start the backend server**
   ```bash
   npm start
   ```

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### API Endpoints

#### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get user profile (protected) |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

#### Request/Response Examples

**Register**
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Login**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Protected Route**
```javascript
GET /api/auth/me
Authorization: Bearer <your-access-token>

// Response
{
  "id": "user-id",
  "email": "user@example.com",
  "refreshToken": "user-refreshToken",
  "role": "user/admin"
}
```

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Tokens**: Signed with secret keys
- **HTTP-Only Cookies**: Refresh tokens stored securely
- **Token Expiration**: Access tokens expire in 15 minutes
- **Refresh Token Rotation**: New refresh token on each refresh

## 🏗️ Integration Guide

### Frontend Integration

1. **Login Flow**
   ```javascript
   const login = async (email, password) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password }),
       credentials: 'include'
     });
     
     const data = await response.json();
     localStorage.setItem('accessToken', data.accessToken);
   };
   ```

2. **Protected API Calls**
   ```javascript
   const fetchProtectedData = async () => {
     const token = localStorage.getItem('accessToken');
     const response = await fetch('/api/protected-route', {
       headers: { 'Authorization': `Bearer ${token}` }
     });
     return response.json();
   };
   ```

3. **Token Refresh**
   ```javascript
   const refreshToken = async () => {
     const response = await fetch('/api/auth/refresh', {
       method: 'POST',
       credentials: 'include'
     });
     
     if (response.ok) {
       const data = await response.json();
       localStorage.setItem('accessToken', data.accessToken);
       return data.accessToken;
     }
     throw new Error('Token refresh failed');
   };
   ```

### Backend Integration

1. **Protect Routes**
   ```javascript
   const { protect } = require('./middleware/authMiddleware');
   
   router.get('/protected-route', protect, (req, res) => {
     // req.user contains the authenticated user
     res.json({ message: 'Access granted', user: req.user });
   });
   ```

2. **Custom User Model**
   ```javascript
   // Add additional fields to your User model
   const userSchema = new mongoose.Schema({
     email: { type: String, required: true, unique: true },
     password: { type: String },
     googleId: { type: String },
     provider: { type: String, default: 'local' },
     refreshToken: { type: String },
     // Add your custom fields here
     firstName: String,
     lastName: String,
     avatar: String,
   });
   ```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
```

### Production Considerations
- Use HTTPS in production
- Set `secure: true` for cookies
- Use strong, unique secrets
- Implement rate limiting
- Add CORS configuration
- Use environment-specific redirect URLs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- JWT for secure authentication
- Google OAuth for social login
- MongoDB for data persistence
- React for the demo frontend

---

**Happy coding! 🎉**

For questions or support, please open an issue in the repository.
