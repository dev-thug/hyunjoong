import assert from "node:assert/strict";
import test from "node:test";
import {
  getBlogPaginationSearchMetadata,
  getDeveloperSearchMetadata,
} from "./metadata/developer-search";

test("defines evidence-backed Korean homepage search metadata", () => {
  const metadata = getDeveloperSearchMetadata("ko", "home");
  assert.deepEqual(metadata, {
    title: "김현중 | 소프트웨어 엔지니어·풀스택 개발자",
    description:
      "React·Next.js 프론트엔드, Node.js·Python 백엔드와 AWS 클라우드 시스템을 만드는 소프트웨어 엔지니어·풀스택 개발자 김현중의 포트폴리오와 기술 블로그.",
    keywords: [
      "개발자",
      "김현중 개발자",
      "풀스택 개발자",
      "백엔드 개발자",
      "프론트엔드 개발자",
      "웹 개발자",
      "AWS 개발자",
      "Next.js 개발자",
      "소프트웨어 엔지니어",
    ],
  });
  assert.ok(
    !metadata.keywords.includes("프리랜서 개발자"),
    "the homepage must not claim current freelance identity without explicit evidence"
  );
});

test("separates Korean search intent across existing proof pages", () => {
  const profile = getDeveloperSearchMetadata("ko", "profile");
  const projects = getDeveloperSearchMetadata("ko", "projects");
  const blog = getDeveloperSearchMetadata("ko", "blog");
  const contact = getDeveloperSearchMetadata("ko", "contact");

  assert.equal(profile.title, "김현중 개발자 프로필 | 풀스택·백엔드·AWS 경력");
  assert.match(profile.description, /React·Next\.js.*Node\.js·Python.*AWS/);
  assert.equal(projects.title, "김현중 개발자 포트폴리오 | 웹·AI·AWS 프로젝트");
  assert.match(projects.description, /AI 에이전트 프로젝트/);
  assert.doesNotMatch(projects.description, /구현 사례|배포 사례|운영 사례/);
  assert.match(projects.keywords.join(" "), /개발자 포트폴리오/);
  assert.equal(blog.title, "김현중 기술 블로그 | Next.js·AWS·AI 에이전트");
  assert.match(blog.description, /백엔드·풀스택 아키텍처/);
  assert.equal(contact.title, "김현중 연락처 | 소프트웨어 엔지니어");
  assert.match(contact.description, /메시지를 보낼 수 있는 연락 페이지/);
  assert.doesNotMatch(
    [contact.title, contact.description, ...contact.keywords].join(" "),
    /협업|개발 문의|고용|채용|프리랜서|외주|컨설팅|collaboration|development inquir|hiring|hire|freelance|outsourc|consult/i
  );

  for (const metadata of [profile, projects, blog, contact]) {
    assert.ok(!metadata.keywords.includes("프리랜서 개발자"));
  }
});

test("provides localized English metadata without unsupported freelance claims", () => {
  const home = getDeveloperSearchMetadata("en", "home");
  const profile = getDeveloperSearchMetadata("en", "profile");

  assert.equal(
    home.title,
    "Hyunjoong Kim | Software Engineer & Full-Stack Developer"
  );
  assert.match(home.description, /software engineer and full-stack developer/i);
  assert.equal(profile.title, "Hyunjoong Kim | Software Engineer Profile");
  assert.ok(!home.keywords.includes("freelance developer"));
});

test("keeps English project and blog AI claims at the published evidence level", () => {
  const projects = getDeveloperSearchMetadata("en", "projects");
  const blog = getDeveloperSearchMetadata("en", "blog");

  assert.match(projects.description, /AI agent projects/i);
  assert.match(blog.description, /AI agents/i);
  assert.doesNotMatch(
    [projects.description, blog.description].join(" "),
    /production AI|implemented AI|deployed AI|implementation cases?/i
  );
});

test("keeps English contact metadata neutral instead of advertising services", () => {
  const contact = getDeveloperSearchMetadata("en", "contact");

  assert.equal(contact.title, "Contact Hyunjoong Kim | Software Engineer");
  assert.match(contact.description, /contact page for sending a message/i);
  assert.doesNotMatch(
    [contact.title, contact.description, ...contact.keywords].join(" "),
    /collaboration|development inquir|project inquir|hiring|hire|freelance|outsourc|consult|협업|외주|프리랜서|컨설팅/i
  );
});

test("gives each indexable blog pagination page distinct metadata", () => {
  const koPage2 = getBlogPaginationSearchMetadata("ko", 2);
  const koPage3 = getBlogPaginationSearchMetadata("ko", 3);
  const enPage2 = getBlogPaginationSearchMetadata("en", 2);

  assert.equal(
    koPage2.title,
    "김현중 기술 블로그 2페이지 | Next.js·AWS·AI 에이전트"
  );
  assert.match(koPage2.description, /2페이지/);
  assert.notEqual(koPage2.title, koPage3.title);
  assert.notEqual(koPage2.description, koPage3.description);
  assert.equal(
    enPage2.title,
    "Hyunjoong Kim Tech Blog — Page 2 | Next.js, AWS & AI Agents"
  );
  assert.match(enPage2.description, /Page 2/);
});
