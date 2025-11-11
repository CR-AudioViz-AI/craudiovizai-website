import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Shield, Users, Church, PawPrint, TreePine, 
  Store, Building2, GraduationCap, MapPin, 
  DollarSign, Server, TrendingUp, Sparkles, FileText
} from 'lucide-react';

export default function CRAIversePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Crai */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Crai Image */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    {/* CRAI Avatar - Your CRAIverse Guide */}
                    <Image
                      src="/avatars/craiavatar.png"
                      alt="CRAI - Your CRAIverse Guide"
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Welcome to CRAIverse
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-4">
                  Meet <span className="font-semibold text-white">Crai</span> - Your Guide to Social Impact
                </p>
                <p className="text-lg text-blue-100 mb-8">
                  20+ specialized modules connecting communities, businesses, and causes. 
                  From supporting first responders to building small businesses, CRAIverse 
                  makes real social impact possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
                    Explore Modules
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    View Grants ($600M+)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Funding Banner */}
      <section className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <DollarSign className="w-8 h-8" />
              <div>
                <p className="font-bold text-xl">$600M+ in Grant Funding Available</p>
                <p className="text-green-100 text-sm">For First Responders, Military Families, Animal Rescue & More</p>
              </div>
            </div>
            <Button className="bg-white text-green-600 hover:bg-green-50">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Impact Modules
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built solutions for communities that need them most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* First Responders Haven */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-blue-500">
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-3" />
                <CardTitle className="text-xl">First Responders Haven</CardTitle>
                <CardDescription>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    $400M+ Grants Available
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Mental health support for police, fire, EMS, and military. Anonymous peer support groups and professional resources.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Anonymous support groups</li>
                  <li>✓ Professional counseling</li>
                  <li>✓ Peer-to-peer networking</li>
                  <li>✓ Grant-funded access</li>
                </ul>
              </CardContent>
            </Card>

            {/* Together Anywhere */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-purple-500">
              <CardHeader>
                <Heart className="w-12 h-12 text-purple-600 mb-3" />
                <CardTitle className="text-xl">Together Anywhere</CardTitle>
                <CardDescription>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    $200M+ Grants Available
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Virtual spaces for military families and long-distance relationships. Stay connected no matter the distance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Shared virtual spaces</li>
                  <li>✓ Video calls & messaging</li>
                  <li>✓ Family event planning</li>
                  <li>✓ Military family resources</li>
                </ul>
              </CardContent>
            </Card>

            {/* Faith Communities */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-yellow-500">
              <CardHeader>
                <Church className="w-12 h-12 text-yellow-600 mb-3" />
                <CardTitle className="text-xl">Faith Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Tools for churches, mosques, temples, and synagogues. Virtual services, community management, and donations.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Live streaming services</li>
                  <li>✓ Member management</li>
                  <li>✓ Online giving tools</li>
                  <li>✓ Event coordination</li>
                </ul>
              </CardContent>
            </Card>

            {/* Animal Rescue Network */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-500">
              <CardHeader>
                <PawPrint className="w-12 h-12 text-green-600 mb-3" />
                <CardTitle className="text-xl">Animal Rescue Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect shelters, rescues, and adopters. Manage adoptions, volunteers, and donations in one place.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Adoption management</li>
                  <li>✓ Volunteer coordination</li>
                  <li>✓ Donation tracking</li>
                  <li>✓ Pet profiles & matching</li>
                </ul>
              </CardContent>
            </Card>

            {/* Memorial Walls & Genealogy */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-indigo-500">
              <CardHeader>
                <TreePine className="w-12 h-12 text-indigo-600 mb-3" />
                <CardTitle className="text-xl">Memorial Walls & Genealogy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Digital tributes, family trees, and legacy preservation. Share stories and honor loved ones forever.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Interactive family trees</li>
                  <li>✓ Digital memorial pages</li>
                  <li>✓ Story & photo sharing</li>
                  <li>✓ Legacy preservation</li>
                </ul>
              </CardContent>
            </Card>

            {/* Small Business Accelerator */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-orange-500">
              <CardHeader>
                <Store className="w-12 h-12 text-orange-600 mb-3" />
                <CardTitle className="text-xl">Small Business Accelerator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete toolkit for small businesses: marketing automation, CRM, website builder, and growth tools.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Marketing automation</li>
                  <li>✓ CRM & customer tracking</li>
                  <li>✓ Website & landing pages</li>
                  <li>✓ Analytics & insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              View All 20+ Modules
            </Button>
          </div>
        </div>
      </section>

      {/* All Modules Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All CRAIverse Modules
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Click any module to learn more
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {[
              { name: 'First Responders Haven', icon: <Shield className="w-6 h-6" />, color: 'blue' },
              { name: 'Together Anywhere', icon: <Heart className="w-6 h-6" />, color: 'purple' },
              { name: 'Faith Communities', icon: <Church className="w-6 h-6" />, color: 'yellow' },
              { name: 'Animal Rescue Network', icon: <PawPrint className="w-6 h-6" />, color: 'green' },
              { name: 'Memorial Walls', icon: <TreePine className="w-6 h-6" />, color: 'indigo' },
              { name: 'Small Business', icon: <Store className="w-6 h-6" />, color: 'orange' },
              { name: 'Collector Communities', icon: <Users className="w-6 h-6" />, color: 'pink' },
              { name: 'Teen Safe Social', icon: <Heart className="w-6 h-6" />, color: 'cyan' },
              { name: 'Senior Connection', icon: <Heart className="w-6 h-6" />, color: 'rose' },
              { name: 'OnlyAvatars', icon: <Sparkles className="w-6 h-6" />, color: 'violet' },
              { name: 'Geographic Targeting', icon: <MapPin className="w-6 h-6" />, color: 'red' },
              { name: 'Affiliate Marketplace', icon: <DollarSign className="w-6 h-6" />, color: 'emerald' },
              { name: 'Web Hosting Partners', icon: <Server className="w-6 h-6" />, color: 'slate' },
              { name: 'Business Directory', icon: <Building2 className="w-6 h-6" />, color: 'amber' },
              { name: 'Avatar Dating', icon: <Heart className="w-6 h-6" />, color: 'fuchsia' },
              { name: 'Trending Products', icon: <TrendingUp className="w-6 h-6" />, color: 'lime' },
              { name: 'Meme Generator', icon: <Sparkles className="w-6 h-6" />, color: 'sky' },
              { name: 'Grant Management', icon: <FileText className="w-6 h-6" />, color: 'teal' },
              { name: 'Asset Library', icon: <Building2 className="w-6 h-6" />, color: 'stone' },
              { name: 'Creator Marketplace', icon: <Store className="w-6 h-6" />, color: 'zinc' },
            ].map((module) => (
              <Card key={module.name} className={`hover:shadow-lg transition-all cursor-pointer hover:border-${module.color}-500`}>
                <CardContent className="p-4 text-center">
                  <div className={`text-${module.color}-600 mb-2 flex justify-center`}>
                    {module.icon}
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{module.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Dashboard Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              CRAIverse Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access all modules, manage your communities, and track your impact
            </p>
          </div>

          {/* Placeholder for embedded dashboard */}
          <div className="bg-gray-50 rounded-xl shadow-lg p-8 min-h-[500px]">
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                CRAIverse Dashboard Integration Point
              </h3>
              <p className="text-gray-500 mb-4">
                This is where we'll embed your CRAIverse dashboard
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-purple-900 font-semibold mb-2">
                  📋 TODO: Embed CRAIverse Dashboard
                </p>
                <ul className="text-sm text-purple-800 text-left space-y-1">
                  <li>• All 20+ modules accessible from one interface</li>
                  <li>• Module-specific features and tools</li>
                  <li>• Grant tracking and application management</li>
                  <li>• Community management features</li>
                  <li>• Analytics and impact reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join communities making a real difference. Access grant funding and connect with others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg">
              Get Started Free
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
