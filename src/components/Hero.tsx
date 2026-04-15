import { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface HeroProps {
  onGoToUpload: () => void;
}

export const Hero: FC<HeroProps> = ({ onGoToUpload }) => {
  return (
    <section className="relative min-h-screen pt-20 flex items-center overflow-hidden">
      {/* Top-right blob cluster */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B004B]/15 editorial-blob -z-10 translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute top-10 right-20 w-32 h-32 shape-ring opacity-25 -z-10"></div>
      <div className="absolute top-40 right-48 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#8B004B] opacity-[0.12] -z-10 rotate-45"></div>
      {/* Bottom-left scatter */}
      <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#8B004B] rotate-45 opacity-15 -z-10"></div>
      <div className="absolute bottom-40 left-32 w-16 h-16 dot-grid opacity-20 -z-10"></div>
      <div className="absolute bottom-10 left-40 w-32 h-12 diagonal-slash opacity-15 -z-10"></div>
      {/* Mid-right floating token icon */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-24 bg-[#8B004B]/10 shape-squircle -z-10 rotate-[-8deg] flex items-center justify-center backdrop-blur-sm border border-[#8B004B]/5">
        <span className="material-symbols-outlined text-4xl text-[#8B004B] opacity-40">token</span>
      </div>
      {/* Abstract background shape */}
      <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[120%] bg-[#8B004B]/5 -rotate-12 transform origin-top-right rounded-[5rem] -z-20"></div>

      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative">
          {/* Scatter accent dots */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-[#8B004B] rounded-full"></div>
          <div className="absolute top-1/2 -left-12 w-6 h-6 border border-[#8B004B] rotate-45"></div>
          <motion.span
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-accent text-3xl text-[#b52d6b] block"
          >
            AI-Powered Design Intelligence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-7xl md:text-8xl font-headline font-bold leading-[0.9] text-[#1A0010]"
          >
            Turn UI into <span className="italic text-[#a51f5e]">instructions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-xl text-[#646653] max-w-md leading-relaxed"
          >
            Automatically extract design tokens, layout logic, and structural semantics from your screenshots into clean, actionable markdown.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={onGoToUpload}
              className="bg-[#b52d6b] text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-[#b52d6b]/20 transition-all flex items-center gap-2"
            >
              Upload Images
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <Link to="/showcase" className="bg-[#efefdb] text-[#373929] px-10 py-4 rounded-full text-lg font-medium hover:bg-[#e9ead2] transition-all inline-block">
              View Example
            </Link>
          </motion.div>
        </div>

        {/* Code preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, rotate: 3 }} transition={{ delay: 0.6 }}
          className="relative group"
        >
          <div className="bg-[#1A0010] rounded-xl p-8 shadow-2xl relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#b3374e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#764c5c]"></div>
              <div className="w-3 h-3 rounded-full bg-[#b9bba5]"></div>
            </div>
            <div className="space-y-3 font-mono text-sm leading-relaxed overflow-hidden">
              <p className="syntax-murrey"># Design Tokens</p>
              <p className="syntax-keyword">primary: <span className="syntax-string">"#8B004B"</span></p>
              <p className="syntax-keyword">surface: <span className="syntax-string">"#FFFCF2"</span></p>
              <p className="text-white/40">// Auto-extracted layout logic</p>
              <p className="syntax-keyword">grid-cols: <span className="syntax-string">"12"</span></p>
              <p className="syntax-keyword">spacing: <span className="syntax-string">"compact"</span></p>
              <p className="syntax-murrey">## Component: Hero</p>
              <p className="text-white/60">- Headline: Cormorant Garamond, 700</p>
              <p className="text-white/60">- Alignment: Asymmetric-Left</p>
            </div>
          </div>
          <div className="absolute -inset-4 bg-[#ffa8c4] blur-3xl opacity-30 -z-10 animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
};
