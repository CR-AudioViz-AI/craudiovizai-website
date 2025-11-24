'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { TrendingUp, Flame, Star, ArrowUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

const trendingProducts = [
  { name: 'AI Thumbnail Creator', category: 'Tools', growth: '+245%', rating: 4.9, sales: 2500 },
  { name: 'Retro Game Bundle', category: 'Games', growth: '+180%', rating: 4.8, sales: 1800 },
  { name: 'Smart Invoice Generator', category: 'Apps', growth: '+156%', rating: 4.7, sales: 1500 },
  { name: 'Logo Maker Pro', category: 'Tools', growth: '+134%', rating: 4.9, sales: 2100 },
  { name: 'Puzzle Collection 2025', category: 'Games', growth: '+112%', rating: 4.6, sales: 980 },
  { name: 'Social Media Kit', category: 'Templates', growth: '+98%', rating: 4.8, sales: 1650 },
];

export default function TrendingProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Flame className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Trending Now
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-orange-100 mb-6 md:mb-8">
              The hottest apps, tools, and games this week
            </p>
          </div>
        </div>
      </section>

      {/* Trending Grid */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {trendingProducts.map((product, index) => (
                <Card key={product.name} className="hover:shadow-lg transition-all relative overflow-hidden">
                  {index < 3 && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Hot
                    </div>
                  )}
                  <div className="h-32 md:h-40 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white/30" />
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                        {product.category}
                      </span>
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" /> {product.growth}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{product.name}</h3>
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span>{product.sales.toLocaleString()} sales</span>
                    </div>
                    <Link href={`/marketplace/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <MobileButton fullWidth size="sm">
                        View Details
                      </MobileButton>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container mx-auto text-center">
          <TrendingUp className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore the Marketplace</h2>
          <p className="text-base md:text-lg text-orange-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Discover thousands more apps, tools, and games
          </p>
          <Link href="/marketplace" className="inline-block">
            <MobileButton size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              Browse All Products
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
