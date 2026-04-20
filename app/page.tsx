"use client";
import { LoginButton } from "./components/LoginButton";
import { ResultCard } from "./components/ResultCard";
import { MissionFooter } from "./components/MissionFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-between">
      <section className="flex flex-col items-center mt-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-beskar-silver">How much of your life have you wasted?</h1>
        <LoginButton />
      </section>
      <ResultCard />
      <MissionFooter />
    </main>
  );
}
