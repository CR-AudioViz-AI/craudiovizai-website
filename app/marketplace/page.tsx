'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton, MobileInput } from '@/components/mobile';
import { 
  Search, TrendingUp, Star, Download,
  ShoppingCart, Tag, Users, DollarSign, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['All Items', 'Templates', 'Games', 'Apps', 'Components', 'Graphics', 'Music', '3D Assets'];

const marketplaceItems = [
  {
    id: 1,
    title: "Modern E-Commerce Template",
    creator: "DesignPro",
    price: 49,
    rating: 4.8,
    sales: 1250,
    category: "Templates"
  },
  {
    id: 2,
    title: "2D Platformer Game Kit",
    creator: "GameDevStudio",
    price: 99,
    rating: 4.9,
    sales: 890,
    category: "Games"
  },
  {
    id: 3,
    title: "AI Chatbot Component",
    creator: "CodeMaster",
    price: 79,
    rating: 4.7,
    sales: 2100,
    category: "Components"
  },
  {
    id: 4,
    title: "Portfolio Website Bundle",
    creator: "WebWizard",
    price: 39,
    rating: 4.6,
    sales: 1580,
    category: "Templates"
  },
  {
    id: 5,
    title: "Puzzle Game Collection",
    creator: "PuzzleMania",
    price: 59,
    rating: 4.9,
    sales: 950,
    category: "Games"
  },
  {
    id: 6,
    title: "Icon Pack Pro (500+)",
    creator: "IconDesigner",
    price: 29,
    rating: 4.8,
    sales: 3200,
    category: "Graphics"
  }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Items' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              Creator Marketplace
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8">
              Buy and sell apps, games, templates, and digital assets
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <MobileInput
                type="search"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                className="bg-white/90 text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-4 py-8 md:py-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">12,450+</div>
              <div className="text-xs md:text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-1">8,920</div>
              <div className="text-xs md:text-sm text-gray-600">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">$2.4M</div>
              <div className="text-xs md:text-sm text-gray-600">Creator Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">70%</div>
              <div className="text-xs md:text-sm text-gray-600">Revenue Share</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6 md:py-8 bg-gray-50 border-y">
        <div className="container mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all flex-shrink-0 text-sm ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Items */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedCategory}
              </h2>
              <div className="text-sm md:text-base text-gray-600">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-xl transition-all">
                  {/* Item Image Placeholder */}
                  <div className="h-40 md:h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center relative">
                    <Sparkles className="w-16 h-16 text-white/30" />
                    {item.rating >= 4.8 && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ Best Seller
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 md:p-6">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Creator */}
                    <p className="text-xs md:text-sm text-gray-600 mb-3">
                      by {item.creator}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mb-4 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{item.sales.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        ${item.price}
                      </div>
                      <Link href={`/marketplace/${item.id}`}>
                        <MobileButton size="sm" className="bg-purple-600 hover:bg-purple-700">
                          View Details
                        </MobileButton>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <MobileButton
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Items');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </MobileButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <Card className="max-w-5xl mx-auto border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  Become a Seller
                </CardTitle>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-gray-600">
                Earn 70% revenue share by selling your creations on our marketplace
              </p>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    70% Revenue Share
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Keep most of your earnings
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">🚀</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    Easy Setup
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    List items in minutes
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">🌍</div>
                  <p className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                    Global Reach
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Access 100K+ buyers
                  </p>
                </div>
              </div>
              <Link href="/marketplace/sell" className="block">
                <MobileButton 
                  fullWidth
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Selling
                </MobileButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Explore?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Discover thousands of premium assets from talented creators worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Browse Marketplace
              </MobileButton>
            </Link>
            <Link href="/marketplace/sell" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Start Selling
              </MobileButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
