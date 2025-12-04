import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileButton } from "@/components/mobile";
import Link from "next/link";
import { MessageCircle, Mail, Phone, FileText, HelpCircle, Clock, Ticket, Bot } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-6">
            Get support from our team and Javari AI assistant
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Live Chat with Javari */}
            <Card className="hover:shadow-lg transition-all border-2 border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Chat with Javari AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get instant answers 24/7 from our AI assistant. Javari can help with most questions and escalate to humans when needed.
                </p>
                <MobileButton 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={() => {
                    const chatButton = document.querySelector("button[aria-label=\"Chat with Javari AI\"]");
                    if (chatButton) (chatButton as HTMLElement).click();
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </MobileButton>
              </CardContent>
            </Card>

            {/* Email Support */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send us an email and we will respond within 24 hours.
                </p>
                <a href="mailto:support@craudiovizai.com">
                  <MobileButton variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    support@craudiovizai.com
                  </MobileButton>
                </a>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Ticket className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Submit a Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create a support ticket for tracked assistance. Our bots will auto-assign and escalate as needed.
                </p>
                <Link href="/dashboard/support">
                  <MobileButton variant="outline" className="w-full">
                    <Ticket className="w-4 h-4 mr-2" />
                    Create Ticket
                  </MobileButton>
                </Link>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive guides, tutorials, and API documentation.
                </p>
                <Link href="/help">
                  <MobileButton variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Docs
                  </MobileButton>
                </Link>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Find quick answers to frequently asked questions.
                </p>
                <Link href="/help#faq">
                  <MobileButton variant="outline" className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    View FAQ
                  </MobileButton>
                </Link>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Javari AI:</span>
                    <span className="font-semibold text-green-600">Instant</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">24 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Tickets:</span>
                    <span className="font-semibold">4-8 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Critical:</span>
                    <span className="font-semibold text-red-600">1 hour</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="px-4 py-12 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            All Systems Operational
          </div>
          <p className="text-gray-600 mt-4">
            <a href="https://status.craudiovizai.com" className="text-blue-600 hover:underline">
              View detailed status page →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
