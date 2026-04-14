import { FC } from "react";

export const OutputDisplay: FC = () => {
  return (
    <section className="py-32 bg-[#fffcf2] relative overflow-hidden">
      <div className="absolute top-20 right-20 w-32 h-32 shape-ring opacity-10"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 bg-[#8B004B]/8 shape-squircle rotate-[-15deg]"></div>
      <div className="absolute top-1/2 left-0 w-8 h-8 bg-[#8B004B] opacity-15 -translate-x-1/2"></div>
      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="font-accent text-3xl text-[#a51f5e] block mb-2">Step 3</span>
          <h2 className="text-5xl font-headline font-bold">Your design.md is ready.</h2>
        </div>
        <div className="bg-[#1A0010] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center bg-white/5 px-8 py-4 border-b border-white/5">
            <span className="text-white/60 font-mono text-sm">output.md</span>
            <div className="flex gap-4">
              <button className="text-white/80 flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">content_copy</span>
                <span className="text-sm">Copy</span>
              </button>
              <button className="text-white/80 flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
          <div className="p-12 font-mono leading-relaxed text-lg overflow-x-auto">
            <p className="syntax-murrey text-2xl mb-6"># Project Identity: Stellar Cloud</p>
            <p className="text-white/40 mb-4">## Style Guide</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="syntax-keyword">Color Palette:</p>
                <ul className="text-white/80 list-disc ml-6 mt-2 space-y-1">
                  <li>Primary: #6366F1</li>
                  <li>Secondary: #EC4899</li>
                  <li>Surface: #F8FAFC</li>
                </ul>
              </div>
              <div>
                <p className="syntax-keyword">Typography:</p>
                <ul className="text-white/80 list-disc ml-6 mt-2 space-y-1">
                  <li>Headline: Inter (700 weight)</li>
                  <li>Body: Roboto (400 weight)</li>
                </ul>
              </div>
            </div>
            <p className="text-white/40 mb-4">## Layout Strategy</p>
            <p className="text-white/80 italic mb-8">"Asymmetric bento grid layout with 24px inner gutters and 48px outer margins."</p>
            <p className="text-white/40 mb-4">## Components</p>
            <div className="space-y-4">
              <p className="syntax-keyword">Card_Primary:</p>
              <p className="text-white/60 ml-4">- Border-radius: 1.5rem</p>
              <p className="text-white/60 ml-4">- Shadow: Ambient-Low</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
