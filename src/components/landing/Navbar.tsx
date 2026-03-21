"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Icon } from "./shared";

export function Navbar() {
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
    <motion.nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled
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
          <Link
            href="/citizen"
            className="text-saffron hover:text-white text-sm font-bold transition-colors"
          >
            Citizen Portal
          </Link>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center justify-center text-primary hover:text-white text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer"
            >
              Log in
            </motion.div>
          </Link>
          <Link href="/auth/signup">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(232,118,26,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center h-10 px-5 rounded bg-saffron hover:bg-saffron/90 text-white text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(232,118,26,0.3)] transition-all duration-300 cursor-pointer"
            >
              Request Demo
            </motion.div>
          </Link>
        </div>
        <div className="md:hidden flex items-center pr-4">
          <Link href="/citizen" className="text-primary font-bold text-sm">
            Citizen App
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
