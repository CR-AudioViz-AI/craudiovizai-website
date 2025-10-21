'use client'

import { useState } from 'react'
import { Image, Type, Sparkles, Download, ShoppingBag, Smile, TrendingUp, Zap, Share2 } from 'lucide-react'

interface MemeTemplate {
  id: string
  name: string
  imageUrl: string
  category: string
  popularity: number
}

interface PrintProduct {
  id: string
  name: string
  icon: string
  basePrice: number
  markup: number
  finalPrice: number
}

export default function MemeGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [fontSize, setFontSize] = useState(48)
  const [showPrintOptions, setShowPrintOptions] = useState(false)

  const templates: MemeTemplate[] = [
    { id: '1', name: 'Distracted Boyfriend', imageUrl: '/memes/distracted.jpg', category: 'Classic', popularity: 98 },
    { id: '2', name: 'Drake Hotline Bling', imageUrl: '/memes/drake.jpg', category: 'Classic', popularity: 97 },
    { id: '3', name: 'Expanding Brain', imageUrl: '/memes/brain.jpg', category: 'Classic', popularity: 95 },
    { id: '4', name: 'Two Buttons', imageUrl: '/memes/buttons.jpg', category: 'Classic', popularity: 93 },
    { id: '5', name: 'Change My Mind', imageUrl: '/memes/change-mind.jpg', category: 'Classic', popularity: 92 },
    { id: '6', name: 'Bernie Sanders', imageUrl: '/memes/bernie.jpg', category: 'Trending', popularity: 90 },
    { id: '7', name: 'Woman Yelling at Cat', imageUrl: '/memes/woman-cat.jpg', category: 'Classic', popularity: 94 },
    { id: '8', name: 'This Is Fine', imageUrl: '/memes/fine.jpg', category: 'Classic', popularity: 91 }
  ]

  const printProducts: PrintProduct[] = [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕', basePrice: 12.99, markup: 7.00, finalPrice: 19.99 },
    { id: 'hoodie', name: 'Hoodie', icon: '🧥', basePrice: 24.99, markup: 15.00, finalPrice: 39.99 },
    { id: 'mug', name: 'Coffee Mug', icon: '☕', basePrice: 8.99, markup: 6.00, finalPrice: 14.99 },
    { id: 'poster', name: 'Poster', icon: '🖼️', basePrice: 7.99, markup: 7.00, finalPrice: 14.99 },
    { id: 'sticker', name: 'Sticker Pack', icon: '🏷️', basePrice: 2.99, markup: 2.00, finalPrice: 4.99 },
    { id: 'phonecase', name: 'Phone Case', icon: '📱', basePrice: 9.99, markup: 5.00, finalPrice: 14.99 },
    { id: 'tote', name: 'Tote Bag', icon: '👜', basePrice: 11.99, markup: 8.00, finalPrice: 19.99 },
    { id: 'pillow', name: 'Throw Pillow', icon: '🛋️', basePrice: 15.99, markup: 9.00, finalPrice: 24.99 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Smile size={40} />
            <h1 className="text-5xl font-bold">Meme Generator & Print Shop</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Create viral memes in seconds, then instantly turn them into physical products. 
            Zero inventory, infinite possibilities, pure profit.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Sparkles className="text-yellow-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">500+</div>
                <div className="text-sm text-gray-600">Meme Templates</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Instant</div>
                <div className="text-sm text-gray-600">Meme Creation</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600">Print Products</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">40-60%</div>
                <div className="text-sm text-gray-600">Profit Margins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Image size={24} />
                Meme Templates
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`border rounded-lg p-3 cursor-pointer hover:border-yellow-500 transition ${
                      selectedTemplate?.id === template.id ? 'border-yellow-500 bg-yellow-50' : ''
                    }`}
                  >
                    <div className="bg-gray-200 rounded h-24 mb-2 flex items-center justify-center">
                      <span className="text-4xl">🖼️</span>
                    </div>
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                      <span className="text-xs text-gray-500">🔥 {template.popularity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Type size={24} />
                Customize Your Meme
              </h2>

              {/* Meme Preview */}
              <div className="bg-gray-100 rounded-lg p-8 mb-6 aspect-square flex items-center justify-center relative">
                {selectedTemplate ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-between p-4">
                    {topText && (
                      <div
                        className="text-center font-bold uppercase px-4 py-2 bg-black bg-opacity-70 rounded"
                        style={{ 
                          color: textColor, 
                          fontSize: `${fontSize}px`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {topText}
                      </div>
                    )}
                    <div className="flex-1 flex items-center justify-center text-6xl">
                      🖼️
                    </div>
                    {bottomText && (
                      <div
                        className="text-center font-bold uppercase px-4 py-2 bg-black bg-opacity-70 rounded"
                        style={{ 
                          color: textColor, 
                          fontSize: `${fontSize}px`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {bottomText}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Image size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Select a template to start creating</p>
                  </div>
                )}
              </div>

              {/* Text Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Top Text</label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Enter top text..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!selectedTemplate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bottom Text</label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Enter bottom text..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={!selectedTemplate}
                  />
                </div>
              </div>

              {/* Customization Controls */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                      disabled={!selectedTemplate}
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-24 px-2 py-1 border rounded text-sm"
                      disabled={!selectedTemplate}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                    disabled={!selectedTemplate}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  disabled={!selectedTemplate}
                  className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download
                </button>
                <button
                  disabled={!selectedTemplate}
                  className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Share
                </button>
                <button
                  disabled={!selectedTemplate}
                  onClick={() => setShowPrintOptions(!showPrintOptions)}
                  className="bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Print It
                </button>
              </div>
            </div>

            {/* Print Options */}
            {showPrintOptions && selectedTemplate && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Turn Your Meme Into Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {printProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer border-2 border-transparent hover:border-orange-500"
                    >
                      <div className="text-5xl mb-3">{product.icon}</div>
                      <h4 className="font-bold mb-2">{product.name}</h4>
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="line-through">${product.basePrice}</div>
                        <div className="text-2xl font-bold text-orange-600">${product.finalPrice}</div>
                      </div>
                      <div className="text-xs text-green-600 font-semibold mb-3">
                        Your Profit: ${product.markup.toFixed(2)}
                      </div>
                      <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition text-sm font-bold">
                        Add to Store
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-bold mb-2">📦 Print-on-Demand Benefits:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Zero inventory - products printed when ordered</li>
                    <li>✅ Automatic fulfillment and shipping</li>
                    <li>✅ Global delivery network</li>
                    <li>✅ High-quality materials guaranteed</li>
                    <li>✅ You set your own profit margins</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Complete Meme-to-Merch Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-yellow-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">500+ Templates</h3>
              <p className="text-gray-600 text-sm">
                Classic memes, trending formats, and custom upload options. Always updated with viral trends.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Type className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Customization</h3>
              <p className="text-gray-600 text-sm">
                Intuitive editor with text styling, color options, and real-time preview. No design skills needed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Store</h3>
              <p className="text-gray-600 text-sm">
                One-click product creation across 15+ items. Integrated fulfillment handles everything automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-20 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Meme Empire Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create viral content and turn it into profitable products. Join thousands of creators making money from memes.
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Create Your First Meme Free
          </button>
        </div>
      </div>
    </div>
  )
}
