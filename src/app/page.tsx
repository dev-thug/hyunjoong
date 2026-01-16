import HomeLayoutWrapper from '@/components/layout/HomeLayoutWrapper';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlogSection from '@/components/sections/BlogSection';

/**
 * 홈 페이지 (서버 컴포넌트)
 * BlogSection에서 fs를 사용하여 MDX 파일을 읽으므로 서버 컴포넌트여야 함
 */
export default function Home() {
  return (
    <HomeLayoutWrapper>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
    </HomeLayoutWrapper>
  );
}
