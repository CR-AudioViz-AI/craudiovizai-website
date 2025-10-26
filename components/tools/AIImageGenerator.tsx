'use client';

import { useState } from 'react';
import { Wand2, Download, Loader2, ImageIcon, RefreshCw, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

/**
 * AI Image Generator
 * Create stunning AI-generated images from text prompts
 * 
 * Features:
 * - Multiple AI models (DALL-E, Stable Diffusion)
 * - Style presets
 * - Aspect ratio selection
 * - High resolution output
 * - Download functionality
 * - Gallery of generations
 * 
 * Session: 2025-10-25 - Saturday
 */

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  created_at: Date;
}

const STYLES = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic imagery' },
  { id: 'artistic', name: 'Artistic', description: 'Painterly and expressive' },
  { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
  { id: 'digital-art', name: 'Digital Art', description: 'Modern digital illustration' },
  { id: '3d-render', name: '3D Render', description: 'Three-dimensional rendering' },
  { id: 'oil-painting', name: 'Oil Painting', description: 'Classic oil painting style' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor aesthetic' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn sketch style' },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square', width: 1024, height: 1024 },
  { id: '16:9', name: 'Landscape', width: 1792, height: 1024 },
  { id: '9:16', name: 'Portrait', width: 1024, height: 1792 },
  { id: '4:3', name: 'Standard', width: 1536, height: 1152 },
];

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [numImages, setNumImages] = useState(1);
  
  const supabase = createClient();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const ratio = ASPECT_RATIOS.find(r => r.id === selectedRatio);
      
      const response = await fetch('/api/tools/image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          aspect_ratio: selectedRatio,
          width: ratio?.width,
          height: ratio?.height,
          quality,
          num_images: numImages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();

      const newImages: GeneratedImage[] = data.images.map((url: string, index: number) => ({
        id: `${Date.now()}_${index}`,
        url,
        prompt: prompt.trim(),
        style: selectedStyle,
        created_at: new Date(),
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);
      setCurrentImage(newImages[0]);

    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `craudioviz-ai-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Image Generator</h1>
              <p className="text-slate-600 dark:text-slate-400">Create stunning images from text descriptions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prompt */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Describe Your Image</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene landscape with mountains and a lake at sunset..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
              />
            </div>

            {/* Style Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedStyle === style.id
                        ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{style.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Aspect Ratio</h3>
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedRatio === ratio.id
                        ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{ratio.id}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ratio.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">Advanced Settings</h3>
                <Settings className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as 'standard' | 'hd')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option value="standard">Standard (10 credits)</option>
                      <option value="hd">HD (20 credits)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Number of Images
                    </label>
                    <select
                      value={numImages}
                      onChange={(e) => setNumImages(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option value={1}>1 image</option>
                      <option value={2}>2 images</option>
                      <option value={4}>4 images</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Preview & Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Image */}
            {currentImage ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.prompt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">{currentImage.prompt}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownload(currentImage)}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Images Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter a prompt and click generate to create your first image
                </p>
              </div>
            )}

            {/* Gallery */}
            {generatedImages.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Generations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {generatedImages.map(image => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImage(image)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage?.id === image.id
                          ? 'border-purple-500 ring-2 ring-purple-300'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
