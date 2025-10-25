import { Metadata } from 'next';
import { AppEmbed } from '@/components/apps/AppEmbed';

export const metadata: Metadata = {
  title: 'Newsletter Pro | CR AudioViz AI',
  description: 'Enterprise email marketing platform for campaigns, audiences, and analytics.',
  openGraph: {
    title: 'Newsletter Pro | CR AudioViz AI',
    description: 'Enterprise email marketing platform for campaigns, audiences, and analytics.',
    type: 'website',
  },
};

export default function NewsletterPage() {
  return (
    <AppEmbed
      src="https://crav-newsletter-r5sxkuuss-roy-hendersons-projects-1d3d5e94.vercel.app"
      title="Newsletter Pro"
      description="Manage email campaigns, audiences, and track analytics"
      icon="📧"
    />
  );
}
