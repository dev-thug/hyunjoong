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
