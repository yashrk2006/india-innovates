"use client";

import { motion } from "framer-motion";
import { Icon, Reveal } from "./shared";

export function KnowledgeGraph() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
  );
}
