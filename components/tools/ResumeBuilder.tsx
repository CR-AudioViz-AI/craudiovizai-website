'use client';

import { useState } from 'react';
import { FileText, Download, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

/**
 * Resume Builder
 * Create professional resumes with AI assistance
 * 
 * Features:
 * - Multiple professional templates
 * - AI-powered content suggestions
 * - Real-time preview
 * - PDF export
 * - ATS-friendly formatting
 * 
 * Session: 2025-10-25 - Saturday
 */

const TEMPLATES = [
  { id: 'professional', name: 'Professional', description: 'Clean and modern' },
  { id: 'creative', name: 'Creative', description: 'Bold and unique' },
  { id: 'executive', name: 'Executive', description: 'Senior-level focused' },
  { id: 'minimal', name: 'Minimal', description: 'Simple elegance' },
];

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    dates: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    dates: string;
  }>;
  skills: string[];
}

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          dates: '',
          description: '',
        },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          dates: '',
        },
      ],
    }));
  };

  const enhanceWithAI = async (section: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tools/resume-builder/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          data: resumeData,
        }),
      });

      if (!response.ok) throw new Error('Failed to enhance');

      const data = await response.json();
      setResumeData(data.enhanced_resume);
    } catch (error) {
      console.error('Error enhancing:', error);
      alert('Failed to enhance. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/tools/resume-builder/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumeData,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personal.name || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resume Builder</h1>
                <p className="text-slate-600 dark:text-slate-400">Create professional, ATS-friendly resumes</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                onClick={exportToPDF}
                disabled={!resumeData.personal.name}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resumeData.personal.name}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Professional Title"
                  value={resumeData.personal.title}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, title: e.target.value }
                  }))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={resumeData.personal.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, email: e.target.value }
                    }))}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={resumeData.personal.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, phone: e.target.value }
                    }))}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Professional Summary</h3>
                <button
                  onClick={() => enhanceWithAI('summary')}
                  disabled={isGenerating}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Enhance with AI
                </button>
              </div>
              <textarea
                placeholder="Write a brief professional summary..."
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Work Experience</h3>
                <button
                  onClick={addExperience}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  + Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].company = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].position = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Key achievements and responsibilities..."
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].description = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Choose Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{template.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 h-[800px] overflow-y-auto">
                {resumeData.personal.name ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6">
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {resumeData.personal.name}
                      </h1>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-3">
                        {resumeData.personal.title}
                      </p>
                      <div className="flex justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>•</span>}
                        {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                          Professional Summary
                        </h2>
                        <p className="text-slate-700 dark:text-slate-300">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                          Work Experience
                        </h2>
                        <div className="space-y-4">
                          {resumeData.experience.map(exp => (
                            <div key={exp.id}>
                              <h3 className="font-semibold text-slate-900 dark:text-white">{exp.position}</h3>
                              <p className="text-slate-600 dark:text-slate-400">{exp.company} • {exp.dates}</p>
                              <p className="text-slate-700 dark:text-slate-300 mt-2">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-600 dark:text-slate-400">Fill in your information to see the preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
