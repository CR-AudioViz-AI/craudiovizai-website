import { Metadata } from 'next';
import { AppEmbed } from '@/components/apps/AppEmbed';

export const metadata: Metadata = {
  title: 'Music Builder | CR AudioViz AI',
  description: 'Create original music with AI-powered composition tools.',
  openGraph: {
    title: 'Music Builder | CR AudioViz AI',
    description: 'Create original music with AI-powered composition tools.',
    type: 'website',
  },
};

export default function MusicBuilderPage() {
  return (
    <AppEmbed
      src="https://crav-music-builder-i4kjpor8l-roy-hendersons-projects-1d3d5e94.vercel.app"
      title="Music Builder"
      description="Compose and produce original music with AI assistance"
      icon="🎵"
    />
  );
}
