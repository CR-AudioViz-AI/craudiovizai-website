import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Zap,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Code,
  Palette,
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  Wrench,
  Shield,
  TrendingUp,
  ArrowRight,
  Star,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

/**
 * Javari AI Page  
 * Showcasing the autonomous AI assistant with pause/play functionality
 * 
 * Created: October 31, 2025
 */

export default function JavariAIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Sparkles className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meet Javari AI
            </h1>
            <p className="text-2xl text-white/90 mb-4">
              Your Autonomous Creative Partner
            </p>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              A self-healing, continuously learning AI assistant that works alongside you to 
              bring your creative visions to life. Pause anytime to clarify, then continue 
              seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/dashboard">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Creating with Javari
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Pause/Play Feature */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              Revolutionary Feature
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Pause, Clarify, Continue</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first AI assistant with built-in workflow controls that lets you pause work, 
              add clarifications, and resume without interruption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <PauseCircle className="w-10 h-10 text-purple-600" />
                  <CardTitle className="text-2xl">Pause & Clarify</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Hit pause at any moment during work to:
                </p>
                <ul className="space-y-3">
                  {[
                    'Add missing requirements or context',
                    'Clarify ambiguous instructions',
                    'Redirect approach mid-task',
                    'Prevent wasted work on wrong assumptions',
                    'Adjust priorities in real-time'
                  ].map((item, index) => (
                    <li key={index} className="flex gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <PlayCircle className="w-10 h-10 text-blue-600" />
                  <CardTitle className="text-2xl">Resume Seamlessly</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  After clarifications, press play to continue with:
                </p>
                <ul className="space-y-3">
                  {[
                    'Full context maintained from before pause',
                    'Instant integration of new requirements',
                    'No need to restart or explain from scratch',
                    'Smart continuation from exact pause point',
                    'Zero interruption to workflow momentum'
                  ].map((item, index) => (
                    <li key={index} className="flex gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-10 h-10 text-purple-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Why This Matters</h4>
                <p className="text-gray-700 leading-relaxed">
                  Traditional AI assistants force you to either let them finish (even if they're heading 
                  in the wrong direction) or stop and start over completely. Javari's pause/play system 
                  saves time, reduces frustration, and ensures your creative vision stays on track without 
                  wasting resources on misaligned work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Creative Intelligence</h2>
            <p className="text-xl text-gray-600">
              Javari handles everything from code to content, design to deployment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Code Generation',
                description: 'Write, debug, and optimize code across multiple languages with intelligent suggestions',
                color: 'blue'
              },
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Design & Graphics',
                description: 'Create stunning visuals, illustrations, and UI designs with AI-powered tools',
                color: 'purple'
              },
              {
                icon: <Film className="w-8 h-8" />,
                title: 'Video Production',
                description: 'Edit, enhance, and produce professional videos with automated workflows',
                color: 'red'
              },
              {
                icon: <Music className="w-8 h-8" />,
                title: 'Audio Creation',
                description: 'Compose music, generate sound effects, and produce podcasts effortlessly',
                color: 'green'
              },
              {
                icon: <ImageIcon className="w-8 h-8" />,
                title: 'Image Generation',
                description: 'Create custom images, enhance photos, and generate AI art on demand',
                color: 'yellow'
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Content Writing',
                description: 'Draft articles, scripts, and marketing copy with contextual awareness',
                color: 'indigo'
              },
              {
                icon: <Wrench className="w-8 h-8" />,
                title: 'Tool Integration',
                description: 'Seamlessly connect and orchestrate all 60+ platform tools',
                color: 'orange'
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Continuous Learning',
                description: 'Adapts to your style, preferences, and workflow over time',
                color: 'pink'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Self-Healing',
                description: 'Automatically detects and fixes errors without manual intervention',
                color: 'teal'
              }
            ].map((capability, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`text-${capability.color}-600 mb-4`}>
                    {capability.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-gray-600">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How Javari Works</h2>
            <p className="text-xl text-gray-600">
              Simple workflow, powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: <MessageSquare className="w-10 h-10" />,
                title: 'Describe Your Vision',
                description: 'Tell Javari what you want to create in natural language'
              },
              {
                step: 2,
                icon: <PlayCircle className="w-10 h-10" />,
                title: 'Watch Javari Work',
                description: 'Real-time progress updates as Javari brings your idea to life'
              },
              {
                step: 3,
                icon: <PauseCircle className="w-10 h-10" />,
                title: 'Pause & Refine',
                description: 'Hit pause anytime to add feedback or clarify requirements'
              },
              {
                step: 4,
                icon: <CheckCircle2 className="w-10 h-10" />,
                title: 'Get Results',
                description: 'Receive production-ready output that matches your vision'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center text-purple-600">
                  {item.icon}
                </div>
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 mx-auto mb-3 flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Built For Creators</h2>
            <p className="text-xl text-gray-600">
              Whatever you create, Javari accelerates it
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Solo Creators & Freelancers',
                description: 'Handle client projects faster with an AI partner that never sleeps',
                benefits: ['Faster turnaround times', 'Professional quality output', 'Compete with larger teams']
              },
              {
                title: 'Small Business Owners',
                description: 'Create marketing materials, websites, and content without hiring specialists',
                benefits: ['Save on agency costs', 'Maintain brand consistency', 'Scale content production']
              },
              {
                title: 'Developers & Engineers',
                description: 'Accelerate development with intelligent code generation and debugging',
                benefits: ['Write code faster', 'Fewer bugs', 'Focus on architecture']
              },
              {
                title: 'Marketing Teams',
                description: 'Produce campaigns, content, and creative assets at scale',
                benefits: ['Consistent messaging', 'Rapid iteration', 'Data-driven optimization']
              }
            ].map((useCase, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <p className="text-gray-600">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Start Creating with Javari Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of creators who are accelerating their work with AI assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/signin">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
