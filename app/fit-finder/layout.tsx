import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Fit Finder | Future Fit — Find Your Perfect Size",
  description: "Answer 3 questions and our AI recommends your exact size. Built for Future Fit's oversized drop-shoulder heavyweight streetwear.",
  openGraph: {
    title: "AI Fit Finder | Future Fit — Find Your Perfect Size",
    description: "Answer 3 questions and our AI recommends your exact size. Built for Future Fit's oversized drop-shoulder heavyweight streetwear.",
    type: "website",
    siteName: "Future Fit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fit Finder | Future Fit — Find Your Perfect Size",
    description: "Answer 3 questions and our AI recommends your exact size. Built for Future Fit's oversized drop-shoulder heavyweight streetwear.",
    site: "@wearfuturefit",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
