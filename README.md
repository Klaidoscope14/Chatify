# Real-Time Chat Application

A full-stack chat application with real-time messaging capabilities using Socket.IO, React, and Node.js.

## Features

- Real-time messaging
- User authentication
- User profiles with avatars
- Online status indicators
- Responsive design
- Light/dark theme support

## Tech Stack

### Frontend
- React
- React Router
- Zustand (State Management)
- Socket.IO Client
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary (Media Storage)

## Project Structure

```
├── backend/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/            # Utility functions and services
│   │   └── index.js        # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
│
└── frontend/               # Frontend React application
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand state stores
    │   ├── lib/            # Utility functions
    │   ├── constants/      # Constants and configuration
    │   └── App.jsx         # Main application component
    ├── public/             # Static assets
    └── package.json        # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database
- Cloudinary account (for media storage)

### Development Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd chat-application
   ```

2. Setup backend:
   ```
   cd backend
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=5001
   JWT_SECRET=<your-secret-key>
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Setup frontend:
   ```
   cd ../frontend
   npm install
   ```

5. Start the development servers:

   In the backend directory:
   ```
   npm run dev
   ```

   In the frontend directory:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend Deployment

1. Set environment variables in your hosting platform:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=5001 (or as provided by your hosting platform)
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   PRODUCTION_URL=<your-production-domain>
   ```

2. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

3. Start the server in production mode:
   ```
   cd ../backend
   npm start
   ```

### Deployment Platforms

The application can be deployed to various platforms:

#### Heroku
1. Create a Procfile in the root directory:
   ```
   web: cd backend && npm start
   ```
2. Set environment variables in Heroku dashboard
3. Deploy using Heroku CLI or GitHub integration

#### Render/Vercel/Netlify
1. Configure the build settings to:
   - Build command: `cd frontend && npm install && npm run build`
   - Output directory: `frontend/dist`
2. Set environment variables in the platform dashboard
3. Configure the server start command: `cd backend && npm install && npm start`

## Security Considerations

1. Never commit `.env` files with real credentials
2. Use environment variables for all sensitive data
3. Set appropriate CORS policies for production
4. Use HTTPS in production

## License

MIT
