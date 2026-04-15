import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string;
}

export const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  keywords,
}) => {
  const siteName = 'design.md';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Turn UI into instructions`;
  const defaultDescription = 'Automatically extract design tokens, layout logic, and structural semantics from your screenshots into clean, actionable markdown.';
  const baseUrl = 'https://designwith.abhijeetkakade.in';
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const image = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-image.png`;

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "design.md",
    "operatingSystem": "Web",
    "applicationCategory": "DesignApplication",
    "description": description || defaultDescription,
    "url": baseUrl,
    "author": {
      "@type": "Person",
      "name": "Abhijeet Kakade"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
