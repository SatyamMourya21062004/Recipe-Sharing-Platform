const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a recipe title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a recipe description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    cuisine: {
      type: String,
      enum: [
        'Italian',
        'Mexican',
        'Asian',
        'Indian',
        'Mediterranean',
        'American',
        'French',
        'Thai',
        'Japanese',
        'Other',
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    prepTime: {
      type: Number, // in minutes
      required: true,
    },
    cookTime: {
      type: Number, // in minutes
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    ingredients: [
      {
        name: String,
        quantity: String,
        unit: String,
      },
    ],
    instructions: [
      {
        step: Number,
        description: String,
      },
    ],
    tags: [String],
    image: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add text indexes for full-text search
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
// Add indexes for filtering
recipeSchema.index({ cuisine: 1, difficulty: 1, prepTime: 1 });
recipeSchema.index({ author: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
