import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { getContactHref, SOCIAL_LINK_MAP } from "@/constants";
import { getDictionary } from "@/get-dictionary";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import { getSiteBaseUrl } from "@/lib/site-config";
import { buildSitePerson, safeJsonLdStringify } from "@/lib/json-ld";

/**
 * 프로필 페이지 메타데이터 (다국어)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  return buildLocalizedPageMetadata({
    lang,
    path: "/profile",
    title: dict.profile.meta_title,
    description: dict.profile.meta_description,
    openGraphType: "profile",
  });
}

/**
 * 프로필 페이지에서 사용할 스킬/경력 데이터를 로케일별로 반환
 */
function getProfileData(lang: Locale) {
  if (lang === "ko") {
    return {
      skills: [
        {
          category: "프론트엔드",
          items: ["React", "Next.js", "TypeScript", "TailwindCSS"],
        },
        {
          category: "백엔드",
          items: ["Node.js", "Python", "GraphQL", "REST API"],
        },
        {
          category: "클라우드",
          items: ["Amplify Gen1 & Gen2", "Lambda", "DynamoDB", "ECS"],
        },
        {
          category: "데브옵스",
          items: [
            "Docker",
            "CloudFormation/Terraform",
            "CI/CD (GitHub Actions)",
            "Kubernetes",
          ],
        },
      ],
      experiences: [
        {
          period: "2023.12 — 현재",
          title: "테크 리더, 풀스택 & AWS 클라우드 개발자",
          company: "Fortuna Helix",
          companyUrl: "https://fortunahelix.com/",
          description:
            "백엔드 및 AWS 클라우드 개발을 주도하고, 기술 방향과 제품 출시를 이끌고 있습니다.",
        },
        {
          period: "2021.12 — 2023.12",
          title: "백엔드 & AWS 클라우드 개발자",
          company: "Healicure",
          companyUrl: "https://yejin.clinic/",
          description:
            "헬스케어 및 기업용 솔루션을 위한 백엔드 및 AWS 클라우드 개발을 담당했습니다.",
        },
        {
          period: "2015.03 — 2022.02",
          title: "학사 학위",
          company: "금오공과대학교",
          companyUrl: "https://www.kumoh.ac.kr/",
          description: "컴퓨터소프트웨어공학",
        },
      ],
    };
  }

  return {
    skills: [
      {
        category: "Frontend",
        items: ["React", "Next.js", "TypeScript", "TailwindCSS"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Python", "GraphQL", "REST API"],
      },
      {
        category: "Cloud",
        items: ["Amplify Gen1 & Gen2", "Lambda", "DynamoDB", "ECS"],
      },
      {
        category: "DevOps",
        items: [
          "Docker",
          "CloudFormation/Terraform",
          "CI/CD (GitHub Actions)",
          "Kubernetes",
        ],
      },
    ],
    experiences: [
      {
        period: "2023.12 — Present",
        title: "Tech Leader, Fullstack & AWS Cloud Developer",
        company: "Fortuna Helix",
        companyUrl: "https://fortunahelix.com/",
        description:
          "Leading backend and AWS cloud development, driving technical direction and delivery.",
      },
      {
        period: "2021.12 — 2023.12",
        title: "Backend & AWS Cloud Developer",
        company: "Healicure",
        companyUrl: "https://yejin.clinic/",
        description:
          "Backend and AWS cloud development for healthcare and enterprise solutions.",
      },
      {
        period: "2015.03 — 2022.02",
        title: "Bachelor's Degree",
        company: "Kumoh National Institute of Technology",
        companyUrl: "https://www.kumoh.ac.kr/",
        description: "Computer Software Engineering",
      },
    ],
  };
}

/**
 * 프로필 페이지
 */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const baseUrl = getSiteBaseUrl();
  const personJsonLd = {
    "@context": "https://schema.org",
    ...buildSitePerson(baseUrl),
    jobTitle: dict.profile.job_title,
    sameAs: Object.values(SOCIAL_LINK_MAP).map((link) => link.href),
  };
  const personJsonLdScript = safeJsonLdStringify(personJsonLd);

  const { skills, experiences } = getProfileData(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLdScript }}
      />
      <div>
        <h1 className="sr-only">{dict.profile.meta_title}</h1>
        {/* 헤더 */}
        <div className="mb-12 md:mb-16 pt-6 md:pt-8">
          <p
            aria-hidden="true"
            className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none"
          >
            PROFILE
          </p>
        </div>

        {/* 소개 섹션 */}
        <section className="mb-16 md:mb-24" aria-labelledby="profile-about-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div>
              <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase mb-4 md:mb-6 flex items-center gap-3">
                <span className="w-6 md:w-8 h-[1px] bg-gray-700" />
                {dict.profile.about_heading}
              </span>
              <h2
                id="profile-about-heading"
                className="text-2xl md:text-4xl lg:text-5xl font-light font-montserrat leading-tight text-white mb-6"
              >
                {dict.profile.intro_heading_prefix}
                <span className="text-gray-500 italic">{dict.profile.intro_heading_emphasis}</span>
                {dict.profile.intro_heading_suffix}
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-sm md:text-base lg:text-lg text-gray-400 font-light leading-relaxed mb-6">
                {dict.profile.intro_para_1}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-400 font-light leading-relaxed">
                {dict.profile.intro_para_2}
              </p>
            </div>
          </div>
        </section>

        {/* 스킬 섹션 */}
        <section className="mb-16 md:mb-24">
          <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase mb-8 md:mb-12 flex items-center gap-3">
            <span className="w-6 md:w-8 h-[1px] bg-gray-700" />
            {dict.profile.tech_stack_heading}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {skills.map((skill) => (
              <div
                key={skill.category}
                className="glass-panel p-5 md:p-6 rounded-xl bg-noise border border-white/5 hover:border-white/10 transition-colors"
              >
                <h3 className="text-xs md:text-sm font-mono text-white uppercase tracking-wider mb-4">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] md:text-xs text-gray-400 px-2 py-1 rounded border border-gray-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 경력 섹션 */}
        <section className="mb-16 md:mb-24">
          <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase mb-8 md:mb-12 flex items-center gap-3">
            <span className="w-6 md:w-8 h-[1px] bg-gray-700" />
            {dict.profile.experience_heading}
          </span>

          <div className="space-y-6 md:space-y-8">
            {experiences.map((exp) => (
              <div
                key={exp.company}
                className="group flex flex-col md:flex-row gap-4 md:gap-8 p-5 md:p-6 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="md:w-1/4">
                  <span className="text-xs font-mono text-gray-500">
                    {exp.period}
                  </span>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-lg md:text-xl font-light text-white mb-1">
                    {exp.title}
                  </h3>
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 block mb-2 hover:text-white transition-colors"
                    aria-label={dict.profile.visit_company_website_aria.replace("{company}", exp.company)}
                  >
                    {exp.company}
                  </a>
                  <p className="text-sm text-gray-400">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 연락처 CTA */}
        <section className="pt-8 md:pt-12 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                {dict.profile.cta_title}
              </h3>
              <p className="text-sm text-gray-500">
                {dict.profile.cta_subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={getContactHref(lang)}
                className="inline-flex items-center gap-3 px-5 py-3 bg-white text-black rounded-full font-mono text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                aria-label={dict.profile.open_contact_form_aria}
              >
                <Mail size={14} />
                {dict.profile.get_in_touch_cta}
              </Link>

              <div className="flex gap-3">
                <a
                  href={SOCIAL_LINK_MAP.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                  aria-label={SOCIAL_LINK_MAP.github.ariaLabel}
                >
                  <Github size={18} />
                </a>
                <a
                  href={SOCIAL_LINK_MAP.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                  aria-label={SOCIAL_LINK_MAP.linkedin.ariaLabel}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={SOCIAL_LINK_MAP.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                  aria-label={SOCIAL_LINK_MAP.x.ariaLabel}
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
