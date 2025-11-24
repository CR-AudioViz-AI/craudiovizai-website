import { Card, CardContent } from '@/components/ui/card';
import { MobileButton } from '@/components/mobile';
import { Scale, FileText, Shield, Eye, Mail } from 'lucide-react';
import Link from 'next/link';

const legalDocs = [
  { icon: FileText, name: 'Terms of Service', description: 'Our terms and conditions', link: '/terms', updated: 'Oct 22, 2025' },
  { icon: Shield, name: 'Privacy Policy', description: 'How we handle your data', link: '/privacy', updated: 'Oct 22, 2025' },
  { icon: Eye, name: 'Cookie Policy', description: 'How we use cookies', link: '/cookies', updated: 'Oct 22, 2025' },
  { icon: Scale, name: 'Acceptable Use', description: 'Platform usage guidelines', link: '/acceptable-use', updated: 'Oct 22, 2025' },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Legal Information
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8">
              Our policies and legal documentation
            </p>
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="px-4 py-12 md:py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {legalDocs.map((doc) => {
                const Icon = doc.icon;
                return (
                  <Link key={doc.name} href={doc.link}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-4 md:p-6">
                        <Icon className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mb-3 md:mb-4" />
                        <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg">{doc.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-2">{doc.description}</p>
                        <p className="text-xs text-gray-400">Updated: {doc.updated}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-12 md:py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto text-center">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Legal Questions?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Contact our legal team for any questions
          </p>
          <Link href="/contact?subject=Legal" className="inline-block">
            <MobileButton size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Contact Legal Team
            </MobileButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
