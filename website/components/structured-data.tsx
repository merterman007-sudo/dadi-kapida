export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Dadı Kapıda",
    description: "Profesyonel yatılı ve gündüzlü dadı yerleştirme danışmanlığı. İstanbul ve Türkiye genelinde güvenilir, referanslı aday eşleştirmesi.",
    url: "https://dadikapida.com",
    logo: "https://dadikapida.com/images/brand/dadi-kapida-logo-square.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Turkish"
    },
    areaServed: [
      { "@type": "City", name: "İstanbul" },
      { "@type": "City", name: "Ankara" },
      { "@type": "City", name: "İzmir" },
      { "@type": "City", name: "Antalya" }
    ],
    serviceType: "Dadı Yerleştirme Danışmanlığı",
    knowsAbout: ["Dadı Yerleştirme", "Yatılı Dadı", "Gündüzlü Dadı", "Bebek Bakıcısı", "Çocuk Bakımı"],
    sameAs: []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: "Dadı Kapıda Danışmanlık Ekibi",
      url: "https://dadikapida.com"
    },
    publisher: {
      "@type": "Organization",
      name: "Dadı Kapıda",
      url: "https://dadikapida.com",
      logo: {
        "@type": "ImageObject",
        url: "https://dadikapida.com/images/brand/dadi-kapida-logo-square.png"
      }
    },
    inLanguage: "tr-TR"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
