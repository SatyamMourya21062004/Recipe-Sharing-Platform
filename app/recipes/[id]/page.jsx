'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { recipeAPI } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getRecipeById(params.id);
      setRecipe(response.data);
    } catch (error) {
      console.error('[ ] Failed to fetch recipe:', error);
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleRateRecipe = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await recipeAPI.rateRecipe(params.id, { rating, review });
      setRating(0);
      setReview('');
      setError('');
      fetchRecipe();
    } catch (error) {
      console.error('[ ] Failed to rate recipe:', error);
      setError('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeAPI.deleteRecipe(params.id);
        router.push('/recipes');
      } catch (error) {
        console.error('[ ] Failed to delete recipe:', error);
        setError('Failed to delete recipe');
      }
    }
  };

  const handleEditRecipe = () => {
    router.push(`/recipes/${params.id}/edit`);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-foreground">Loading recipe...</p>
        </div>
      </>
    );
  }

  if (!recipe || error) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-foreground">{error || 'Recipe not found'}</p>
        </div>
      </>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const isAuthor = user && user.id === recipe.author._id;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {recipe.image ? (
            <div className="relative w-full h-96 bg-muted rounded-lg mb-8 overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-lg mb-8">
              <span className="text-7xl">🍽️</span>
            </div>
          )}

          <div className="bg-white rounded-lg border border-border p-8 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{recipe.title}</h1>
                <p className="text-muted-foreground">By {recipe.author.name}</p>
              </div>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEditRecipe}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRecipe}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">Cuisine</p>
                <p className="text-lg font-semibold text-foreground">{recipe.cuisine}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="text-lg font-semibold text-foreground">{recipe.difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-lg font-semibold text-foreground">{totalTime} min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Servings</p>
                <p className="text-lg font-semibold text-foreground">{recipe.servings}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Recipe Info</h2>
                <div className="space-y-3 text-foreground">
                  <div>
                    <p className="text-sm text-muted-foreground">Prep Time</p>
                    <p className="font-semibold">{recipe.prepTime} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime} minutes</p>
                  </div>
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 bg-muted text-foreground text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4 text-foreground">
                    <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold">
                      {instruction.step}
                    </span>
                    <p className="pt-1">{instruction.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.averageRating > 0 && (
            <div className="bg-white rounded-lg border border-border p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold text-primary">{recipe.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({recipe.ratings.length} ratings)</span>
              </div>

              <div className="space-y-4">
                {recipe.ratings.map((rating, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{rating.userId.name || 'Anonymous'}</p>
                      <span className="text-primary font-bold">★ {rating.rating}</span>
                    </div>
                    {rating.review && <p className="text-muted-foreground">{rating.review}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {user && (
            <div className="bg-white rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Rate This Recipe</h2>
              <form onSubmit={handleRateRecipe} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className={`text-3xl transition-all ${
                          rating >= r ? 'text-primary scale-110' : 'text-muted-foreground'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Review (Optional)</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </form>
            </div>
          )}

          {!user && (
            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground mb-4">Sign in to rate and review this recipe</p>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
