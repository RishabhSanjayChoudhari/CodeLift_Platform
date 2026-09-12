import React, { useEffect } from 'react';

export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | CodeLift Engineering Academy`;
    }
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description, keywords]);

  return null;
}
