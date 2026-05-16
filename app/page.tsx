"use client";
import { AuthTopBar } from "./components/AuthTopBar";
import { LoginButton } from "./components/LoginButton";
import { ResultCard } from "./components/ResultCard";
import { MissionFooter } from "./components/MissionFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-between px-4 pb-8">
      <AuthTopBar />
      <section className="w-full max-w-6xl flex flex-col items-center pt-20 md:pt-24">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center text-beskar-silver leading-tight">How much of your life have you wasted?</h1>
        <LoginButton />
      </section>
      <ResultCard />
      <MissionFooter />
    </main>
  );
}
