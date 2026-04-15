import { FC } from "react";

export const HowItWorks: FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-[#f5f4e4] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-32 h-32 dot-grid opacity-10"></div>
      <div className="absolute bottom-0 left-1/4 w-40 h-40 shape-ring opacity-[0.08]"></div>
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-[#8B004B] rotate-45 opacity-5"></div>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <h2 className="text-5xl font-headline font-bold text-center mb-24">The Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="relative bg-[#fbfaed] p-12 rounded-xl no-line-shadow overflow-hidden group">
            <span className="absolute -top-10 -right-4 font-headline font-bold text-[10rem] text-[#b52d6b]/10 leading-none group-hover:text-[#b52d6b]/20 transition-colors">1</span>
            <h3 className="text-3xl font-headline font-bold mb-6 relative z-10">Upload</h3>
            <p className="text-[#646653] leading-relaxed relative z-10">Provide your design vision through high-fidelity screenshots or wireframe snapshots.</p>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#8B004B] rounded-full opacity-20"></div>
          </div>
          {/* Step 2 */}
          <div className="relative bg-[#fbfaed] p-12 rounded-xl no-line-shadow overflow-hidden group">
            <span className="absolute -top-10 -right-4 font-headline font-bold text-[10rem] text-[#b52d6b]/10 leading-none group-hover:text-[#b52d6b]/20 transition-colors">2</span>
            <h3 className="text-3xl font-headline font-bold mb-6 relative z-10">Extract</h3>
            <p className="text-[#646653] leading-relaxed relative z-10">Our AI interprets the visual hierarchy, identifying tokens, layout patterns, and semantic roles.</p>
            <div className="absolute bottom-4 right-4 w-4 h-4 border border-[#8B004B] rotate-45 opacity-20"></div>
          </div>
          {/* Step 3 */}
          <div className="relative bg-[#fbfaed] p-12 rounded-xl no-line-shadow overflow-hidden group">
            <span className="absolute -top-10 -right-4 font-headline font-bold text-[10rem] text-[#b52d6b]/10 leading-none group-hover:text-[#b52d6b]/20 transition-colors">3</span>
            <h3 className="text-3xl font-headline font-bold mb-6 relative z-10">Download</h3>
            <p className="text-[#646653] leading-relaxed relative z-10">Receive a structured markdown file that acts as the single source of truth for your development team.</p>
            <div className="absolute bottom-4 right-4 w-6 h-0.5 bg-[#8B004B] rotate-45 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
