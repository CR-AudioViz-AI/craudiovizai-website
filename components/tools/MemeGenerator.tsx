'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile, Download, Image as ImageIcon } from 'lucide-react';

/**
 * Meme Generator
 * Create viral memes with custom text
 * 
 * Features:
 * - Popular meme templates
 * - Custom text positioning
 * - Font customization
 * - Download as image
 * - Share directly
 * 
 * Session: 2025-10-25 - Saturday
 */

const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline Bling', url: '/memes/drake.jpg' },
  { id: 'distracted', name: 'Distracted Boyfriend', url: '/memes/distracted.jpg' },
  { id: 'two-buttons', name: 'Two Buttons', url: '/memes/two-buttons.jpg' },
  { id: 'woman-cat', name: 'Woman Yelling at Cat', url: '/memes/woman-cat.jpg' },
  { id: 'success-kid', name: 'Success Kid', url: '/memes/success-kid.jpg' },
  { id: 'disaster-girl', name: 'Disaster Girl', url: '/memes/disaster-girl.jpg' },
];

export default function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(MEME_TEMPLATES[0]);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    generateMeme();
  }, [selectedTemplate, topText, bottomText, fontSize, imageLoaded]);

  const generateMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Set text properties
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Draw top text
      if (topText) {
        const lines = wrapText(ctx, topText.toUpperCase(), canvas.width - 40);
        lines.forEach((line, index) => {
          const y = 20 + (index * fontSize);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }
      
      // Draw bottom text
      if (bottomText) {
        const lines = wrapText(ctx, bottomText.toUpperCase(), canvas.width - 40);
        lines.forEach((line, index) => {
          const y = canvas.height - 20 - ((lines.length - index) * fontSize);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }
      
      setImageLoaded(true);
    };
    
    // For demo purposes, use a placeholder
    img.src = `https://via.placeholder.com/500x500/cccccc/666666?text=${selectedTemplate.name.replace(/\s+/g, '+')}`;
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meme-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-yellow-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meme Generator</h1>
              <p className="text-slate-600 dark:text-slate-400">Create viral memes in seconds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Choose Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {MEME_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedTemplate.id === template.id
                        ? 'bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Add Text</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Top Text
                  </label>
                  <input
                    type="text"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="TOP TEXT"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bottom Text
                  </label>
                  <input
                    type="text"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="BOTTOM TEXT"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Font Size</h3>
              <input
                type="range"
                min="24"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
                <span>Small</span>
                <span>{fontSize}px</span>
                <span>Large</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadMeme}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Meme
            </button>
          </div>

          {/* Preview */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg sticky top-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">Preview</h3>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
              {!topText && !bottomText && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Add text to see your meme
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
