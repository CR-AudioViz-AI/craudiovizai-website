// CR AUDIOVIZ AI - Image Resizer Tool
// Session: 2025-10-28 - Fixed for production
// Purpose: Example creative tool - CLIENT-ONLY rendering

'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/lib/analytics';
import { LoadingOverlay, ButtonLoading } from '@/components/LoadingComponents';

interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

// Force dynamic rendering (don't prerender at build time)
export const dynamic = "force-dynamic";

// Simple notification display without context
function showNotification(message: string, type: 'success' | 'error' | 'warning') {
  // Simple alert for now - can be enhanced later
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else if (type === 'warning') {
    alert(`Warning: ${message}`);
  } else {
    console.log(`Success: ${message}`);
  }
}

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [resizedImage, setResizedImage] = useState<string>('');
  const [options, setOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 90,
    format: 'jpeg'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { trackEvent } = useAnalytics();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    trackEvent('tool_file_uploaded', {
      tool_name: 'image-resizer',
      file_type: selectedFile.type,
      file_size: selectedFile.size
    });
  };

  const resizeImage = async () => {
    if (!file || !preview) {
      showNotification('Please upload an image first', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = preview;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let targetWidth = options.width;
      let targetHeight = options.height;

      if (options.maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        if (img.width > img.height) {
          targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
          targetWidth = Math.round(targetHeight * aspectRatio);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const quality = options.quality / 100;
      const mimeType = `image/${options.format}`;
      const resizedDataUrl = canvas.toDataURL(mimeType, quality);

      setResizedImage(resizedDataUrl);
      
      trackEvent('tool_action_completed', {
        tool_name: 'image-resizer',
        action: 'resize',
        original_size: `${img.width}x${img.height}`,
        new_size: `${targetWidth}x${targetHeight}`,
        format: options.format
      });

    } catch (error) {
      console.error('Resize error:', error);
      showNotification('Failed to resize image. Please try again.', 'error');
      
      trackEvent('tool_error', {
        tool_name: 'image-resizer',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.download = `resized-image.${options.format}`;
    link.href = resizedImage;
    link.click();

    trackEvent('tool_download', {
      tool_name: 'image-resizer',
      format: options.format
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Image Resizer</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Resize your images to any dimension while maintaining quality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Image</h2>
              
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-purple-400/50 rounded-lg p-8 text-center hover:border-purple-400 transition-colors bg-white/5">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-white mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Options Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Resize Options</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Width (px)</label>
                    <input
                      type="number"
                      value={options.width}
                      onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Height (px)</label>
                    <input
                      type="number"
                      value={options.height}
                      onChange={(e) => setOptions({ ...options, height: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.maintainAspectRatio}
                      onChange={(e) => setOptions({ ...options, maintainAspectRatio: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span>Maintain aspect ratio</span>
                  </label>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Quality: {options.quality}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={options.quality}
                    onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Output Format</label>
                  <select
                    value={options.format}
                    onChange={(e) => setOptions({ ...options, format: e.target.value as 'jpeg' | 'png' | 'webp' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>

                <button
                  onClick={resizeImage}
                  disabled={!file || isProcessing}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Resize Image</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Result</h2>
            
            {resizedImage ? (
              <div className="space-y-4">
                <img
                  src={resizedImage}
                  alt="Resized"
                  className="w-full rounded-lg"
                />
                <button
                  onClick={downloadImage}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Resized Image</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Your resized image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isProcessing && <LoadingOverlay message="Resizing your image..." />}
    </div>
  );
}
