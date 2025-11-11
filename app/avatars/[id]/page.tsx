import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Mail, Calendar } from 'lucide-react';

// Avatar data (matches meet-the-team)
const avatars = [
  { id: 'javari', name: 'Javari AI', role: 'Chief Technology Officer', image: '/avatars/javariavatar.png', hasImage: true, color: 'blue', description: 'Leading AI development and innovation across all CR AudioViz AI platforms.' },
  { id: 'pulse', name: 'Pulse', role: 'Code Czar & Emergency Fixer', image: '/avatars/PulseAvatar.png', hasImage: true, color: 'red', description: 'Rapid response specialist handling critical system issues and code emergencies.' },
  { id: 'aria', name: 'Aria', role: 'Chief People Officer', image: '/avatars/aria.png', hasImage: false, color: 'purple', description: 'Managing team culture, hiring, and employee development.' },
  { id: 'lexis', name: 'Lexis', role: 'Chief Legal Officer', image: '/avatars/lexis.png', hasImage: false, color: 'gray', description: 'Overseeing legal compliance, contracts, and intellectual property.' },
  { id: 'sage', name: 'Sage', role: 'Chief Financial Officer', image: '/avatars/sage.png', hasImage: false, color: 'green', description: 'Managing financial strategy, budgets, and revenue operations.' },
  { id: 'amara', name: 'Amara', role: 'Training Director', image: '/avatars/amara.png', hasImage: false, color: 'teal', description: 'Developing AI training programs and educational content.' },
  { id: 'kairo', name: 'Kairo', role: 'Chief Innovation Officer', image: '/avatars/KairoAvatar.png', hasImage: true, color: 'indigo', description: 'Driving innovation and exploring emerging AI technologies.' },
  { id: 'crai', name: 'CRAI', role: 'CRAIverse Director', image: '/avatars/craiavatar.png', hasImage: true, color: 'purple', description: 'Managing CRAIverse ecosystem and community engagement.' },
  { id: 'echo', name: 'Echo', role: 'CMO Senior VP', image: '/avatars/echo.png', hasImage: false, color: 'purple', description: 'Leading marketing strategy and brand development.' },
  { id: 'harmony', name: 'Harmony', role: 'Customer Success Officer', image: '/avatars/harmony.png', hasImage: false, color: 'pink', description: 'Ensuring customer satisfaction and success across all platforms.' },
  { id: 'scout', name: 'Scout', role: 'Intelligence Officer', image: '/avatars/ScoutAvatar.png', hasImage: true, color: 'teal', description: 'Gathering market intelligence and competitive analysis.' },
];

export default function AvatarDetailPage({ params }: { params: { id: string } }) {
  const avatar = avatars.find(a => a.id === params.id);
  
  if (!avatar) {
    notFound();
  }

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    gray: 'from-gray-500 to-gray-600',
    green: 'from-green-500 to-green-600',
    teal: 'from-teal-500 to-teal-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  }[avatar.color] || 'from-gray-500 to-gray-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link href="/meet-the-team">
          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </Link>
      </div>

      {/* Avatar Profile */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Avatar Image */}
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses} rounded-full blur-3xl opacity-30`}></div>
              <div className="relative bg-white/10 backdrop-blur rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl aspect-square">
                {avatar.hasImage ? (
                  <Image
                    src={avatar.image}
                    alt={avatar.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${colorClasses} text-white`}>
                    <div className="text-center">
                      <div className="text-8xl font-bold mb-2">
                        {avatar.name.charAt(0)}
                      </div>
                      <div className="text-lg opacity-75">Image Coming Soon</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Info */}
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">{avatar.name}</h1>
              <p className="text-2xl text-blue-200 mb-6">{avatar.role}</p>
              <p className="text-lg text-gray-300 mb-8">{avatar.description}</p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Chat with {avatar.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href="/javari">
                      <Button className={`w-full bg-gradient-to-r ${colorClasses} hover:opacity-90 text-white`}>
                        Start Conversation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Reach out to {avatar.name} for inquiries related to {avatar.role.toLowerCase()}.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Send Message
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {avatar.name} is available 24/7 through our AI-powered platform.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet More Team Members */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet More Team Members</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avatars
              .filter(a => a.id !== avatar.id)
              .slice(0, 4)
              .map((otherAvatar) => (
                <Link key={otherAvatar.id} href={`/avatars/${otherAvatar.id}`}>
                  <Card className="bg-white/10 backdrop-blur border-white/20 hover:border-white/40 transition-all cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                        {otherAvatar.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-white text-sm">{otherAvatar.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{otherAvatar.role}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
