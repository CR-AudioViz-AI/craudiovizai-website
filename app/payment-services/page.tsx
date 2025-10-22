import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield, AlertCircle, CheckCircle, FileText, DollarSign } from 'lucide-react';
import Image from 'next/image';

export default function PaymentServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Payment Services & Disclosures
            </h1>
            <p className="text-xl text-blue-100">
              Important information about how we process payments and protect your transactions
            </p>
          </div>
        </div>
      </section>

      {/* Payment Processors Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Our Payment Processors
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              CR AudioViz AI partners with industry-leading payment processors to ensure secure, 
              reliable transactions. We do not store your payment information on our servers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Stripe */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {/* Stripe logo placeholder */}
                    <div className="w-32 h-12 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xl">Stripe</span>
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl">Credit & Debit Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>PCI DSS Level 1 Certified</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Accepts Visa, Mastercard, Amex, Discover</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>3D Secure authentication</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Bank-level encryption</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {/* PayPal logo placeholder */}
                    <div className="w-32 h-12 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xl">PayPal</span>
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl">PayPal Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>PayPal Buyer Protection</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Pay with PayPal balance or linked accounts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>No payment details shared with merchants</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Secure checkout process</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stripe Disclosure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  Stripe Payment Processing Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Payment Processing</h3>
                  <p className="text-sm">
                    Card payments are processed by Stripe, Inc., a third-party payment processor. 
                    When you make a payment using a credit or debit card, your payment information 
                    is transmitted directly to Stripe and is not stored on our servers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Stripe's Services</h3>
                  <p className="text-sm mb-2">
                    By making a payment through Stripe, you agree to be bound by:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>
                      <a href="https://stripe.com/legal/consumer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                        Stripe Services Agreement
                      </a>
                    </li>
                    <li>
                      <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                        Stripe Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Data Security</h3>
                  <p className="text-sm">
                    Stripe maintains PCI DSS Level 1 certification, the highest level of security 
                    certification in the payment card industry. Your payment data is encrypted using 
                    industry-standard protocols and never stored on our servers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Dispute Resolution</h3>
                  <p className="text-sm">
                    If you have questions or disputes regarding a charge processed through Stripe, 
                    you may contact us at support@craudiovizai.com or contact Stripe directly. 
                    Credit card disputes (chargebacks) should be initiated through your card issuer.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Learn More About Stripe
                  </p>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div>
                      Website:{' '}
                      <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                        https://stripe.com
                      </a>
                    </div>
                    <div>
                      Support:{' '}
                      <a href="https://support.stripe.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                        https://support.stripe.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PayPal Disclosure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  PayPal Payment Processing Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Payment Processing</h3>
                  <p className="text-sm">
                    PayPal payments are processed by PayPal Holdings, Inc., a third-party payment processor. 
                    When you make a payment using PayPal, you are redirected to PayPal's secure checkout 
                    and your payment information is handled entirely by PayPal.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">PayPal's Agreements</h3>
                  <p className="text-sm mb-2">
                    By making a payment through PayPal, you agree to be bound by:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>
                      <a href="https://www.paypal.com/us/legalhub/useragreement-full" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                        PayPal User Agreement
                      </a>
                    </li>
                    <li>
                      <a href="https://www.paypal.com/us/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                        PayPal Privacy Statement
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Buyer Protection</h3>
                  <p className="text-sm">
                    PayPal offers Purchase Protection for eligible purchases. This may cover you if an 
                    item doesn't arrive or doesn't match the seller's description. Specific terms and 
                    eligibility criteria apply. Please review PayPal's Buyer Protection policy for details.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Recurring Payments</h3>
                  <p className="text-sm">
                    If you subscribe to our services using PayPal, you authorize PayPal to automatically 
                    charge your account for recurring subscription fees. You can cancel recurring payments 
                    at any time through your PayPal account settings or by contacting us.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Dispute Resolution</h3>
                  <p className="text-sm">
                    If you have questions or disputes regarding a PayPal payment, you should first contact 
                    us at support@craudiovizai.com. You may also open a dispute through PayPal's Resolution 
                    Center within 180 days of the transaction.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    Learn More About PayPal
                  </p>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div>
                      Website:{' '}
                      <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                        https://www.paypal.com
                      </a>
                    </div>
                    <div>
                      Support:{' '}
                      <a href="https://www.paypal.com/us/smarthelp/home" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                        https://www.paypal.com/us/smarthelp/home
                      </a>
                    </div>
                    <div>
                      Resolution Center:{' '}
                      <a href="https://www.paypal.com/disputes/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">
                        https://www.paypal.com/disputes/
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* General Payment Terms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              General Payment Terms
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Billing and Charges
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm space-y-2">
                  <p>• Subscription fees are billed in advance on a recurring basis (monthly or annually)</p>
                  <p>• All prices are in USD unless otherwise stated</p>
                  <p>• You authorize us to charge your payment method for all fees you incur</p>
                  <p>• Failed payments may result in service suspension</p>
                  <p>• We reserve the right to change prices with 30 days' notice</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                    Refunds and Cancellations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm space-y-2">
                  <p>• 14-day money-back guarantee on initial subscriptions</p>
                  <p>• No refunds for partial months or unused credits unless required by law</p>
                  <p>• Cancellations take effect at the end of the current billing period</p>
                  <p>• To request a refund, contact support@craudiovizai.com within 14 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Taxes and Fees
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm space-y-2">
                  <p>• Prices do not include applicable taxes or payment processing fees</p>
                  <p>• You are responsible for all applicable taxes on your purchases</p>
                  <p>• Sales tax/VAT will be calculated and added at checkout when applicable</p>
                  <p>• Payment processor fees may apply based on your payment method</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    Security and Fraud Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm space-y-2">
                  <p>• We do not store complete payment information on our servers</p>
                  <p>• All transactions are monitored for fraud</p>
                  <p>• Report unauthorized charges immediately to support@craudiovizai.com</p>
                  <p>• We may verify your identity for large or suspicious transactions</p>
                  <p>• You are responsible for maintaining the security of your account</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Rights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Your Rights as a Customer
            </h2>
            
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to clear disclosure of all fees and charges before payment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to cancel recurring subscriptions at any time</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to request refunds within our stated refund policy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to dispute charges through your payment processor</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to secure and encrypted payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to access transaction history and receipts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Right to customer support for payment-related issues</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions About Payments?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is here to help with any payment-related questions or issues
          </p>
          <a href="mailto:support@craudiovizai.com">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Contact Support
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
