import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { BRAND } from "@/constants";
import { getPublicProfile } from "@/data/public-profile";
import { buildSitePerson } from "./json-ld";

type Dictionary = {
  readonly hero: Record<string, string>;
  readonly about: Record<string, string>;
  readonly projects: Record<string, string>;
  readonly profile: Record<string, string>;
};

const readDictionary = (locale: "ko" | "en"): Dictionary =>
  JSON.parse(
    readFileSync(resolve(process.cwd(), `src/dictionaries/${locale}.json`), "utf8"),
  ) as Dictionary;

const publicIdentityText = (dictionary: Dictionary): string[] => [
  dictionary.hero.role_title,
  dictionary.hero.role_description,
  dictionary.hero.architecture,
  dictionary.hero.meta_title,
  dictionary.hero.meta_description,
  dictionary.hero.open_for_ventures,
  dictionary.about.description,
  dictionary.about.focus_value,
  dictionary.projects.meta_description,
  dictionary.profile.meta_title,
  dictionary.profile.meta_description,
  dictionary.profile.intro_para_1,
  dictionary.profile.intro_para_2,
  dictionary.profile.current_focus_cta,
  dictionary.profile.job_title,
].filter((value): value is string => typeof value === "string");

const assertNoProductBranding = (value: string): void => {
  assert.doesNotMatch(value, /Specify\.app|제품 빌더|AI 제품 빌더|product builder/i);
};

test("presents Hyunjoong as a software engineer rather than a Specify.app product builder", () => {
  const ko = getPublicProfile("ko");
  const en = getPublicProfile("en");

  assert.equal(ko.jobTitle, "소프트웨어 엔지니어");
  assert.equal(en.jobTitle, "Software Engineer");
  assert.equal(BRAND.TITLE, "Software Engineer");

  for (const profile of [ko, en]) {
    assertNoProductBranding(profile.description);
    assertNoProductBranding(profile.currentFocus.title);
    assertNoProductBranding(profile.currentFocus.description);
    for (const paragraph of profile.introParagraphs) {
      assertNoProductBranding(paragraph);
    }
    assert.ok(profile.experiences.every((experience) => !/Specify\.app/i.test(experience.company)));
  }

  const koPerson = buildSitePerson("https://hyunjoong.kim", "ko");
  const enPerson = buildSitePerson("https://hyunjoong.kim", "en");
  assert.equal(koPerson.jobTitle, "소프트웨어 엔지니어");
  assert.equal(enPerson.jobTitle, "Software Engineer");
  assertNoProductBranding(koPerson.description);
  assertNoProductBranding(enPerson.description);
});

test("keeps public hero, about, project-index, and profile copy independent of Specify.app", () => {
  for (const locale of ["ko", "en"] as const) {
    const dictionary = readDictionary(locale);
    for (const copy of publicIdentityText(dictionary)) {
      assertNoProductBranding(copy);
    }
  }

  const ko = readDictionary("ko");
  const en = readDictionary("en");
  assert.equal(ko.hero.meta_title, "김현중 | 소프트웨어 엔지니어");
  assert.equal(en.hero.meta_title, "Hyunjoong Kim | Software Engineer");
});

test("makes the authored leverage philosophy concrete in bilingual profile copy", () => {
  const koDictionary = readDictionary("ko");
  const enDictionary = readDictionary("en");
  const koProfile = getPublicProfile("ko");
  const enProfile = getPublicProfile("en");

  assert.equal(koDictionary.hero.role_title, "사업에 도움이 되는 소프트웨어를 만듭니다");
  assert.equal(enDictionary.hero.role_title, "I build software that creates leverage.");
  assert.equal(
    koDictionary.hero.role_description,
    "사람들이 제품을 잘 쓰고, 팀이 더 잘 일할 수 있도록 제품과 시스템을 만듭니다.",
  );
  assert.equal(
    enDictionary.hero.role_description,
    "I build products and systems that make day-to-day work easier for customers and teams.",
  );
  assert.equal(
    enDictionary.hero.meta_description,
    "Portfolio and technical writing by software engineer Hyunjoong Kim, focused on software that creates leverage for businesses.",
  );
  assert.equal(
    koDictionary.hero.meta_description,
    "사업에 도움이 되는 소프트웨어를 만드는 엔지니어 김현중의 포트폴리오와 기술 블로그.",
  );
  assert.equal(koDictionary.profile.intro_heading_prefix, "더 큰 일을 가능하게 하는 ");
  assert.equal(koDictionary.profile.intro_heading_emphasis, "소프트웨어");
  assert.equal(koDictionary.profile.intro_heading_suffix, "를 만듭니다.");
  assert.equal(enDictionary.profile.intro_heading_prefix, "Software that creates ");
  assert.equal(enDictionary.profile.intro_heading_emphasis, "leverage");
  assert.equal(enDictionary.profile.intro_heading_suffix, ".");
  assert.equal(
    koDictionary.profile.intro_para_1,
    "웹과 클라우드 환경에서 제품과 시스템을 만듭니다.",
  );
  assert.equal(
    koDictionary.profile.intro_para_2,
    "고객이 제품을 막힘없이 쓰고, 팀이 중요한 일에 더 많은 시간을 쓸 수 있다면 소프트웨어는 레버리지가 됩니다.",
  );
  assert.equal(
    enDictionary.profile.intro_para_1,
    "I build products and systems for the web and cloud.",
  );
  assert.equal(
    enDictionary.profile.intro_para_2,
    "Software becomes leverage when customers can use a product without getting stuck and teams have more time for important work.",
  );
  assert.deepEqual(koProfile.introParagraphs, [
    "웹과 클라우드 환경에서 제품과 시스템을 만듭니다.",
    "고객이 제품을 막힘없이 쓰고, 팀이 중요한 일에 더 많은 시간을 쓸 수 있다면 소프트웨어는 레버리지가 됩니다.",
  ]);
  assert.deepEqual(enProfile.introParagraphs, [
    "I build products and systems for the web and cloud.",
    "Software becomes leverage when customers can use a product without getting stuck and teams have more time for important work.",
  ]);
  assert.equal(
    koDictionary.about.description,
    "사람들이 제품을 잘 쓰고, 팀이 중요한 일에 집중할 수 있게 돕는 소프트웨어에 관심이 있습니다.",
  );
  assert.equal(
    enDictionary.about.description,
    "I care about software that helps people use products well and gives teams room to focus on important work.",
  );
  assert.equal(koDictionary.about.focus_value, "고객 / 팀");
  assert.equal(enDictionary.about.focus_value, "Customers / Teams");
  assert.equal(
    koDictionary.profile.meta_description,
    "고객과 팀을 위한 제품과 시스템을 만드는 소프트웨어 엔지니어 김현중의 프로필.",
  );
  assert.equal(
    enDictionary.profile.meta_description,
    "Profile of Hyunjoong Kim, a software engineer building products and systems for customers and teams.",
  );
  assert.equal(
    koProfile.description,
    "고객과 팀을 위한 제품과 시스템을 만드는 소프트웨어 엔지니어.",
  );
  assert.equal(
    enProfile.description,
    "Software engineer building products and systems for customers and teams.",
  );
  assert.equal(
    koProfile.currentFocus.description,
    "지금은 제품 개발과 기술 방향, AWS 클라우드 시스템을 함께 다루는 일에 집중하고 있습니다.",
  );
  assert.equal(
    enProfile.currentFocus.description,
    "Right now, I work across product development, technical direction, and AWS cloud systems.",
  );

  const retiredGenericPhrases =
    /문제의 맥락|성능·신뢰성|운영 가능성|확장 가능|신뢰할 수 있는|오래 쓰이는|operating context|scalable, reliable|people can rely on/i;

  for (const copy of [
    koDictionary.hero.role_description,
    koDictionary.about.description,
    koDictionary.profile.intro_para_2,
    koProfile.description,
    koProfile.currentFocus.description,
    enDictionary.hero.role_description,
    enDictionary.about.description,
    enDictionary.profile.intro_para_2,
    enProfile.description,
    enProfile.currentFocus.description,
  ]) {
    assert.doesNotMatch(copy, retiredGenericPhrases);
  }
});
