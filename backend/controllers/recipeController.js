const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { recipeSchema } = require('../utils/validation');

const createRecipe = async (req, res) => {
  try {
    const { error, value } = recipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const recipe = new Recipe({
      ...value,
      author: req.userId,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await recipe.save();
    await recipe.populate('author', 'name email');

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    console.error('[ ] Create recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipes = async (req, res) => {
  try {
    const { search, cuisine, difficulty, maxPrepTime, tags, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (cuisine) {
      filter.cuisine = cuisine;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (maxPrepTime) {
      filter.prepTime = { $lte: parseInt(maxPrepTime) };
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const recipes = await Recipe.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments(filter);

    res.json({
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('[ ] Get recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id).populate('author', 'name email bio profilePicture');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('[ ] Get recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { error, value } = recipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    Object.assign(recipe, value);

    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`;
    }

    await recipe.save();
    await recipe.populate('author', 'name email');

    res.json({
      message: 'Recipe updated successfully',
      recipe,
    });
  } catch (error) {
    console.error('[ ] Update recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('[ ] Delete recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Remove existing rating from this user if any
    recipe.ratings = recipe.ratings.filter((r) => r.userId.toString() !== req.userId);

    // Add new rating
    recipe.ratings.push({
      userId: req.userId,
      rating,
      review,
    });

    // Calculate average rating
    const totalRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = parseFloat((totalRating / recipe.ratings.length).toFixed(2));

    await recipe.save();
    await recipe.populate('author', 'name email');

    res.json({
      message: 'Rating added successfully',
      recipe,
    });
  } catch (error) {
    console.error('[ ] Rate recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const recipes = await Recipe.find({ author: userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recipe.countDocuments({ author: userId });

    res.json({
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('[ ] Get user recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getUserRecipes,
};
