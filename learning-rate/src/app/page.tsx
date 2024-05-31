'use client'
import Hero from "@/app/components/hero";
import PGInfo from "@/app/components/playground_info";
import LessonsInfo from "@/app/components/lessons_info";

export default function Home() {
  return (
    <main>
      <Hero />
      <PGInfo />
      <LessonsInfo />
    </main>
  );
};
