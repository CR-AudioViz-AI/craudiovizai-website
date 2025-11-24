import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Quote,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
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
    challenge: 'Creative Spark Agency was spending $800/month on multiple tools and couldn\'t deliver fast enough for their growing client base. Projects took 2-3 weeks when clients wanted results in days.',
    solution: 'By switching to CR AudioViz AI\'s unified platform, they consolidated all tools into one subscription. Javari AI automated repetitive tasks, eliminating the need to switch between 10+ applications.',
    results: [
      { metric: 'Cost Savings', value: '89% reduction', icon: DollarSign },
      { metric: 'Project Speed', value: '5x faster delivery', icon: Clock },
      { metric: 'Client Growth', value: '900% increase', icon: Users },
      { metric: 'Revenue Impact', value: '$120K additional ARR', icon: TrendingUp }
    ],
    testimonial: {
      quote: 'CR AudioViz AI literally saved our agency. We went from drowning in subscriptions to having everything we need in one place.',
      author: 'Sarah Mitchell',
      role: 'Founder & Creative Director'
    },
    tags: ['Marketing', 'Agency', 'Cost Reduction', 'Scalability'],
    featured: true
  },
  {
    id: 'solo-entrepreneur',
    title: 'Solo Entrepreneur Builds 6-Figure Business Without Hiring',
    company: 'Mindful Wellness Co.',
    industry: 'Health & Wellness',
    challenge: 'Jessica Rodriguez wanted to launch an online wellness coaching business but had no budget for a team. She needed professional branding, course materials, and marketing content.',
    solution: 'Using CR AudioViz AI, Jessica created her entire brand identity, developed course content with professional presentations, and managed client communications - all for less than $100/month.',
    results: [
      { metric: 'Time to Launch', value: '30 days', icon: Clock },
      { metric: 'Year 1 Revenue', value: '$147K', icon: DollarSign },
      { metric: 'Cost Savings', value: '$48K saved', icon: TrendingUp },
      { metric: 'Client Satisfaction', value: '4.9/5.0', icon: CheckCircle2 }
    ],
    testimonial: {
      quote: 'As a solo entrepreneur, I needed to look professional on a bootstrap budget. CR AudioViz AI gave me everything I needed to build a 6-figure business without hiring anyone.',
      author: 'Jessica Rodriguez',
      role: 'Founder'
    },
    tags: ['Solopreneur', 'Wellness', 'Bootstrap', 'Course Creation'],
    featured: true
  },
  {
    id: 'content-creator',
    title: 'YouTube Channel Grows from 5K to 500K Subscribers',
    company: 'Tech Tomorrow Channel',
    industry: 'Content Creation',
    challenge: 'Marcus Thompson\'s tech YouTube channel was stuck at 5K subscribers. His thumbnails and editing were amateurish, and producing quality content took 40+ hours per week.',
    solution: 'CR AudioViz AI\'s thumbnail creator, video editing tools, and AI scriptwriting assistant helped Marcus produce professional content in half the time while maintaining his authentic voice.',
    results: [
      { metric: 'Subscriber Growth', value: '500K gained', icon: Users },
      { metric: 'Production Time', value: '50% reduction', icon: Clock },
      { metric: 'Sponsorship Revenue', value: '$85K/year', icon: DollarSign },
      { metric: 'Video Quality', value: '10/10 rating', icon: TrendingUp }
    ],
    testimonial: {
      quote: 'My channel exploded after I started using CR AudioViz AI. The thumbnail creator alone is worth 10x the subscription price. This platform is a game-changer for creators.',
      author: 'Marcus Thompson',
      role: 'Content Creator'
    },
    tags: ['YouTube', 'Content Creation', 'Video Production', 'Growth'],
    featured: false
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Briefcase className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
              Customer Success Stories
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-green-100 mb-6 md:mb-8">
              Real results from creators who transformed their businesses with CR AudioViz AI
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">$2.4M+</div>
                <div className="text-xs md:text-sm text-gray-600">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">89%</div>
                <div className="text-xs md:text-sm text-gray-600">Average Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">5x</div>
                <div className="text-xs md:text-sm text-gray-600">Faster Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100K+</div>
                <div className="text-xs md:text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            {caseStudies.map((study) => (
              <Card 
                key={study.id}
                className={`hover:shadow-2xl transition-all ${
                  study.featured ? 'border-2 border-green-500' : ''
                }`}
              >
                {study.featured && (
                  <div className="bg-green-500 text-white px-4 py-2 text-center text-xs md:text-sm font-bold">
                    ⭐ FEATURED SUCCESS STORY
                  </div>
                )}
                
                <CardContent className="p-6 md:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {study.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {study.title}
                    </h2>
                    <div className="text-sm md:text-base text-gray-600">
                      {study.company} • {study.industry}
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                        The Challenge
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                        The Solution
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="mb-6">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">
                      Results Achieved
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {study.results.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <div 
                            key={index}
                            className="bg-green-50 rounded-lg p-4 text-center"
                          >
                            <Icon className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                              {result.value}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {result.metric}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <Quote className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm md:text-base text-gray-700 italic mb-4 leading-relaxed">
                      "{study.testimonial.quote}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        {study.testimonial.author}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {study.testimonial.role}, {study.company}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href={`/case-studies/${study.id}`} className="block">
                    <MobileButton
                      fullWidth
                      variant="outline"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Read Full Case Study
                    </MobileButton>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-green-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've transformed their businesses with CR AudioViz AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                className="bg-white text-green-600 hover:bg-green-50"
              >
                Start Free Trial
              </MobileButton>
            </Link>
            <Link href="/contact" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Talk to Sales
              </MobileButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
