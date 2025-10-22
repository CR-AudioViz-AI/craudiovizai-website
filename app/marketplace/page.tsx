import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Star, 
  Download,
  ShoppingCart,
  Tag,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  // Mock marketplace items
  const items = [
    {
      id: 1,
      title: "Modern E-Commerce Template",
      creator: "DesignPro",
      price: 49,
      rating: 4.8,
      sales: 1250,
      category: "Templates",
      image: "/placeholder-template.jpg"
    },
    {
      id: 2,
      title: "2D Platformer Game Kit",
      creator: "GameDevStudio",
      price: 99,
      rating: 4.9,
      sales: 890,
      category: "Games",
      image: "/placeholder-game.jpg"
    },
    {
      id: 3,
      title: "AI Chatbot Component",
      creator: "CodeMaster",
      price: 79,
      rating: 4.7,
      sales: 2100,
      category: "Components",
      image: "/placeholder-component.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              CRAIverse Marketplace
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Buy and sell apps, games, templates, and digital assets
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search marketplace..."
                  className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 h-14 text-lg"
                />
                <Button className="bg-white text-purple-600 hover:bg-purple-50 h-14 px-8">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Button variant="default" className="bg-purple-600">All Items</Button>
              <Button variant="outline">Templates</Button>
              <Button variant="outline">Games</Button>
              <Button variant="outline">Apps</Button>
              <Button variant="outline">Components</Button>
              <Button variant="outline">Graphics</Button>
              <Button variant="outline">Music</Button>
              <Button variant="outline">3D Assets</Button>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">12,450+</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">8,920</div>
              <div className="text-sm text-gray-600">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">$2.4M</div>
              <div className="text-sm text-gray-600">Creator Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">45K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured This Week</h2>
              <Link href="/marketplace/featured">
                <Button variant="link">View All →</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all group">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                        <Download className="w-5 h-5 mr-2" />
                        Preview
                      </Button>
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded font-semibold">
                        {item.category}
                      </span>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-semibold">{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1 truncate">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      by {item.creator}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">${item.price}</div>
                        <div className="text-xs text-gray-500">{item.sales} sales</div>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-orange-600" />
                Trending Now
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Repeat items grid */}
              {[...items, ...items].slice(0, 8).map((item, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-400"></div>
                  <CardContent className="p-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded font-semibold">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {item.creator}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">${item.price}</div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a Seller
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Earn 70% revenue share by selling your creations in the marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/seller">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                <Tag className="w-5 h-5 mr-2" />
                Start Selling
              </Button>
            </Link>
            <Link href="/help/marketplace">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
