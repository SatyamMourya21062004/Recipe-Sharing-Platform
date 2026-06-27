'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import RecipeSearch from '@/components/RecipeSearch';
import RecipeCard from '@/components/RecipeCard';
import { recipeAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchParams.get('search') || undefined,
        cuisine: searchParams.get('cuisine') || undefined,
        difficulty: searchParams.get('difficulty') || undefined,
        maxPrepTime: searchParams.get('maxPrepTime') || undefined,
        tags: searchParams.get('tags') || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

      const response = await recipeAPI.getRecipes(params);
      setRecipes(response.data.recipes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('[ ] Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-muted py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Discover Recipes</h1>
            <RecipeSearch />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-foreground mt-4">Loading recipes...</p>
              </div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-2xl text-foreground mb-2">No recipes found</p>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white border border-border hover:bg-muted'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
