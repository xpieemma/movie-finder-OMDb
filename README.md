# 🎬 [Movie Finder](https://movie-finder-frontend-five.vercel.app/)

A full-stack movie discovery application that provides detailed information about movies using the OMDb API.

![logo](./movie-finder-frontend/public/movie-finder-logo.svg)

## ✨ Features

- **Search Movies** - Find any movie by title with pagination support
- **Movie Details** - View comprehensive information including plot, cast, ratings, and more
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Rate Limiting** - Built-in protection against API abuse
- **Caching** - Redis and in-memory caching for optimal performance

## 🛠️ Tech Stack

### Frontend

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation

### Backend

- Node.js with Express
- TypeScript for type safety
- OMDb API integration
- Redis caching layer
- Rate limiting middleware

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Add your OMDb API key to the backend environment
4. Start the backend server
5. Launch the frontend development server

## 📁 Project Structure

movie-finder/
├── movie-finder-api/ # Backend Node.js/Express server
│ ├── src/ # Source files
│ ├── swagger/ # API documentation
│ └── logs/ # Application logs
│
└── movie-finder-frontend/ # React frontend application
├── src/ # Source files
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ ├── hooks/ # Custom React hooks
│ ├── api/ # API integration layer
│ └── context/ # React context providers
└── public/ # Static assets


## 🌐 API Endpoints

- `GET /api/search?title={query}` - Search for movies
- `GET /api/movies/{id}` - Get detailed movie information
- `GET /api/stats` - View API usage statistics
- `GET /health` - Health check endpoint

## 🚢 Deployment

- **Backend** - Deploy to Koyeb with one click using the included configuration
- **Frontend** - Deploy to Vercel with automatic builds and previews

## 📝 Environment Variables

### Backend--

- `OMDB_API_KEY` - Your OMDb API key
- `PORT` - Server port
- `CORS_ORIGINS` - Allowed frontend origins

### Frontend---

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

## 🤝 Contributing

Contributions are very welcome! Please feel free to submit a Pull Request.

- **Student**
- GitHub - [xpieemma](https://github.com/xpieemma)
- LinkedIn - [E. Pierre](https://www.linkedin.com/in/epierr14)

## 📄 License

This project is licensed under the ISC License.