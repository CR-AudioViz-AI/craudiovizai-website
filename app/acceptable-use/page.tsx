import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Scale,
  Users,
  Lock,
  Ban,
  FileWarning,
  Mail
} from 'lucide-react';
import Link from 'next/link';

/**
 * Acceptable Use Policy Page
 * Defines acceptable and prohibited uses of the CR AudioViz AI platform
 * 
 * Created: October 31, 2025
 * Last Updated: October 31, 2025
 */

export default function AcceptableUsePage() {
  const lastUpdated = 'October 31, 2025';
  const effectiveDate = 'October 31, 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Acceptable Use Policy
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Guidelines for appropriate and responsible use of our platform
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Badge className="bg-white/20 text-white border-white/30">
                Effective: {effectiveDate}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                Last Updated: {lastUpdated}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Scale className="w-6 h-6 text-blue-600" />
                Policy Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This Acceptable Use Policy (AUP) governs your use of CR AudioViz AI's platform, 
                services, and tools. By accessing or using our platform, you agree to comply with 
                this policy and all applicable laws and regulations.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are committed to maintaining a safe, legal, and productive environment for all 
                users. This policy outlines acceptable behaviors and explicitly prohibits activities 
                that could harm our platform, users, or third parties.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  Violations of this policy may result in immediate suspension or termination of 
                  your account, removal of content, and potential legal action.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact & Legal */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Questions or Concerns?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Acceptable Use Policy, please contact us at <a href="mailto:legal@craudiovizai.com" className="text-blue-600 hover:underline">legal@craudiovizai.com</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
