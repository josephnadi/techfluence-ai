import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
}

const SEO = ({ 
  title, 
  description, 
  canonical, 
  keywords, 
  robots,
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/nmD0J8GO0zP5DhgY8XqBm37nJd02/social-images/social-1759102531297-ChatGPT Image Sep 18, 2025, 12_46_06 PM.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    if (robots) {
      updateMetaTag('robots', robots);
    }

    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:site_name', 'Techfluence AI', 'property');
    if (canonical) {
      updateMetaTag('og:url', canonical, 'property');
    }

    // Update Twitter tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:site', '@techfluence_ai');

    // Update or create canonical link
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.href = canonical;
    }

    // Add structured data if provided
    if (structuredData) {
      let scriptElement = document.querySelector('script[data-seo-structured]') as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('data-seo-structured', 'true');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Cleanup structured data on unmount
    return () => {
      const scriptElement = document.querySelector('script[data-seo-structured]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [title, description, canonical, keywords, robots, ogImage, ogType, twitterCard, structuredData]);

  return null;
};

export default SEO;
