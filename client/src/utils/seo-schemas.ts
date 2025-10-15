interface Address {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

interface ContactPoint {
  "@type": "ContactPoint";
  telephone: string;
  contactType: string;
  availableLanguage: string[];
}

interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://carmigui.com/#organization",
    "name": "CARMIGUI - CM Carmigui Comércio Geral & Prestação de Serviços SARL",
    "alternateName": "CARMIGUI",
    "url": "https://carmigui.com",
    "logo": "https://carmigui.com/attached_assets/Component 3 (1)_1760555027927.png",
    "description": "Construtora e imobiliária líder em Angola, especializada em construção de vivendas, condomínios, prédios comerciais e gestão imobiliária em Luanda.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Luanda",
      "addressRegion": "Luanda",
      "addressCountry": "AO"
    } as Address,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.8383,
      "longitude": 13.2344
    } as GeoCoordinates,
    "telephone": ["+244 945 806 968", "+244 957 970 662"],
    "email": "carmiguicomercialda@gmail.com",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+244 945 806 968",
        "contactType": "customer service",
        "availableLanguage": ["pt-AO"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+244 957 970 662",
        "contactType": "sales",
        "availableLanguage": ["pt-AO"]
      }
    ] as ContactPoint[],
    "areaServed": {
      "@type": "Country",
      "name": "Angola"
    },
    "serviceArea": [
      {
        "@type": "City",
        "name": "Luanda"
      },
      {
        "@type": "City",
        "name": "Benguela"
      },
      {
        "@type": "City",
        "name": "Lobito"
      },
      {
        "@type": "City",
        "name": "Huambo"
      }
    ],
    "sameAs": []
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent", "GeneralContractor"],
    "@id": "https://carmigui.com/#localbusiness",
    "name": "CARMIGUI - Construção e Imobiliário",
    "image": "https://carmigui.com/attached_assets/Component 3 (1)_1760555027927.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Luanda",
      "addressRegion": "Luanda",
      "addressCountry": "AO"
    } as Address,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.8383,
      "longitude": 13.2344
    } as GeoCoordinates,
    "url": "https://carmigui.com",
    "telephone": "+244 945 806 968",
    "email": "carmiguicomercialda@gmail.com",
    "priceRange": "Kz",
    "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-13:00",
    "paymentAccepted": "Dinheiro, Transferência Bancária",
    "currenciesAccepted": "AOA"
  };
}

export function generateRealEstateSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://carmigui.com/#realestate",
    "name": "CARMIGUI Imobiliário",
    "description": "Agência imobiliária em Luanda especializada em venda e compra de imóveis, vivendas, apartamentos e condomínios em Angola.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Luanda",
      "addressCountry": "AO"
    } as Address,
    "telephone": "+244 945 806 968",
    "email": "carmiguicomercialda@gmail.com",
    "areaServed": "Angola",
    "serviceType": ["Venda de Imóveis", "Compra de Imóveis", "Gestão de Condomínios", "Consultoria Imobiliária"]
  };
}

export function generateConstructionCompanySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": "https://carmigui.com/#construction",
    "name": "CARMIGUI Construtora",
    "description": "Construtora em Luanda especializada em construção de vivendas, prédios comerciais, condomínios e obras civis em Angola.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Luanda",
      "addressCountry": "AO"
    } as Address,
    "telephone": "+244 945 806 968",
    "email": "carmiguicomercialda@gmail.com",
    "areaServed": "Angola",
    "serviceType": [
      "Construção de Vivendas",
      "Construção de Condomínios",
      "Construção de Prédios Comerciais",
      "Projetos de Arquitetura",
      "Projetos de Engenharia",
      "Reformas e Ampliações",
      "Fiscalização de Obras",
      "Gestão de Obras"
    ]
  };
}

export function generateProductSchema(property: {
  id: string;
  title: string;
  description: string;
  price: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  cityName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://carmigui.com/imoveis/${property.id}`,
    "name": property.title,
    "description": property.description,
    "image": property.images[0] || "",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "AOA",
      "availability": "https://schema.org/InStock",
      "url": `https://carmigui.com/imoveis/${property.id}`
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Quartos",
        "value": property.bedrooms || 0
      },
      {
        "@type": "PropertyValue",
        "name": "Casas de Banho",
        "value": property.bathrooms || 0
      },
      {
        "@type": "PropertyValue",
        "name": "Área",
        "value": `${property.area} m²`
      },
      {
        "@type": "PropertyValue",
        "name": "Localização",
        "value": property.cityName || "Luanda"
      }
    ]
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
