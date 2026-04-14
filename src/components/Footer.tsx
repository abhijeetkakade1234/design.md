import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-[#8B004B] text-[#fffcf2] flex flex-col items-center justify-center py-20 px-4 space-y-8 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[85px] border-b-white opacity-10 rotate-12"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-2 border-white/20 rotate-45"></div>
      <div className="absolute bottom-20 left-40 w-8 h-8 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 dot-grid opacity-10 invert"></div>
      <div className="absolute inset-0 editorial-blob scale-150 blur-3xl opacity-20"></div>
      <div className="font-headline text-[#fffcf2] text-5xl relative z-10">design.md</div>
      <div className="flex flex-wrap justify-center gap-12 relative z-10">
        <a className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity" href="#">Manifesto</a>
        <a className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity underline decoration-1" href="#">Terms</a>
        <a className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity" href="#">Privacy</a>
        <a className="text-[#fffcf2]/60 font-body text-sm uppercase tracking-widest hover:text-white transition-opacity" href="#">Social</a>
      </div>
      <p className="font-headline text-2xl text-[#fffcf2]/80 max-w-md text-center italic relative z-10">"The digital monograph for modern design engineering."</p>
      <div className="pt-8 text-xs font-body opacity-40 uppercase tracking-[0.3em] relative z-10">
        © 2024 design.md curated works
      </div>
    </footer>
  );
};
