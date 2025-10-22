import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Play, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function TutorialsPage() {
  // Mock tutorial data
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with CR AudioViz AI",
      description: "Complete beginner's guide to navigating the platform",
      duration: "12:34",
      category: "Getting Started",
      level: "Beginner",
      views: "25.4K"
    },
    {
      id: 2,
      title: "Building Your First Website with Javari",
      description: "Step-by-step tutorial on creating a professional website",
      duration: "18:45",
      category: "Javari AI",
      level: "Beginner",
      views: "18.2K"
    },
    {
      id: 3,
      title: "Advanced Logo Design Techniques",
      description: "Master the logo generator tool for professional results",
      duration: "15:20",
      category: "Design Tools",
      level: "Intermediate",
      views: "12.8K"
    },
    {
      id: 4,
      title: "Creating Mobile Apps from Scratch",
      description: "Complete guide to building and deploying mobile apps",
      duration: "32:15",
      category: "Development",
      level: "Advanced",
      views: "9.5K"
    },
    {
      id: 5,
      title: "Selling in the Marketplace",
      description: "How to monetize your creations and earn 70% revenue",
      duration: "10:50",
      category: "Marketplace",
      level: "Beginner",
      views: "8.3K"
    },
    {
      id: 6,
      title: "Game Development Masterclass",
      description: "Build engaging games using our game builder tools",
      duration: "45:30",
      category: "Game Development",
      level: "Intermediate",
      views: "7.9K"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Video className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Video Tutorials
            </h1>
            <p className="text-xl text-pink-100 mb-8">
              Learn everything about CR AudioViz AI with our comprehensive video guides
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search tutorials..."
                  className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 h-12"
                />
                <Button className="bg-white text-red-600 hover:bg-red-50 h-12">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="bg-blue-600">All Tutorials</Button>
                <Button variant="outline">Getting Started</Button>
                <Button variant="outline">Javari AI</Button>
                <Button variant="outline">Design Tools</Button>
                <Button variant="outline">Development</Button>
                <Button variant="outline">Marketplace</Button>
                <Button variant="outline">Game Development</Button>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Level
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutorial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Featured Tutorial</span>
            </div>
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-white text-lg font-semibold">Watch Now</p>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      Getting Started
                    </span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      12:34
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      25.4K views
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Getting Started with CR AudioViz AI
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Complete beginner's guide to navigating the platform. Learn how to create your account, 
                    understand credits, explore tools, and build your first project in under 15 minutes.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button className="bg-red-600 hover:bg-red-700" size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Tutorial
                    </Button>
                    <span className="text-sm text-gray-500">Beginner Level</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tutorial Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Tutorials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group cursor-pointer">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded font-semibold">
                        {tutorial.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{tutorial.level}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {tutorial.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        {tutorial.views} views
                      </div>
                      <Link href={`/tutorials/${tutorial.id}`}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Tutorials
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Learning Paths
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Complete Beginner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Start from scratch and learn the fundamentals of the platform
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 8 video tutorials</li>
                    <li>• 2 hours total</li>
                    <li>• Certificate upon completion</li>
                  </ul>
                  <Button variant="outline" className="w-full">Start Learning</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Javari Mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Become an expert at using Javari AI to build anything
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 12 video tutorials</li>
                    <li>• 3.5 hours total</li>
                    <li>• Certificate upon completion</li>
                  </ul>
                  <Button variant="outline" className="w-full">Start Learning</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Marketplace Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn how to create and sell products in the marketplace
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 6 video tutorials</li>
                    <li>• 1.5 hours total</li>
                    <li>• Certificate upon completion</li>
                  </ul>
                  <Button variant="outline" className="w-full">Start Learning</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators mastering CR AudioViz AI
          </p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-pink-50">
            Browse All Tutorials
          </Button>
        </div>
      </section>
    </div>
  );
}
