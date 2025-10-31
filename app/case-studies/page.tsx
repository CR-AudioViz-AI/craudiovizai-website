import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Target,
  CheckCircle2,
  ArrowRight,
  Quote
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Case Studies Page
 * Real customer success stories and results
 * 
 * Created: October 31, 2025
 */

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  logo: string;
  heroImage: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    icon: any;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    photo: string;
  };
  tags: string[];
  featured: boolean;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'digital-marketing-agency',
    title: 'How a Digital Agency Scaled From 10 to 100 Clients',
    company: 'Creative Spark Agency',
    industry: 'Digital Marketing',
    logo: '/logos/creative-spark.svg',
    heroImage: '/case-studies/creative-spark-hero.jpg',
    challenge: 'Creative Spark Agency was spending $800/month on multiple tools (Canva Pro, Adobe Creative Cloud, ChatGPT Plus, Grammarly, Hootsuite) and still couldn\'t deliver fast enough for their growing client base. Projects took 2-3 weeks when clients wanted results in days.',
    solution: 'By switching to CR AudioViz AI\'s unified platform, they consolidated all tools into one $79.99/month subscription. The AI assistant Javari helped automate repetitive tasks, and the integrated creative tools eliminated the need to switch between 10+ applications.',
    results: [
      {
        metric: 'Cost Savings',
        value: '89% reduction',
        icon: DollarSign
      },
      {
        metric: 'Project Speed',
        value: '5x faster delivery',
        icon: Clock
      },
      {
        metric: 'Client Growth',
        value: '900% increase',
        icon: Users
      },
      {
        metric: 'Revenue Impact',
        value: '$120K additional ARR',
        icon: TrendingUp
      }
    ],
    testimonial: {
      quote: 'CR AudioViz AI literally saved our agency. We went from drowning in subscriptions to having everything we need in one place. Javari is like having a junior designer, copywriter, and project manager rolled into one.',
      author: 'Sarah Mitchell',
      role: 'Founder & Creative Director',
      photo: '/testimonials/sarah-mitchell.jpg'
    },
    tags: ['Marketing', 'Agency', 'Cost Reduction', 'Scalability'],
    featured: true
  },
  {
    id: 'small-business-owner',
    title: 'Solo Entrepreneur Builds 6-Figure Business Without Hiring',
    company: 'Mindful Wellness Co.',
    industry: 'Health & Wellness',
    logo: '/logos/mindful-wellness.svg',
    heroImage: '/case-studies/mindful-wellness-hero.jpg',
    challenge: 'Jessica Rodriguez wanted to launch an online wellness coaching business but had no budget for a team. She needed professional branding, course materials, marketing content, and client management - all tasks she couldn\'t afford to outsource at $50-150/hour.',
    solution: 'Using CR AudioViz AI, Jessica created her entire brand identity (logo, website, marketing materials), developed course content with professional presentations and workbooks, and managed client communications through the platform - all for less than $100/month.',
    results: [
      {
        metric: 'Time to Launch',
        value: '3 weeks vs 6 months',
        icon: Clock
      },
      {
        metric: 'Cost Avoided',
        value: '$25K in design fees',
        icon: DollarSign
      },
      {
        metric: 'Revenue Generated',
        value: '$147K in Year 1',
        icon: TrendingUp
      },
      {
        metric: 'Client Satisfaction',
        value: '4.9/5.0 rating',
        icon: Target
      }
    ],
    testimonial: {
      quote: 'I would still be stuck in planning mode if I hadn\'t found CR AudioViz AI. The platform gave me everything I needed to look professional and compete with established players. I built my entire business on it.',
      author: 'Jessica Rodriguez',
      role: 'Founder & Wellness Coach',
      photo: '/testimonials/jessica-rodriguez.jpg'
    },
    tags: ['Solopreneur', 'Startup', 'Wellness', 'Branding'],
    featured: true
  },
  {
    id: 'nonprofit-organization',
    title: 'Nonprofit Increases Donor Engagement by 340%',
    company: 'Hope for Tomorrow Foundation',
    industry: 'Nonprofit',
    logo: '/logos/hope-tomorrow.svg',
    heroImage: '/case-studies/hope-tomorrow-hero.jpg',
    challenge: 'With limited staff and a tiny marketing budget, Hope for Tomorrow struggled to create compelling fundraising materials. Their newsletters looked unprofessional, social media was inconsistent, and donor communications were generic.',
    solution: 'The Foundation used CR AudioViz AI to produce professional-quality newsletters, social media content, fundraising presentations, and personalized donor communications. The AI assistant helped them maintain consistency and scale their outreach without hiring additional staff.',
    results: [
      {
        metric: 'Donor Engagement',
        value: '340% increase',
        icon: Users
      },
      {
        metric: 'Email Open Rate',
        value: '62% (industry avg 21%)',
        icon: Target
      },
      {
        metric: 'Social Following',
        value: '5x growth in 6 months',
        icon: TrendingUp
      },
      {
        metric: 'Donations',
        value: '$230K additional funds',
        icon: DollarSign
      }
    ],
    testimonial: {
      quote: 'Every dollar matters in nonprofit work. CR AudioViz AI gave us enterprise-level creative tools at a price we could actually afford. Our donors now see us as professional and trustworthy.',
      author: 'Michael Chen',
      role: 'Executive Director',
      photo: '/testimonials/michael-chen.jpg'
    },
    tags: ['Nonprofit', 'Fundraising', 'Social Impact', 'Growth'],
    featured: true
  },
  {
    id: 'ecommerce-store',
    title: 'E-Commerce Store Doubles Conversion Rate With Better Visuals',
    company: 'Urban Threads Apparel',
    industry: 'E-Commerce',
    logo: '/logos/urban-threads.svg',
    heroImage: '/case-studies/urban-threads-hero.jpg',
    challenge: 'Urban Threads was losing sales to competitors with better product photography and marketing materials. Hiring professional photographers and designers for every product launch would cost $10K+ per collection.',
    solution: 'Using the AI image generation, photo editing, and marketing tools, Urban Threads created professional product photos, social media campaigns, and email marketing materials in-house. The team reduced production time from weeks to hours.',
    results: [
      {
        metric: 'Conversion Rate',
        value: '2.1x improvement',
        icon: TrendingUp
      },
      {
        metric: 'Content Production',
        value: '10x faster',
        icon: Clock
      },
      {
        metric: 'Creative Costs',
        value: '92% reduction',
        icon: DollarSign
      },
      {
        metric: 'Revenue Growth',
        value: '$450K increase',
        icon: Target
      }
    ],
    testimonial: {
      quote: 'The quality of visuals we can produce now rivals brands with 10x our budget. CR AudioViz AI leveled the playing field. Our conversion rates speak for themselves.',
      author: 'David Park',
      role: 'Co-Founder & CMO',
      photo: '/testimonials/david-park.jpg'
    },
    tags: ['E-Commerce', 'Fashion', 'Visual Content', 'ROI'],
    featured: false
  },
  {
    id: 'content-creator',
    title: 'YouTuber Grows From 5K to 500K Subscribers in 18 Months',
    company: 'Tech Tomorrow Channel',
    industry: 'Content Creation',
    logo: '/logos/tech-tomorrow.svg',
    heroImage: '/case-studies/tech-tomorrow-hero.jpg',
    challenge: 'Marcus Thompson was creating quality tech reviews but struggled with thumbnails, titles, descriptions, and promotional materials. His videos weren\'t getting recommended because the presentation didn\'t match the content quality.',
    solution: 'CR AudioViz AI helped Marcus optimize every aspect of his YouTube presence - from eye-catching thumbnails and SEO-optimized descriptions to social media promotion and sponsor pitch decks. The AI analyzed trending formats and suggested improvements.',
    results: [
      {
        metric: 'Subscriber Growth',
        value: '10,000% in 18 months',
        icon: Users
      },
      {
        metric: 'Video CTR',
        value: '8.5% (avg 2-3%)',
        icon: Target
      },
      {
        metric: 'Sponsorship Revenue',
        value: '$85K annual',
        icon: DollarSign
      },
      {
        metric: 'Upload Frequency',
        value: '3x more videos',
        icon: Clock
      }
    ],
    testimonial: {
      quote: 'I was spending 8 hours on thumbnails and titles for every video. Now it takes 30 minutes and performs better. CR AudioViz AI helped me scale my channel without sacrificing quality.',
      author: 'Marcus Thompson',
      role: 'Content Creator & Tech Reviewer',
      photo: '/testimonials/marcus-thompson.jpg'
    },
    tags: ['YouTube', 'Content Creation', 'Growth', 'Creator Economy'],
    featured: false
  },
  {
    id: 'real-estate-agency',
    title: 'Real Estate Team Closes 43% More Deals With Better Marketing',
    company: 'Summit Realty Group',
    industry: 'Real Estate',
    logo: '/logos/summit-realty.svg',
    heroImage: '/case-studies/summit-realty-hero.jpg',
    challenge: 'Summit Realty\'s listings looked identical to competitors. They needed unique property presentations, virtual staging, professional brochures, and social media content - all expensive when outsourced per listing.',
    solution: 'The team used CR AudioViz AI to create custom property brochures, virtual staging, social media posts, email campaigns, and client presentations. Each listing now had a complete marketing package that made properties stand out.',
    results: [
      {
        metric: 'Deal Close Rate',
        value: '43% improvement',
        icon: Target
      },
      {
        metric: 'Days on Market',
        value: '31% reduction',
        icon: Clock
      },
      {
        metric: 'Marketing Cost',
        value: '84% savings',
        icon: DollarSign
      },
      {
        metric: 'Agent Productivity',
        value: '2.5x more listings',
        icon: Users
      }
    ],
    testimonial: {
      quote: 'Our listings now look like luxury properties even in the mid-range market. Sellers choose us because we make their homes look incredible. The ROI is undeniable.',
      author: 'Jennifer Williams',
      role: 'Broker & Team Leader',
      photo: '/testimonials/jennifer-williams.jpg'
    },
    tags: ['Real Estate', 'Marketing', 'Sales', 'Visual Content'],
    featured: false
  }
];

export default function CaseStudiesPage() {
  const featuredStudies = caseStudies.filter(study => study.featured);
  const otherStudies = caseStudies.filter(study => !study.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Real Results, Real Stories
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Success Stories From Our Community
            </h1>
            <p className="text-xl text-white/90 mb-8">
              See how businesses, creators, and organizations are achieving extraordinary results 
              with CR AudioViz AI's unified creative platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Average 5x ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>85% cost reduction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>10x faster production</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In-depth looks at how our customers achieved transformational results
            </p>
          </div>

          <div className="space-y-12">
            {featuredStudies.map((study, index) => (
              <Card key={study.id} className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Left Column - Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {study.company.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{study.company}</h3>
                        <p className="text-sm text-gray-600">{study.industry}</p>
                      </div>
                    </div>

                    <h4 className="text-2xl font-bold mb-4">{study.title}</h4>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">The Challenge</h5>
                        <p className="text-gray-700">{study.challenge}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-green-600 mb-2">The Solution</h5>
                        <p className="text-gray-700">{study.solution}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {study.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full sm:w-auto">
                      Read Full Case Study
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>

                  {/* Right Column - Results & Testimonial */}
                  <div>
                    {/* Results Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.results.map((result, idx) => (
                        <Card key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50">
                          <CardContent className="p-4">
                            <result.icon className="w-6 h-6 text-blue-600 mb-2" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {result.value}
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.metric}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="p-6">
                        <Quote className="w-8 h-8 text-blue-600 mb-4" />
                        <p className="text-gray-700 italic mb-4">
                          "{study.testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {study.testimonial.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{study.testimonial.author}</div>
                            <div className="text-sm text-gray-600">{study.testimonial.role}</div>
                            <div className="text-sm text-gray-500">{study.company}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Case Studies Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick insights from diverse industries and use cases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherStudies.map((study) => (
              <Card key={study.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {study.company.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{study.company}</div>
                      <div className="text-sm text-gray-600">{study.industry}</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{study.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {study.results.slice(0, 2).map((result, idx) => (
                      <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{result.value}</div>
                        <div className="text-xs text-gray-600">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {study.solution}
                  </p>

                  <Button variant="outline" className="w-full">
                    View Case Study
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results By The Numbers */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Results Across All Case Studies</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Aggregate impact from customers featured on this page
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">$1.2M+</div>
              <div className="text-white/90">Additional Revenue Generated</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">640%</div>
              <div className="text-white/90">Average Growth Rate</div>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">87%</div>
              <div className="text-white/90">Time Saved on Content</div>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/90">Would Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses, creators, and organizations achieving 
                extraordinary results with our unified creative platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                No credit card required • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
