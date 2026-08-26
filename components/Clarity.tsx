"use client";

import Script from "next/script";

interface ClarityProps {
  projectId?: string;
}

export default function Clarity({ projectId }: ClarityProps) {
  // Get project ID from environment or props
  const clarityProjectId = projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  // Don't render if no project ID is available
  if (!clarityProjectId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityProjectId}");
        `,
      }}
    />
  );
}
