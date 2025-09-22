export default function StructuredData() {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "김현중",
    jobTitle: "풀스택 개발자",
    description:
      "풀스택 개발자로 NodeJS, Python, AWS를 활용한 확장 가능한 클라우드 네이티브 앱 개발 경험과 협업 중심의 개발 철학을 보유하고 있습니다.",
    url: "https://hyunjoong.kim",
    image: "https://hyunjoong.kim/profile-image.jpg",
    sameAs: ["https://github.com/dev-thug", "https://linkedin.com/in/dev-thug"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "Seoul",
    },
    email: "de0978@gmail.com",
    telephone: "+82-10-0000-0000",
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "Microservices Architecture",
      "Cloud Native Development",
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "프리랜서",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "풀스택 개발 경력 4년",
        description:
          "NodeJS, Python, AWS 기반 클라우드 네이티브 앱 개발 및 운영",
      },
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "김현중 포트폴리오",
    url: "https://hyunjoong.kim",
    description: "풀스택 개발자 김현중의 포트폴리오 웹사이트",
    author: {
      "@type": "Person",
      name: "김현중",
    },
    inLanguage: "ko-KR",
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hyunjoong.kim/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const professionalServiceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "김현중 풀스택 개발 서비스",
    description:
      "웹 애플리케이션 개발, 클라우드 네이티브 솔루션, API 개발 전문 서비스",
    provider: {
      "@type": "Person",
      name: "김현중",
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    serviceType: [
      "웹 애플리케이션 개발",
      "API 개발",
      "클라우드 네이티브 개발",
      "프론트엔드 개발",
      "백엔드 개발",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personData, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData, null, 2),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceData, null, 2),
        }}
      />
    </>
  );
}
