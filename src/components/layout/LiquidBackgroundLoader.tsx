"use client";

import dynamic from "next/dynamic";

// WebGL 컴포넌트는 SSR에서 제외하고 지연 로드한다.
// `ssr: false` 옵션은 클라이언트 컴포넌트 안에서만 사용 가능하므로,
// HomeLayoutWrapper 서버 컴포넌트가 이 파일을 통해 LiquidBackground를 마운트한다.
const LiquidBackground = dynamic(
  () => import("@/components/LiquidBackground"),
  { ssr: false }
);

const LiquidBackgroundLoader = () => <LiquidBackground />;

export default LiquidBackgroundLoader;
