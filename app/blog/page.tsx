import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  // Mock blog posts - replace with actual data
  const posts = [
    {
      id: 1,
      title: "10 Ways AI is Revolutionizing Creative Work in 2025",
      excerpt: "Discover how artificial intelligence is transforming the creative industry and what it means for designers, developers, and content creators.",
      author: "Sarah Johnson",
      date: "October 15, 2025",
      category: "AI & Technology",
      readTime: "5 min read",
      image: "/blog/ai-creative-work.jpg" // placeholder
    },
    {
      id: 2,
      title: "Building Your First Game with CR AudioViz AI",
      excerpt: "A step-by-step tutorial on creating an engaging game using our platform's powerful tools and Javari AI assistant.",
      author: "Mike Chen",
      date: "October 10, 2025",
      category: "Tutorials",
      readTime: "8 min read",
      image: "/blog/game-tutorial.jpg"
    },
    {
      id: 3,
      title: "The Future of No-Code Development",
      excerpt: "Explore how no-code platforms are democratizing software development and empowering non-technical creators.",
      author: "Emily Rodriguez",
      date: "October 5, 2025",
      category: "Industry Insights",
      readTime: "6 min read",
      image: "/blog/no-code-future.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              CR AudioViz AI Blog
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Insights, tutorials, and stories from the world of AI-powered creativity
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
                />
                <Button className="bg-white text-purple-600 hover:bg-purple-50">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="default" className="bg-blue-600">All Posts</Button>
            <Button variant="outline">AI & Technology</Button>
            <Button variant="outline">Tutorials</Button>
            <Button variant="outline">Industry Insights</Button>
            <Button variant="outline">Product Updates</Button>
            <Button variant="outline">Case Studies</Button>
            <Button variant="outline">Tips & Tricks</Button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Featured Post</span>
            </div>
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto bg-gray-200">
                  {/* Placeholder for featured image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Featured Image
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      AI & Technology
                    </span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      October 15, 2025
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    10 Ways AI is Revolutionizing Creative Work in 2025
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Discover how artificial intelligence is transforming the creative industry and what it means for designers, developers, and content creators worldwide.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      Sarah Johnson • 5 min read
                    </div>
                    <Link href="/blog/ai-revolutionizing-creative-work">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                  <div className="relative h-48 bg-gray-200">
                    {/* Placeholder for post image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Post Image
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs font-semibold">
                        {post.category}
                      </span>
                      <span className="text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`} className="mt-4">
                      <Button variant="outline" className="w-full">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest articles, tutorials, and insights delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/90 border-0 text-gray-900"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
