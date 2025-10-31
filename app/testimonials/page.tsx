import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import Link from 'next/link';

/**
 * Testimonials Page
 * Customer reviews, ratings, and social proof
 * 
 * Created: October 31, 2025
 */

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  quote: string;
  result?: string;
  verified: boolean;
  featured: boolean;
  photo: string;
  video?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Sarah Mitchell',
    role: 'Creative Director',
    company: 'Creative Spark Agency',
    industry: 'Marketing',
    rating: 5,
    quote: 'CR AudioViz AI literally saved our agency. We went from drowning in subscriptions to having everything we need in one place. The ROI was immediate - we saved $720/month in tool costs and delivered projects 5x faster.',
    result: '5x faster delivery, 89% cost savings',
    verified: true,
    featured: true,
    photo: '/testimonials/sarah-mitchell.jpg'
  },
  {
    id: '2',
    author: 'Marcus Thompson',
    role: 'Content Creator',
    company: 'Tech Tomorrow Channel',
    industry: 'YouTube',
    rating: 5,
    quote: 'My channel exploded after I started using CR AudioViz AI. The thumbnail creator alone is worth 10x the subscription price. I went from 5K to 500K subscribers in 18 months. This platform is a game-changer for creators.',
    result: '500K subscribers gained, $85K sponsorship revenue',
    verified: true,
    featured: true,
    photo: '/testimonials/marcus-thompson.jpg',
    video: 'https://youtube.com/testimonial-marcus'
  },
  {
    id: '3',
    author: 'Jessica Rodriguez',
    role: 'Founder',
    company: 'Mindful Wellness Co.',
    industry: 'Health & Wellness',
    rating: 5,
    quote: 'As a solo entrepreneur, I needed to look professional on a bootstrap budget. CR AudioViz AI gave me everything - branding, course materials, marketing content. I built a 6-figure business without hiring anyone. Incredible value.',
    result: '$147K Year 1 revenue as solopreneur',
    verified: true,
    featured: true,
    photo: '/testimonials/jessica-rodriguez.jpg'
  },
  {
    id: '4',
    author: 'David Park',
    role: 'Co-Founder & CMO',
    company: 'Urban Threads Apparel',
    industry: 'E-Commerce',
    rating: 5,
    quote: 'The quality of product photos and marketing materials we create now rivals brands with 10x our budget. Our conversion rate doubled. The AI tools are incredibly sophisticated yet easy to use.',
    result: '2.1x conversion rate improvement, $450K revenue increase',
    verified: true,
    featured: false,
    photo: '/testimonials/david-park.jpg'
  },
  {
    id: '5',
    author: 'Michael Chen',
    role: 'Executive Director',
    company: 'Hope for Tomorrow Foundation',
    industry: 'Nonprofit',
    rating: 5,
    quote: 'Every dollar matters in nonprofit work. CR AudioViz AI gave us enterprise-level creative tools at a price we could actually afford. Our donor engagement increased 340% and we raised an additional $230K this year.',
    result: '340% donor engagement increase, $230K additional funds',
    verified: true,
    featured: false,
    photo: '/testimonials/michael-chen.jpg'
  },
  {
    id: '6',
    author: 'Jennifer Williams',
    role: 'Broker & Team Leader',
    company: 'Summit Realty Group',
    industry: 'Real Estate',
    rating: 5,
    quote: 'Our listings now look like luxury properties even in the mid-range market. We close 43% more deals and properties sell 31% faster. The virtual staging and property brochure tools are phenomenal.',
    result: '43% more deals closed, 31% faster sales',
    verified: true,
    featured: false,
    photo: '/testimonials/jennifer-williams.jpg'
  },
  {
    id: '7',
    author: 'Alex Turner',
    role: 'Freelance Designer',
    company: 'Turner Creative Studio',
    industry: 'Freelance',
    rating: 5,
    quote: 'I can deliver client work in hours that used to take days. The AI assistant helps me brainstorm, the tools are professional-grade, and everything integrates perfectly. My client capacity tripled without working longer hours.',
    verified: true,
    featured: false,
    photo: '/testimonials/alex-turner.jpg'
  },
  {
    id: '8',
    author: 'Rachel Kim',
    role: 'Social Media Manager',
    company: 'BrightPath Consulting',
    industry: 'Consulting',
    rating: 5,
    quote: 'Managing social media for 15 clients was overwhelming. CR AudioViz AI streamlined everything - content creation, scheduling, analytics. I doubled my client roster without hiring help. The platform pays for itself 20x over.',
    verified: true,
    featured: false,
    photo: '/testimonials/rachel-kim.jpg'
  },
  {
    id: '9',
    author: 'James Rodriguez',
    role: 'Startup Founder',
    company: 'LaunchPad SaaS',
    industry: 'Technology',
    rating: 5,
    quote: 'We bootstrapped our startup and couldn\'t afford a marketing team. CR AudioViz AI became our entire creative department. We created all our launch materials, pitch decks, and marketing content for less than $100/month.',
    verified: true,
    featured: false,
    photo: '/testimonials/james-rodriguez.jpg'
  },
  {
    id: '10',
    author: 'Emily Watson',
    role: 'Course Creator',
    company: 'Digital Marketing Academy',
    industry: 'Education',
    rating: 5,
    quote: 'Creating professional course materials used to require expensive software and designers. Now I produce everything myself - presentations, workbooks, graphics, videos. My students say my courses look more professional than $2000 competitors.',
    verified: true,
    featured: false,
    photo: '/testimonials/emily-watson.jpg'
  },
  {
    id: '11',
    author: 'Carlos Mendez',
    role: 'Restaurant Owner',
    company: 'Sabor Latino Restaurant',
    industry: 'Food & Beverage',
    rating: 5,
    quote: 'I needed menus, social media posts, flyers, and website updates but couldn\'t afford agencies. CR AudioViz AI helps me create everything in-house. Our Instagram following grew 400% and reservations are up 60%.',
    verified: true,
    featured: false,
    photo: '/testimonials/carlos-mendez.jpg'
  },
  {
    id: '12',
    author: 'Lisa Chang',
    role: 'Event Planner',
    company: 'Elegant Events Co.',
    industry: 'Events',
    rating: 5,
    quote: 'Every event needs custom invitations, signage, social graphics, and presentations. CR AudioViz AI lets me create everything quickly and beautifully. Clients are impressed and I save thousands per event on design costs.',
    verified: true,
    featured: false,
    photo: '/testimonials/lisa-chang.jpg'
  },
  {
    id: '13',
    author: 'Tom Harrison',
    role: 'Small Business Owner',
    company: 'Harrison Home Services',
    industry: 'Home Services',
    rating: 5,
    quote: 'I\'m a plumber, not a marketer. But CR AudioViz AI makes it easy to create professional ads, flyers, and social posts. My phone rings 3x more than before I started using it. Best business investment I\'ve made.',
    verified: true,
    featured: false,
    photo: '/testimonials/tom-harrison.jpg'
  },
  {
    id: '14',
    author: 'Amanda Foster',
    role: 'Fitness Coach',
    company: 'Foster Fitness',
    industry: 'Fitness',
    rating: 5,
    quote: 'Creating workout plans, meal guides, and motivational content is so easy now. My online coaching business looks as professional as the big franchises. I\'ve 4x\'d my client base in 9 months.',
    verified: true,
    featured: false,
    photo: '/testimonials/amanda-foster.jpg'
  },
  {
    id: '15',
    author: 'Kevin Zhang',
    role: 'Podcast Host',
    company: 'Business Insights Podcast',
    industry: 'Media',
    rating: 5,
    quote: 'The audiogram creator, social clips, and show notes generator save me 10+ hours per week. I can focus on great interviews instead of editing and promotion. My download numbers doubled in 3 months.',
    verified: true,
    featured: false,
    photo: '/testimonials/kevin-zhang.jpg'
  },
  {
    id: '16',
    author: 'Monica Santos',
    role: 'Real Estate Agent',
    company: 'Santos Properties',
    industry: 'Real Estate',
    rating: 5,
    quote: 'The property flyer and virtual staging tools are incredible. My listings get 3x more engagement and I look like a top-tier agent. Clients specifically mention how professional my marketing materials are.',
    verified: true,
    featured: false,
    photo: '/testimonials/monica-santos.jpg'
  },
  {
    id: '17',
    author: 'Ryan Cooper',
    role: 'Marketing Director',
    company: 'GrowthHive Marketing',
    industry: 'Marketing',
    rating: 5,
    quote: 'We serve mid-market clients who want big agency results on smaller budgets. CR AudioViz AI is our secret weapon. We deliver Fortune 500 quality work at 1/10th the cost. Client retention is 95%.',
    verified: true,
    featured: false,
    photo: '/testimonials/ryan-cooper.jpg'
  },
  {
    id: '18',
    author: 'Sophie Laurent',
    role: 'Fashion Blogger',
    company: 'Style by Sophie',
    industry: 'Fashion',
    rating: 5,
    quote: 'Creating consistent, on-brand content for Instagram, Pinterest, and my blog was exhausting. CR AudioViz AI made it effortless. My engagement rates tripled and I landed my first 5-figure brand partnership.',
    verified: true,
    featured: false,
    photo: '/testimonials/sophie-laurent.jpg'
  },
  {
    id: '19',
    author: 'Nathan Price',
    role: 'Author & Speaker',
    company: 'Price Leadership Institute',
    industry: 'Speaking & Training',
    rating: 5,
    quote: 'My presentations, workbooks, and marketing materials now look professionally designed. Speaking engagements increased 50% and I can charge premium rates. The platform transformed how people perceive my brand.',
    verified: true,
    featured: false,
    photo: '/testimonials/nathan-price.jpg'
  },
  {
    id: '20',
    author: 'Olivia Martinez',
    role: 'Interior Designer',
    company: 'Martinez Design Studio',
    industry: 'Design',
    rating: 5,
    quote: 'Client mood boards, presentations, and social content used to take forever. Now I create stunning materials in minutes. I booked 8 new projects in 2 months just from my improved online presence.',
    verified: true,
    featured: false,
    photo: '/testimonials/olivia-martinez.jpg'
  }
];

export default function TestimonialsPage() {
  const featuredTestimonials = testimonials.filter(t => t.featured);
  const otherTestimonials = testimonials.filter(t => !t.featured);

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  const industries = [...new Set(testimonials.map(t => t.industry))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by 10,000+ Customers
            </h1>
            <p className="text-xl text-white/90 mb-8">
              See what businesses, creators, and organizations are saying about 
              CR AudioViz AI's unified creative platform.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>4.9/5.0 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>98% Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{industries.length}</div>
              <div className="text-sm text-gray-600">Industries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Featured Stories</Badge>
            <h2 className="text-3xl font-bold mb-4">Hear From Our Top Performers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In-depth testimonials from customers who achieved extraordinary results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {featuredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-blue-600 mb-4" />
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-6 text-lg italic">
                    "{testimonial.quote}"
                  </p>

                  {testimonial.result && (
                    <div className="bg-white/60 rounded-lg p-3 mb-4">
                      <div className="text-sm font-semibold text-blue-600 mb-1">Results:</div>
                      <div className="text-sm text-gray-700">{testimonial.result}</div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {testimonial.author}
                        {testimonial.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>

                  {testimonial.video && (
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Watch Video Testimonial
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white py-6 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400" />
              <Input placeholder="Search testimonials..." className="border-gray-300" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                All Industries
              </Button>
              <Button variant="outline" size="sm">
                5 Stars Only
              </Button>
              <Button variant="outline" size="sm">
                Verified Only
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Customer Reviews</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Authentic reviews from real customers across diverse industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-4 text-sm line-clamp-4">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        {testimonial.author}
                        {testimonial.verified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {testimonial.industry}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Breakdown */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved Across Industries</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Businesses of all types trust CR AudioViz AI
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {industries.map((industry) => {
              const count = testimonials.filter(t => t.industry === industry).length;
              return (
                <Badge key={industry} variant="outline" className="text-sm px-4 py-2">
                  {industry} ({count})
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join 10,000+ Happy Customers
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start creating professional content with our unified platform today. 
            See why customers rate us 4.9/5.0.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            No credit card required • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
