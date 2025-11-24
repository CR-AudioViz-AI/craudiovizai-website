import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Shield, Users, Settings, BarChart, Database, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const adminSections = [
  { icon: Users, name: 'User Management', description: 'Manage users and permissions', link: '/admin/users', color: 'blue' },
  { icon: BarChart, name: 'Analytics', description: 'View platform statistics', link: '/admin/analytics', color: 'green' },
  { icon: Database, name: 'Content Management', description: 'Manage apps and content', link: '/admin/content', color: 'purple' },
  { icon: Settings, name: 'System Settings', description: 'Configure platform settings', link: '/admin/settings', color: 'orange' },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4 py-8 md:py-12">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-sm md:text-base text-gray-300">
              Manage your CR AudioViz AI platform
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-8 md:py-12 bg-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">10,234</div>
                  <div className="text-xs md:text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">$45.2K</div>
                  <div className="text-xs md:text-sm text-gray-600">Monthly Revenue</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">1.2M</div>
                  <div className="text-xs md:text-sm text-gray-600">API Calls</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                  <div className="text-xs md:text-sm text-gray-600">Uptime</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Sections */}
      <section className="px-4 py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link key={section.name} href={section.link}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start gap-4">
                          <Icon className={`w-10 h-10 md:w-12 md:h-12 text-${section.color}-600 flex-shrink-0`} />
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{section.name}</h3>
                            <p className="text-xs md:text-sm text-gray-600">{section.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="px-4 py-8 md:py-12 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <h3 className="font-bold text-green-800 text-sm md:text-base">All Systems Operational</h3>
                  <p className="text-xs md:text-sm text-green-700">No issues detected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
