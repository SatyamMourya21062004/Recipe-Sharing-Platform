import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-white to-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-7xl">🍳</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">RecipeShare</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing recipes from around the world, share your culinary creations, and connect with food enthusiasts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/recipes"
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Explore Recipes
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold text-lg"
              >
                Join Community
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Advanced Search</h3>
              <p className="text-muted-foreground">
                Find recipes by cuisine, difficulty level, prep time, and more with our powerful search filters.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Share Your Recipes</h3>
              <p className="text-muted-foreground">
                Create an account and share your favorite recipes with a community of food lovers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-border shadow-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Rate & Review</h3>
              <p className="text-muted-foreground">
                Rate recipes, leave reviews, and help others discover the best dishes to cook.
              </p>
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-r from-primary to-secondary p-12 rounded-lg text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
            <p className="text-lg mb-6 opacity-90">
              Create an account to share your recipes and start exploring delicious dishes from around the world.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
