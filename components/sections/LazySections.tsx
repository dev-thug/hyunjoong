"use client";

import dynamic from "next/dynamic";

const LoadingSkeleton = () => (
  <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
);

const Skills = dynamic(() => import("./Skills"), { loading: LoadingSkeleton });
const Experience = dynamic(() => import("./Experience"), { loading: LoadingSkeleton });
const Contact = dynamic(() => import("./Contact"), { loading: LoadingSkeleton });

export default function LazySections() {
  return (
    <>
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
