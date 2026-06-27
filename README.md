# RecipeShare - Recipe Sharing Platform

A modern, full-stack recipe sharing application built with React.js, Node.js/Express, and MongoDB. Share your favorite recipes, discover culinary creations from around the world, and connect with food enthusiasts.

## Overview

RecipeShare is a search-focused recipe sharing platform that allows users to:

- **Create & Share** personalized recipes with detailed instructions
- **Search & Discover** recipes using advanced filtering (cuisine, difficulty, prep time, tags)
- **Rate & Review** recipes from the community
- **Build Community** by following and viewing other users' recipes

## Tech Stack

### Frontend
- **React 19** - Modern UI components
- **Next.js 16** - Full-stack framework with App Router
- **Tailwind CSS** - Responsive styling
- **SWR/Axios** - Data fetching and API communication
- **js-cookie** - Cookie-based token management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - RESTful API framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication & authorization
- **Multer** - File upload handling
- **Joi** - Schema validation
- **bcryptjs** - Secure password hashing

### DevOps
- **Local MongoDB** - Development database
- **npm/pnpm** - Package management
- **CORS** - Cross-origin request handling

## Features

### User Management
- ✓ Email/password registration and login
- ✓ JWT-based session management
- ✓ User profiles with recipe collections
- ✓ Secure password hashing

### Recipe Management
- ✓ Full CRUD operations (Create, Read, Update, Delete)
- ✓ Structured recipe format with ingredients and instructions
- ✓ Image upload support for recipe photos
- ✓ Tagging system for categorization
- ✓ Cuisine type classification
- ✓ Difficulty level indication

### Advanced Search & Filtering
- ✓ Full-text search across recipe titles and descriptions
- ✓ Filter by cuisine type
- ✓ Filter by difficulty level (Easy, Medium, Hard)
- ✓ Filter by maximum preparation time
- ✓ Tag-based filtering
- ✓ Pagination support
- ✓ Combined multi-filter queries

### Rating & Reviews
- ✓ Rate recipes on a 1-5 star scale
- ✓ Add detailed written reviews
- ✓ Automatic average rating calculation
- ✓ View community feedback and ratings

### Technical Highlights
- ✓ RESTful API with proper HTTP methods
- ✓ Input validation on backend (Joi)
- ✓ Comprehensive error handling
- ✓ Image storage with local file system
- ✓ Responsive design for mobile and desktop
- ✓ Optimized pagination for large datasets

### First Steps

1. **Create Account** → Go to `/register` and sign up
2. **Explore Recipes** → Visit `/recipes` to browse the community's recipes
3. **Share a Recipe** → Click "Share Recipe" and add your own creation
4. **Search & Filter** → Use advanced search to find recipes by your preferences
5. **Rate & Review** → Leave feedback on recipes you try

## Project Structure

```
recipe-sharing-platform/
├── backend/                      # Express.js API server
│   ├── config/database.js        # MongoDB connection
│   ├── models/                   # User and Recipe schemas
│   ├── controllers/              # Business logic
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Auth and file upload
│   ├── utils/validation.js       # Joi validation schemas
│   ├── uploads/                  # Recipe images
│   ├── server.js                 # Express app entry point
│   └── .env                      # Environment configuration
│
├── app/                          # Next.js pages and layout
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── recipes/                  # Recipe pages
│   ├── login/                    # Authentication pages
│   └── register/
│
├── components/                   # Reusable React components
│   ├── Navigation.jsx            # Top navigation bar
│   ├── RecipeSearch.jsx          # Search and filter form
│   ├── RecipeCard.jsx            # Recipe card display
│   └── ...
│
├── lib/                          # Utilities
    ├── api.js                    # API client with Axios
    └── AuthContext.jsx           # Authentication context

