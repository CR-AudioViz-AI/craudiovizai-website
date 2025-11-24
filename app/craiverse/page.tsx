import { MobileButton } from '@/components/mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Shield, Users, Church, PawPrint, TreePine, 
  Store, Building2, GraduationCap, MapPin, 
  DollarSign, Sparkles, Globe
} from 'lucide-react';

const modules = [
  {
    id: 'first-responders',
    name: 'First Responders Haven',
    icon: Shield,
    color: 'blue',
    grants: '$400M+',
    description: 'Mental health support for police, fire, EMS, and military. Anonymous peer support groups and professional resources.',
    features: ['Anonymous support groups', 'Professional counseling', 'Peer networking', 'Grant-funded access']
  },
  {
    id: 'together-anywhere',
    name: 'Together Anywhere',
    icon: Heart,
    color: 'red',
    grants: '$50M+',
    description: 'Virtual family rooms for military families separated by deployment. Video chat, shared calendars, and memory books.',
    features: ['Video family rooms', 'Shared calendars', 'Memory books', 'Deployment support']
  },
  {
    id: 'faith-communities',
    name: 'Faith Communities',
    icon: Church,
    color: 'purple',
    grants: '$75M+',
    description: 'Digital tools for churches, temples, and religious organizations. Live streaming, donation management, and member engagement.',
    features: ['Live streaming', 'Donation management', 'Member portal', 'Event planning']
  },
  {
    id: 'animal-rescue',
    name: 'Animal Rescue Network',
    icon: PawPrint,
    color: 'orange',
    grants: '$40M+',
    description: 'Connect rescue organizations, foster families, and adopters. Track animals, manage adoptions, and coordinate volunteers.',
    features: ['Adoption matching', 'Foster network', 'Volunteer coordination', 'Medical records']
  },
  {
    id: 'green-earth',
    name: 'Green Earth Initiative',
    icon: TreePine,
    color: 'green',
    grants: '$35M+',
    description: 'Environmental projects and community gardens. Track conservation efforts, coordinate volunteers, and share resources.',
    features: ['Project tracking', 'Volunteer coordination', 'Resource sharing', 'Impact metrics']
  },
  {
    id: 'small-business',
    name: 'Small Business Hub',
    icon: Store,
    color: 'indigo',
    grants: '$25M+',
    description: 'Tools for local businesses to thrive. Inventory management, customer engagement, and marketing automation.',
    features: ['Inventory management', 'Customer CRM', 'Marketing tools', 'Financial tracking']
  }
];

export default function CRAIversePage() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Crai */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* CRAI Avatar */}
              <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48">
                  <Image
                    src="/avatars/craiavatar.png"
                    alt="CRAI - Your CRAIverse Guide"
                    width={192}
                    height={192}
                    className="rounded-full shadow-xl"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6">
                  Welcome to CRAIverse
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-3 md:mb-4">
                  Meet <span className="font-semibold text-white">Crai</span> - Your Guide to Social Impact
                </p>
                <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8">
                  20+ specialized modules connecting communities, businesses, and causes. 
                  From supporting first responders to building small businesses, CRAIverse 
                  makes real social impact possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <MobileButton 
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    Explore Modules
                  </MobileButton>
                  <MobileButton 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10"
                    icon={<DollarSign className="w-5 h-5" />}
                  >
                    View Grants ($600M+)
                  </MobileButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Funding Banner */}
      <section className="bg-green-600 text-white px-4 py-4 md:py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
            <div className="flex items-center space-x-3 text-center md:text-left">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              <div>
                <p className="font-bold text-base md:text-xl">$600M+ in Grant Funding Available</p>
                <p className="text-green-100 text-xs md:text-sm">For First Responders, Military Families, Animal Rescue & More</p>
              </div>
            </div>
            <MobileButton 
              size="sm"
              className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto"
            >
              Learn More
            </MobileButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Globe className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">20+</div>
                <div className="text-xs md:text-sm text-gray-600">Social Modules</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">$600M+</div>
                <div className="text-xs md:text-sm text-gray-600">Grant Funding</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">1M+</div>
                <div className="text-xs md:text-sm text-gray-600">People Helped</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-xs md:text-sm text-gray-600">Social Impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="px-4 py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Impact Modules
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for communities that need them most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {modules.map((module) => {
              const Icon = module.icon;
              const colors = getColorClasses(module.color);
              
              return (
                <Card 
                  key={module.id}
                  className={`hover:shadow-xl transition-all border-2 ${colors.border} hover:${colors.border}`}
                >
                  <CardHeader className="p-4 md:p-6">
                    <Icon className={`w-10 h-10 md:w-12 md:h-12 ${colors.text} mb-3`} />
                    <CardTitle className="text-lg md:text-xl">{module.name}</CardTitle>
                    <CardDescription>
                      <span className={`inline-block ${colors.bg} ${colors.text} text-xs font-semibold px-2 py-1 rounded`}>
                        {module.grants} Grants Available
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      {module.description}
                    </p>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-600 mb-4">
                      {module.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                    <Link href={`/craiverse/${module.id}`} className="block">
                      <MobileButton
                        fullWidth
                        size="sm"
                        className={`${colors.bg} ${colors.text} hover:${colors.bg} border-0`}
                      >
                        Learn More
                      </MobileButton>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* More Coming Soon */}
          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-4">
              <Sparkles className="inline w-5 h-5 text-purple-600 mr-2" />
              14 more impact modules coming soon
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join CRAIverse and connect with communities making a real difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/signup" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Get Started
              </MobileButton>
            </Link>
            <Link href="/contact?subject=CRAIverse" className="flex-1">
              <MobileButton 
                size="lg" 
                fullWidth
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Learn More
              </MobileButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
