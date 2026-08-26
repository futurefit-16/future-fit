const SITE_URL = "https://wearfuturefit.com";

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": `${SITE_URL}/#organization`,
    name: "Future Fit",
    url: SITE_URL,
    logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
    },
    description:
        "India's premier AI-driven streetwear brand. Oversized tees, hoodies, and tech-fleece apparel designed with AI precision.",
    email: "hello@wearfuturefit.com",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
    },
    sameAs: [
        "https://instagram.com/wearfuturefit",
        "https://twitter.com/wearfuturefit",
    ],
};

const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Future Fit",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

export default function JSONLD() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
            />
        </>
    );
}
