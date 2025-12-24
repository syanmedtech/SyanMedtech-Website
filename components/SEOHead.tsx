
import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  keyword?: string;
  ogImage?: string;
  schema?: any;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOProps> = ({ title, description, ogImage, schema, noIndex }) => {
  // In a React context, we might use react-helmet, but for this architecture,
  // we simulate dynamic head manipulation for maximum performance.
  React.useEffect(() => {
    document.title = `${title} | SYAN MED Tech`;
    
    const setMeta = (name: string, content: string, property = false) => {
      let el = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (property) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    if (ogImage) setMeta('og:image', ogImage, true);
    if (noIndex) setMeta('robots', 'noindex, nofollow');

    // Schema Injection
    if (schema) {
      let script = document.getElementById('syan-schema') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'syan-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    }
  }, [title, description, ogImage, schema, noIndex]);

  return null;
};

export default SEOHead;
