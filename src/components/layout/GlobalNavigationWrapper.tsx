import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import GlobalNavigationClient from "./GlobalNavigationClient";

interface GlobalNavigationWrapperProps {
  readonly lang: Locale;
}

/**
 * 전역 네비게이션 래퍼 (서버 컴포넌트)
 * 사전(dictionary)을 로드해 클라이언트 네비게이션 상태 컴포넌트에 전달한다.
 */
const GlobalNavigationWrapper = async ({
  lang,
}: GlobalNavigationWrapperProps) => {
  const dict = await getDictionary(lang);
  return <GlobalNavigationClient lang={lang} navLabels={dict.nav} />;
};

export default GlobalNavigationWrapper;
