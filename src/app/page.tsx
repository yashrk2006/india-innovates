"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsMarquee } from "@/components/landing/StatsMarquee";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { PlatformCapabilities } from "@/components/landing/PlatformCapabilities";
import { KnowledgeGraph } from "@/components/landing/KnowledgeGraph";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Roles } from "@/components/landing/Roles";
import { SecurityEthics } from "@/components/landing/SecurityEthics";
import { MultilingualSupport } from "@/components/landing/MultilingualSupport";
import { CTA_Section } from "@/components/landing/CTA_Section";
import { Footer } from "@/components/landing/Footer";

/**
 * LandingPage - The main gateway for BoothIQ.
 * Modularized into separate components for maintainability and performance.
 */
export default function LandingPage() {
  return (
    <div className="font-display antialiased selection:bg-primary selection:text-white bg-background-dark">
      <Navbar />
      <main className="relative">
        <Hero />
        <StatsMarquee />
        <ProblemStatement />
        <PlatformCapabilities />
        <KnowledgeGraph />
        <HowItWorks />
        <Roles />
        <SecurityEthics />
        <MultilingualSupport />
        <CTA_Section />
      </main>
      <Footer />
    </div>
  );
}
