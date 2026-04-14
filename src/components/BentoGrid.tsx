import { FC } from "react";

export const BentoGrid: FC = () => {
  return (
    <section className="py-32 bg-[#fffcf2] relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-24 h-24 shape-ring opacity-10"></div>
      <div className="absolute bottom-1/4 right-0 w-32 h-32 dot-grid opacity-15"></div>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Zero Friction - wide */}
          <div className="md:col-span-2 bg-[#b52d6b]/5 p-12 rounded-[2rem] flex flex-col justify-end min-h-[350px] relative overflow-hidden">
            <div className="absolute top-8 right-8 w-12 h-12 bg-[#8B004B]/10 shape-squircle rotate-12"></div>
            <span className="material-symbols-outlined text-4xl text-[#b52d6b] mb-6">speed</span>
            <h3 className="text-3xl font-headline font-bold mb-4">Zero Friction</h3>
            <p className="text-[#646653]">Skip the manual inspection in Figma. Get the logic immediately.</p>
          </div>
          {/* Token First */}
          <div className="bg-[#efefdb] p-12 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border border-[#8B004B] opacity-10 rotate-45"></div>
            <span className="material-symbols-outlined text-4xl text-[#b52d6b]">token</span>
            <div>
              <h3 className="text-2xl font-headline font-bold mb-2">Token First</h3>
              <p className="text-sm text-[#646653]">Clean CSS & Tailwind extraction.</p>
            </div>
          </div>
          {/* Pure MD - dark */}
          <div className="bg-[#1A0010] p-12 rounded-[2rem] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 shape-squircle -translate-y-1/2 translate-x-1/2"></div>
            <span className="material-symbols-outlined text-4xl text-[#ffa8c4]">description</span>
            <div>
              <h3 className="text-2xl font-headline font-bold mb-2">Pure MD</h3>
              <p className="text-sm text-white/60">Universal documentation format.</p>
            </div>
          </div>
          {/* Dev Friendly */}
          <div className="md:col-span-1 bg-[#efefdb] p-12 rounded-[2rem] flex flex-col justify-between">
            <span className="material-symbols-outlined text-4xl text-[#b52d6b]">diversity_3</span>
            <h3 className="text-2xl font-headline font-bold mb-2">Dev Friendly</h3>
          </div>
          {/* Editorial Web - wide */}
          <div className="md:col-span-3 bg-[#ffa8c4]/10 p-12 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <h3 className="text-4xl font-headline font-bold mb-6">Designed for the Editorial Web</h3>
              <p className="text-lg text-[#646653]">We don't just extract pixels; we understand the "Editorial Artisan" philosophy. Your design.md will preserve the soul of your layouts.</p>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 editorial-blob opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-10 right-10 w-24 h-24 shape-ring opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
