export const SEOData = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      "name": "Nexa Interiores - Loja de Móveis de Alto Padrão em Ribeirão Preto",
      "description": "Nexa Interiores traz mobiliário exclusivo direto das maiores e mais recentes feiras de mobiliário de alto padrão para a sua casa. Especialistas em sofás, poltronas e salas de jantar.",
      "image": "https://nexainteriores.com.br/images/og-image.webp",
      "@id": "https://nexainteriores.com.br",
      "url": "https://nexainteriores.com.br",
      "telephone": "+5516997908686",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Norma Valério Corrêa, 316",
        "addressLocality": "Ribeirão Preto",
        "addressRegion": "SP",
        "postalCode": "14021-614",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -21.215317,
        "longitude": -47.803685
      },
      "areaServed": {
        "@type": "City",
        "name": "Ribeirão Preto e Região"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "19:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "09:00",
          "closes": "13:00"
        }
      ],
      "sameAs": [
        "https://instagram.com/nexainteriores"
      ],
      "priceRange": "$$$$"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Curadoria de Interiores Gratuita",
      "provider": {
        "@id": "https://nexainteriores.com.br"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ribeirão Preto"
      },
      "description": "Serviço exclusivo e gratuito de curadoria de interiores. Ajudamos a harmonizar sofás, poltronas, salas de jantar e decoração para projetos de alto padrão.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "A Nexa Interiores cobra pela curadoria de interiores?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não. Oferecemos curadoria de interiores de alto padrão de forma totalmente gratuita aos nossos clientes em nossa loja de Ribeirão Preto. Basta agendar pelo WhatsApp."
          }
        },
        {
          "@type": "Question",
          "name": "De onde vêm os móveis da Nexa Interiores?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Temos o diferencial de ter mobiliário exclusivo, direto das maiores e mais recentes feiras de mobiliário de alto padrão internacional e nacional. Focamos em sofás de luxo, poltronas, salas de jantar e itens decorativos exclusivos."
          }
        }
      ]
    }
  ];

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};
