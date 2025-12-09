import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import LazySections from "@/components/sections/LazySections";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AnalyticsProvider>
        <main className="min-h-screen">
          <Hero />
          <Projects />
          <About />
          <LazySections />
        </main>
      </AnalyticsProvider>
    </Suspense>
  );
}
