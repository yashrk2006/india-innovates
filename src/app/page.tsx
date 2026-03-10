"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ──────────────────────────────────────────────────────────
   Icon helper – Material Symbols Outlined
   ────────────────────────────────────────────────────────── */
function Icon({
  name,
  className = "",
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={size ? { fontSize: size } : undefined}
    >
      {name}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Scroll-reveal wrapper (Framer Motion)
   ────────────────────────────────────────────────────────── */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const offsets: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: 60 },
    down: { x: 0, y: -60 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
    none: { x: 0, y: 0 },
  };
  const { x, y } = offsets[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   Stagger children wrapper
   ────────────────────────────────────────────────────────── */
function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12, delayChildren: 0.15 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

const staggerChild = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ══════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ─── 1. Sticky Navbar ─── */}
      <motion.nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${scrolled
          ? "border-primary/30 bg-background-dark/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(201,167,74,0.08)]"
          : "border-primary/10 bg-background-dark/70 backdrop-blur-md"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="size-8 text-primary">
              <Icon name="how_to_vote" size={32} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-serif font-bold leading-none tracking-tight">
                BoothIQ
              </h2>
              <span className="text-[10px] text-primary uppercase tracking-widest font-mono">
                Intelligence Unit
              </span>
            </div>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Solutions", target: "capabilities" },
              { label: "Platform", target: "how-it-works" },
              { label: "Resources", target: "security" },
              { label: "Pricing", target: "cta" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.target)}
                className="relative text-cream/90 hover:text-white text-sm font-medium transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <Link href="/citizen" className="text-saffron hover:text-white text-sm font-bold transition-colors">
              Citizen Portal
            </Link>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex text-primary hover:text-white text-sm font-bold tracking-wide transition-colors duration-300"
              >
                Log in
              </motion.button>
            </Link>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(232,118,26,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="h-10 px-5 rounded bg-saffron hover:bg-saffron/90 text-white text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(232,118,26,0.3)] transition-all duration-300"
              >
                Request Demo
              </motion.button>
            </Link>
          </div>
          <div className="md:hidden flex items-center pr-4"> {/* Mobile menu placeholder */}
            <Link href="/citizen" className="text-primary font-bold text-sm">Citizen App</Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── 2. Hero Section ─── */}
      <motion.header
        ref={heroRef}
        className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-background-dark"
        style={{ opacity: heroOpacity }}
      >
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 z-0 opacity-25 bg-cover bg-center mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')`,
            y: heroY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark z-0" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-green-400" />
            </span>
            <span className="text-xs font-mono text-primary uppercase tracking-widest">
              Live Election Data Stream
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.08]"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
              Every Voter.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
              Every Street.
            </span>
            <br />
            <motion.span
              className="text-primary italic inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            >
              Connected.
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="max-w-2xl text-lg md:text-xl text-cream/80 font-body leading-relaxed"
          >
            The premium AI-driven political intelligence platform for Indian
            democracy. Gain the winning edge with hyper-local data, predictive
            modeling, and real-time booth management.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            <Link href="/auth/signup">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 35px rgba(232,118,26,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="h-14 px-8 rounded bg-saffron text-white text-base font-bold tracking-wide shadow-[0_0_20px_rgba(232,118,26,0.4)] transition-all duration-300 flex items-center gap-2 group"
              >
                Start Your Campaign
                <Icon
                  name="arrow_forward"
                  className="group-hover:translate-x-1.5 transition-transform duration-300 text-lg"
                />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{
                scale: 1.06,
                borderColor: "rgba(201,167,74,0.8)",
                backgroundColor: "rgba(201,167,74,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo("knowledge-graph")}
              className="h-14 px-8 rounded border border-primary/40 bg-transparent text-primary text-base font-bold tracking-wide transition-all duration-300 flex items-center gap-2"
            >
              <Icon name="play_circle" className="text-lg" />
              Watch Intelligence Briefing
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollTo("problem")}
        >
          <span className="text-[10px] text-primary/60 font-mono uppercase tracking-widest">
            Scroll
          </span>
          <Icon name="keyboard_arrow_down" className="text-primary/60 text-2xl" />
        </motion.div>
      </motion.header>

      {/* ─── 3. Marquee Stats ─── */}
      <div className="w-full bg-primary/5 border-y border-primary/10 py-4 overflow-hidden relative z-20">
        <div className="ticker-wrap">
          <div className="ticker-content font-mono text-sm md:text-base text-primary uppercase tracking-widest">
            <span className="mx-6">10.5 Lakh Booths Mapped</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">950M+ Voters Indexed</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">28 States Covered</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">Real-time Sync Active</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">ISO 27001 Certified Security</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">10.5 Lakh Booths Mapped</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">950M+ Voters Indexed</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">28 States Covered</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">Real-time Sync Active</span>
            <span className="mx-2 text-primary/40">•</span>
            <span className="mx-6">ISO 27001 Certified Security</span>
            <span className="mx-2 text-primary/40">•</span>
          </div>
        </div>
      </div>

      {/* ─── 4. Problem Statement ─── */}
      <section id="problem" className="py-28 bg-background-dark relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6 text-white">
              <span className="text-primary">&ldquo;</span>Politics is a game of
              inches.<span className="text-primary">&rdquo;</span>
            </h2>
            <p className="text-xl text-cream/80 font-body leading-relaxed mb-8 border-l-4 border-primary/30 pl-6">
              Don&apos;t let data silos, manual errors, or delayed intelligence
              cost you the election. Traditional campaign methods leave 40% of
              potential swing voters untouched.
            </p>
            <div className="flex items-center gap-4 text-sm font-mono text-primary/80">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon name="warning" />
              </motion.span>
              <span>CAMPAIGN RISK ASSESSMENT: CRITICAL</span>
            </div>
          </Reveal>

          <StaggerContainer className="grid gap-4">
            {/* Card 1: Fragmented Data */}
            <motion.div
              variants={staggerChild}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-panel p-6 rounded-lg flex items-start gap-4 transition-colors group cursor-default"
            >
              <div className="p-3 bg-red-900/20 text-red-500 rounded border border-red-500/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] transition-all duration-300">
                <Icon name="database" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold mb-1">Fragmented Data</h3>
                <p className="text-cream/70 text-sm">Voter lists scattered across Excel sheets, PDFs, and notebooks lead to duplicate efforts.</p>
              </div>
            </motion.div>

            {/* Card 2: Slow Decisions */}
            <motion.div
              variants={staggerChild}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-panel p-6 rounded-lg flex items-start gap-4 transition-colors group cursor-default"
            >
              <div className="p-3 bg-orange-900/20 text-orange-500 rounded border border-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] transition-all duration-300">
                <Icon name="schedule" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold mb-1">Slow Decisions</h3>
                <p className="text-cream/70 text-sm">Critical insights arriving 48 hours too late to act upon effectively.</p>
              </div>
            </motion.div>

            {/* Card 3: Wasted Resources */}
            <motion.div
              variants={staggerChild}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-panel p-6 rounded-lg flex items-start gap-4 transition-colors group cursor-default"
            >
              <div className="p-3 bg-yellow-900/20 text-yellow-500 rounded border border-yellow-500/20 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_12px_rgba(234,179,8,0.2)] transition-all duration-300">
                <Icon name="monetization_on" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold mb-1">Wasted Resources</h3>
                <p className="text-cream/70 text-sm">Campaign funds spent on safe seats instead of battling for swing booths.</p>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 5. Platform Capabilities ─── */}
      <section
        id="capabilities"
        className="py-28 bg-[#0e0e14] border-t border-primary/10"
      >
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal>
            <span className="text-saffron font-mono text-sm uppercase tracking-widest mb-2 block">
              The War Room Suite
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Advanced Tactical Capabilities
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-cream/70 max-w-md font-body text-sm">
              Designed for high-command strategists and ground-level executors
              alike.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "hub",
              title: "Knowledge Graph",
              desc: "Connect voters to schemes, family units, caste demographics, and influence networks in a single view.",
            },
            {
              icon: "pie_chart",
              title: "Intelligent Segmentation",
              desc: "Micro-target voters based on 50+ parameters including past voting behavior and scheme beneficiary status.",
            },
            {
              icon: "psychology",
              title: "Sentiment Analysis",
              desc: "AI-driven analysis of local issues and sentiment from ground reports and social listening.",
            },
            {
              icon: "map",
              title: "Booth Management",
              desc: "Assign tasks to booth workers, track door-to-door visits, and verify voter slips in real-time.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerChild}
              whileHover={{
                scale: 1.03,
                y: -6,
                borderColor: "rgba(201,167,74,0.5)",
              }}
              className="bg-gradient-to-br from-[#1a1a22] to-[#121216] border border-white/5 p-8 rounded-xl transition-all duration-300 group cursor-default"
            >
              <motion.div
                className="w-12 h-12 rounded bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300"
                whileHover={{ rotate: 10 }}
              >
                <Icon name={feature.icon} />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}

          {/* Feature 5: WhatsApp & SMS */}
          <motion.div
            variants={staggerChild}
            whileHover={{
              scale: 1.02,
              y: -4,
              borderColor: "rgba(201,167,74,0.5)",
            }}
            className="lg:col-span-2 bg-gradient-to-br from-[#1a1a22] to-[#121216] border border-white/5 p-8 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-default"
          >
            <div className="relative z-10">
              <motion.div
                className="w-12 h-12 rounded bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300"
                whileHover={{ rotate: 10 }}
              >
                <Icon name="chat" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">
                WhatsApp &amp; SMS Integration
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed max-w-md">
                Launch campaigns directly from the dashboard. One-click
                personalized messaging to thousands of voters.
              </p>
            </div>
            <motion.div
              className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </StaggerContainer>
      </section>

      {/* ─── 6. Knowledge Graph Visual ─── */}
      <section
        id="knowledge-graph"
        className="h-[600px] w-full bg-background-dark relative border-y border-primary/20 overflow-hidden flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-lighten"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-[2px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <Reveal direction="left">
            <div className="glass-panel p-8 rounded-xl max-w-lg border-l-4 border-l-primary shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <h3 className="text-white font-mono text-sm tracking-widest uppercase">
                  Live Entity Resolution
                </h3>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                See the unseen connections.
              </h2>
              <p className="text-cream/80 text-sm mb-6">
                Our proprietary Knowledge Graph reveals hidden relationships
                between families, influencers, and schemes that Excel sheets
                miss.
              </p>
              <motion.button
                whileHover={{ x: 6 }}
                onClick={() => scrollTo("capabilities")}
                className="text-primary hover:text-white font-bold text-sm flex items-center gap-2 group transition-colors duration-300"
              >
                Explore Sample Data
                <Icon
                  name="arrow_forward"
                  className="group-hover:translate-x-1 transition-transform duration-300 text-lg"
                />
              </motion.button>
            </div>
          </Reveal>
        </div>

        {/* Floating controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          {["add", "remove", "filter_alt"].map((icon) => (
            <motion.button
              key={icon}
              whileHover={{ scale: 1.15, backgroundColor: "#c9a74a" }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#25252b] text-white p-2 rounded border border-white/10 transition-colors duration-200"
            >
              <Icon name={icon} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* ─── 7. How It Works ─── */}
      <section id="how-it-works" className="py-28 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                From Chaos to Clarity
              </h2>
              <p className="text-cream/70">
                Deploying BoothIQ takes days, not months.
              </p>
            </div>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <motion.div
              className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />

            {[
              {
                icon: "upload_file",
                step: "1. Import",
                desc: "Upload your raw voter lists, PDFs, and previous election data securely.",
              },
              {
                icon: "diversity_3",
                step: "2. Segment",
                desc: "AI automatically cleans duplicates and segments voters by caste, age, and loyalty.",
              },
              {
                icon: "campaign",
                step: "3. Create",
                desc: "Generate targeted campaigns and route maps for your ground workers.",
              },
              {
                icon: "how_to_reg",
                step: "4. Deliver",
                desc: "Track conversion in real-time on polling day. Win the booth.",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={staggerChild}
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.12,
                    borderColor: "rgba(201,167,74,0.9)",
                    boxShadow: "0 0 25px rgba(201,167,74,0.3)",
                  }}
                  className="w-24 h-24 rounded-full bg-[#1a1a22] border-2 border-primary/30 flex items-center justify-center mb-6 transition-all duration-300 relative z-10"
                >
                  <Icon name={item.icon} className="text-4xl text-primary" />
                </motion.div>
                <h4 className="text-white font-bold mb-2 text-lg">
                  {item.step}
                </h4>
                <p className="text-sm text-cream/60">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 8. Roles Section ─── */}
      <section id="roles" className="py-28 bg-[#0e0e14]">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl font-serif font-bold text-white mb-10 border-l-4 border-saffron pl-4">
              Hierarchy of Command
            </h2>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                level: "LEVEL 1",
                title: "Super Admin",
                perks: [
                  "Full Access Control",
                  "State-wide Analytics",
                  "Budget Allocation",
                ],
                color: "from-primary/10 to-transparent",
              },
              {
                level: "LEVEL 2",
                title: "State Head",
                perks: [
                  "Constituency Mgmt",
                  "Candidate Reports",
                  "Media Monitoring",
                ],
                color: "from-saffron/10 to-transparent",
              },
              {
                level: "LEVEL 3",
                title: "District Lead",
                perks: [
                  "Mandal Operations",
                  "Worker Assignment",
                  "Event Coordination",
                ],
                color: "from-blue-500/10 to-transparent",
              },
              {
                level: "LEVEL 4",
                title: "Booth Worker",
                perks: [
                  "Voter Verification",
                  "Door-to-Door App",
                  "Issue Reporting",
                ],
                color: "from-green-500/10 to-transparent",
              },
            ].map((role) => (
              <motion.div
                key={role.title}
                variants={staggerChild}
                whileHover={{ scale: 1.04, y: -6 }}
                className={`bg-gradient-to-b ${role.color} bg-[#15151a] p-6 rounded-lg border border-white/5 hover:border-primary/50 transition-all duration-300 cursor-default`}
              >
                <div className="text-xs font-mono text-primary mb-2 tracking-wider">
                  {role.level}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {role.title}
                </h3>
                <ul className="text-sm text-cream/70 space-y-2.5">
                  {role.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Icon
                        name="check_circle"
                        size={16}
                        className="text-green-400"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 9. Security & Ethics ─── */}
      <section
        id="security"
        className="py-28 bg-background-dark border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          <Reveal>
            <h2 className="text-3xl font-serif font-bold text-white mb-6">
              Uncompromised Security
            </h2>
            <p className="text-cream/80 mb-8 font-body">
              Your data is your greatest asset. We protect it with
              military-grade encryption and strict access controls.
            </p>
            <div className="flex gap-4">
              {[
                { icon: "lock", label: "ISO 27001" },
                { icon: "dns", label: "Data Sovereignty" },
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  whileHover={{ scale: 1.08, borderColor: "rgba(232,118,26,0.6)" }}
                  className="bg-[#1a1a22] px-4 py-2 rounded border border-white/10 flex items-center gap-2 transition-all duration-300"
                >
                  <Icon name={badge.icon} className="text-saffron" />
                  <span className="text-sm font-bold text-white">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-2 gap-x-8 gap-y-12">
            {[
              {
                title: "End-to-End Encryption",
                desc: "Data is encrypted at rest and in transit.",
                icon: "enhanced_encryption",
              },
              {
                title: "Role-Based Access",
                desc: "Granular permissions prevent leaks.",
                icon: "admin_panel_settings",
              },
              {
                title: "Audit Logs",
                desc: "Every action is tracked and timestamped.",
                icon: "history",
              },
              {
                title: "2FA Enforcement",
                desc: "Mandatory dual factor for all admins.",
                icon: "phonelink_lock",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerChild}>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-saffron rounded-full" />
                  {item.title}
                </h4>
                <p className="text-sm text-cream/60">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── 10. Multilingual Support ─── */}
      <section id="multilingual" className="py-28 bg-[#111116] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <Reveal className="flex-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Serving the Many Voices of Bharat
            </h2>
            <p className="text-cream/80 text-lg mb-8">
              BoothIQ is natively multilingual. Empower your grassroots workers
              in their mother tongue.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "English",
                "Hindi",
                "Telugu",
                "Tamil",
                "Marathi",
                "Bengali",
                "Kannada",
                "Gujarati",
              ].map((lang, i) => (
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ scale: 1.1, borderColor: "rgba(201,167,74,0.6)" }}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white transition-all duration-300 cursor-default"
                >
                  {lang}
                </motion.span>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" className="flex-1 flex justify-center">
            <div className="relative w-80 h-80 opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Stylized map of India"
                className="w-full h-full object-contain filter invert opacity-30 drop-shadow-[0_0_15px_rgba(201,167,74,0.5)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2JMRNjj0sVGQ8GC3cq1NZEz35Vneqgi9XJfz4Z9jmc87Qw3wMCQm6uoj7HynojGZHVtxoo4k6QxvAob-gBifwoV7RYggzS7QtRkW9w7bPz79DAVOuTgdBbLTR6uZoa_OoFmLnGadnL_3VfmOu6YyPdXz0bU-3fQ9wqxCjcP6DENn0MgF2evk2e4BVZPmm5eaXtk2VWJG0F9AsMwtVqDYJwHF61mGuRHXm_XXKHZBwX8o6DXCg8Sd2GtTFu2vV2ua4gET6YbwBOg"
              />
              {/* Floating tags */}
              {[
                { text: "नमस्ते", top: "25%", left: "25%" },
                { text: "నమస్కారం", top: "50%", left: "50%" },
                { text: "வணக்கம்", top: "70%", left: "35%" },
                { text: "নমস্কার", top: "33%", right: "20%" },
              ].map((tag, i) => (
                <motion.div
                  key={tag.text}
                  className="absolute bg-background-dark/80 px-2.5 py-1 rounded text-[10px] text-primary border border-primary/30 font-mono"
                  style={{
                    top: tag.top,
                    left: tag.left,
                    right: tag.right,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 2.5 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  {tag.text}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 11. Testimonial ─── */}
      <section className="py-28 bg-background-dark">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-7xl text-primary/30 font-serif leading-none block">
              &ldquo;
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-white font-medium italic leading-relaxed -mt-8 mb-8">
              BoothIQ gave us the granularity we needed. We flipped 45 critical
              booths by identifying scheme beneficiaries who were undecided. It
              wasn&apos;t just data; it was a roadmap to victory.
            </h3>
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-white tracking-wide uppercase text-sm">
                Campaign Manager
              </span>
              <span className="text-saffron text-xs font-mono">
                Major State Election, 2024
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 12. CTA ─── */}
      <section
        id="cta"
        className="py-28 bg-gradient-to-r from-saffron/20 via-[#0e0e14] to-background-dark border-y border-saffron/20 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-saffron/10 blur-[100px]" />

        <Reveal>
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to dominate the ground?
            </h2>
            <p className="text-lg text-cream/80 mb-10 max-w-2xl mx-auto">
              Secure your constituency&apos;s data today. Access is limited to
              authorized campaign managers and representatives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{
                    scale: 1.06,
                    boxShadow: "0 0 40px rgba(232,118,26,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="h-14 px-10 rounded bg-saffron text-white text-lg font-bold tracking-wide shadow-[0_0_25px_rgba(232,118,26,0.4)] transition-all duration-300"
                >
                  Request Access
                </motion.button>
              </Link>
              <motion.button
                whileHover={{
                  scale: 1.06,
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                className="h-14 px-10 rounded border border-white/20 bg-transparent text-white text-lg font-bold tracking-wide transition-all duration-300"
              >
                View Demo Video
              </motion.button>
            </div>
            <p className="mt-6 text-xs text-cream/50 font-mono">
              Strictly confidential. Verified political entities only.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ─── 13. Footer ─── */}
      <footer className="bg-background-dark pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="how_to_vote" size={24} className="text-primary" />
              <h2 className="text-white text-lg font-serif font-bold">
                BoothIQ
              </h2>
            </div>
            <p className="text-cream/60 text-sm max-w-xs mb-6">
              The premium intelligence platform for modern political warfare.
            </p>
            <div className="flex gap-4">
              {["alternate_email", "call", "feed"].map((icon) => (
                <motion.div key={icon} whileHover={{ scale: 1.2, color: "#c9a74a" }}>
                  <Link
                    href="#"
                    className="text-cream/60 hover:text-primary transition-colors duration-300"
                  >
                    <Icon name={icon} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Platform",
              links: [
                "Knowledge Graph",
                "Voter Analytics",
                "Booth App",
                "Security",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Ethics Policy", "Contact"],
            },
            {
              title: "Resources",
              links: ["Blog", "Case Studies", "Help Center", "API Docs"],
            },
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-cream/60 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-xs">
            &copy; 2024 BoothIQ Intelligence Private Limited. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            <span className="text-[10px] text-cream/60 uppercase tracking-widest font-mono">
              Made for Bharat Mandapam 2026
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
