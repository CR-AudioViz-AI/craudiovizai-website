import { Metadata } from 'next';
import { AppEmbed } from '@/components/apps/AppEmbed';

export const metadata: Metadata = {
  title: 'App Builder | CR AudioViz AI',
  description: 'Build production-ready apps with AI assistance. Export the code you own.',
  openGraph: {
    title: 'App Builder | CR AudioViz AI',
    description: 'Build production-ready apps with AI assistance. Export the code you own.',
    type: 'website',
  },
};

export default function BuilderPage() {
  return (
    <AppEmbed
      src="https://crav-builder-n19hjp6wq-roy-hendersons-projects-1d3d5e94.vercel.app"
      title="App Builder"
      description="Create custom applications with AI-powered assistance"
      icon="🏗️"
    />
  );
}
