import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen, 
  Video, 
  MessageSquare,
  ChevronRight,
  Clock,
  TrendingUp,
  Zap,
  Users,
  CreditCard,
  Settings,
  Code,
  Palette,
  HelpCircle,
  ExternalLink,
  Star,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

/**
 * Knowledge Base Page
 * Searchable help articles and documentation
 * 
 * Created: October 31, 2025
 */

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  views: number;
  helpful: number;
  readTime: string;
  lastUpdated: string;
  tags: string[];
  popular: boolean;
}

const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Zap,
    description: 'New to CR AudioViz AI? Start here',
    articleCount: 12,
    color: 'blue'
  },
  {
    id: 'tools',
    name: 'Using Tools',
    icon: Palette,
    description: 'Learn to use our creative tools',
    articleCount: 45,
    color: 'purple'
  },
  {
    id: 'account',
    name: 'Account & Billing',
    icon: CreditCard,
    description: 'Manage your account and subscription',
    articleCount: 18,
    color: 'green'
  },
  {
    id: 'javari',
    name: 'Javari AI Assistant',
    icon: MessageSquare,
    description: 'Get the most from your AI assistant',
    articleCount: 22,
    color: 'orange'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Code,
    description: 'Connect with other platforms',
    articleCount: 15,
    color: 'red'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: Settings,
    description: 'Fix common issues',
    articleCount: 28,
    color: 'gray'
  }
];

const popularArticles: Article[] = [
  {
    id: '1',
    title: 'How to Get Started with CR AudioViz AI in 5 Minutes',
    description: 'Quick start guide covering account setup, first project, and basic tool usage.',
    category: 'Getting Started',
    views: 8420,
    helpful: 1240,
    readTime: '5 min',
    lastUpdated: '2025-10-28',
    tags: ['Quick Start', 'Beginner', 'Setup'],
    popular: true
  },
  {
    id: '2',
    title: 'Complete Guide to AI Image Generation',
    description: 'Master AI image creation with prompt engineering, style control, and advanced techniques.',
    category: 'Tools',
    subcategory: 'Image Tools',
    views: 6890,
    helpful: 1050,
    readTime: '12 min',
    lastUpdated: '2025-10-25',
    tags: ['AI Images', 'Prompts', 'Advanced'],
    popular: true
  },
  {
    id: '3',
    title: 'Understanding Your Subscription and Credits',
    description: 'Learn how credits work, what counts as usage, and how to manage your plan.',
    category: 'Account & Billing',
    views: 5670,
    helpful: 890,
    readTime: '8 min',
    lastUpdated: '2025-10-30',
    tags: ['Credits', 'Billing', 'Plans'],
    popular: true
  },
  {
    id: '4',
    title: 'Getting the Best Results from Javari AI',
    description: 'Tips and techniques for effective prompting and task delegation to your AI assistant.',
    category: 'Javari AI',
    views: 4320,
    helpful: 780,
    readTime: '10 min',
    lastUpdated: '2025-10-29',
    tags: ['Javari', 'Prompts', 'Best Practices'],
    popular: true
  },
  {
    id: '5',
    title: 'How to Create Professional Social Media Graphics',
    description: 'Step-by-step guide to creating scroll-stopping social media content.',
    category: 'Tools',
    subcategory: 'Design Tools',
    views: 3890,
    helpful: 620,
    readTime: '15 min',
    lastUpdated: '2025-10-27',
    tags: ['Social Media', 'Graphics', 'Tutorial'],
    popular: true
  },
  {
    id: '6',
    title: 'Troubleshooting: Why Isn\'t My Tool Working?',
    description: 'Common issues and solutions for tool errors, loading problems, and generation failures.',
    category: 'Troubleshooting',
    views: 3210,
    helpful: 540,
    readTime: '7 min',
    lastUpdated: '2025-10-26',
    tags: ['Errors', 'Fixes', 'Support'],
    popular: true
  }
];

const recentArticles: Article[] = [
  {
    id: '7',
    title: 'New: Video Generation Tool - Complete Guide',
    description: 'Learn to use our newest tool for creating AI-generated videos.',
    category: 'Tools',
    subcategory: 'Video Tools',
    views: 1240,
    helpful: 180,
    readTime: '10 min',
    lastUpdated: '2025-10-31',
    tags: ['New', 'Video', 'Tutorial'],
    popular: false
  },
  {
    id: '8',
    title: 'October 2025 Platform Updates',
    description: 'What\'s new this month: features, improvements, and bug fixes.',
    category: 'Getting Started',
    views: 2100,
    helpful: 320,
    readTime: '5 min',
    lastUpdated: '2025-10-31',
    tags: ['Updates', 'Features', 'Changelog'],
    popular: false
  },
  {
    id: '9',
    title: 'How to Connect Google Drive to Your Account',
    description: 'Import and export files seamlessly with Google Drive integration.',
    category: 'Integrations',
    views: 890,
    helpful: 140,
    readTime: '6 min',
    lastUpdated: '2025-10-30',
    tags: ['Google Drive', 'Cloud Storage', 'Setup'],
    popular: false
  },
  {
    id: '10',
    title: 'Understanding AI Credit Usage',
    description: 'Detailed breakdown of how different actions consume credits.',
    category: 'Account & Billing',
    views: 1560,
    helpful: 240,
    readTime: '8 min',
    lastUpdated: '2025-10-29',
    tags: ['Credits', 'Usage', 'Billing'],
    popular: false
  }
];

export default function KnowledgeBasePage() {
  const totalArticles = categories.reduce((acc, cat) => acc + cat.articleCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Knowledge Base
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Everything you need to know about using CR AudioViz AI. 
              Searchable guides, tutorials, and answers.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search for answers..." 
                  className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{totalArticles} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Video tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Community support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers organized by topic
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/knowledge-base/${category.id}`}>
                <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                      </div>
                      <Badge variant="secondary">
                        {category.articleCount} articles
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Explore category
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Articles</h2>
              <p className="text-gray-600">Most viewed and helpful articles</p>
            </div>
            <Button variant="outline">
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/knowledge-base/article/${article.id}`}>
                            <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors mb-1">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm mb-3">
                            {article.description}
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <Badge variant="secondary">{article.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime} read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>{article.helpful} found helpful</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recently Updated</h2>
              <p className="text-gray-600">Latest additions and updates</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{article.category}</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Updated
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">
                    <Link href={`/knowledge-base/article/${article.id}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read Article
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Video Tutorials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prefer watching? Check out our video tutorial library
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group cursor-pointer">
                  <Video className="w-16 h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" variant="secondary">
                      Watch Now
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Tutorial</Badge>
                  <h3 className="font-semibold mb-2">Getting Started Guide</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>12:34</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Contact Support
                <MessageSquare className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/community">
                Join Community
                <Users className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            Average response time: Under 2 hours
          </p>
        </div>
      </section>
    </div>
  );
}
