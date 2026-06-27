const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getUserRecipes,
} = require('../controllers/recipeController');

router.post('/', auth, upload.single('image'), createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', auth, upload.single('image'), updateRecipe);
router.delete('/:id', auth, deleteRecipe);
router.post('/:id/rate', auth, rateRecipe);
router.get('/user/:userId', getUserRecipes);

module.exports = router;
