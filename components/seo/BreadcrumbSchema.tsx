"use client";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  // Generate JSON-LD structured data for breadcrumbs
  const generateBreadcrumbSchema = () => {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };

    return JSON.stringify(breadcrumbList, null, 0);
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateBreadcrumbSchema()
      }}
    />
  );
}
