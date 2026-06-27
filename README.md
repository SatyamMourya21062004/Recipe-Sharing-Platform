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

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB (local or cloud)

### Installation

1. **Clone or Download the Project**
   ```bash
   # Navigate to the project directory
   cd recipe-sharing-platform
   ```

2. **Start MongoDB**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Or use MongoDB Atlas for cloud database
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   # Runs on http://localhost:5000
   ```

4. **Frontend Setup** (in a new terminal)
   ```bash
   cd ..  # back to project root
   pnpm install
   pnpm dev
   # Runs on http://localhost:3000
   ```

5. **Open in Browser**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:5000/api`

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
│   ├── api.js                    # API client with Axios
│   └── AuthContext.jsx           # Authentication context
│
└── SETUP_GUIDE.md               # Detailed setup instructions
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/profile` | Get current user (auth required) |
| PUT | `/auth/profile` | Update user profile (auth required) |

### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recipes` | Create recipe (auth required) |
| GET | `/recipes` | Get all recipes with filters |
| GET | `/recipes/:id` | Get recipe details |
| PUT | `/recipes/:id` | Update recipe (auth required) |
| DELETE | `/recipes/:id` | Delete recipe (auth required) |
| POST | `/recipes/:id/rate` | Rate/review recipe (auth required) |
| GET | `/recipes/user/:userId` | Get recipes by user |

### Search Parameters

```
GET /api/recipes?search=pasta&cuisine=Italian&difficulty=Easy&maxPrepTime=30&page=1&limit=12
```

Parameters:
- `search` - Search in title, description, tags
- `cuisine` - Italian, Mexican, Asian, Indian, Mediterranean, American, French, Thai, Japanese
- `difficulty` - Easy, Medium, Hard
- `maxPrepTime` - Maximum prep time in minutes
- `tags` - Filter by tags
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

## Environment Configuration

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/recipe_sharing
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Frontend API Base URL
```javascript
// lib/api.js
const API_URL = 'http://localhost:5000/api';
```

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running: `brew services list` (macOS)
- Start MongoDB: `brew services start mongodb-community`
- Or use MongoDB Atlas connection string

### Port 5000 Already in Use
- Change PORT in `.env` or kill process: `lsof -ti:5000 | xargs kill -9`

### Image Upload Not Working
- Ensure `/uploads` directory exists
- Check file size is under 5MB
- Verify only JPEG, PNG, GIF formats are allowed

### CORS Errors
- Confirm backend runs on `http://localhost:5000`
- Check CORS configuration in `server.js`

## For Detailed Setup Instructions
See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive installation, deployment, and development guides.

## Development

### Running Tests
```bash
# Backend tests (to be implemented)
cd backend && npm test

# Frontend tests (to be implemented)
cd .. && npm test
```

### Adding New Features

1. **New Recipe Field**
   - Update Recipe model in `backend/models/Recipe.js`
   - Update validation schema in `backend/utils/validation.js`
   - Update API response in controllers
   - Update frontend form component

2. **New Search Filter**
   - Add filter parameter to `getRecipes` controller
   - Add query to frontend search form
   - Update API client in `lib/api.js`

3. **New Page**
   - Create component in `app/` directory
   - Add to Navigation links
   - Import and use API services

## Contributing

This project demonstrates full-stack development patterns. Feel free to extend it with:
- User followers/following system
- Recipe collections/saved recipes
- Social sharing features
- Advanced analytics
- Mobile app using React Native

## Performance Tips

- Images are cached in the browser
- Pagination prevents loading excessive data
- Database indexes on search fields
- JWT tokens cached in cookies
- API responses are structured for efficient parsing

## Security Considerations

- Passwords hashed with bcryptjs (salted)
- JWT tokens for stateless authentication
- File upload validation and size limits
- Input validation with Joi schemas
- CORS properly configured
- Environment variables for sensitive data

**Important**: In production, change `JWT_SECRET` to a secure random value and enable HTTPS.

## Future Enhancements

- [ ] Social following system
- [ ] Recipe collections/favorites
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Recipe difficulty levels with time estimates
- [ ] Dietary restriction filters (vegan, gluten-free, etc.)
- [ ] Multi-language support
- [ ] Cloud image storage (AWS S3)
- [ ] Real-time notifications
- [ ] Mobile app

## Support

For detailed setup help, troubleshooting, and deployment guides, refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## License

MIT License - Feel free to use this project for learning and development.

---

**Happy Cooking!** 🍳
