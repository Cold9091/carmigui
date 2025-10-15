import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  schema?: object;
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = '/attached_assets/Component 3 (1)_1760555027927.png';
const SITE_NAME = 'CARMIGUI - Construção e Imobiliário em Angola';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://carmigui.com';

export function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  schema,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    document.title = `${title} | CARMIGUI`;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords || '' },
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:image', content: ogImage || DEFAULT_OG_IMAGE },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:url', content: canonicalUrl || BASE_URL + window.location.pathname },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: ogTitle || title },
      { name: 'twitter:description', content: ogDescription || description },
      { name: 'twitter:image', content: ogImage || DEFAULT_OG_IMAGE },
      { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'googlebot', content: noindex ? 'noindex, nofollow' : 'index, follow' },
      { name: 'geo.region', content: 'AO' },
      { name: 'geo.placename', content: 'Luanda, Angola' },
      { name: 'language', content: 'pt-AO' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', property);
        } else if (name) {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    });

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl || BASE_URL + window.location.pathname);

    if (schema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      const schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogType, canonicalUrl, schema, noindex]);

  return null;
}
