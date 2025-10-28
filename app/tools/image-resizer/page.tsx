// CR AUDIOVIZ AI - Image Resizer Tool
// Session: 2025-10-25 - Phase 4
// Purpose: Example creative tool showing the standard pattern for all 60+ tools

'use client';

import { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAnalytics } from '@/lib/analytics';
import { useNotificationHelpers } from '@/components/NotificationSystem';

// Safe notification helper that works during SSR
function useSafeNotificationHelpers() {
  try {
    return useNotificationHelpers();
  } catch (error) {
    // Return no-op functions during SSR
    return {
      showSuccess: () => {},
      showError: () => {},
      showInfo: () => {},
      showWarning: () => {}
    };
  }
}
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

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [resizedImage, setResizedImage] = useState<string>('');
  const [options, setOptions] = useState<ResizeOptions>({
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    quality: 90,
    format: 'jpeg'
  });
  const [processing, setProcessing] = useState(false);
  const [creditsRequired, setCreditsRequired] = useState(5);
  
  const { appUse, error: trackError } = useAnalytics();
  const { success, error, warning } = useNotificationHelpers();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      error('Invalid File', 'Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      error('File Too Large', 'Maximum file size is 10MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);

    success('File Loaded', 'Image ready to resize');
  };

  const handleResize = async () => {
    if (!file) {
      warning('No File', 'Please select an image first');
      return;
    }

    setProcessing(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      // Call API
      const response = await fetch('/api/tools/image-resizer', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resize image');
      }

      const data = await response.json();

      // Set resized image
      setResizedImage(data.imageUrl);
      
      // Track usage
      appUse('image-resizer', creditsRequired);
      
      success('Image Resized!', `Used ${creditsRequired} credits`);

    } catch (err: any) {
      console.error('Resize error:', err);
      error('Resize Failed', err.message);
      trackError(err.message, 'image_resizer');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `resized-image.${options.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Downloaded!', 'Image saved to your device');
  };

  const resetTool = () => {
    setFile(null);
    setPreview('');
    setResizedImage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-3">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Image Resizer</h1>
                <p className="text-gray-600 mt-1">Resize images while maintaining quality</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <p className="text-sm text-blue-900 font-medium">
                {creditsRequired} credits per resize
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
              
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  </div>
                  <button
                    onClick={resetTool}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Choose Different Image
                  </button>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resize Options</h2>
              
              <div className="space-y-4">
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={options.width}
                      onChange={(e) => setOptions({...options, width: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={options.height}
                      onChange={(e) => setOptions({...options, height: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aspectRatio"
                    checked={options.maintainAspectRatio}
                    onChange={(e) => setOptions({...options, maintainAspectRatio: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="aspectRatio" className="text-sm text-gray-700">
                    Maintain aspect ratio
                  </label>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {options.quality}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={options.quality}
                    onChange={(e) => setOptions({...options, quality: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Format
                  </label>
                  <select
                    value={options.format}
                    onChange={(e) => setOptions({...options, format: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              </div>

              {/* Resize Button */}
              <ButtonLoading
                loading={processing}
                loadingText="Resizing..."
                onClick={handleResize}
                disabled={!file || processing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resize Image ({creditsRequired} credits)
              </ButtonLoading>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Result</h2>
              
              {!resizedImage ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">
                    Resized image will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={resizedImage}
                      alt="Resized"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-lg px-3 py-1 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About This Tool</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Supports JPEG, PNG, and WebP formats</li>
                <li>• Maintain aspect ratio for perfect proportions</li>
                <li>• Adjustable quality settings</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Fast processing with high-quality output</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        show={processing}
        text="Resizing your image..."
        progress={undefined}
      />
    </div>
  );
}
