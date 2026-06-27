'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { recipeAPI } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function CreateRecipePage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const isEditMode = !!params.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [{ step: 1, description: '' }],
    tags: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (isEditMode) {
      fetchRecipe();
    }
  }, [isEditMode, params.id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getRecipeById(params.id);
      const recipe = response.data;
      if (recipe.author._id !== user.id) {
        router.push('/recipes');
        return;
      }

      setFormData({
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags.join(', '),
        image: null,
      });
    } catch (error) {
      console.error('[ ] Failed to fetch recipe:', error);
      router.push('/recipes');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index].description = value;
    setFormData((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, description: '' },
      ],
    }));
  };

  const removeInstruction = (index) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instr, i) => ({ ...instr, step: i + 1 })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      return;
    }

    if (formData.ingredients.some((ing) => !ing.name || !ing.quantity || !ing.unit)) {
      setError('All ingredients must be complete');
      return;
    }

    if (formData.instructions.some((instr) => !instr.description)) {
      setError('All instructions must be filled');
      return;
    }

    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('cuisine', formData.cuisine);
      formDataObj.append('difficulty', formData.difficulty);
      formDataObj.append('prepTime', parseInt(formData.prepTime));
      formDataObj.append('cookTime', parseInt(formData.cookTime));
      formDataObj.append('servings', parseInt(formData.servings));
      formDataObj.append('ingredients', JSON.stringify(formData.ingredients));
      formDataObj.append('instructions', JSON.stringify(formData.instructions));
      formDataObj.append('tags', formData.tags ? formData.tags.split(',').map((t) => t.trim()) : []);
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }

      if (isEditMode) {
        await recipeAPI.updateRecipe(params.id, formDataObj);
      } else {
        await recipeAPI.createRecipe(formDataObj);
      }

      router.push(isEditMode ? `/recipes/${params.id}` : '/recipes');
    } catch (error) {
      console.error('[ ] Failed to save recipe:', error);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-foreground">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipe Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Classic Spaghetti Carbonara"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipe Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe..."
                rows="3"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cuisine</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Asian">Asian</option>
                  <option value="Indian">Indian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                  <option value="Thai">Thai</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prep Time (min)</label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cook Time (min)</label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Servings</label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., vegetarian, quick, dessert"
                className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Ingredients</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                >
                  Add Ingredient
                </button>
              </div>

              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="flex-1 px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      className="w-24 px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      placeholder="Unit"
                      className="w-24 px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Instructions</h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                >
                  Add Step
                </button>
              </div>

              <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                      {instruction.step}
                    </div>
                    <textarea
                      value={instruction.description}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      placeholder="Describe this step..."
                      rows="2"
                      className="flex-1 px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm h-fit"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t border-border pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Recipe' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
