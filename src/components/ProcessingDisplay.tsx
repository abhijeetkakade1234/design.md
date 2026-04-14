import { FC } from "react";

export const ProcessingDisplay: FC = () => {
  return (
    <section className="py-32 flex flex-col items-center justify-center space-y-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-[#8B004B] rounded-full opacity-10"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-[#8B004B] opacity-15"></div>
      <div className="absolute bottom-1/4 left-1/2 w-64 h-1 diagonal-slash opacity-10 -rotate-45"></div>
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 editorial-blob animate-pulse scale-110"></div>
        <div className="absolute inset-0 bg-[#b52d6b]/20 rounded-full animate-ping opacity-20"></div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-[#b52d6b]">data_object</span>
        </div>
      </div>
      <div className="text-center">
        <span className="font-accent text-3xl text-[#a51f5e] block mb-2">Step 2</span>
        <h3 className="text-3xl font-headline italic text-[#a51f5e] mb-4">Analyzing layout structure...</h3>
        <p className="text-[#646653] font-medium tracking-widest uppercase text-xs">Extraction in progress</p>
      </div>
    </section>
  );
};
