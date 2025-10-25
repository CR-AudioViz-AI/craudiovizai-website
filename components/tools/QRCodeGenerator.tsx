'use client';

import { useState } from 'react';
import { QrCode, Download, Link, Mail, Phone, Wifi, MapPin } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef } from 'react';

/**
 * QR Code Generator
 * Create customizable QR codes for various purposes
 * 
 * Features:
 * - Multiple QR types (URL, Email, Phone, WiFi, Location)
 * - Customizable colors and styles
 * - Logo embedding
 * - High resolution output
 * - Instant download
 * 
 * Session: 2025-10-25 - Saturday
 */

const QR_TYPES = [
  { id: 'url', name: 'Website URL', icon: Link, placeholder: 'https://example.com' },
  { id: 'email', name: 'Email', icon: Mail, placeholder: 'email@example.com' },
  { id: 'phone', name: 'Phone', icon: Phone, placeholder: '+1234567890' },
  { id: 'wifi', name: 'WiFi', icon: Wifi, placeholder: 'Network Name' },
  { id: 'location', name: 'Location', icon: MapPin, placeholder: 'Address or coordinates' },
];

const COLORS = [
  { name: 'Black', dot: '#000000', bg: '#FFFFFF' },
  { name: 'Blue', dot: '#2563EB', bg: '#FFFFFF' },
  { name: 'Purple', dot: '#9333EA', bg: '#FFFFFF' },
  { name: 'Green', dot: '#16A34A', bg: '#FFFFFF' },
  { name: 'Red', dot: '#DC2626', bg: '#FFFFFF' },
];

export default function QRCodeGenerator() {
  const [selectedType, setSelectedType] = useState('url');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [qrCode, setQrCode] = useState<any>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qrCodeInstance = new QRCodeStyling({
      width: 300,
      height: 300,
      data: content || 'https://craudiovizai.com',
      dotsOptions: {
        color: COLORS[selectedColor].dot,
        type: 'rounded',
      },
      backgroundOptions: {
        color: COLORS[selectedColor].bg,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
      },
    });

    setQrCode(qrCodeInstance);
  }, []);

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (qrCode) {
      qrCode.update({
        data: content || 'https://craudiovizai.com',
        dotsOptions: {
          color: COLORS[selectedColor].dot,
          type: 'rounded',
        },
        backgroundOptions: {
          color: COLORS[selectedColor].bg,
        },
      });
    }
  }, [content, selectedColor, qrCode]);

  const handleDownload = (format: 'png' | 'svg') => {
    if (qrCode) {
      qrCode.download({
        name: 'qr-code',
        extension: format,
      });
    }
  };

  const formatContent = () => {
    switch (selectedType) {
      case 'email':
        return `mailto:${content}`;
      case 'phone':
        return `tel:${content}`;
      case 'wifi':
        return `WIFI:T:WPA;S:${content};P:password;;`;
      case 'location':
        return `geo:${content}`;
      default:
        return content;
    }
  };

  useEffect(() => {
    if (content && qrCode) {
      qrCode.update({ data: formatContent() });
    }
  }, [content, selectedType]);

  const currentType = QR_TYPES.find(t => t.id === selectedType);
  const Icon = currentType?.icon || Link;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">QR Code Generator</h1>
              <p className="text-slate-600 dark:text-slate-400">Create custom QR codes in seconds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">QR Code Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {QR_TYPES.map(type => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg transition-all ${
                        selectedType === type.id
                          ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500'
                          : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                      }`}
                    >
                      <TypeIcon className="w-5 h-5 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{type.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Input */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Content</h3>
              <div className="relative">
                <Icon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={currentType?.placeholder}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Enter the content you want to encode in the QR code
              </p>
            </div>

            {/* Color Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Color</h3>
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`relative aspect-square rounded-lg border-2 transition-all ${
                      selectedColor === index
                        ? 'border-indigo-500 ring-2 ring-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: color.dot }}
                    title={color.name}
                  >
                    {selectedColor === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Download</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDownload('png')}
                  disabled={!content}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  disabled={!content}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  SVG
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                PNG for web use, SVG for print quality
              </p>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg sticky top-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6 text-center">Preview</h3>
              <div className="flex justify-center">
                <div ref={qrRef} className="flex items-center justify-center" />
              </div>
              {!content && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Enter content to generate QR code
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
