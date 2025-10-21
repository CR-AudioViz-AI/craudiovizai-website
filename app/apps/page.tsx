export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <a href="/" className="text-gray-600 hover:text-blue-600">← Back to Home</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            60+ Creative Tools
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Everything you need to build, create, and grow your business
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">All Tools & Apps</h2>
          
          {/* Website Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🌐 Website & App Builders</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ToolCard name="Website Builder" description="Complete websites in minutes" credits={10} />
              <ToolCard name="Landing Page" description="High-converting landing pages" credits={5} />
              <ToolCard name="E-commerce Store" description="Online store with cart & checkout" credits={15} />
              <ToolCard name="Portfolio Site" description="Showcase your work beautifully" credits={8} />
            </div>
          </div>

          {/* Design Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🎨 Design & Graphics</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ToolCard name="Logo Creator" description="Professional logos instantly" credits={3} />
              <ToolCard name="Brand Kit" description="Complete brand identity" credits={10} />
              <ToolCard name="Social Graphics" description="Post templates for all platforms" credits={2} />
              <ToolCard name="Infographic Maker" description="Data visualizations" credits={5} />
            </div>
          </div>

          {/* Video Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🎬 Video & Animation</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ToolCard name="Video Editor" description="Professional video editing" credits={8} />
              <ToolCard name="Animated Explainer" description="Animated explainer videos" credits={12} />
              <ToolCard name="Slideshow Maker" description="Photo slideshows with music" credits={4} />
              <ToolCard name="Intro/Outro Creator" description="Branded video intros" credits={5} />
            </div>
          </div>

          {/* Audio Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">🎵 Audio & Music</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ToolCard name="Music Generator" description="AI-generated music tracks" credits={5} />
              <ToolCard name="Podcast Editor" description="Edit and enhance podcasts" credits={6} />
              <ToolCard name="Voiceover Studio" description="Professional voiceovers" credits={4} />
              <ToolCard name="Sound Effects" description="Custom sound effect library" credits={2} />
            </div>
          </div>

          {/* Business Tools */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">📊 Business Tools</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ToolCard name="Invoice Generator" description="Professional invoices" credits={1} />
              <ToolCard name="Proposal Builder" description="Client proposals that win" credits={3} />
              <ToolCard name="Analytics Dashboard" description="Track your metrics" credits={5} />
              <ToolCard name="CRM System" description="Manage customers" credits={10} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with 50 free credits. No credit card required.
          </p>
          
            href="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
          >
            Start Building Free
          </a>
        </div>
      </section>
    </div>
  )
}

function ToolCard({ name, description, credits }: { name: string; description: string; credits: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h4 className="font-bold text-lg mb-2">{name}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-bold">{credits} credits</span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Use Tool
        </button>
      </div>
    </div>
  )
}
