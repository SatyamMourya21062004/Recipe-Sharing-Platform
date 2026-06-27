'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import RecipeCard from '@/components/RecipeCard';
import { recipeAPI } from '@/lib/api';

export default function UserProfilePage() {
  const params = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserRecipes();
  }, [params.userId]);

  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getUserRecipes(params.userId, { limit: 20 });
      setRecipes(response.data.recipes);
      if (response.data.recipes.length > 0) {
        setUserName(response.data.recipes[0].author.name);
      }
    } catch (error) {
      console.error('[ ] Failed to fetch user recipes:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-border p-8 mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">{userName || 'User Profile'}</h1>
            <p className="text-muted-foreground">{recipes.length} recipes shared</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-foreground">Loading recipes...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">No recipes shared yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
