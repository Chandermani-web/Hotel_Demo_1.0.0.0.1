import React, { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  breadcrumbs?: { name: string; item: string }[];
  noindex?: boolean;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  breadcrumbs,
  noindex
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Robots meta tag (noindex for demo booking, manage booking, and admin)
    const isNoIndex = noindex || canonicalPath.startsWith('/book') || canonicalPath === '/manage-booking' || canonicalPath === '/admin-demo';
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', isNoIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Update Standard Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 4. Update OpenGraph Tags
    const updateMetaProperty = (prop: string, content: string) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', siteConfig.name);

    const siteBase = siteConfig.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    const currentUrl = `${siteBase}${canonicalPath}`;
    updateMetaProperty('og:url', currentUrl);

    // 5. Update Twitter Tags
    const updateMetaName = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaName('twitter:title', title);
    updateMetaName('twitter:description', description);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 6. JSON-LD Hotel Schema (CONFIRMED FIELDS ONLY: NO fake ratings, reviews, prices or awards)
    const hotelSchemaId = 'hotel-carlton-jsonld';
    let scriptTag = document.getElementById(hotelSchemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = hotelSchemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": siteConfig.name,
      "description": "3-star accommodation in Civil Lines, Bareilly offering quiet hospitality and essential amenities.",
      "telephone": siteConfig.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": siteConfig.address.street,
        "addressLocality": siteConfig.address.locality,
        "addressRegion": siteConfig.address.state,
        "postalCode": siteConfig.address.postalCode,
        "addressCountry": "IN"
      },
      "starRating": {
        "@type": "Rating",
        "ratingValue": "3"
      },
      "amenityFeature": siteConfig.confirmedAmenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": "true"
      }))
    };

    if (siteConfig.googleBusinessUrl) {
      schemaData.hasMap = siteConfig.googleBusinessUrl;
    }
    if (siteConfig.siteUrl) {
      schemaData.url = siteConfig.siteUrl;
    }

    scriptTag.textContent = JSON.stringify(schemaData);

    // 7. Breadcrumbs JSON-LD if provided
    const breadcrumbSchemaId = 'hotel-carlton-breadcrumbs-jsonld';
    let bcScript = document.getElementById(breadcrumbSchemaId) as HTMLScriptElement | null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      if (!bcScript) {
        bcScript = document.createElement('script');
        bcScript.id = breadcrumbSchemaId;
        bcScript.type = 'application/ld+json';
        document.head.appendChild(bcScript);
      }
      const bcData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteBase || "/"
          },
          ...breadcrumbs.map((bc, idx) => ({
            "@type": "ListItem",
            "position": idx + 2,
            "name": bc.name,
            "item": `${siteBase}${bc.item}`
          }))
        ]
      };
      bcScript.textContent = JSON.stringify(bcData);
    } else if (bcScript) {
      bcScript.remove();
    }

    // 8. ID-Gated Google Search Console Verification tag
    if (siteConfig.analytics.googleSearchConsoleId) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', siteConfig.analytics.googleSearchConsoleId);
    }

  }, [title, description, canonicalPath, breadcrumbs]);

  return null;
};
