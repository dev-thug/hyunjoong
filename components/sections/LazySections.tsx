"use client";

import dynamic from "next/dynamic";

const Skills = dynamic(() => import("./Skills"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
  ),
});
const Experience = dynamic(() => import("./Experience"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
  ),
});
const Contact = dynamic(() => import("./Contact"), {
  loading: () => (
    <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
  ),
});

export default function LazySections() {
  return (
    <>
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
