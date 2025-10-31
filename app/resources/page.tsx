import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  FileText, 
  Video, 
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Palette,
  Code,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Star,
  Eye
} from 'lucide-react';
import Link from 'next/link';

/**
 * Resources Page
 * Downloadable templates, guides, and educational content
 * 
 * Created: October 31, 2025
 */

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'template' | 'guide' | 'video' | 'ebook' | 'checklist' | 'worksheet';
  format: string;
  size?: string;
  downloads: number;
  rating: number;
  featured: boolean;
  premium: boolean;
  icon: any;
  thumbnail: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Complete Social Media Content Calendar Template',
    description: 'Plan 90 days of content across all platforms. Includes post ideas, hashtag strategy, and analytics tracking.',
    category: 'Marketing',
    type: 'template',
    format: 'XLSX',
    size: '2.3 MB',
    downloads: 3420,
    rating: 4.9,
    featured: true,
    premium: false,
    icon: Palette,
    thumbnail: '/resources/social-calendar.jpg'
  },
  {
    id: '2',
    title: 'Ultimate Brand Identity Guide',
    description: 'Step-by-step guide to creating a professional brand identity. Covers logo design, color theory, typography, and brand voice.',
    category: 'Design',
    type: 'ebook',
    format: 'PDF',
    size: '8.5 MB',
    downloads: 2890,
    rating: 4.8,
    featured: true,
    premium: false,
    icon: Palette,
    thumbnail: '/resources/brand-guide.jpg'
  },
  {
    id: '3',
    title: 'Content Marketing ROI Calculator',
    description: 'Calculate the ROI of your content marketing efforts. Track spend, conversions, and revenue attribution.',
    category: 'Marketing',
    type: 'template',
    format: 'XLSX',
    size: '1.2 MB',
    downloads: 2150,
    rating: 4.7,
    featured: true,
    premium: false,
    icon: TrendingUp,
    thumbnail: '/resources/roi-calculator.jpg'
  },
  {
    id: '4',
    title: 'Video Tutorial: Mastering AI Image Generation',
    description: '45-minute comprehensive video course on creating stunning AI-generated images for your brand.',
    category: 'Tutorials',
    type: 'video',
    format: 'MP4',
    size: '350 MB',
    downloads: 1890,
    rating: 5.0,
    featured: false,
    premium: true,
    icon: Video,
    thumbnail: '/resources/ai-image-tutorial.jpg'
  },
  {
    id: '5',
    title: 'Email Marketing Sequence Templates (10 Pack)',
    description: 'Ready-to-use email sequences for welcome series, abandoned cart, re-engagement, and more.',
    category: 'Marketing',
    type: 'template',
    format: 'DOCX',
    size: '450 KB',
    downloads: 3200,
    rating: 4.9,
    featured: false,
    premium: false,
    icon: FileText,
    thumbnail: '/resources/email-sequences.jpg'
  },
  {
    id: '6',
    title: 'Complete Business Plan Template',
    description: 'Professional business plan template used by successful startups. Includes financial projections and market analysis.',
    category: 'Business',
    type: 'template',
    format: 'DOCX + XLSX',
    size: '3.8 MB',
    downloads: 1670,
    rating: 4.8,
    featured: false,
    premium: false,
    icon: Briefcase,
    thumbnail: '/resources/business-plan.jpg'
  },
  {
    id: '7',
    title: 'SEO Optimization Checklist 2025',
    description: '100-point checklist covering on-page SEO, technical SEO, content optimization, and link building.',
    category: 'Marketing',
    type: 'checklist',
    format: 'PDF',
    size: '800 KB',
    downloads: 4100,
    rating: 4.9,
    featured: false,
    premium: false,
    icon: Search,
    thumbnail: '/resources/seo-checklist.jpg'
  },
  {
    id: '8',
    title: 'Graphic Design Principles Masterclass',
    description: 'Learn the fundamentals of professional graphic design. Covers composition, color, typography, and hierarchy.',
    category: 'Design',
    type: 'ebook',
    format: 'PDF',
    size: '12 MB',
    downloads: 2340,
    rating: 4.8,
    featured: false,
    premium: true,
    icon: Palette,
    thumbnail: '/resources/design-masterclass.jpg'
  },
  {
    id: '9',
    title: 'Social Media Ad Templates (50 Pack)',
    description: 'Professional ad templates for Facebook, Instagram, LinkedIn, and Twitter. Fully customizable in multiple formats.',
    category: 'Marketing',
    type: 'template',
    format: 'PSD + AI',
    size: '156 MB',
    downloads: 2890,
    rating: 4.9,
    featured: false,
    premium: true,
    icon: Zap,
    thumbnail: '/resources/ad-templates.jpg'
  },
  {
    id: '10',
    title: 'Startup Launch Checklist',
    description: 'Complete checklist for launching a successful startup. From MVP to market validation to scaling.',
    category: 'Business',
    type: 'checklist',
    format: 'PDF',
    size: '1.1 MB',
    downloads: 1980,
    rating: 4.7,
    featured: false,
    premium: false,
    icon: GraduationCap,
    thumbnail: '/resources/startup-checklist.jpg'
  },
  {
    id: '11',
    title: 'Presentation Templates Bundle (20 Pack)',
    description: 'Professional PowerPoint and Keynote templates for pitch decks, reports, and presentations.',
    category: 'Business',
    type: 'template',
    format: 'PPTX',
    size: '89 MB',
    downloads: 3450,
    rating: 4.8,
    featured: false,
    premium: false,
    icon: Briefcase,
    thumbnail: '/resources/presentation-bundle.jpg'
  },
  {
    id: '12',
    title: 'Content Creation Workflow Guide',
    description: 'Streamline your content creation process. Includes ideation frameworks, production checklists, and distribution strategies.',
    category: 'Marketing',
    type: 'guide',
    format: 'PDF',
    size: '4.2 MB',
    downloads: 2670,
    rating: 4.9,
    featured: false,
    premium: false,
    icon: BookOpen,
    thumbnail: '/resources/content-workflow.jpg'
  },
  {
    id: '13',
    title: 'Website Wireframe Kit (100+ Components)',
    description: 'Complete wireframe kit for designing websites and apps. Includes navigation, forms, cards, and more.',
    category: 'Design',
    type: 'template',
    format: 'Figma',
    size: 'Cloud',
    downloads: 1560,
    rating: 4.8,
    featured: false,
    premium: true,
    icon: Code,
    thumbnail: '/resources/wireframe-kit.jpg'
  },
  {
    id: '14',
    title: 'Financial Planning Spreadsheet Bundle',
    description: 'Budget tracker, expense manager, cash flow projections, and financial dashboard templates.',
    category: 'Business',
    type: 'template',
    format: 'XLSX',
    size: '5.6 MB',
    downloads: 2100,
    rating: 4.7,
    featured: false,
    premium: false,
    icon: TrendingUp,
    thumbnail: '/resources/financial-bundle.jpg'
  },
  {
    id: '15',
    title: 'Complete Branding Package Template',
    description: 'Everything you need to present a professional brand: logo usage guide, color palettes, typography, and brand guidelines.',
    category: 'Design',
    type: 'template',
    format: 'PDF + AI',
    size: '45 MB',
    downloads: 1890,
    rating: 5.0,
    featured: false,
    premium: true,
    icon: Palette,
    thumbnail: '/resources/branding-package.jpg'
  }
];

export default function ResourcesPage() {
  const featuredResources = resources.filter(r => r.featured);
  const categories = [...new Set(resources.map(r => r.category))];
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Free Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Templates, Guides & Resources
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Professional templates, comprehensive guides, and video tutorials to 
              accelerate your creative projects. All free for our community.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>{totalDownloads.toLocaleString()}+ downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>{resources.length} resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.8 average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-white py-6 border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400" />
              <Input placeholder="Search resources..." className="border-gray-300" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                All Categories
              </Button>
              <Button variant="outline" size="sm">
                Templates
              </Button>
              <Button variant="outline" size="sm">
                Guides
              </Button>
              <Button variant="outline" size="sm">
                Videos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and highest-rated resources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <resource.icon className="w-20 h-20 text-blue-600" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{resource.category}</Badge>
                    {resource.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{resource.format}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant={resource.premium ? "default" : "outline"}>
                    {resource.premium ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade to Download
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete library of templates, guides, and tutorials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.filter(r => !r.featured).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  <resource.icon className="w-16 h-16 text-gray-400 group-hover:scale-110 transition-transform" />
                  {resource.premium && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      Premium
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {resource.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{resource.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find resources specific to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryResources = resources.filter(r => r.category === category);
              const categoryIcon = categoryResources[0].icon;
              
              return (
                <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <categoryIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {categoryResources.length} resources
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse {category}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Access to Premium Resources
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Upgrade to Premium to unlock exclusive templates, advanced guides, 
            and comprehensive video courses.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pricing">
                View Premium Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Download className="mr-2 w-5 h-5" />
              Download All Free Resources
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            Premium starts at $29.99/month • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
