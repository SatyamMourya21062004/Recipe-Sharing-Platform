'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function RecipeCard({ recipe }) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link href={`/recipes/${recipe._id}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {recipe.image ? (
          <div className="relative w-full h-48 bg-muted">
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
          <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}

        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2">{recipe.title}</h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-block px-2 py-1 bg-muted text-xs font-medium text-foreground rounded">
              {recipe.cuisine}
            </span>
            <span className="inline-block px-2 py-1 bg-muted text-xs font-medium text-foreground rounded">
              {recipe.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>⏱️ {totalTime} min</span>
            <span>👥 {recipe.servings} servings</span>
          </div>

          {recipe.averageRating > 0 && (
            <div className="mt-3 flex items-center gap-1">
              <span className="text-sm font-medium text-primary">★ {recipe.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({recipe.ratings.length})</span>
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            By {recipe.author.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
