import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, Activity, Clock } from 'lucide-react';

export default function StatusPage() {
  // Mock status data - replace with real monitoring
  const currentStatus = {
    overall: 'operational', // operational, degraded, outage
    lastUpdate: new Date().toLocaleString()
  };

  const services = [
    { name: 'Website & Dashboard', status: 'operational', uptime: '99.99%' },
    { name: 'Javari AI Assistant', status: 'operational', uptime: '99.95%' },
    { name: 'API Services', status: 'operational', uptime: '99.98%' },
    { name: 'Payment Processing', status: 'operational', uptime: '100%' },
    { name: 'Tools & Features', status: 'operational', uptime: '99.97%' },
    { name: 'Marketplace', status: 'operational', uptime: '99.96%' },
    { name: 'Game Platform', status: 'operational', uptime: '99.94%' },
    { name: 'File Storage & CDN', status: 'operational', uptime: '99.99%' }
  ];

  const recentIncidents = [
    {
      date: 'October 15, 2025',
      title: 'Scheduled Maintenance - Database Upgrade',
      status: 'resolved',
      duration: '2 hours',
      impact: 'Minor performance degradation'
    },
    {
      date: 'September 28, 2025',
      title: 'API Rate Limiting Issue',
      status: 'resolved',
      duration: '45 minutes',
      impact: 'Some API requests failed'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Service Outage';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'outage':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`py-20 ${
        currentStatus.overall === 'operational' 
          ? 'bg-gradient-to-br from-green-600 to-teal-600' 
          : currentStatus.overall === 'degraded'
          ? 'bg-gradient-to-br from-yellow-600 to-orange-600'
          : 'bg-gradient-to-br from-red-600 to-pink-600'
      } text-white`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Activity className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              System Status
            </h1>
            <div className="flex items-center justify-center space-x-3 mb-4">
              {getStatusIcon(currentStatus.overall)}
              <span className="text-2xl font-semibold">
                All Systems {getStatusText(currentStatus.overall)}
              </span>
            </div>
            <p className="text-lg opacity-90">
              Last updated: {currentStatus.lastUpdate}
            </p>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Service Status</h2>
            
            <div className="space-y-4">
              {services.map((service, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className={`text-sm ${getStatusColor(service.status)}`}>
                            {getStatusText(service.status)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{service.uptime}</p>
                        <p className="text-xs text-gray-500">30-day uptime</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Chart Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">90-Day Uptime History</h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Uptime chart visualization would go here</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>90 days ago</span>
                  <span>Today</span>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-2xl text-green-600">99.98%</div>
                    <div className="text-gray-600">Overall Uptime</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-blue-600">15ms</div>
                    <div className="text-gray-600">Avg Response</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-purple-600">2</div>
                    <div className="text-gray-600">Incidents</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-orange-600">3.5h</div>
                    <div className="text-gray-600">Total Downtime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Incidents</h2>
            
            {recentIncidents.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No incidents reported in the last 90 days</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {recentIncidents.map((incident, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{incident.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                          {incident.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{incident.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Impact</p>
                          <p className="font-semibold text-gray-900">{incident.impact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Status Updates
                  </h3>
                  <p className="text-gray-600">
                    Subscribe to receive notifications about system status changes and maintenance
                  </p>
                </div>
                <div className="max-w-md mx-auto flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            If you're experiencing issues not listed here, contact our support team
          </p>
          <a href="mailto:support@craudiovizai.com">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
