'use client';

/**
 * Javari AI Page - Direct Embed
 * Embeds the full Javari AI application directly
 */

export default function JavariAIPage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        src="https://crav-javari-1dru7gr25-roy-hendersons-projects-1d3d5e94.vercel.app/javari"
        className="w-full h-full border-0"
        title="Javari AI Application"
        allow="clipboard-read; clipboard-write; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
