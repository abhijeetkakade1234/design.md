import { useState } from "react";
import { UploadZone } from "./components/UploadZone";
import { Editor } from "./components/Editor";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { UploadDisplay } from "./components/UploadDisplay";
import { ProcessingDisplay } from "./components/ProcessingDisplay";
import { OutputDisplay } from "./components/OutputDisplay";
import { HowItWorks } from "./components/HowItWorks";
import { BentoGrid } from "./components/BentoGrid";
import { Footer } from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";

type View = "landing" | "upload" | "editor";

function App() {
  const [view, setView] = useState<View>("landing");
  const [content, setContent] = useState<string | null>(null);

  const goToUpload = () => { setView("upload"); window.scrollTo(0, 0); };
  const goToLanding = () => { setView("landing"); setContent(null); window.scrollTo(0, 0); };
  const handleGenerated = (md: string) => { setContent(md); setView("editor"); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden">
      {/* ═══════════════════════════════════════ NAVBAR ═══════════════════════════════════════ */}
      <Navbar onGoToLanding={goToLanding} onGoToUpload={goToUpload} />

      {/* ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ */}
      <AnimatePresence mode="wait">

        {/* ─── LANDING PAGE ─── */}
        {view === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero onGoToUpload={goToUpload} />
            <UploadDisplay onGoToUpload={goToUpload} />
            <ProcessingDisplay />
            <OutputDisplay />
            <HowItWorks />
            <BentoGrid />
            <Footer />
          </motion.div>
        )}

        {/* ─── UPLOAD / FUNCTIONAL APP ─── */}
        {view === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="pt-24 min-h-screen bg-[#fbfaed]"
          >
            {/* Background shapes */}
            <div className="absolute top-10 left-10 w-24 h-24 shape-squircle bg-[#8B004B]/10 rotate-12 -z-0"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8B004B]/5 editorial-blob -z-0"></div>

            <div className="max-w-4xl mx-auto px-8 py-16 relative z-10">
              <button onClick={goToLanding} className="mb-8 text-[#b52d6b] font-body font-medium flex items-center gap-2 hover:underline">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to home
              </button>
              <div className="text-center mb-16">
                <h2 className="text-5xl font-headline font-bold mb-4">Drop your screenshots.</h2>
                <span className="font-accent text-2xl text-[#b52d6b] block">Up to 5 images.</span>
              </div>
              <UploadZone
                canGenerate={true}
                onGenerated={handleGenerated}
                onStartProcessing={() => {}}
                onIncrementUsage={() => {}}
              />
            </div>
          </motion.div>
        )}

        {/* ─── EDITOR ─── */}
        {view === "editor" && content && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="pt-24 min-h-screen bg-[#fffcf2]"
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setView("upload")} className="text-[#b52d6b] font-medium flex items-center gap-2 hover:underline">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Upload
                </button>
                <div className="text-sm font-label uppercase tracking-widest text-[#646653]">
                  Result: <span className="text-[#b52d6b] font-bold">design.md</span>
                </div>
              </div>
            </div>
            <Editor content={content} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
