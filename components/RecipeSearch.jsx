'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RecipeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [maxPrepTime, setMaxPrepTime] = useState(searchParams.get('maxPrepTime') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (cuisine) params.append('cuisine', cuisine);
    if (difficulty) params.append('difficulty', difficulty);
    if (maxPrepTime) params.append('maxPrepTime', maxPrepTime);

    router.push(`/recipes?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setCuisine('');
    setDifficulty('');
    setMaxPrepTime('');
    router.push('/recipes');
  };

  return (
    <form onSubmit={handleSearch} className="w-full bg-white p-6 rounded-lg border border-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Search Recipes</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recipe name or ingredients..."
            className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="Indian">Indian</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="American">American</option>
            <option value="French">French</option>
            <option value="Thai">Thai</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Prep Time (min)</label>
          <input
            type="number"
            value={maxPrepTime}
            onChange={(e) => setMaxPrepTime(e.target.value)}
            placeholder="e.g., 30"
            className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
