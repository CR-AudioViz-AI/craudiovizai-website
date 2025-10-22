import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

// This would come from your database - apps marked as "coming soon"
const getComingSoonApps = async () => {
  // TODO: Connect to Supabase to fetch apps where status = 'coming_soon'
  // For now, returning mock data structure
  return [
    {
      id: 1,
      title: 'Website Builder',
      description: 'Build professional websites without coding',
      icon: '🌐',
      category: 'Website & Development'
    },
    {
      id: 2,
      title: 'Logo Maker',
      description: 'Create stunning logos with AI assistance',
      icon: '🎨',
      category: 'Design & Branding'
    },
    {
      id: 3,
      title: 'Video Editor',
      description: 'Professional video editing made simple',
      icon: '🎬',
      category: 'Video & Audio'
    }
  ];
};

// This would come from your database - testimonials marked to appear on home
const getFeaturedTestimonials = async () => {
  // TODO: Connect to Supabase to fetch testimonials where show_on_home = true
  // For now, returning empty array (section won't appear)
  return [];
};

export default async function HomePage() {
  const comingSoonApps = await getComingSoonApps();
  const testimonials = await getFeaturedTestimonials();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-navy-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Story. Our Design.
            </h1>
            
            {/* Javari Introduction - Small text from screenshot */}
            <div className="mb-8 text-lg md:text-xl text-blue-100">
              <p className="mb-2">
                Meet <span className="font-semibold text-white">Javari</span> - Your AI Master Builder
              </p>
              <p className="text-base md:text-lg">
                Just tell Javari what you want to create, and watch it come to life. 
                Build websites, apps, and games with AI-powered tools. No coding required.
              </p>
            </div>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/solutions">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold">
                  Start Building
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Coming Soon Apps */}
      {comingSoonApps.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Exciting new tools and features on the horizon
              </p>
            </div>

            {/* 3 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {comingSoonApps.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-4xl mb-2">{app.icon}</div>
                    <CardTitle className="text-xl">{app.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {app.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{app.description}</p>
                    <div className="mt-4">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CRAIverse Teaser Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Crai Image (Blonde Woman) */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
                  {/* TODO: Add actual Crai image - blonde woman from uploaded assets */}
                  <Image
                    src="/images/crai-avatar.png"
                    alt="Crai - Your CRAIverse Guide"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Welcome to CRAIverse
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  A revolutionary platform connecting communities, businesses, and causes. 
                  From supporting first responders to building small businesses, CRAIverse 
                  offers 20+ specialized modules designed to make a real social impact.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Support First Responders & Military Families</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Build Faith Communities & Memorial Spaces</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Access $600M+ in Grant Funding</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Launch Print-on-Demand Products in Minutes</span>
                  </li>
                </ul>
                <Link href="/craiverse">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Explore CRAIverse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Only shows if testimonials exist */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of creators building amazing things
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial: any) => (
                <Card key={testimonial.id} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                    <div className="flex mt-4 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Platform Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600 mt-2">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">1,200+</div>
                <div className="text-gray-600 mt-2">Games</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">60+</div>
                <div className="text-gray-600 mt-2">Creative Tools</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">$600M+</div>
                <div className="text-gray-600 mt-2">Grants Available</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
